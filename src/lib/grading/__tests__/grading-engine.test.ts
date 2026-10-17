import { describe, it, expect } from 'vitest';
import {
  evaluateGrade,
  calculateTotalScore,
  validateComponentScore,
  calculateTermPerformance,
  DEFAULT_GRADING_RULES,
} from '../grading-engine';

describe('Grading Engine', () => {
  describe('evaluateGrade', () => {
    it('correctly grades an A (75-100)', () => {
      const res = evaluateGrade(85);
      expect(res.grade).toBe('A');
      expect(res.remark).toBe('Distinction');
      expect(res.gpaPoint).toBe(5.0);
    });

    it('correctly grades exact boundaries', () => {
      expect(evaluateGrade(75).grade).toBe('A');
      expect(evaluateGrade(74.99).grade).toBe('B');
      expect(evaluateGrade(65).grade).toBe('B');
      expect(evaluateGrade(50).grade).toBe('C');
      expect(evaluateGrade(45).grade).toBe('D');
      expect(evaluateGrade(40).grade).toBe('E');
      expect(evaluateGrade(39.99).grade).toBe('F');
      expect(evaluateGrade(0).grade).toBe('F');
    });

    it('supports custom grading scales', () => {
      const customRules = [
        { grade: '1st', min_score: 70, max_score: 100, remark: 'First Class', gpa_point: 5.0 },
        { grade: '2nd-Upper', min_score: 60, max_score: 69.99, remark: 'Second Upper', gpa_point: 4.0 },
        { grade: 'Fail', min_score: 0, max_score: 59.99, remark: 'Fail', gpa_point: 0.0 },
      ];
      expect(evaluateGrade(72, customRules).grade).toBe('1st');
      expect(evaluateGrade(63, customRules).grade).toBe('2nd-Upper');
      expect(evaluateGrade(45, customRules).grade).toBe('Fail');
    });
  });

  describe('calculateTotalScore', () => {
    it('sums CA and Exam correctly', () => {
      expect(calculateTotalScore([25, 60])).toBe(85);
      expect(calculateTotalScore([28.5, 59.5])).toBe(88);
    });

    it('handles zero or missing components safely', () => {
      expect(calculateTotalScore([0, 50])).toBe(50);
      expect(calculateTotalScore([NaN, 50])).toBe(50);
    });
  });

  describe('validateComponentScore', () => {
    it('validates scores within bounds', () => {
      expect(validateComponentScore(25, 30, 'CA').isValid).toBe(true);
      expect(validateComponentScore(70, 70, 'Exam').isValid).toBe(true);
      expect(validateComponentScore(0, 30, 'CA').isValid).toBe(true);
    });

    it('flags negative scores', () => {
      const res = validateComponentScore(-5, 30, 'CA');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('cannot be negative');
    });

    it('flags scores exceeding maximum', () => {
      const res = validateComponentScore(35, 30, 'CA');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('exceeds maximum allowed of 30');
    });
  });

  describe('calculateTermPerformance', () => {
    it('calculates average score, GPA, and subject counts', () => {
      const subjects = [
        { total_score: 80, grade: 'A', gpaPoint: 5.0 }, // Math
        { total_score: 70, grade: 'B', gpaPoint: 4.0 }, // English
        { total_score: 60, grade: 'C', gpaPoint: 3.0 }, // Science
      ];
      const perf = calculateTermPerformance(subjects);
      expect(perf.totalSubjects).toBe(3);
      expect(perf.totalScore).toBe(210);
      expect(perf.averageScore).toBe(70);
      expect(perf.gpa).toBe(4.0);
      expect(perf.passedSubjects).toBe(3);
    });
  });
});
