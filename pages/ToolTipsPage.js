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
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(200);
    await this.page.hover(this.selectors.hoverButton);
    await this.page.waitForTimeout(500);
  }

  async hoverOverTextField() {
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(200);
    await this.page.hover(this.selectors.hoverTextField);
    await this.page.waitForTimeout(500);
  }

  async hoverOverLink() {
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(200);
    await this.page.hover(this.selectors.hoverLink);
    await this.page.waitForTimeout(500);
  }

  async hoverOverContraryLink() {
    await this.page.mouse.move(0, 0);
    await this.page.waitForTimeout(200);
    await this.page.hover(this.selectors.hoverLinkContrary);
    await this.page.waitForTimeout(500);
  }

  async getTooltipText() {
    const tooltips = await this.page.locator(this.selectors.tooltip).all();
    for (const tooltip of tooltips) {
      try {
        if (await tooltip.isVisible({ timeout: 500 })) {
          const text = await tooltip.textContent();
          if (text && text.trim()) {
            return text;
          }
        }
      } catch {
        // Tooltip not visible, continue
      }
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

}

module.exports = ToolTipsPage;
