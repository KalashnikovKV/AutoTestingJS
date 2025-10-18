import { expect } from 'chai';
import {
  filterUsersByAge,
  sortUsersByName,
  findUserById,
  isEmailTaken,
} from '../src/utils/usersListUtils.js';

describe('Users List Utils', () => {
  const sampleUsers = [
    { id: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
    { id: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
    { id: 3, name: 'Charlie', age: 35, email: 'charlie@example.com' },
    { id: 4, name: 'David', age: 20, email: 'david@example.com' },
    { id: 5, name: 'Eve', age: 28, email: 'eve@example.com' },
  ];

  describe('filterUsersByAge', () => {
    it('should filter users by age range', () => {
      const result = filterUsersByAge(sampleUsers, 25, 30);
      expect(result).to.have.length(3);
      expect(result).to.deep.include({
        id: 1,
        name: 'Alice',
        age: 25,
        email: 'alice@example.com',
      });
      expect(result).to.deep.include({
        id: 2,
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
      });
      expect(result).to.deep.include({
        id: 5,
        name: 'Eve',
        age: 28,
        email: 'eve@example.com',
      });
    });

    it('should return empty array when no users match age range', () => {
      const result = filterUsersByAge(sampleUsers, 40, 50);
      expect(result).to.be.an('array').that.is.empty;
    });

    it('should return all users when age range includes all', () => {
      const result = filterUsersByAge(sampleUsers, 15, 50);
      expect(result).to.have.length(5);
    });

    it('should handle single user matching age range', () => {
      const result = filterUsersByAge(sampleUsers, 20, 20);
      expect(result).to.have.length(1);
      expect(result[0]).to.deep.equal({
        id: 4,
        name: 'David',
        age: 20,
        email: 'david@example.com',
      });
    });

    it('should handle edge cases with same min and max age', () => {
      const result = filterUsersByAge(sampleUsers, 30, 30);
      expect(result).to.have.length(1);
      expect(result[0]).to.deep.equal({
        id: 2,
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
      });
    });

    it('should throw an error for non-array input', () => {
      expect(() => filterUsersByAge('not an array', 20, 30)).to.throw(
        'Users must be an array',
      );
      expect(() => filterUsersByAge(null, 20, 30)).to.throw(
        'Users must be an array',
      );
      expect(() => filterUsersByAge(undefined, 20, 30)).to.throw(
        'Users must be an array',
      );
      expect(() => filterUsersByAge({}, 20, 30)).to.throw(
        'Users must be an array',
      );
    });

    it('should handle empty array', () => {
      const result = filterUsersByAge([], 20, 30);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('sortUsersByName', () => {
    it('should sort users by name alphabetically', () => {
      const result = sortUsersByName(sampleUsers);
      expect(result).to.have.length(5);
      expect(result[0].name).to.equal('Alice');
      expect(result[1].name).to.equal('Bob');
      expect(result[2].name).to.equal('Charlie');
      expect(result[3].name).to.equal('David');
      expect(result[4].name).to.equal('Eve');
    });

    it('should not modify the original array', () => {
      const originalUsers = [...sampleUsers];
      sortUsersByName(sampleUsers);
      expect(sampleUsers).to.deep.equal(originalUsers);
    });

    it('should handle users with same names', () => {
      const usersWithSameNames = [
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Alice', age: 30 },
      ];
      const result = sortUsersByName(usersWithSameNames);
      expect(result).to.have.length(2);
    });

    it('should handle case-sensitive sorting', () => {
      const usersWithCase = [
        { id: 1, name: 'alice', age: 25 },
        { id: 2, name: 'Alice', age: 30 },
        { id: 3, name: 'BOB', age: 35 },
      ];
      const result = sortUsersByName(usersWithCase);
      expect(result[0].name).to.equal('alice');
      expect(result[1].name).to.equal('Alice');
      expect(result[2].name).to.equal('BOB');
    });

    it('should throw an error for non-array input', () => {
      expect(() => sortUsersByName('not an array')).to.throw(
        'Users must be an array',
      );
      expect(() => sortUsersByName(null)).to.throw('Users must be an array');
      expect(() => sortUsersByName(undefined)).to.throw(
        'Users must be an array',
      );
    });

    it('should handle empty array', () => {
      const result = sortUsersByName([]);
      expect(result).to.be.an('array').that.is.empty;
    });
  });

  describe('findUserById', () => {
    it('should find user by existing ID', () => {
      const result = findUserById(sampleUsers, 2);
      expect(result).to.deep.equal({
        id: 2,
        name: 'Bob',
        age: 30,
        email: 'bob@example.com',
      });
    });

    it('should return null for non-existing ID', () => {
      const result = findUserById(sampleUsers, 999);
      expect(result).to.be.null;
    });

    it('should find user with ID 0', () => {
      const usersWithZeroId = [
        { id: 0, name: 'Zero', age: 25 },
        { id: 1, name: 'One', age: 30 },
      ];
      const result = findUserById(usersWithZeroId, 0);
      expect(result).to.deep.equal({ id: 0, name: 'Zero', age: 25 });
    });

    it('should find user with negative ID', () => {
      const usersWithNegativeId = [
        { id: -1, name: 'Negative', age: 25 },
        { id: 1, name: 'Positive', age: 30 },
      ];
      const result = findUserById(usersWithNegativeId, -1);
      expect(result).to.deep.equal({ id: -1, name: 'Negative', age: 25 });
    });

    it('should throw an error for non-array input', () => {
      expect(() => findUserById('not an array', 1)).to.throw(
        'Users must be an array',
      );
      expect(() => findUserById(null, 1)).to.throw('Users must be an array');
      expect(() => findUserById(undefined, 1)).to.throw(
        'Users must be an array',
      );
    });

    it('should handle empty array', () => {
      const result = findUserById([], 1);
      expect(result).to.be.null;
    });
  });

  describe('isEmailTaken', () => {
    it('should return true for existing email', () => {
      const result = isEmailTaken(sampleUsers, 'alice@example.com');
      expect(result).to.be.true;
    });

    it('should return false for non-existing email', () => {
      const result = isEmailTaken(sampleUsers, 'nonexistent@example.com');
      expect(result).to.be.false;
    });

    it('should handle case-sensitive email checking', () => {
      const result = isEmailTaken(sampleUsers, 'ALICE@EXAMPLE.COM');
      expect(result).to.be.false;
    });

    it('should return true for email with different case if it exists', () => {
      const usersWithCaseEmail = [
        { id: 1, name: 'Alice', email: 'ALICE@EXAMPLE.COM' },
      ];
      const result = isEmailTaken(usersWithCaseEmail, 'alice@example.com');
      expect(result).to.be.false;
    });

    it('should handle empty string email', () => {
      const usersWithEmptyEmail = [{ id: 1, name: 'Alice', email: '' }];
      const result = isEmailTaken(usersWithEmptyEmail, '');
      expect(result).to.be.true;
    });

    it('should throw an error for non-array input', () => {
      expect(() => isEmailTaken('not an array', 'test@example.com')).to.throw(
        'Users must be an array',
      );
      expect(() => isEmailTaken(null, 'test@example.com')).to.throw(
        'Users must be an array',
      );
      expect(() => isEmailTaken(undefined, 'test@example.com')).to.throw(
        'Users must be an array',
      );
    });

    it('should handle empty array', () => {
      const result = isEmailTaken([], 'test@example.com');
      expect(result).to.be.false;
    });

    it('should handle users with null or undefined email', () => {
      const usersWithNullEmail = [
        { id: 1, name: 'Alice', email: null },
        { id: 2, name: 'Bob', email: undefined },
      ];
      const result1 = isEmailTaken(usersWithNullEmail, null);
      const result2 = isEmailTaken(usersWithNullEmail, undefined);
      expect(result1).to.be.true;
      expect(result2).to.be.true;
    });
  });
});
