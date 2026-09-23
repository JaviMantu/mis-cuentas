// ATDD — work/005-rediseno-mobile/spec.md. Los specs anteriores no se tocan: protegen el comportamiento.
import { test, expect } from '@playwright/test';

const HOY = '/?hoy=2026-09-10';
const TABS = ['Resumen', 'Mes', 'Presupuesto'];

async function demo(page) {
  await page.goto(HOY);
  await page.getByRole('button', { name: 'Cargar datos de ejemplo' }).click();
}
const noHScroll = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

test('AC-005.1 sin scroll horizontal de 320 a 1280 px', async ({ page }) => {
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    await demo(page);
    for (const tab of TABS) {
      await page.getByRole('tab', { name: tab }).click();
      expect(await noHScroll(page), `${width}px · ${tab}`).toBe(true);
    }
    await page.getByRole('button', { name: '+ Gasto' }).click();
    expect(await noHScroll(page), `${width}px · sheet`).toBe(true);
    await page.keyboard.press('Escape');
    await page.evaluate(() => localStorage.clear());
  }
});

// AC-005.2 reemplazado por AC-006.1 y AC-006.2 (work/006-ui-por-dispositivo/spec.md §4).

test('AC-005.3 objetivos táctiles de al menos 44 × 44 px en celular', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await demo(page);
  for (const tab of TABS) {
    await page.getByRole('tab', { name: tab }).click();
    const small = await page.evaluate(() => [...document.querySelectorAll('button, select, input:not([type=radio]):not([type=checkbox]), [role=tab], label.chip')]
      .filter(el => el.checkVisibility() && el.getClientRects().length)
      .map(el => ({ el: el.getAttribute('aria-label') || el.textContent.trim() || el.name, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width < 44 || r.height < 44)
      .map(({ el, r }) => `${el} ${Math.round(r.width)}×${Math.round(r.height)}`));
    expect(small, tab).toEqual([]);
  }
});

test('AC-005.4 deshacer un pagado lo devuelve a pendientes y restaura el balance', async ({ page }) => {
  await page.addInitScript(() => { if (!localStorage.getItem('mis-cuentas:v1')) localStorage.setItem('mis-cuentas:v1', JSON.stringify({
    accounts: [{ id: 'banco', name: 'Banco', opening: 500000000 }],
    items: [{ id: 'a1', name: 'Arriendo', kind: 'expense', amount: 120000000, day: 5, account: 'banco' }] })); });
  await page.goto(HOY);
  await page.getByRole('tab', { name: 'Mes' }).click();
  await page.getByRole('button', { name: 'Marcar Arriendo como pagado' }).click();
  await expect(page.getByRole('status')).toContainText('Arriendo pagado');
  await page.getByRole('button', { name: 'Deshacer' }).click();
  await expect(page.getByRole('button', { name: 'Marcar Arriendo como pagado' })).toBeVisible();
  await page.getByRole('tab', { name: 'Resumen' }).click();
  await expect(page.getByLabel('Balance Banco')).toHaveText('$ 5.000.000');
});

test('AC-005.5 modo oscuro con fondo oscuro y saldo con contraste AA', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await demo(page);
  const { bg, ratio } = await page.evaluate(() => {
    const rgb = (color) => { const c = document.createElement('canvas').getContext('2d'); c.fillStyle = color; c.fillRect(0, 0, 1, 1); return [...c.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const total = document.querySelector('[aria-label="Balance total"]');
    let host = total; while (host && getComputedStyle(host).backgroundColor === 'rgba(0, 0, 0, 0)') host = host.parentElement;
    const a = lum(rgb(getComputedStyle(total).color)), b = lum(rgb(getComputedStyle(host).backgroundColor));
    return { bg: lum(rgb(getComputedStyle(document.body).backgroundColor)), ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
  });
  expect(bg).toBeLessThan(0.05);
  expect(ratio).toBeGreaterThanOrEqual(4.5);
});

test('AC-005.6 Resumen dice qué falta y deja marcar en 1 clic sin salir', async ({ page }) => {
  await demo(page);
  await expect(page.getByText('Te faltan $ 1.295.000 en 2 pagos')).toBeVisible();
  await page.getByRole('list', { name: 'Próximos pagos' }).getByRole('button', { name: 'Marcar Arriendo como pagado' }).click();
  await expect(page.getByText('Te faltan $ 95.000 en 1 pago')).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Resumen' })).toHaveAttribute('aria-selected', 'true');
});

test('AC-005.9 con datos no se muestra ningún estado vacío ni un aviso sin texto', async ({ page }) => {
  await demo(page);
  await expect(page.getByText('Tus cuentas, en un vistazo')).toBeHidden();
  await expect(page.locator('#toast')).toBeHidden();
  await page.getByRole('tab', { name: 'Mes' }).click();
  await expect(page.getByText('Aún no hay pagos este mes')).toBeHidden();
});
