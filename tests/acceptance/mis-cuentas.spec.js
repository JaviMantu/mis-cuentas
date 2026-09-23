// ATDD — un test por criterio de work/001-marcar-pagado/spec.md. El ID va en el título (evals/run.mjs traza).
import { test, expect } from '@playwright/test';

const KEY = 'mis-cuentas:v1';
const HOY = '/?hoy=2026-09-10';
const accounts = [
  { id: 'efectivo', name: 'Efectivo', opening: 0 },
  { id: 'banco', name: 'Banco', opening: 500000000 },
  { id: 'tarjeta', name: 'Tarjeta', opening: 0 },
];

// "Dado": siembra el estado una sola vez, para que recargar no lo reinicie.
async function given(page, state) {
  await page.addInitScript(([key, value]) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, value);
  }, [KEY, JSON.stringify({ accounts, items: [], movements: [], ...state })]);
  await page.goto(HOY);
}

const item = (over) => ({ id: 'a1', name: 'Arriendo', kind: 'expense', amount: 120000000, day: 5, account: 'banco', ...over });

test('AC-001.1 marcar Pagado baja el balance de la cuenta en 1 clic', async ({ page }) => {
  await given(page, { items: [item()] });
  await page.getByRole('tab', { name: 'Mes' }).click();
  await page.getByRole('button', { name: 'Marcar Arriendo como pagado' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Arriendo' })).toContainText('Pagado');
  await page.getByRole('tab', { name: 'Resumen' }).click();
  await expect(page.getByLabel('Balance Banco')).toHaveText('$ 3.800.000');
});

test('AC-001.2 marcar Recibido sube el balance de la cuenta', async ({ page }) => {
  await given(page, { items: [item({ id: 's1', name: 'Salario', kind: 'income', amount: 400000000, day: 1 })] });
  await page.getByRole('tab', { name: 'Mes' }).click();
  await page.getByRole('button', { name: 'Marcar Salario como recibido' }).click();
  await page.getByRole('tab', { name: 'Resumen' }).click();
  await expect(page.getByLabel('Balance Banco')).toHaveText('$ 9.000.000');
});

test('AC-001.3 gasto rápido en 2 clics', async ({ page }) => {
  await given(page, {});
  await page.getByRole('button', { name: '+ Gasto' }).click();           // clic 1
  await page.getByLabel('Monto').fill('25.000');                          // escribir no es clic
  await page.getByRole('button', { name: 'Guardar' }).click();            // clic 2
  await expect(page.getByLabel('Balance Banco')).toHaveText('$ 4.975.000');
});

test('AC-001.4 el total cuadra al centavo', async ({ page }) => {
  await given(page, { accounts: [
    { id: 'efectivo', name: 'Efectivo', opening: 100010 },
    { id: 'banco', name: 'Banco', opening: 200020 },
  ] });
  await expect(page.getByLabel('Balance total')).toHaveText('$ 3.000,30');
});

test('AC-001.5 lo pagado persiste al recargar y no se marca dos veces', async ({ page }) => {
  await given(page, { items: [item()] });
  await page.getByRole('tab', { name: 'Mes' }).click();
  await page.getByRole('button', { name: 'Marcar Arriendo como pagado' }).click();
  await page.reload();
  await page.getByRole('tab', { name: 'Mes' }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Arriendo' })).toContainText('Pagado');
  await expect(page.getByRole('button', { name: 'Marcar Arriendo como pagado' })).toHaveCount(0);
});

test('AC-001.6 un monto inválido no se guarda y muestra error', async ({ page }) => {
  await given(page, {});
  for (const bad of ['abc', '-5']) {
    await page.getByRole('button', { name: '+ Gasto' }).click();
    await page.getByLabel('Monto').fill(bad);
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByRole('alert')).toContainText('monto');
    await page.keyboard.press('Escape');
  }
  await expect(page.getByLabel('Balance Banco')).toHaveText('$ 5.000.000');
});
