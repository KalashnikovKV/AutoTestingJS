const { test, expect } = require('@playwright/test');
const AlertsPage = require('../pages/AlertsPage');
const TestDataGenerator = require('../utils/testData');

test.describe('DemoQA Alerts Tests', () => {
  let alertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new AlertsPage(page);
    await alertsPage.navigateTo('/alerts');
  });

  test('All alert buttons functionality', async ({ page }) => {
    await test.step('Alert Button', async () => {
      const alertPromise = alertsPage.handleAlert('accept');
      await alertsPage.clickAlertButton();
      await alertPromise;
      await expect(page.locator('#alertButton')).toBeVisible();
    });

    await test.step('Timer Alert Button', async () => {
      const alertPromise = alertsPage.handleAlert('accept');
      await alertsPage.clickTimerAlertButton();
      await alertPromise;
      await expect(page.locator('#timerAlertButton')).toBeVisible();
    });

    await test.step('Confirm Button - Accept', async () => {
      const alertPromise = alertsPage.handleAlert('accept');
      await alertsPage.clickConfirmButton();
      await alertPromise;
      const confirmResult = await alertsPage.getConfirmResult();
      expect(confirmResult).toContain('You selected Ok');
    });

    await test.step('Confirm Button - Dismiss', async () => {
      const alertPromise = alertsPage.handleAlert('dismiss');
      await alertsPage.clickConfirmButton();
      await alertPromise;
      const confirmResult = await alertsPage.getConfirmResult();
      expect(confirmResult).toContain('You selected Cancel');
    });

    await test.step('Prompt Button - Accept with text', async () => {
      const testText = TestDataGenerator.generateRandomText().fullName;
      const alertPromise = alertsPage.handleAlert('accept', testText);
      await alertsPage.clickPromptButton();
      await alertPromise;
      const promptResult = await alertsPage.getPromptResult();
      expect(promptResult).toContain(testText);
    });

    await test.step('Prompt Button - Dismiss', async () => {
      const alertPromise = alertsPage.handleAlert('dismiss');
      await alertsPage.clickPromptButton();
      await alertPromise;
      const promptResult = await alertsPage.getPromptResult();
      expect(promptResult === '' || promptResult.includes('You entered null')).toBe(true);
    });
  });

  test('All alerts in sequence', async () => {
    const results = await alertsPage.testAllAlerts();
    
    expect(results.confirmAccept).toContain('You selected Ok');
    expect(results.confirmDismiss).toContain('You selected Cancel');
    expect(results.promptAccept).toContain('Test Prompt Text');
    expect(results.promptDismiss === '' || results.promptDismiss.includes('You entered null')).toBe(true);
  });

  test('Negative scenario - Handle multiple rapid alerts', async () => {
    await test.step('Rapid alert clicking', async () => {
      alertsPage.handleAlert('accept');

      await alertsPage.clickAlertButton();
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await alertsPage.waitForTimeout(100);
      await alertsPage.clickTimerAlertButton();
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await alertsPage.waitForTimeout(100);
      await alertsPage.clickConfirmButton();

      // eslint-disable-next-line playwright/no-wait-for-timeout
      await alertsPage.waitForTimeout(1000);
    });
  });
});
