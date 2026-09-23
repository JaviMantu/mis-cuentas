// ATDD — work/006-ui-por-dispositivo/spec.md. Cada test crea su propio dispositivo: el proyecto de Playwright no decide.
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4173';
const HOY = '/?hoy=2026-09-10';
const device = (browser, kind) => browser.newContext({
  baseURL: BASE, viewport: { width: 1280, height: 800 }, ...(kind === 'touch' ? { hasTouch: true, isMobile: true } : { hasTouch: false, isMobile: false }),
});

test('AC-006.1 táctil sin hover a 1280 px usa la interfaz móvil', async ({ browser }) => {
  const page = await (await device(browser, 'touch')).newPage();
  await page.goto(HOY);
  await expect(page.locator('html')).toHaveAttribute('data-ui', 'mobile');
  const box = await page.getByRole('navigation', { name: 'Principal' }).boundingBox();
  expect(box.y + box.height).toBeGreaterThanOrEqual(798);
  expect(box.width).toBeGreaterThanOrEqual(1270);
});

test('AC-006.2 mouse a 1280 px usa la interfaz de escritorio: riel, tabla y panel lateral', async ({ browser }) => {
  const page = await (await device(browser, 'mouse')).newPage();
  await page.goto(HOY);
  await expect(page.locator('html')).toHaveAttribute('data-ui', 'desktop');
  const nav = await page.getByRole('navigation', { name: 'Principal' }).boundingBox();
  expect(nav.x).toBeLessThanOrEqual(1);
  expect(nav.height).toBeGreaterThanOrEqual(790);
  await page.getByRole('button', { name: 'Cargar datos de ejemplo' }).click();
  await page.getByRole('tab', { name: 'Mes' }).click();
  for (const col of ['Fecha', 'Concepto', 'Cuenta', 'Monto', 'Estado']) {
    await expect(page.getByRole('columnheader', { name: col })).toBeVisible();
  }
  // Regresión del audit 006: la columna Concepto colapsaba y el nombre quedaba en una letra.
  const concept = page.getByRole('list', { name: 'Recurrentes del mes' }).getByText('Arriendo');
  expect(await concept.evaluate(el => el.scrollWidth <= el.clientWidth && el.clientWidth >= 120)).toBe(true);
  await page.getByRole('button', { name: '+ Gasto' }).click();
  const sheet = await page.getByRole('dialog').boundingBox();
  expect(sheet.x + sheet.width).toBeGreaterThanOrEqual(1278);
  expect(sheet.height).toBeGreaterThanOrEqual(790);
});

test('AC-006.3 la vista forzada se recuerda y se puede revertir', async ({ browser }) => {
  const page = await (await device(browser, 'mouse')).newPage();
  await page.goto(HOY);
  await page.getByRole('button', { name: 'Vista móvil' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-ui', 'mobile');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-ui', 'mobile');
  await page.getByRole('tab', { name: 'Presupuesto' }).click();
  await page.getByRole('button', { name: 'Vista de escritorio' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-ui', 'desktop');
});

test('AC-006.4 atajos de teclado en escritorio, nunca mientras se escribe', async ({ browser }) => {
  const page = await (await device(browser, 'mouse')).newPage();
  await page.goto(HOY);
  await page.keyboard.press('g');
  await expect(page.getByRole('dialog')).toContainText('Nuevo gasto');
  await page.getByLabel('Monto').pressSequentially('12i2');
  await expect(page.getByLabel('Monto')).toHaveValue('12i2');
  await expect(page.getByRole('dialog')).toContainText('Nuevo gasto');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden(); // Chrome cierra el diálogo en una tarea posterior
  await page.keyboard.press('i');
  await expect(page.getByRole('dialog')).toContainText('Nuevo ingreso');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden(); // Chrome cierra el diálogo en una tarea posterior
  await page.keyboard.press('2');
  await expect(page.getByRole('tab', { name: 'Mes' })).toHaveAttribute('aria-selected', 'true');
});

test('AC-006.6 escritorio muestra últimos movimientos, el más reciente primero', async ({ browser }) => {
  const page = await (await device(browser, 'mouse')).newPage();
  await page.goto(HOY);
  await page.getByRole('button', { name: 'Cargar datos de ejemplo' }).click();
  const list = page.getByRole('list', { name: 'Últimos movimientos' });
  await expect(list.getByRole('listitem')).toHaveCount(2);
  await expect(list.getByRole('listitem').first()).toContainText('Almuerzo');
});
