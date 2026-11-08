import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  use: { baseURL: "http://127.0.0.1:4173", browserName: "chromium", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
    {
      name: "mobile",
      use: { viewport: { width: 375, height: 900 }, hasTouch: true, isMobile: true },
    },
  ],
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{projectName}/{arg}{ext}",
  webServer: {
    command:
      "npm run showcase:build && vp preview --config showcase/vite.config.ts --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
