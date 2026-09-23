// ATDD: los tests de aceptación del proyecto P (raíz por defecto) contra su src/ servido localmente.
import { defineConfig } from '@playwright/test';

const P = process.env.P ?? '.';
const port = 4173;

export default defineConfig({
  testDir: `${P}/tests/acceptance`,
  reporter: 'line',
  timeout: 15000,
  expect: { timeout: 3000 },
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure' },
  webServer: { command: `node scripts/serve.mjs ${P}/src ${port}`, port, reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'escritorio', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    { name: 'movil', use: { browserName: 'chromium', viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true } },
  ],
});
