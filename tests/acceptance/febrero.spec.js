import { test, expect } from '@playwright/test';

test('AC-002.3 en febrero, un recurrente del 31 se muestra el 28 y no en marzo', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mis-cuentas:v1', JSON.stringify({
    items: [{ id: 'g1', name: 'Gimnasio', kind: 'expense', amount: 9000000, day: 31, account: 'banco' }],
  })));
  await page.goto('/?hoy=2026-02-10');
  await page.getByRole('tab', { name: 'Mes' }).click();
  const row = page.getByRole('listitem').filter({ hasText: 'Gimnasio' });
  // Cambio de contrato declarado en work/007-experiencia-guiada/spec.md: fechas humanas («28 feb»).
  await expect(row).toContainText('28 feb');
  await expect(row).not.toContainText(/\b\d{1,2} mar\b/);
});
