const BasePage = require('./BasePage');

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
    await this.hideAllTooltips();
    await this.page.locator(this.selectors.hoverButton).waitFor({ state: 'visible' }).catch(() => {});
    await this.page.hover(this.selectors.hoverButton);
    await this.page.locator(this.selectors.tooltip).first().waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});
  }

  async hoverOverTextField() {
    await this.hideAllTooltips();
    await this.page.locator(this.selectors.hoverTextField).waitFor({ state: 'visible' }).catch(() => {});
    await this.page.hover(this.selectors.hoverTextField);
    await this.page.locator(this.selectors.tooltip).first().waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});
  }

  async hoverOverLink() {
    await this.hideAllTooltips();
    await this.page.locator(this.selectors.hoverLink).waitFor({ state: 'visible' }).catch(() => {});
    await this.page.hover(this.selectors.hoverLink);
    await this.page.locator(this.selectors.tooltip).first().waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});
  }

  async hoverOverContraryLink() {
    await this.hideAllTooltips();
    await this.page.locator(this.selectors.hoverLinkContrary).waitFor({ state: 'visible' }).catch(() => {});
    await this.page.hover(this.selectors.hoverLinkContrary);
    await this.page.locator(this.selectors.tooltip).first().waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});
  }

  async hideAllTooltips() {
    await this.page.mouse.move(0, 0);
    const tooltips = await this.page.locator(this.selectors.tooltip).all();
    for (const tooltip of tooltips) {
      try {
        await tooltip.waitFor({ state: 'hidden', timeout: 500 }).catch(() => {});
      } catch {
      }
    }
  }

  async getTooltipText() {
    const tooltip = this.page.locator(this.selectors.tooltip).first();
    try {
      await tooltip.waitFor({ state: 'visible', timeout: 1000 });
      const text = await tooltip.textContent();
      return text ? text.trim() : null;
    } catch {
      return null;
    }
  }

  async getTooltipLocator() {
    return this.page.locator(this.selectors.tooltip).first();
  }

  async isTooltipVisible() {
    const tooltip = this.page.locator(this.selectors.tooltip).first();
    try {
      await tooltip.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
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
