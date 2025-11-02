const BasePage = require('./BasePage');
const { TIMEOUTS, SELECTORS } = require('../utils/constants');

class FormPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      firstName: '#firstName',
      lastName: '#lastName',
      email: '#userEmail',
      gender: '#genterWrapper',
      mobile: '#userNumber',
      dateOfBirth: '#dateOfBirthInput',
      subjects: '#subjectsInput',
      hobbies: '#hobbiesWrapper',
      picture: '#uploadPicture',
      currentAddress: '#currentAddress',
      state: '#state',
      city: '#city',
      submitButton: '#submit',
      modal: '.modal-content',
      modalTitle: '.modal-title',
      closeButton: '#closeLargeModal',
      validationError: '.invalid-feedback',
    };
  }

  async fillForm(formData) {
    if (await this.checkElementVisibleNow(SELECTORS.MODAL)) {
      await this.closeModal();
    }

    if (formData.firstName) {
      await this.fillField(this.selectors.firstName, formData.firstName);
    }
    if (formData.lastName) {
      await this.fillField(this.selectors.lastName, formData.lastName);
    }
    if (formData.email) {
      await this.fillField(this.selectors.email, formData.email);
    }
    if (formData.mobile) {
      await this.fillField(this.selectors.mobile, formData.mobile);
    }
    if (formData.currentAddress) {
      await this.fillField(
        this.selectors.currentAddress,
        formData.currentAddress
      );
    }

    if (formData.gender) {
      const genderMap = { Male: '1', Female: '2', Other: '3' };
      const genderId = genderMap[formData.gender];
      await this.clickElement(
        `#genterWrapper label[for="gender-radio-${genderId}"]`
      );
    }

    if (formData.hobbies && formData.hobbies.length > 0) {
      for (const hobby of formData.hobbies) {
        try {
          if (await this.checkElementVisibleNow(SELECTORS.MODAL)) {
            await this.closeModal();
            await this.waitForTimeout(TIMEOUTS.LONG);
          }

          const hobbyId =
            hobby === 'Sports' ? '1' : hobby === 'Reading' ? '2' : '3';
          const hobbySelector = `#hobbiesWrapper label[for="hobbies-checkbox-${hobbyId}"]`;

          await this.scrollToElement(hobbySelector);
          await this.waitForTimeout(TIMEOUTS.MEDIUM);

          await this.clickElement(hobbySelector, { force: true });
        } catch (error) {
          console.log(`Failed to select hobby ${hobby}:`, error.message);
        }
      }
    }

    if (formData.picture) {
      try {
        await this.page.setInputFiles(this.selectors.picture, formData.picture);
      } catch (error) {
        console.log('File upload error:', error.message);
      }
    }

    if (formData.state && formData.state.trim()) {
      try {
        await this.clickElement(this.selectors.state, { force: true });
        await this.waitForTimeout(TIMEOUTS.LONG);

        await this.page.keyboard.type(formData.state);
        await this.waitForTimeout(TIMEOUTS.MEDIUM);
        await this.page.keyboard.press('Enter');
      } catch (error) {
        console.log(`State selection error: ${formData.state}`, error.message);
      }
    }

    if (formData.city && formData.city.trim()) {
      try {
        await this.clickElement(this.selectors.city, { force: true });
        await this.waitForTimeout(TIMEOUTS.LONG);

        await this.page.keyboard.type(formData.city);
        await this.waitForTimeout(TIMEOUTS.MEDIUM);
        await this.page.keyboard.press('Enter');
      } catch (error) {
        console.log(`City selection error: ${formData.city}`, error.message);
      }
    }
  }

  async submitForm() {
    try {
      if (await this.checkElementVisibleNow(SELECTORS.MODAL)) {
        await this.closeModal();
        await this.waitForTimeout(TIMEOUTS.LONG);
      }

      try {
        await this.scrollToElement(this.selectors.submitButton);
        await this.waitForTimeout(TIMEOUTS.MEDIUM);
      } catch (error) {
        console.log('Submit button scroll error:', error.message);
      }

      try {
        const submitButton = this.page.locator(this.selectors.submitButton);
        await submitButton
          .waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT })
          .catch(() => {});
        await submitButton.click({ timeout: TIMEOUTS.DEFAULT });
      } catch (error) {
        try {
          await this.clickElement(this.selectors.submitButton, { force: true });
        } catch (error2) {
          throw new Error(`Failed to submit form: ${error2.message}`);
        }
      }
    } catch (error) {
      const errorMessage = error.message || '';
      if (
        errorMessage.includes('closed') ||
        errorMessage.includes('Target page')
      ) {
        throw new Error('Browser context was closed during form submission');
      }
      throw error;
    }
  }

  async getModalTitle() {
    try {
      await this.waitForElement(this.selectors.modal);
    } catch {
      return '';
    }

    const titleSelectors = [
      '.modal-title',
      '#example-modal-sizes-lg-title',
      '.modal-header h4',
      '.modal-header h5',
      '.modal-header .modal-title',
    ];

    for (const selector of titleSelectors) {
      try {
        const title = await this.getText(selector);
        if (title && title.trim()) {
          return title.trim();
        }
      } catch (error) {
        console.log(`Modal title selector error: ${selector}`, error.message);
      }
    }

    try {
      const headerText = await this.getText('.modal-header');
      return headerText || '';
    } catch {
      return '';
    }
  }

  async getFormResults() {
    const results = {};
    const modalContent = this.page.locator(this.selectors.modal);

    const rows = await modalContent.locator('tbody tr').all();
    for (const row of rows) {
      const label = await row.locator('td').nth(0).textContent();
      const value = await row.locator('td').nth(1).textContent();
      results[label] = value;
    }

    return results;
  }

  async closeModal() {
    try {
      if (await this.checkElementVisibleNow(SELECTORS.MODAL)) {
        if (await this.checkElementVisibleNow(this.selectors.closeButton)) {
          await this.clickElement(this.selectors.closeButton, { force: true });
        }
        await this.page.keyboard.press('Escape');
      }
    } catch (error) {
      console.log('Modal close error:', error.message);
    }
  }

  async validateFormSubmission() {
    await this.submitForm();

    try {
      const modalTitle = await this.getModalTitle();
      const results = await this.getFormResults();

      return {
        modalTitle,
        results,
        isValid: modalTitle === 'Thanks for submitting the form',
      };
    } catch {
      const errors = await this.checkValidationErrors();

      return {
        modalTitle: '',
        results: {},
        isValid: false,
        errors: errors,
      };
    }
  }

  async checkValidationErrors() {
    const errors = [];

    const errorSelectors = [
      '.invalid-feedback',
      '.text-danger',
      '.error',
      '[class*="error"]',
      '[class*="invalid"]',
      '.form-control:invalid',
      'input:invalid',
      'select:invalid',
    ];

    for (const selector of errorSelectors) {
      try {
        const errorElements = await this.page.locator(selector).all();
        for (const errorElement of errorElements) {
          try {
            const isVisible = await errorElement.isVisible().catch(() => false);
            if (isVisible) {
              const text = await errorElement.textContent();
              if (text && text.trim()) {
                errors.push(text.trim());
              }
            }
          } catch (error) {
            console.log('Element visibility check error:', error.message);
          }
        }
      } catch (error) {
        console.log(`Error selector check: ${selector}`, error.message);
      }
    }

    const inputs = await this.page.locator('input, select, textarea').all();
    for (const input of inputs) {
      const validity = await input.evaluate((el) => el.validity);
      if (!validity.valid) {
        const message = await input.evaluate((el) => el.validationMessage);
        if (message) {
          errors.push(message);
        }
      }
    }

    return errors;
  }
}

module.exports = FormPage;
