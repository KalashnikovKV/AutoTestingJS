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
      const outputElement = this.page.locator(this.selectors.output);
      await outputElement.waitFor({ state: 'visible', timeout: 5000 });
      const text = await outputElement.textContent();
      return text || '';
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

    // Name parsing - более гибкий с несколькими паттернами
    const namePatterns = [
      /Name:\s*([^E]*?)(?=Email:|$)/,
      /Name:\s*([^\n]+)/,
      /Name:\s*(.+?)(?=\s+Email:)/,
    ];
    for (const pattern of namePatterns) {
      const match = outputText.match(pattern);
      if (match && match[1] && match[1].trim()) {
        data.name = match[1].trim();
        break;
      }
    }

    // Email parsing - более гибкий с несколькими паттернами
    const emailPatterns = [
      /Email:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
      /Email:\s*([^C]*?)(?=Current Address|$)/,
      /Email:\s*([^\n]+)/,
    ];
    for (const pattern of emailPatterns) {
      const match = outputText.match(pattern);
      if (match && match[1] && match[1].trim()) {
        data.email = match[1].trim();
        break;
      }
    }

    // Current Address parsing - более гибкий
    const currentAddressPatterns = [
      /Current Address\s*:\s*(.+?)(?=\s*(?:Permanent|Permananet)\s+Address|$)/,
      /Current Address\s*:\s*(.+?)(?=Permanent|Permananet|$)/,
      /Current Address\s*:\s*(.+)$/,
    ];
    for (const pattern of currentAddressPatterns) {
      const match = outputText.match(pattern);
      if (match && match[1] && match[1].trim()) {
        let addr = match[1].trim();
        addr = addr.replace(/\s*(?:Permanent|Permananet)\s+Address\s*:.*$/, '').trim();
        if (addr) {
          data.currentAddress = addr;
          break;
        }
      }
    }

    // Permanent Address parsing - более гибкий
    const permanentAddressPatterns = [
      /(?:Permanent|Permananet)\s+Address\s*:\s*(.*?)$/,
      /(?:Permanent|Permananet)\s+Address\s*:\s*(.+)/,
    ];
    for (const pattern of permanentAddressPatterns) {
      const match = outputText.match(pattern);
      if (match && match[1] && match[1].trim()) {
        data.permanentAddress = match[1].trim();
        break;
      }
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
