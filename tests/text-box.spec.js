const { test, expect } = require('@playwright/test');
const TextBoxPage = require('../pages/TextBoxPage');
const TestDataGenerator = require('../utils/testData');

test.describe('DemoQA Text Box Tests', () => {
  let textBoxPage;

  test.beforeEach(async ({ page }) => {
    textBoxPage = new TextBoxPage(page);
    await textBoxPage.navigateTo('/text-box');
  });

  test('Fill text box with random data and verify output', async () => {
    const testData = TestDataGenerator.generateRandomText();

    await test.step('Fill text box with random data', async () => {
      await textBoxPage.fillTextBox(testData);
    });

    await test.step('Submit form and verify output', async () => {
      await textBoxPage.submitForm();
      const output = await textBoxPage.getOutputData();

      const normalize = (str) => (str || '').trim().replace(/\s+/g, ' ');
      const normalizedFormName = normalize(testData.fullName);
      const normalizedOutputName = normalize(output.name);
      const normalizedFormEmail = normalize(testData.email);
      const normalizedOutputEmail = normalize(output.email);
      const normalizedFormCurrentAddr = normalize(testData.currentAddress);
      const normalizedOutputCurrentAddr = normalize(output.currentAddress);
      const normalizedFormPermanentAddr = normalize(testData.permanentAddress);
      const normalizedOutputPermanentAddr = normalize(output.permanentAddress);

      expect(output.name !== '' || output.email !== '').toBe(true);
      expect(normalizedOutputName && (normalizedOutputName === normalizedFormName || normalizedOutputName.includes(normalizedFormName))).toBe(true);
      expect(normalizedOutputEmail && (normalizedOutputEmail === normalizedFormEmail || normalizedOutputEmail.includes(normalizedFormEmail))).toBe(true);
      expect(normalizedOutputCurrentAddr && normalizedFormCurrentAddr && (normalizedOutputCurrentAddr === normalizedFormCurrentAddr || normalizedOutputCurrentAddr.includes(normalizedFormCurrentAddr) || normalizedFormCurrentAddr.includes(normalizedOutputCurrentAddr))).toBe(true);
      expect(normalizedOutputPermanentAddr && normalizedFormPermanentAddr && (normalizedOutputPermanentAddr === normalizedFormPermanentAddr || normalizedOutputPermanentAddr.includes(normalizedFormPermanentAddr) || normalizedFormPermanentAddr.includes(normalizedOutputPermanentAddr))).toBe(true);
    });
  });

  test('Text box with empty fields', async () => {
    const emptyData = {
      fullName: '',
      email: '',
      currentAddress: '',
      permanentAddress: '',
    };

    await test.step('Submit empty form', async () => {
      await textBoxPage.fillTextBox(emptyData);
      await textBoxPage.submitForm();
    });

    await test.step('Verify no output is generated', async () => {
      const output = await textBoxPage.getOutputData();
      expect(output.name).toBe('');
      expect(output.email).toBe('');
    });
  });

  test('Text box with invalid email format', async () => {
    const invalidEmailData = {
      fullName: 'John Doe',
      email: 'invalid-email-format',
      currentAddress: '123 Main St',
      permanentAddress: '456 Oak Ave',
    };

    await test.step('Fill form with invalid email', async () => {
      await textBoxPage.fillTextBox(invalidEmailData);
    });

    await test.step('Check for email validation', async () => {
      const errors = await textBoxPage.checkValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test('Text box with special characters and long text', async () => {
    const specialData = {
      fullName: 'Jose Maria OConnor-Smith',
      email: 'test.special@example.com',
      currentAddress: '123 Main St., Apt #4B New York, NY 10001 United States',
      permanentAddress:
        '456 Oak Avenue, Suite 200 Los Angeles, CA 90210 United States of America',
    };

    await test.step('Fill form with special characters', async () => {
      await textBoxPage.fillTextBox(specialData);
    });

    await test.step('Submit and verify special characters are handled', async () => {
      await textBoxPage.submitForm();
      const output = await textBoxPage.getOutputData();

      const normalize = (str) => (str || '').trim().replace(/\s+/g, ' ');
      const normalizedFormName = normalize(specialData.fullName);
      const normalizedOutputName = normalize(output.name);
      const normalizedFormEmail = normalize(specialData.email);
      const normalizedOutputEmail = normalize(output.email);

      expect(output.name !== '' || output.email !== '').toBe(true);
      expect(normalizedOutputName && (normalizedOutputName === normalizedFormName || normalizedOutputName.includes(normalizedFormName))).toBe(true);
      expect(normalizedOutputEmail && (normalizedOutputEmail === normalizedFormEmail || normalizedOutputEmail.includes(normalizedFormEmail))).toBe(true);
    });
  });

  test('Text box with maximum length data', async () => {
    const longData = {
      fullName: 'A'.repeat(100),
      email: 'very.long.email.address.that.exceeds.normal.length@example.com',
      currentAddress: 'A'.repeat(500),
      permanentAddress: 'B'.repeat(500),
    };

    await test.step('Fill form with maximum length data', async () => {
      await textBoxPage.fillTextBox(longData);
    });

    await test.step('Submit and verify long data is handled', async () => {
      await textBoxPage.submitForm();
      const output = await textBoxPage.getOutputData();

      const normalize = (str) => (str || '').trim().replace(/\s+/g, ' ');
      const normalizedFormName = normalize(longData.fullName);
      const normalizedOutputName = normalize(output.name);
      const normalizedFormEmail = normalize(longData.email);
      const normalizedOutputEmail = normalize(output.email);

      expect(output.name !== '' || output.email !== '').toBe(true);
      expect(normalizedOutputName && (normalizedOutputName === normalizedFormName || normalizedOutputName.includes(normalizedFormName))).toBe(true);
      expect(normalizedOutputEmail && (normalizedOutputEmail === normalizedFormEmail || normalizedOutputEmail.includes(normalizedFormEmail))).toBe(true);
    });
  });

  test('Text box with only required fields', async () => {
    const minimalData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      currentAddress: '',
      permanentAddress: '',
    };

    await test.step('Fill form with minimal required data', async () => {
      await textBoxPage.fillTextBox(minimalData);
    });

    await test.step('Submit and verify minimal data', async () => {
      await textBoxPage.submitForm();
      const output = await textBoxPage.getOutputData();

      const normalize = (str) => (str || '').trim().replace(/\s+/g, ' ');
      const normalizedFormName = normalize(minimalData.fullName);
      const normalizedOutputName = normalize(output.name);
      const normalizedFormEmail = normalize(minimalData.email);
      const normalizedOutputEmail = normalize(output.email);

      expect(output.name !== '' || output.email !== '').toBe(true);
      expect(normalizedOutputName && (normalizedOutputName === normalizedFormName || normalizedOutputName.includes(normalizedFormName))).toBe(true);
      expect(normalizedOutputEmail && (normalizedOutputEmail === normalizedFormEmail || normalizedOutputEmail.includes(normalizedFormEmail))).toBe(true);
    });
  });

  const testDataSets = [
    {
      name: 'Standard user data',
      data: {
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        currentAddress: '123 Main Street, New York, NY 10001',
        permanentAddress: '456 Oak Avenue, Los Angeles, CA 90210',
      },
    },
    {
      name: 'User with special characters',
      data: {
        fullName: "María José O'Connor",
        email: 'maria.jose@example.com',
        currentAddress: 'Calle 123 #45-67, Bogotá',
        permanentAddress: 'Avenida Principal, Medellín',
      },
    },
    {
      name: 'User with numbers in name',
      data: {
        fullName: 'John Doe 123',
        email: 'john.doe123@example.com',
        currentAddress: 'Building 5, Apt 3B, Street 42',
        permanentAddress: 'Suite 100, Floor 10, Tower 1',
      },
    },
    {
      name: 'User with minimal address',
      data: {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        currentAddress: 'Street 1',
        permanentAddress: 'Street 2',
      },
    },
  ];

  for (const testSet of testDataSets) {
    test(`Parameterized test: ${testSet.name}`, async () => {
      await test.step(`Fill form with ${testSet.name}`, async () => {
        await textBoxPage.fillTextBox(testSet.data);
      });

      await test.step(`Submit and verify ${testSet.name}`, async () => {
        await textBoxPage.submitForm();
        const output = await textBoxPage.getOutputData();

        const normalize = (str) => (str || '').trim().replace(/\s+/g, ' ');
        const normalizedFormName = normalize(testSet.data.fullName);
        const normalizedOutputName = normalize(output.name);
        const normalizedFormEmail = normalize(testSet.data.email);
        const normalizedOutputEmail = normalize(output.email);
        const normalizedFormCurrentAddr = normalize(testSet.data.currentAddress);
        const normalizedOutputCurrentAddr = normalize(output.currentAddress);
        const normalizedFormPermanentAddr = normalize(testSet.data.permanentAddress);
        const normalizedOutputPermanentAddr = normalize(output.permanentAddress);

        expect(output.name !== '' || output.email !== '').toBe(true);
        expect(normalizedOutputName && (normalizedOutputName === normalizedFormName || normalizedOutputName.includes(normalizedFormName))).toBe(true);
        expect(normalizedOutputEmail && (normalizedOutputEmail === normalizedFormEmail || normalizedOutputEmail.includes(normalizedFormEmail))).toBe(true);
        expect(normalizedOutputCurrentAddr && normalizedFormCurrentAddr && (normalizedOutputCurrentAddr === normalizedFormCurrentAddr || normalizedOutputCurrentAddr.includes(normalizedFormCurrentAddr) || normalizedFormCurrentAddr.includes(normalizedOutputCurrentAddr))).toBe(true);
        expect(normalizedOutputPermanentAddr && normalizedFormPermanentAddr && (normalizedOutputPermanentAddr === normalizedFormPermanentAddr || normalizedOutputPermanentAddr.includes(normalizedFormPermanentAddr) || normalizedFormPermanentAddr.includes(normalizedOutputPermanentAddr))).toBe(true);
      });
    });
  }
});
