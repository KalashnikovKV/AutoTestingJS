const BasePage = require('./BasePage');

class TextBoxPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectors = {
      fullName: '#userName',
      email: '#userEmail',
      currentAddress: '#currentAddress',
      permanentAddress: '#permanentAddress',
      submitButton: '#submit',
      output: '#output',
      outputName: '#name',
      outputEmail: '#email',
      outputCurrentAddress: '#output #currentAddress',
      outputPermanentAddress: '#output #permanentAddress',
    };
  }

  async fillTextBox(formData) {
    await this.fillField(this.selectors.fullName, formData.fullName);
    await this.fillField(this.selectors.email, formData.email);
    await this.fillField(
      this.selectors.currentAddress,
      formData.currentAddress
    );
    await this.fillField(
      this.selectors.permanentAddress,
      formData.permanentAddress
    );
  }

  async submitForm() {
    await this.clickElement(this.selectors.submitButton);
  }

  async getOutputText() {
    try {
      await this.waitForElement(this.selectors.output, 5000);
      return await this.getText(this.selectors.output);
    } catch (error) {
      return '';
    }
  }

  async parseOutputWithLineBreaks(outputText) {
    const data = {};
    const lines = outputText.split('\n').filter((line) => line.trim());
    
    for (const line of lines) {
      if (line.includes('Name:')) {
        data.name = line.replace('Name:', '').trim();
      } else if (line.includes('Email:')) {
        data.email = line.replace('Email:', '').trim();
      } else if (line.includes('Current Address')) {
        data.currentAddress = line.replace(/Current Address\s*:/, '').trim();
      } else if (line.includes('Permanent Address') || line.includes('Permananet Address')) {
        data.permanentAddress = line.replace(/Permanent? Address\s*:/, '').trim();
      }
    }
    
    return data;
  }

  async parseOutputWithoutLineBreaks(outputText) {
    const data = {};

    const nameMatch = outputText.match(/Name:([^E]*?)(?=Email:|$)/);
    if (nameMatch) {
      data.name = nameMatch[1].trim();
    }

    const emailMatch = outputText.match(/Email:([^C]*?)(?=Current Address|$)/);
    if (emailMatch) {
      data.email = emailMatch[1].trim();
    } else {
      const emailAltMatch = outputText.match(/Email:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailAltMatch) {
        data.email = emailAltMatch[1].trim();
      }
    }

    const currentAddressMatch = outputText.match(/Current Address\s*:\s*(.+?)(?=\s*(?:Permanent|Permananet)\s+Address|$)/);
    if (currentAddressMatch) {
      data.currentAddress = currentAddressMatch[1].trim();
    } else {
      const altMatch = outputText.match(/Current Address\s*:\s*(.+)$/);
      if (altMatch) {
        let addr = altMatch[1].trim();
        addr = addr.replace(/\s*(?:Permanent|Permananet)\s+Address\s*:.*$/, '').trim();
        data.currentAddress = addr;
      }
    }

    const permanentAddressMatch = outputText.match(/(?:Permanent|Permananet) Address\s*:\s*(.*?)$/);
    if (permanentAddressMatch) {
      data.permanentAddress = permanentAddressMatch[1].trim();
    }

    return data;
  }

  async getOutputData() {
    try {
      const outputText = await this.getOutputText();
      if (!outputText) {
        return {
          name: '',
          email: '',
          currentAddress: '',
          permanentAddress: '',
        };
      }

      const hasLineBreaks = outputText.includes('\n');
      const data = hasLineBreaks 
        ? await this.parseOutputWithLineBreaks(outputText)
        : await this.parseOutputWithoutLineBreaks(outputText);

      return {
        name: data.name || '',
        email: data.email || '',
        currentAddress: data.currentAddress || '',
        permanentAddress: data.permanentAddress || '',
      };
    } catch (error) {
      return {
        name: '',
        email: '',
        currentAddress: '',
        permanentAddress: '',
      };
    }
  }


  async checkValidationErrors() {
    const errors = [];

    const emailField = this.page.locator(this.selectors.email);
    const emailValidation = await emailField.evaluate(
      (el) => el.validationMessage
    );
    if (emailValidation) {
      errors.push(`Email validation: ${emailValidation}`);
    }

    return errors;
  }
}

module.exports = TextBoxPage;
