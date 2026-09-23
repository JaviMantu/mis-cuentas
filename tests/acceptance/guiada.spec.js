// ATDD — work/007-experiencia-guiada/spec.md
import { test, expect } from '@playwright/test';

const HOY = '/?hoy=2026-09-10';
const seed = (page, state) => page.addInitScript((s) => { if (!localStorage.getItem('mis-cuentas:v1')) localStorage.setItem('mis-cuentas:v1', JSON.stringify(s)); }, state);

test('AC-007.6 el primer uso abre el onboarding y se puede saltar', async ({ page }) => {
  await page.goto(HOY);
  await expect(page.getByText('Paso 1 de 4')).toBeVisible();
  await page.getByRole('button', { name: 'Saltar' }).click();
  await expect(page.getByRole('button', { name: 'Configurar en 1 minuto' })).toBeVisible();
});

async function onboard(page) {
  await page.goto(HOY);
  await page.getByRole('button', { name: 'Banco', exact: true }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByRole('button', { name: 'Salario', exact: true }).click();
  await page.getByLabel('Monto de Salario').fill('4.000.000');
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByRole('button', { name: 'Arriendo', exact: true }).click();
  await page.getByLabel('Monto de Arriendo').fill('1.200.000');
  await page.getByRole('button', { name: 'Internet', exact: true }).click();
  await page.getByLabel('Monto de Internet').fill('95.000');
  await page.getByRole('button', { name: 'Siguiente' }).click();
}

test('AC-007.7 onboarding completo tecleando solo montos', async ({ page }) => {
  await onboard(page);
  await page.getByRole('button', { name: 'Empezar' }).click();
  await expect(page.getByText('Te faltan $ 1.295.000 en 2 pagos')).toBeVisible();
  await page.getByRole('tab', { name: 'Mes' }).click();
  await expect(page.getByRole('list', { name: 'Recurrentes del mes' }).getByRole('listitem')).toHaveCount(3);
});

test('AC-007.8 el paso 4 muestra el libre al mes', async ({ page }) => {
  await onboard(page);
  await expect(page.getByText('Paso 4 de 4')).toBeVisible();
  await expect(page.getByText('Te quedan $ 2.705.000 libres al mes')).toBeVisible();
});

test('AC-007.9 gasto con categoría y «Mismo monto» sin teclear', async ({ page }) => {
  await seed(page, { accounts: [{ id: 'banco', name: 'Banco', opening: 500000000 }], items: [],
    movements: [{ id: 'm1', kind: 'expense', amount: 2500000, account: 'banco', date: '2026-09-02', note: 'Mercado' }] });
  await page.goto(HOY);
  await page.getByRole('button', { name: '+ Gasto' }).click();
  await page.getByRole('radio', { name: 'Mercado', exact: true }).check();
  await page.getByRole('button', { name: /Mismo monto/ }).click();
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByLabel('Balance Banco')).toHaveText('$ 4.950.000');
});

test('AC-007.10 categorías personalizadas: agregar, renombrar y archivar', async ({ page }) => {
  await seed(page, { items: [] });
  await page.goto(HOY);
  await page.getByRole('tab', { name: 'Ajustes' }).click();
  await page.getByRole('radio', { name: 'Gastos', exact: true }).check();
  await page.getByLabel('Nueva categoría').fill('Mascotas');
  await page.getByRole('button', { name: 'Agregar categoría' }).click();
  await page.getByRole('button', { name: '+ Gasto' }).click();
  await expect(page.getByRole('radio', { name: 'Mascotas', exact: true })).toBeAttached();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('button', { name: 'Renombrar Mascotas' }).click();
  await page.getByLabel('Nuevo nombre de Mascotas').fill('Mascota');
  await page.getByLabel('Nuevo nombre de Mascotas').press('Enter');
  await page.getByRole('button', { name: 'Archivar Mascota' }).click();
  await page.getByRole('button', { name: '+ Gasto' }).click();
  await expect(page.getByRole('radio', { name: 'Mascota', exact: true })).toHaveCount(0);
});

test('AC-007.11 cuentas con nombre libre', async ({ page }) => {
  await seed(page, { items: [] });
  await page.goto(HOY);
  await page.getByRole('tab', { name: 'Ajustes' }).click();
  for (const [name, type] of [['Banco X', 'Banco'], ['Nequi', 'Billetera digital']]) {
    await page.getByLabel('Nombre de la cuenta').fill(name);
    await page.getByLabel('Tipo de cuenta').selectOption({ label: type });
    await page.getByRole('button', { name: 'Agregar cuenta' }).click();
  }
  await page.getByRole('tab', { name: 'Resumen' }).click();
  await expect(page.getByLabel('Balance Banco X')).toBeVisible();
  await expect(page.getByLabel('Balance Nequi')).toBeVisible();
  await page.getByRole('button', { name: '+ Gasto' }).click();
  await expect(page.getByRole('radio', { name: 'Nequi', exact: true })).toBeAttached();
});

test('AC-007.12 vista Automático vuelve a la regla del dispositivo', async ({ browser }) => {
  const ctx = await browser.newContext({ baseURL: 'http://localhost:4173', viewport: { width: 1280, height: 800 }, hasTouch: false, isMobile: false });
  const page = await ctx.newPage();
  await page.goto(HOY);
  await page.getByRole('tab', { name: 'Ajustes' }).click();
  await page.getByRole('radio', { name: 'Móvil', exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-ui', 'mobile');
  await page.getByRole('radio', { name: 'Automático', exact: true }).check();
  await expect(page.locator('html')).toHaveAttribute('data-ui', 'desktop');
  expect(await page.evaluate(() => localStorage.getItem('mis-cuentas:ui'))).toBeNull();
});

test('AC-007.13 fechas humanas en Mes y en Próximos pagos', async ({ page }) => {
  await page.goto(HOY);
  await page.getByRole('button', { name: 'Cargar datos de ejemplo' }).click();
  await expect(page.getByRole('list', { name: 'Próximos pagos' })).toContainText('5 sep');
  await page.getByRole('tab', { name: 'Mes' }).click();
  const mes = page.getByRole('list', { name: 'Recurrentes del mes' });
  await expect(mes).toContainText('5 sep');
  await expect(mes).not.toContainText('2026-09-05');
});

test('AC-007.14 tocar un chip no reanima el paso; solo cambiar de paso lo anima', async ({ page }) => {
  await page.goto(HOY);
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: 'Salario', exact: true }).click();
  const running = await page.locator('.ob-body').evaluate(el => el.getAnimations().length);
  expect(running).toBe(0);
});
