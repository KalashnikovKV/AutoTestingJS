const { faker } = require('@faker-js/faker');

class TestDataGenerator {
  static generateRandomUser() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 80 }),
      salary: faker.number.int({ min: 1000, max: 10000 }),
      department: faker.commerce.department(),
      currentAddress: faker.location.streetAddress(),
      permanentAddress: faker.location.streetAddress()
    };
  }

  static generateRandomText() {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      currentAddress: faker.location.streetAddress(),
      permanentAddress: faker.location.streetAddress()
    };
  }

  static generateFormData() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
      mobile: faker.phone.number('##########'),
      dateOfBirth: null,
      subjects: [],
      hobbies: faker.helpers.arrayElements([
        'Sports', 'Reading', 'Music'
      ], { min: 1, max: 3 }),
      picture: 'data/test-image.jpg',
      currentAddress: faker.location.streetAddress(),
      state: 'NCR',
      city: 'Delhi'
    };
  }

  static generateMinimalFormData() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      gender: 'Male',
      mobile: faker.phone.number('##########'),
      currentAddress: faker.location.streetAddress(),
      dateOfBirth: null,
      subjects: [],
      hobbies: [],
      picture: '',
      state: '',
      city: '',
    };
  }

  static generateInvalidFormData() {
    return {
      firstName: '',
      lastName: faker.person.lastName(),
      email: 'invalid-email',
      gender: 'Male',
      mobile: '123',
      dateOfBirth: {
        year: 2025,
        month: 'January',
        day: 1
      },
      subjects: [],
      hobbies: [],
      picture: '',
      currentAddress: '',
      state: '',
      city: ''
    };
  }

  static generateApiUserCredentials() {
    const timestamp = Date.now();
    const randomString = faker.string.alphanumeric(8);
    return {
      userName: `user_${randomString}_${timestamp}`,
      password: `Password123!${randomString}`,
    };
  }
}

module.exports = TestDataGenerator;
