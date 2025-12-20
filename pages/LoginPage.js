const BasePage = require('./BasePage');
const { TIMEOUTS } = require('../utils/constants');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      userNameInput: '#userName',
      passwordInput: '#password',
      loginButton: '#login',
      errorMessage: '#name',
      userInfo: '#userName-value',
    };
  }

  async navigateToLogin() {
    await this.navigateTo('/login');
  }

  async enterUserName(userName) {
    await this.waitForElementVisible(this.selectors.userNameInput);
    await this.fillField(this.selectors.userNameInput, userName);
  }

  async enterPassword(password) {
    await this.waitForElementVisible(this.selectors.passwordInput);
    await this.fillField(this.selectors.passwordInput, password);
  }

  async clickLoginButton() {
    await this.waitForElementVisible(this.selectors.loginButton);
    await this.clickElement(this.selectors.loginButton);
  }

  async login(userName, password) {
    await this.enterUserName(userName);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async isLoginSuccessful() {
    try {
      await this.waitForElementVisible(this.selectors.userInfo, TIMEOUTS.DEFAULT);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUserName() {
    await this.waitForElementVisible(this.selectors.userInfo);
    return await this.getTextTrimmed(this.selectors.userInfo);
  }

  async hasErrorMessage() {
    try {
      await this.waitForElementVisible(this.selectors.errorMessage, 3000);
      const errorText = await this.getTextTrimmed(this.selectors.errorMessage);
      return errorText.length > 0;
    } catch (error) {
      return false;
    }
  }

  async getErrorMessage() {
    if (await this.hasErrorMessage()) {
      return await this.getTextTrimmed(this.selectors.errorMessage);
    }
    return '';
  }
}

module.exports = LoginPage;

