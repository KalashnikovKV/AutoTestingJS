const { test, expect } = require('@playwright/test');
const FormPage = require('../pages/FormPage');
const TestDataGenerator = require('../utils/testData');

test.describe('DemoQA Automation Practice Form Tests', () => {
  let formPage;

  test.beforeEach(async ({ page }) => {
    formPage = new FormPage(page);
    await formPage.navigateTo('/automation-practice-form');
  });

  test('Fill form with valid data and verify submission', async () => {
    const formData = TestDataGenerator.generateFormData();

    await test.step('Fill form with valid data', async () => {
      await formPage.fillForm(formData);
    });

    await test.step('Submit form and verify results', async () => {
      await formPage.submitForm();
      const modalTitle = await formPage.getModalTitle();
      const results = await formPage.getFormResults();

      expect(modalTitle).toBe('Thanks for submitting the form');
      expect(results['Student Name']).toBe(
        `${formData.firstName} ${formData.lastName}`
      );
      expect(results['Student Email']).toBe(formData.email);
      expect(results['Gender']).toBe(formData.gender);
      expect(results['Mobile']).toBe(formData.mobile);
    });

    await test.step('Close modal', async () => {
      await formPage.closeModal();
    });
  });

  test('Form validation with invalid data', async () => {
    const invalidData = TestDataGenerator.generateInvalidFormData();

    await test.step('Fill form with invalid data', async () => {
      await formPage.fillForm(invalidData);
    });

    await test.step('Submit form and check for validation errors', async () => {
      await formPage.submitForm();

      const errors = await formPage.checkValidationErrors();
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test('Mandatory field validation', async () => {
    await test.step('Submit empty form', async () => {
      await formPage.submitForm();

      const requiredFields = await formPage.checkRequiredFields();

      expect(requiredFields.firstName).toBe(true);
      expect(requiredFields.lastName).toBe(true);
      expect(requiredFields.mobile).toBe(true);
    });
  });

  test('Form with minimal required data', async () => {
    const minimalData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      gender: 'Male',
      mobile: '1234567890',
    };

    await test.step('Fill form with minimal required data', async () => {
      await formPage.fillForm(minimalData);
    });

    await test.step('Submit and verify minimal data submission', async () => {
      await formPage.submitForm();
      const modalTitle = await formPage.getModalTitle();
      const results = await formPage.getFormResults();

      expect(modalTitle).toBe('Thanks for submitting the form');
      expect(results['Student Name']).toBe(
        `${minimalData.firstName} ${minimalData.lastName}`
      );
      expect(results['Student Email']).toBe(minimalData.email);
    });
  });

  test('Form with special characters and edge cases', async () => {
    const edgeCaseData = {
      firstName: "O'Connor",
      lastName: 'Smith-Johnson',
      email: 'test.tag@example.com',
      gender: 'Other',
      mobile: '1234567890',
      currentAddress: '123 Main St., Apt #4B\nNew York, NY 10001',
    };

    await test.step('Fill form with edge case data', async () => {
      await formPage.fillForm(edgeCaseData);
    });

    await test.step('Submit and verify edge case data', async () => {
      await formPage.submitForm();
      const modalTitle = await formPage.getModalTitle();
      const results = await formPage.getFormResults();

      expect(modalTitle).toBe('Thanks for submitting the form');
      expect(results['Student Name']).toBe(
        `${edgeCaseData.firstName} ${edgeCaseData.lastName}`
      );
    });
  });

  const formDataSets = [
    {
      name: 'Male user with full data',
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        gender: 'Male',
        mobile: '1234567890',
        currentAddress: '123 Main Street, New York, NY 10001',
      },
    },
    {
      name: 'Female user with full data',
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        gender: 'Female',
        mobile: '9876543210',
        currentAddress: '456 Oak Avenue, Los Angeles, CA 90210',
      },
    },
    {
      name: 'Other gender with special characters',
      data: {
        firstName: "O'Connor",
        lastName: 'Smith-Johnson',
        email: 'test.tag@example.com',
        gender: 'Other',
        mobile: '5555555555',
        currentAddress: '789 Pine Street, Apt #3B, Seattle, WA 98101',
      },
    },
    {
      name: 'User with minimal required fields',
      data: {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob.wilson@example.com',
        gender: 'Male',
        mobile: '1111111111',
        currentAddress: '',
      },
    },
  ];

  for (const testSet of formDataSets) {
    test(`Parameterized test: ${testSet.name}`, async () => {
      await test.step(`Fill form with ${testSet.name}`, async () => {
        await formPage.fillForm(testSet.data);
      });

      await test.step(`Submit and verify ${testSet.name}`, async () => {
        await formPage.submitForm();
        const modalTitle = await formPage.getModalTitle();
        const results = await formPage.getFormResults();

        expect(modalTitle).toBe('Thanks for submitting the form');
        expect(results['Student Name']).toBe(
          `${testSet.data.firstName} ${testSet.data.lastName}`
        );
        expect(results['Student Email']).toBe(testSet.data.email);
        expect(results['Gender']).toBe(testSet.data.gender);
        expect(results['Mobile']).toBe(testSet.data.mobile);
      });

      await test.step('Close modal', async () => {
        await formPage.closeModal();
      });
    });
  }
});
