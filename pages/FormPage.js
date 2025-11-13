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

  async closeModalIfVisible() {
    if (await this.checkElementVisibleNow(SELECTORS.MODAL)) {
      await this.closeModal();
    }
  }

  async fillBasicFields(formData) {
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
  }

  async selectGender(gender) {
    if (!gender) return;
    
    const genderMap = { Male: '1', Female: '2', Other: '3' };
    const genderId = genderMap[gender];
    await this.clickElement(
      `#genterWrapper label[for="gender-radio-${genderId}"]`
    );
  }

  async selectHobbies(hobbies) {
    if (!hobbies || hobbies.length === 0) return;

    for (const hobby of hobbies) {
      try {
        if (await this.checkElementVisibleNow(SELECTORS.MODAL)) {
          await this.closeModal();
          await this.page.locator(SELECTORS.MODAL).waitFor({ state: 'hidden', timeout: TIMEOUTS.ELEMENT_WAIT });
        }

        const hobbyId =
          hobby === 'Sports' ? '1' : hobby === 'Reading' ? '2' : '3';
        const hobbySelector = `#hobbiesWrapper label[for="hobbies-checkbox-${hobbyId}"]`;

        await this.scrollToElement(hobbySelector);
        const hobbyLocator = this.page.locator(hobbySelector);
        await hobbyLocator.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_WAIT });

        await this.clickElement(hobbySelector, { force: true });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Failed to select hobby ${hobby}:`, error.message);
      }
    }
  }

  async uploadPicture(picturePath) {
    if (!picturePath) return;

    try {
      await this.page.setInputFiles(this.selectors.picture, picturePath);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('File upload error:', error.message);
    }
  }

  async selectState(state) {
    if (!state || !state.trim()) return;

    try {
      await this.clickElement(this.selectors.state, { force: true });
      await this.page.locator(this.selectors.state).waitFor({ state: 'visible' }).catch(() => {});
      await this.page.keyboard.type(state);
      await this.page.locator(`text=${state}`).first().waitFor({ state: 'visible', timeout: 300 }).catch(() => {});
      await this.page.keyboard.press('Enter');
      await this.page.locator(this.selectors.state).waitFor({ state: 'attached' }).catch(() => {});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`State selection error: ${state}`, error.message);
    }
  }

  async selectCity(city) {
    if (!city || !city.trim()) return;

    try {
      await this.clickElement(this.selectors.city, { force: true });
      await this.page.locator(this.selectors.city).waitFor({ state: 'visible' }).catch(() => {});
      await this.page.keyboard.type(city);
      await this.page.locator(`text=${city}`).first().waitFor({ state: 'visible', timeout: 300 }).catch(() => {});
      await this.page.keyboard.press('Enter');
      await this.page.locator(this.selectors.city).waitFor({ state: 'attached' }).catch(() => {});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`City selection error: ${city}`, error.message);
    }
  }

  async fillForm(formData) {
    await this.closeModalIfVisible();
    await this.fillBasicFields(formData);
    await this.selectGender(formData.gender);
    await this.selectHobbies(formData.hobbies);
    await this.uploadPicture(formData.picture);
    await this.selectState(formData.state);
    await this.selectCity(formData.city);
  }

  async submitForm() {
    try {
      if (await this.checkElementVisibleNow(SELECTORS.MODAL)) {
        await this.closeModal();
        await this.page.locator(SELECTORS.MODAL).waitFor({ state: 'hidden', timeout: TIMEOUTS.ELEMENT_WAIT });
      }

      try {
        await this.scrollToElement(this.selectors.submitButton);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Submit button scroll error:', error.message);
      }

      try {
        const submitButton = this.page.locator(this.selectors.submitButton);
        await submitButton.waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT });
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
        // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.log('Modal close error:', error.message);
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
            // eslint-disable-next-line no-console
            console.log('Element visibility check error:', error.message);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
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

  async hasRequiredAttribute(selector) {
    const element = this.page.locator(selector);
    return await element.evaluate(el => el.hasAttribute('required'));
  }

  async checkRequiredFields() {
    return {
      firstName: await this.hasRequiredAttribute(this.selectors.firstName),
      lastName: await this.hasRequiredAttribute(this.selectors.lastName),
      mobile: await this.hasRequiredAttribute(this.selectors.mobile),
    };
  }
}

module.exports = FormPage;
