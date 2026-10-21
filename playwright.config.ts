import { defineConfig, devices } from '@playwright/test';

// The app the tests run against, started here, or reused when it's already running (outside the CI): the dev server,
// or with E2E_APP=build the production build, served like `npm run preview:local` does. Some bugs only exist in one,
// like the preview answering the API's requests with the app's page
const apps = {
  dev: { command: 'npm run dev', url: 'http://localhost:5173' },
  // Builds the app first
  build: { command: 'npm run preview:local', url: 'http://localhost:4173', timeout: 180_000 },
};
const appName = process.env.E2E_APP ?? 'dev';
if (!(appName in apps)) throw new Error(`E2E_APP should be one of: ${Object.keys(apps).join(', ')}`);
const app = apps[appName as keyof typeof apps];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: app.url,
    trace: 'on-first-retry',
    locale: 'fr-FR',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    ...app,
    reuseExistingServer: !process.env.CI,
  },
});
