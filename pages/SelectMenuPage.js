const BasePage = require('./BasePage');
const { TIMEOUTS, SELECTORS } = require('../utils/constants');

class SelectMenuPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      selectValue: '#withOptGroup',
      selectOne: '#selectOne',
      oldStyleSelect: '#oldSelectMenu',
      multiSelect: '#cars',
      colorMultiSelect: '#selectMenuContainer .css-1pahdxg-control',
      selectValueDropdown: '.css-1wa3eu0-placeholder',
      selectOneDropdown: '.css-1wa3eu0-placeholder',
      selectValueOption: '.css-26l3qy-menu',
      selectOneOption: '.css-26l3qy-menu'
    };
  }

  async selectValueOption(group, option) {
    await this.clickElement(this.selectors.selectValue);
    await this.waitForTimeout(TIMEOUTS.LONG);
    
    await this.page.waitForSelector(SELECTORS.DROPDOWN_MENU, { timeout: TIMEOUTS.ELEMENT_WAIT });
    const optionSelector = `${SELECTORS.DROPDOWN_MENU} div:has-text("${group}, option ${option}")`;
    const optionExists = await this.page.locator(optionSelector).count() > 0;
    if (!optionExists) {
      throw new Error(`Option "${group}, option ${option}" not found in dropdown`);
    }
    await this.clickElement(optionSelector);
  }

  async selectValueOptionAndWait(group, option) {
    const expectedText = `${group}, option ${option}`;
    
    await this.clickElement(this.selectors.selectValue);
    await this.waitForTimeout(TIMEOUTS.LONG);
    
    await this.page.waitForSelector(SELECTORS.DROPDOWN_MENU, { timeout: TIMEOUTS.ELEMENT_WAIT });
    
    const optionSelector = `${SELECTORS.DROPDOWN_MENU} div:has-text("${expectedText}")`;
    await this.page.waitForSelector(optionSelector, { timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.clickElement(optionSelector);
    
    await this.waitForElementHidden(SELECTORS.DROPDOWN_MENU, TIMEOUTS.ELEMENT_WAIT);
    
    await this.page.locator(this.selectors.selectValue).waitFor({ 
      hasText: expectedText, 
      timeout: TIMEOUTS.DEFAULT 
    });
  }

  async selectOneOption(option) {
    await this.clickElement(this.selectors.selectOne);
    await this.waitForTimeout(TIMEOUTS.LONG);
    
    await this.page.waitForSelector(SELECTORS.DROPDOWN_MENU, { timeout: TIMEOUTS.ELEMENT_WAIT });
    await this.clickElement(`${SELECTORS.DROPDOWN_MENU} .css-yt9ioa-option:has-text("${option}")`);
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
      await this.waitForTimeout(TIMEOUTS.LONG);
      
      const optionText = option.charAt(0).toUpperCase() + option.slice(1);
      await this.page.click(`${SELECTORS.DROPDOWN_MENU} div:has-text("${optionText}")`);
      await this.waitForTimeout(TIMEOUTS.MEDIUM);
    }
  }

  async getCleanSelectText(selector) {
    const element = this.page.locator(selector);
    const cleanText = await element.evaluate(el => {
      const selectedOption = el.querySelector('[aria-selected="true"]');
      if (selectedOption) {
        return selectedOption.textContent.trim();
      }
      
      const text = el.textContent || el.innerText || '';
      const lines = text.split('\n').filter(line => line.trim());
      for (const line of lines) {
        if (line.includes('option') && line.includes('selected')) {
          const match = line.match(/([^,]+,\s*option\s+\d+)/);
          if (match) {
            return match[1].trim();
          }
        }
      }
      
      return lines.find(line => line.trim() && !line.includes('results available') && !line.includes('Select is focused')) || text;
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
    await this.waitForTimeout(TIMEOUTS.LONG);

    await this.selectOneOption('Other');
    await this.waitForTimeout(TIMEOUTS.LONG);

    await this.selectOldStyleOption('green');
    await this.waitForTimeout(TIMEOUTS.LONG);

    await this.selectMultiSelectOptions(['volvo', 'saab']);
    await this.waitForTimeout(TIMEOUTS.LONG);

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

  async validateSelections(expectedSelections) {
    const actualSelections = await this.getSelectedValuesForValidation();
    const validation = {};

    for (const [key, expected] of Object.entries(expectedSelections)) {
      validation[key] = {
        expected,
        actual: actualSelections[key],
        matches: actualSelections[key] && actualSelections[key].includes(expected)
      };
    }

    return validation;
  }

  async validateSelectionsClean(expectedSelections) {
    const actualSelections = await this.getSelectedValuesClean();
    const validation = {};

    for (const [key, expected] of Object.entries(expectedSelections)) {
      validation[key] = {
        expected,
        actual: actualSelections[key],
        matches: actualSelections[key] && actualSelections[key].includes(expected)
      };
    }

    return validation;
  }
}

module.exports = SelectMenuPage;
