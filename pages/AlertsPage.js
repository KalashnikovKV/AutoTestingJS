const BasePage = require('./BasePage');
const { TIMEOUTS } = require('../utils/constants');

class AlertsPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      alertButton: '#alertButton',
      timerAlertButton: '#timerAlertButton',
      confirmButton: '#confirmButton',
      promptButton: '#promtButton',
      confirmResult: '#confirmResult',
      promptResult: '#promptResult',
    };
  }

  async clickAlertButton() {
    await this.clickElement(this.selectors.alertButton);
  }

  async clickTimerAlertButton() {
    await this.clickElement(this.selectors.timerAlertButton);
  }

  async clickConfirmButton() {
    await this.clickElement(this.selectors.confirmButton);
  }

  async clickPromptButton() {
    await this.clickElement(this.selectors.promptButton);
  }

  async isAlertButtonVisible() {
    return await this.isElementVisible(this.selectors.alertButton);
  }

  async isTimerAlertButtonVisible() {
    return await this.isElementVisible(this.selectors.timerAlertButton);
  }

  async waitForAlertButtonAttached(timeout = 200) {
    await this.page.locator(this.selectors.alertButton).waitFor({ state: 'attached', timeout });
  }

  async waitForTimerAlertButtonAttached(timeout = 200) {
    await this.page.locator(this.selectors.timerAlertButton).waitFor({ state: 'attached', timeout });
  }

  async waitForConfirmResultAttached(timeout = TIMEOUTS.DEFAULT) {
    await this.page.locator(this.selectors.confirmResult).waitFor({ state: 'attached', timeout });
  }

  async getConfirmResult() {
    return await this.getText(this.selectors.confirmResult);
  }

  async getPromptResult() {
    try {
      const locator = this.page.locator(this.selectors.promptResult);

      const text = await locator
        .textContent({ timeout: TIMEOUTS.EXTRA_LONG })
        .catch(() => null);
      if (text !== null && text.trim() !== '') {
        return text.trim();
      }

      await locator
        .waitFor({ state: 'attached', timeout: TIMEOUTS.EXTRA_LONG })
        .catch(() => {});
      const finalText = await locator
        .textContent({ timeout: TIMEOUTS.LONG })
        .catch(() => null);

      return finalText ? finalText.trim() : '';
    } catch {
      return '';
    }
  }

  async handleAlert(action = 'accept', text = '') {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve();
      }, TIMEOUTS.DEFAULT);

      this.page.once('dialog', async (dialog) => {
        clearTimeout(timeout);
        try {
          if (action === 'accept') {
            if (dialog.type() === 'prompt' && text) {
              await dialog.accept(text);
            } else {
              await dialog.accept();
            }
          } else {
            await dialog.dismiss();
          }
          resolve();
        } catch (error) {
          resolve();
        }
      });
    });
  }

  async testAllAlerts() {
    const results = {};

    const alertPromise1 = this.handleAlert('accept');
    await this.clickAlertButton();
    await alertPromise1;
    await this.page.locator(this.selectors.alertButton).waitFor({ state: 'attached', timeout: TIMEOUTS.ELEMENT_WAIT });

    const alertPromise2 = this.handleAlert('accept');
    await this.clickTimerAlertButton();
    await alertPromise2;
    await this.page.locator(this.selectors.timerAlertButton).waitFor({ state: 'attached', timeout: TIMEOUTS.ALERT_TIMER });

    const alertPromise3 = this.handleAlert('accept');
    await this.clickConfirmButton();
    await alertPromise3;
    await this.page.locator(this.selectors.confirmResult).waitFor({ state: 'attached', timeout: TIMEOUTS.ELEMENT_WAIT });
    results.confirmAccept = await this.getConfirmResult();

    const alertPromise4 = this.handleAlert('dismiss');
    await this.clickConfirmButton();
    await alertPromise4;
    await this.page.locator(this.selectors.confirmResult).waitFor({ state: 'attached', timeout: TIMEOUTS.ELEMENT_WAIT });
    results.confirmDismiss = await this.getConfirmResult();

    const alertPromise5 = this.handleAlert('accept', 'Test Prompt Text');
    await this.clickPromptButton();
    await alertPromise5;
    await this.page.locator(this.selectors.promptResult).waitFor({ state: 'attached', timeout: TIMEOUTS.ELEMENT_WAIT });
    results.promptAccept = await this.getPromptResult();

    const alertPromise6 = this.handleAlert('dismiss');
    await this.clickPromptButton();
    await alertPromise6;
    await this.page.locator(this.selectors.promptResult).waitFor({ state: 'attached', timeout: 1000 }).catch(() => {});
    results.promptDismiss = await this.getPromptResult();

    return results;
  }
}

module.exports = AlertsPage;
