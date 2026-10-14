import {defineConfig, devices} from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome'], viewport: {width: 1280, height: 800}}},
    {
      name: 'mobile',
      use: {...devices['Desktop Chrome'], viewport: {width: 375, height: 812}, hasTouch: true},
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: false,
    timeout: 300_000,
    env: {NEXT_PUBLIC_ENABLE_UI_LAB: '1', ELCA_NOW: '2026-10-13T12:00:00-04:00'},
  },
});
