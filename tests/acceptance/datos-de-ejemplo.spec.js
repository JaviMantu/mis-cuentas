import { test, expect } from '@playwright/test';

test('AC-004.1 un clic carga un mes de ejemplo', async ({ page }) => {
  await page.goto('/?hoy=2026-09-10');
  await page.getByRole('button', { name: 'Cargar datos de ejemplo' }).click();
  await expect(page.getByLabel('Balance total')).toHaveText('$ 5.675.000');
  await page.getByRole('tab', { name: 'Mes' }).click();
  await expect(page.getByRole('list', { name: 'Recurrentes del mes' }).getByRole('listitem')).toHaveCount(3);
  await expect(page.getByRole('listitem').filter({ hasText: 'Salario' })).toContainText('Recibido');
});

test('AC-004.2 con datos existentes no se ofrece el ejemplo', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mis-cuentas:v1', JSON.stringify({
    items: [{ id: 'a1', name: 'Arriendo', kind: 'expense', amount: 100, day: 5, account: 'banco' }],
  })));
  await page.goto('/?hoy=2026-09-10');
  await expect(page.getByLabel('Balance total')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cargar datos de ejemplo' })).toHaveCount(0);
});
