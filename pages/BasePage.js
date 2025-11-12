const { ROUTE_PATTERNS, TIMEOUTS } = require('../utils/constants');

class BasePage {
  constructor(page) {
    this.page = page;
    this._routeHandlerSet = false;
  }

  async navigateTo(url) {
    if (!this._routeHandlerSet) {
      await this.page.route('**/*', (route) => {
        const requestUrl = route.request().url();
        const shouldBlock = ROUTE_PATTERNS.GOOGLE_ADS.some((pattern) =>
          requestUrl.includes(pattern)
        );

        if (shouldBlock) {
          route.abort();
        } else {
          route.continue();
        }
      });
      this._routeHandlerSet = true;
    }

    try {
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUTS.DEFAULT * 3,
      });
    } catch (error) {
      try {
        await this.page.goto(url, {
          waitUntil: 'load',
          timeout: TIMEOUTS.DEFAULT,
        });
      } catch (error2) {
        throw new Error(`Failed to navigate to ${url}: ${error2.message}`);
      }
    }
  }

  async takeScreenshot(name) {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  async waitForElement(selector, timeout = TIMEOUTS.DEFAULT, options = {}) {
    await this.page.waitForSelector(selector, { timeout, ...options });
  }

  async waitForElementVisible(selector, timeout = TIMEOUTS.DEFAULT) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async waitForElementHidden(selector, timeout = TIMEOUTS.DEFAULT) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  async clickElement(selector, options = {}) {
    try {
      await this.page.click(selector, options);
    } catch (error) {
      if (!options.force) {
        // eslint-disable-next-line playwright/no-force-option
        await this.page.click(selector, { ...options, force: true });
      } else {
        throw error;
      }
    }
  }

  async fillField(selector, value) {
    if (!value) return;

    try {
      await this.page.fill(selector, value);
    } catch (error) {
      try {
        await this.page.click(selector);
        await this.page.fill(selector, value);
      } catch (error2) {
        throw new Error(`Failed to fill field ${selector}: ${error2.message}`);
      }
    }
  }

  async getText(selector, options = {}) {
    try {
      return await this.page.textContent(selector, options);
    } catch (error) {
      return null;
    }
  }

  async getTextTrimmed(selector) {
    const text = await this.getText(selector);
    return text ? text.trim() : '';
  }

  async isElementVisible(selector, timeout = TIMEOUTS.DEFAULT) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
      return true;
    } catch (error) {
      console.log(`Element not visible: ${selector}`, error.message);
      return false;
    }
  }

  async checkElementVisibleNow(selector) {
    try {
      const element = this.page.locator(selector);
      return await element.isVisible({ timeout: 500 }).catch(() => false);
    } catch {
      return false;
    }
  }

  async waitForTimeout(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async scrollToElement(selector) {
    try {
      await this.page.locator(selector).scrollIntoViewIfNeeded();
    } catch (error) {
      console.log('Scroll error:', error.message);
    }
  }
}

module.exports = BasePage;
