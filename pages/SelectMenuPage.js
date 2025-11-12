const BasePage = require('./BasePage');
const { TIMEOUTS } = require('../utils/constants');

class SelectMenuPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      selectValue: '#withOptGroup',
      selectOne: '#selectOne',
      oldStyleSelect: '#oldSelectMenu',
      multiSelect: '#cars',
      colorMultiSelect: '#selectMenuContainer > div',
      multiSelectLabel: 'text=Multiselect drop down',
    };
  }

  async selectValueOption(group, option) {
    await this.clickElement(this.selectors.selectValue);
    
    const optionText = `${group}, option ${option}`;
    const optionLocator = this.page.locator(`div[id*="react-select"][id*="-option"]:has-text("${optionText}")`).first();
    
    try {
      await optionLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await optionLocator.click();
    } catch (error) {
      throw new Error(`Option "${optionText}" not found in dropdown`);
    }
  }

  async selectValueOptionAndWait(group, option) {
    const expectedText = `${group}, option ${option}`;
    
    await this.clickElement(this.selectors.selectValue);
    
    const optionLocator = this.page.locator(`div[id*="react-select"][id*="-option"]:has-text("${expectedText}")`).first();
    await optionLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await optionLocator.click();
    
    await this.page.locator(this.selectors.selectValue).waitFor({ 
      state: 'attached',
      hasText: expectedText, 
      timeout: TIMEOUTS.DEFAULT 
    });
  }

  async selectOneOption(option) {
    await this.clickElement(this.selectors.selectOne);
    
    const optionLocator = this.page.locator(`div[id*="react-select"][id*="-option"]:has-text("${option}")`).first();
    await optionLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
    await optionLocator.click();
  }

  async selectOldStyleOption(option) {
    const optionLabel = option === 'green' ? 'Green' : option.charAt(0).toUpperCase() + option.slice(1);
    await this.page.selectOption(this.selectors.oldStyleSelect, { label: optionLabel });
  }

  async selectMultiSelectOptions(options) {
    await this.page.selectOption(this.selectors.multiSelect, options);
  }

  async selectColorMultiSelectOptions(options) {
    for (const option of options) {
      await this.page.click(this.selectors.colorMultiSelect);
      
      const optionText = option.charAt(0).toUpperCase() + option.slice(1);
      const optionLocator = this.page.locator(`div[id*="react-select"][id*="-option"]:has-text("${optionText}")`).first();
      await optionLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });
      await optionLocator.click();
      
      await optionLocator.waitFor({ state: 'hidden', timeout: TIMEOUTS.ELEMENT_WAIT }).catch(() => {});
    }
  }

  async getCleanSelectText(selector) {
    const element = this.page.locator(selector);
    const cleanText = await element.evaluate(el => {
      const selectedOption = el.querySelector('[aria-selected="true"]');
      if (selectedOption) {
        return selectedOption.textContent.trim();
      }
      
      const text = el.textContent || '';
      const lines = text.split('\n').filter(line => line.trim());
      const optionLine = lines.find(line => 
        line.trim() && 
        !line.includes('results available') && 
        !line.includes('Select is focused')
      );
      
      return optionLine ? optionLine.trim() : text.trim();
    });
    
    return cleanText;
  }

  async getSelectedValues() {
    const results = {};
    
    const selectValueText = await this.getText(this.selectors.selectValue);
    results.selectValue = selectValueText;
    
    const selectOneText = await this.getText(this.selectors.selectOne);
    results.selectOne = selectOneText;
    
    const oldStyleValue = await this.page.inputValue(this.selectors.oldStyleSelect);
    results.oldStyleSelect = oldStyleValue;
    
    const multiSelectElement = this.page.locator(this.selectors.multiSelect);
    const selectedOptions = await multiSelectElement.evaluate(select => {
      return Array.from(select.selectedOptions).map(option => option.value);
    });
    results.multiSelect = selectedOptions.join(',');
    
    return results;
  }

  async testAllSelectMenus() {
    const results = {};

    await this.selectValueOption('Group 2', '1');
    await this.page.locator(this.selectors.selectValue).waitFor({ state: 'attached', timeout: TIMEOUTS.DEFAULT });

    await this.selectOneOption('Other');
    await this.page.locator(this.selectors.selectOne).waitFor({ state: 'attached', timeout: TIMEOUTS.DEFAULT });

    await this.selectOldStyleOption('green');
    await this.page.locator(this.selectors.oldStyleSelect).waitFor({ state: 'attached', timeout: TIMEOUTS.DEFAULT });

    await this.selectMultiSelectOptions(['volvo', 'saab']);
    await this.page.locator(this.selectors.multiSelect).waitFor({ state: 'attached', timeout: TIMEOUTS.DEFAULT });

    results.selections = await this.getSelectedValues();

    return results;
  }

  async getSelectedValuesForValidation() {
    const results = {};
    
    const selectValueText = await this.getText(this.selectors.selectValue);
    results.selectValue = selectValueText;
    
    const selectOneText = await this.getText(this.selectors.selectOne);
    results.selectOne = selectOneText;
    
    const oldStyleElement = this.page.locator(this.selectors.oldStyleSelect);
    const oldStyleText = await oldStyleElement.evaluate(select => {
      return select.options[select.selectedIndex].text;
    });
    results.oldStyleSelect = oldStyleText.toLowerCase();
    
    const multiSelectElement = this.page.locator(this.selectors.multiSelect);
    const selectedOptions = await multiSelectElement.evaluate(select => {
      return Array.from(select.selectedOptions).map(option => option.value);
    });
    results.multiSelect = selectedOptions.join(',');
    
    return results;
  }

  async getSelectedValuesClean() {
    const results = {};
    
    const selectValueText = await this.getCleanSelectText(this.selectors.selectValue);
    results.selectValue = selectValueText;
    
    const selectOneText = await this.getCleanSelectText(this.selectors.selectOne);
    results.selectOne = selectOneText;
    
    const oldStyleValue = await this.page.inputValue(this.selectors.oldStyleSelect);
    results.oldStyleSelect = oldStyleValue;
    
    const multiSelectElement = this.page.locator(this.selectors.multiSelect);
    const selectedOptions = await multiSelectElement.evaluate(select => {
      return Array.from(select.selectedOptions).map(option => option.value);
    });
    results.multiSelect = selectedOptions.join(',');
    
    return results;
  }

  async isSelectValueVisible() {
    return await this.isElementVisible(this.selectors.selectValue);
  }

  async isSelectOneVisible() {
    return await this.isElementVisible(this.selectors.selectOne);
  }

  async isOldStyleSelectVisible() {
    return await this.isElementVisible(this.selectors.oldStyleSelect);
  }

  async isMultiSelectVisible() {
    return await this.isElementVisible(this.selectors.multiSelect);
  }

  async isMultiSelectLabelVisible() {
    const label = this.page.locator(this.selectors.multiSelectLabel);
    try {
      await label.waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT });
      return true;
    } catch {
      return false;
    }
  }

  async checkAllSelectElementsPresent() {
    return {
      selectValue: await this.isSelectValueVisible(),
      selectOne: await this.isSelectOneVisible(),
      oldStyleSelect: await this.isOldStyleSelectVisible(),
      multiSelect: await this.isMultiSelectVisible(),
      multiSelectLabel: await this.isMultiSelectLabelVisible(),
    };
  }

}

module.exports = SelectMenuPage;
