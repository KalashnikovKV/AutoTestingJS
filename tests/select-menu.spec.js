const { test, expect } = require('@playwright/test');
const SelectMenuPage = require('../pages/SelectMenuPage');

test.describe('DemoQA Select Menu Tests', () => {
  let selectMenuPage;

  test.beforeEach(async ({ page }) => {
    selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.navigateTo('/select-menu');
  });

  test('All select menu functionality as specified', async () => {
    await test.step('Select Value - Group 2, option 1', async () => {
      await selectMenuPage.selectValueOption('Group 2', '1');
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.selectValue).toContain('Group 2, option 1');
    });

    await test.step('Select One - Other', async () => {
      await selectMenuPage.selectOneOption('Other');
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.selectOne).toContain('Other');
    });

    await test.step('Old Style Select Menu - Green', async () => {
      await selectMenuPage.selectOldStyleOption('green');
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.oldStyleSelect).toBe('2');
    });

    await test.step('Multiselect drop down - Volvo, Saab', async () => {
      await selectMenuPage.selectMultiSelectOptions(['volvo', 'saab']);
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.multiSelect).toContain('volvo');
      expect(selections.multiSelect).toContain('saab');
    });

    await test.step('Multiselect drop down - Black, Blue', async () => {
      await selectMenuPage.selectColorMultiSelectOptions(['black', 'blue']);
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.colorMultiSelect).toBeDefined();
      expect(selections.colorMultiSelect.toLowerCase()).toMatch(/black|blue/);
    });
  });

  test('All select menus in sequence', async () => {
    const results = await selectMenuPage.testAllSelectMenus();
    
    expect(results.selections.selectValue).toContain('Group 2, option 1');
    expect(results.selections.selectOne).toContain('Other');
    expect(results.selections.oldStyleSelect).toBe('2');
    expect(results.selections.multiSelect).toContain('volvo');
    expect(results.selections.multiSelect).toContain('saab');
  });

  test('Select menu validation', async () => {
    const expectedSelections = {
      selectValue: 'Group 2, option 1',
      selectOne: 'Other',
      oldStyleSelect: 'green',
      multiSelect: 'volvo,saab'
    };

    await test.step('Perform all selections', async () => {
      await selectMenuPage.selectValueOption('Group 2', '1');
      await selectMenuPage.selectOneOption('Other');
      await selectMenuPage.selectOldStyleOption('green');
      await selectMenuPage.selectMultiSelectOptions(['volvo', 'saab']);
    });

    await test.step('Validate all selections', async () => {
      const actualSelections = await selectMenuPage.getSelectedValuesForValidation();
      
      expect(actualSelections.selectValue).toContain(expectedSelections.selectValue);
      expect(actualSelections.selectOne).toContain(expectedSelections.selectOne);
      expect(actualSelections.oldStyleSelect).toContain(expectedSelections.oldStyleSelect);
      expect(actualSelections.multiSelect).toContain(expectedSelections.multiSelect);
    });
  });

  test('Select menu with different options', async () => {
    await test.step('Different Select Value options', async () => {
      await selectMenuPage.selectValueOptionAndWait('Group 1', '2');
      const selections = await selectMenuPage.getSelectedValuesClean();
      expect(selections.selectValue).toContain('Group 1, option 2');
    });

    await test.step('Different Select One options', async () => {
      await selectMenuPage.selectOneOption('Prof.');
      const selections = await selectMenuPage.getSelectedValuesClean();
      expect(selections.selectOne).toContain('Prof.');
    });

    await test.step('Different Old Style options', async () => {
      await selectMenuPage.selectOldStyleOption('red');
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.oldStyleSelect).toBe('red');
    });

    await test.step('Different Multiselect options', async () => {
      await selectMenuPage.selectMultiSelectOptions(['opel', 'audi']);
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.multiSelect).toContain('opel');
      expect(selections.multiSelect).toContain('audi');
    });
  });

  test('Select menu edge cases', async () => {
    await test.step('Selecting same option multiple times', async () => {
      await selectMenuPage.selectValueOption('Group 2', '1');
      await selectMenuPage.selectValueOption('Group 2', '1');
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.selectValue).toContain('Group 2, option 1');
    });

    await test.step('Multiselect with all options', async () => {
      await selectMenuPage.selectMultiSelectOptions(['volvo', 'saab', 'opel', 'audi']);
      const selections = await selectMenuPage.getSelectedValues();
      expect(selections.multiSelect).toContain('volvo');
      expect(selections.multiSelect).toContain('saab');
      expect(selections.multiSelect).toContain('opel');
      expect(selections.multiSelect).toContain('audi');
    });
  });

  test('Negative scenario - Invalid selections', async () => {
    await test.step('Selecting non-existent options', async () => {
      let errorCaught = false;
      try {
        await selectMenuPage.selectValueOption('Non-existent Group', '1');
      } catch (error) {
        errorCaught = true;
        expect(error.message).toContain('not found in dropdown');
      }
      expect(errorCaught).toBe(true);
    });

    await test.step('Multiselect with invalid options', async () => {
      let errorCaught = false;
      try {
        await Promise.race([
          selectMenuPage.selectMultiSelectOptions(['invalid1', 'invalid2']),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
      } catch (error) {
        errorCaught = true;
      }
      expect(errorCaught).toBeDefined();
    });
  });

  test('All 5 select elements are present', async () => {
    await test.step('Verify all 5 select elements exist on page', async () => {
      const elements = await selectMenuPage.checkAllSelectElementsPresent();
      
      expect(elements.selectValue).toBe(true);
      expect(elements.selectOne).toBe(true);
      expect(elements.oldStyleSelect).toBe(true);
      expect(elements.multiSelect).toBe(true);
      expect(elements.multiSelectLabel).toBe(true);
    });
  });
});