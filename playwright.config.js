const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.workers ? parseInt(process.env.workers) : undefined,
  grep: process.env.runThis ? new RegExp(process.env.runThis, 'i') : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }]
  ],
  use: {
    baseURL: 'https://demoqa.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    extraHTTPHeaders: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },

  projects: [
    {
      name: 'chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { 
          width: process.env.VIEWPORT_WIDTH ? parseInt(process.env.VIEWPORT_WIDTH) : 1920, 
          height: process.env.VIEWPORT_HEIGHT ? parseInt(process.env.VIEWPORT_HEIGHT) : 1080 
        }
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { 
          width: process.env.VIEWPORT_WIDTH ? parseInt(process.env.VIEWPORT_WIDTH) : 1920, 
          height: process.env.VIEWPORT_HEIGHT ? parseInt(process.env.VIEWPORT_HEIGHT) : 1080 
        }
      },
    },
  ],
});
