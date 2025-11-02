class TestHelpers {
  static async waitForElementToBeVisible(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  static async waitForElementToBeHidden(page, selector, timeout = 10000) {
    await page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  static async scrollToElement(page, selector) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  static async takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}-${timestamp}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    return filename;
  }

  static async waitForNetworkIdle(page, timeout = 30000) {
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  static async clearAndFillField(page, selector, value) {
    await page.fill(selector, '');
    await page.fill(selector, value);
  }

  static async selectDropdownOption(page, dropdownSelector, optionText) {
    await page.click(dropdownSelector);
    await page.waitForTimeout(500);
    await page.click(`text=${optionText}`);
  }

  static async handleAlerts(page, action = 'accept', text = '') {
    page.on('dialog', async dialog => {
      if (action === 'accept') {
        if (dialog.type() === 'prompt' && text) {
          await dialog.accept(text);
        } else {
          await dialog.accept();
        }
      } else {
        await dialog.dismiss();
      }
    });
  }

  static async waitForUrl(page, expectedUrl, timeout = 10000) {
    await page.waitForURL(expectedUrl, { timeout });
  }

  static async getElementText(page, selector) {
    return await page.textContent(selector);
  }

  static async isElementVisible(page, selector) {
    return await page.isVisible(selector);
  }

  static async getElementAttribute(page, selector, attribute) {
    return await page.getAttribute(selector, attribute);
  }

  static async waitForTimeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateRandomEmail() {
    const domains = ['example.com', 'test.com', 'demo.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${this.generateRandomString(8)}@${domain}`;
  }

  static generateRandomPhone() {
    return Math.floor(Math.random() * 9000000000) + 1000000000;
  }
}

module.exports = TestHelpers;
