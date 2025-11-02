const { test, expect } = require('@playwright/test');

test.describe('Basic Playwright Test', () => {
  test('Should navigate to demoqa.com', async ({ page }) => {
    await page.goto('https://demoqa.com');
    await expect(page).toHaveTitle(/DEMOQA/);
  });
});
