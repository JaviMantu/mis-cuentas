// ATDD — AC-008.2: lo desplegado abre, no falla, no llama a terceros y trae los headers de seguridad.
import { test, expect } from '@playwright/test';

test('AC-008.2 la app desplegada abre el onboarding, sin errores ni terceros y con headers de seguridad', async ({ page, baseURL }) => {
  const origin = new URL(baseURL).origin;
  const errors = [], foreign = [];
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { const u = new URL(r.url()); if (/^https?:$/.test(u.protocol) && u.origin !== origin) foreign.push(r.url()); });

  const res = await page.goto('/');
  // Un preview con Vercel Authentication redirige al login de Vercel: eso no es la app (lección del primer PR de work/008).
  expect(new URL(page.url()).origin, 'el despliegue está protegido: configura VERCEL_AUTOMATION_BYPASS_SECRET (Deployment Protection → Protection Bypass for Automation)').toBe(origin);
  expect(res.status()).toBe(200);
  const h = res.headers();
  expect(h['content-security-policy']).toMatch(/default-src 'self'/);
  expect(h['content-security-policy']).toMatch(/script-src 'self' 'sha256-/);
  expect(h['content-security-policy']).toMatch(/frame-ancestors 'none'/);
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(h['permissions-policy']).toContain('camera=()');

  await expect(page.getByText('Paso 1 de 4')).toBeVisible();
  await page.getByRole('button', { name: 'Cargar datos de ejemplo' }).click();
  await expect(page.getByText(/Te faltan \$/)).toBeVisible();
  expect(errors, 'errores de consola').toEqual([]);
  expect(foreign, 'peticiones a otros orígenes').toEqual([]);
});
