const BasePage = require('./BasePage');
const { TIMEOUTS } = require('../utils/constants');

class ToolTipsPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      hoverButton: '#toolTipButton',
      hoverTextField: '#toolTipTextField',
      hoverLink: '#texToolTopContainer a:first-child',
      hoverLinkContrary: '#texToolTopContainer a:last-child',
      tooltip: '.tooltip-inner',
    };
  }

  async hoverOverButton() {
    await this.page.hover(this.selectors.hoverButton);
    try {
      await this.page.waitForSelector(this.selectors.tooltip, {
        state: 'visible',
        timeout: TIMEOUTS.ELEMENT_WAIT,
      });
    } catch {
      await this.waitForTimeout(TIMEOUTS.MEDIUM);
    }
  }

  async hoverOverTextField() {
    await this.page.hover(this.selectors.hoverTextField);
    await this.waitForTimeout(TIMEOUTS.LONG);
  }

  async hoverOverLink() {
    await this.page.hover(this.selectors.hoverLink);
    await this.waitForTimeout(TIMEOUTS.LONG);
  }

  async hoverOverContraryLink() {
    await this.page.hover(this.selectors.hoverLinkContrary);
    await this.waitForTimeout(TIMEOUTS.LONG);
  }

  async getTooltipText() {
    const tooltip = this.page.locator(this.selectors.tooltip);
    if (await tooltip.isVisible()) {
      return await tooltip.textContent();
    }
    return null;
  }

  async testAllTooltips() {
    const results = {};

    await this.hoverOverButton();
    results.buttonTooltip = await this.getTooltipText();

    await this.hoverOverTextField();
    results.textFieldTooltip = await this.getTooltipText();

    await this.hoverOverLink();
    results.linkTooltip = await this.getTooltipText();

    await this.hoverOverContraryLink();
    results.contraryLinkTooltip = await this.getTooltipText();

    return results;
  }

  async validateTooltipText(expectedText, actualText) {
    return actualText && actualText.includes(expectedText);
  }
}

module.exports = ToolTipsPage;
