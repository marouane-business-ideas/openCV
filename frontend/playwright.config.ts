import { defineConfig, devices } from "@playwright/test";

/**
 * Template tests: every resume template is printed to a real PDF and each page is compared with
 * the approved screenshot. See tests/templates/README.md
 */
export default defineConfig({
  testDir: "./tests/templates",
  testMatch: "*.visual.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:5173",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173/template-lab.html",
    reuseExistingServer: !process.env.CI,
  },
});
