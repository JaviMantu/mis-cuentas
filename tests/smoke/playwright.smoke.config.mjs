// Smoke contra una URL desplegada (preview o producción): BASE_URL=https://… npx playwright test --config …
import { defineConfig } from '@playwright/test';

const BASE = process.env.BASE_URL;
if (!BASE) throw new Error('falta BASE_URL');

export default defineConfig({
  testDir: '.',
  testMatch: /smoke\.spec\.js/,
  reporter: 'line',
  retries: 1,
  // Previews protegidos: el header de bypass de Vercel viaja solo si existe el secreto.
  use: { baseURL: BASE, extraHTTPHeaders: process.env.VERCEL_BYPASS ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS } : {} },
  projects: [
    { name: 'movil', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'escritorio', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
  ],
});
