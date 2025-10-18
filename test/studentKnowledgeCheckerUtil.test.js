import { expect } from 'chai';
import { checkStudentKnowledge } from '../src/utils/studentKnowledgeCheckerUtil.js';

describe('Student Knowledge Checker Util', () => {
  describe('checkStudentKnowledge', () => {
    it('should return true when all answers are correct', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should return false when at least one answer is incorrect', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'wrong_answer',
        question3: 'answer3',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return false when student has different number of answers', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return false when student has extra answers', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
        question4: 'answer4',
      };
      const correctAnswers = {
        question1: 'answer1',
        question2: 'answer2',
        question3: 'answer3',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should return false when question keys are different', () => {
      const studentAnswers = {
        question1: 'answer1',
        question2: 'answer2',
      };
      const correctAnswers = {
        question1: 'answer1',
        question3: 'answer3',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should handle empty objects', () => {
      const studentAnswers = {};
      const correctAnswers = {};

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should handle single question correctly', () => {
      const studentAnswers = { question1: 'correct_answer' };
      const correctAnswers = { question1: 'correct_answer' };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should handle single question incorrectly', () => {
      const studentAnswers = { question1: 'wrong_answer' };
      const correctAnswers = { question1: 'correct_answer' };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should handle answers with different data types', () => {
      const studentAnswers = {
        question1: 'string_answer',
        question2: 42,
        question3: true,
      };
      const correctAnswers = {
        question1: 'string_answer',
        question2: 42,
        question3: true,
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should return false when data types don\'t match', () => {
      const studentAnswers = {
        question1: '42',
        question2: 42,
      };
      const correctAnswers = {
        question1: 42,
        question2: '42',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should handle answers with special characters', () => {
      const studentAnswers = {
        question1: 'answer with spaces',
        question2: 'answer-with-dashes',
        question3: 'answer_with_underscores',
      };
      const correctAnswers = {
        question1: 'answer with spaces',
        question2: 'answer-with-dashes',
        question3: 'answer_with_underscores',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should handle answers with unicode characters', () => {
      const studentAnswers = {
        question1: 'ответ на русском',
        question2: 'réponse en français',
      };
      const correctAnswers = {
        question1: 'ответ на русском',
        question2: 'réponse en français',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should handle case-sensitive answers', () => {
      const studentAnswers = {
        question1: 'Answer',
        question2: 'answer',
      };
      const correctAnswers = {
        question1: 'answer',
        question2: 'Answer',
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });

    it('should handle null and undefined values', () => {
      const studentAnswers = {
        question1: null,
        question2: undefined,
      };
      const correctAnswers = {
        question1: null,
        question2: undefined,
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.true;
    });

    it('should return false when null and undefined don\'t match', () => {
      const studentAnswers = {
        question1: null,
        question2: undefined,
      };
      const correctAnswers = {
        question1: undefined,
        question2: null,
      };

      expect(checkStudentKnowledge(studentAnswers, correctAnswers)).to.be.false;
    });
  });
});
