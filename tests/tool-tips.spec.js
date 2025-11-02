const { test, expect } = require('@playwright/test');
const ToolTipsPage = require('../pages/ToolTipsPage');

test.describe('DemoQA Tool Tips Tests', () => {
  let toolTipsPage;

  test.beforeEach(async ({ page }) => {
    toolTipsPage = new ToolTipsPage(page);
    await toolTipsPage.navigateTo('/tool-tips');
  });

  test('All tooltips functionality', async () => {
    await test.step('Button tooltip', async () => {
      await toolTipsPage.hoverOverButton();
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toContain('You hovered over the Button');
    });

    await test.step('Text field tooltip', async () => {
      await toolTipsPage.hoverOverTextField();
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toContain('You hovered over the text field');
    });

    await test.step('Link tooltip', async () => {
      await toolTipsPage.hoverOverLink();
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toContain('You hovered over the Contrary');
    });

    await test.step('Contrary link tooltip', async () => {
      await toolTipsPage.hoverOverContraryLink();
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toContain('You hovered over the 1.10.32');
    });
  });

  test('All tooltips in sequence', async () => {
    const results = await toolTipsPage.testAllTooltips();

    expect(results.buttonTooltip).toContain('You hovered over the Button');
    expect(results.textFieldTooltip).toContain(
      'You hovered over the text field'
    );
    expect(results.linkTooltip).toContain('You hovered over the Contrary');
    expect(results.contraryLinkTooltip).toContain(
      'You hovered over the 1.10.32'
    );
  });

  test('Tooltip visibility and timing', async () => {
    await test.step('Verify tooltip appears on hover', async () => {
      await toolTipsPage.hoverOverButton();
      const tooltip = toolTipsPage.page.locator('.tooltip-inner');
      await expect(tooltip).toBeVisible();
    });

    await test.step('Verify tooltip disappears when not hovering', async () => {
      await toolTipsPage.hoverOverButton();
      await toolTipsPage.page.mouse.move(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const tooltip = toolTipsPage.page.locator('.tooltip-inner');
      await expect(tooltip).toBeHidden();
    });
  });

  test('Tooltip content accuracy', async () => {
    const expectedTooltips = {
      button: 'You hovered over the Button',
      textField: 'You hovered over the text field',
      link: 'You hovered over the Contrary',
      contraryLink: 'You hovered over the 1.10.32',
    };

    await test.step('Button tooltip content', async () => {
      await toolTipsPage.hoverOverButton();
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toBe(expectedTooltips.button);
    });

    await test.step('Text field tooltip content', async () => {
      await toolTipsPage.hoverOverTextField();
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toBe(expectedTooltips.textField);
    });

    await test.step('Link tooltip content', async () => {
      await toolTipsPage.hoverOverLink();
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toBe(expectedTooltips.link);
    });

    await test.step('Contrary link tooltip content', async () => {
      await toolTipsPage.hoverOverContraryLink();
      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toBe(expectedTooltips.contraryLink);
    });
  });

  test('Negative scenario - Rapid hovering', async () => {
    await test.step('Rapid hover testing', async () => {
      await toolTipsPage.hoverOverButton();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await toolTipsPage.hoverOverTextField();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await toolTipsPage.hoverOverLink();
      await new Promise((resolve) => setTimeout(resolve, 100));
      await toolTipsPage.hoverOverContraryLink();

      const tooltipText = await toolTipsPage.getTooltipText();
      expect(tooltipText).toContain('You hovered over the 1.10.32');
    });
  });

  test('Tooltip positioning and styling', async () => {
    await test.step('Verify tooltip positioning', async () => {
      await toolTipsPage.hoverOverButton();
      const tooltip = toolTipsPage.page.locator('.tooltip-inner');
      await tooltip
        .waitFor({ state: 'visible', timeout: 5000 })
        .catch(() => {});
      await expect(tooltip).toBeVisible();

      const tooltipStyle = await tooltip.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
        };
      });

      expect(tooltipStyle.backgroundColor).toBeTruthy();
      expect(tooltipStyle.color).toBeTruthy();
      expect(tooltipStyle.fontSize).toBeTruthy();
    });
  });
});
