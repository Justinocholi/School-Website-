import { describe, it, expect } from 'vitest';
import {
  validateStudentImport,
  validateSubjectResultImport,
  generateStudentTemplate,
} from '../import-service';

describe('Bulk Import Validation Engine', () => {
  describe('validateStudentImport', () => {
    it('passes completely valid student rows', async () => {
      const rows = [
        {
          student_id: 'NEW001',
          first_name: 'Kelechi',
          last_name: 'Iheanacho',
          class_name: 'JSS 1A',
        },
        {
          student_id: 'NEW002',
          first_name: 'Chidinma',
          last_name: 'Okonkwo',
          class_name: 'JSS 1A',
        },
      ];

      const res = await validateStudentImport(rows, 'create_only');
      expect(res.valid.length).toBe(2);
      expect(res.errors.length).toBe(0);
      expect(res.summary.validCount).toBe(2);
    });

    it('flags missing required fields with correct row numbers', async () => {
      const rows = [
        { student_id: '', first_name: 'Test', last_name: 'User', class_name: 'JSS 1A' },
        { student_id: 'NEW003', first_name: '', last_name: 'User', class_name: 'JSS 1A' },
        { student_id: 'NEW004', first_name: 'Test', last_name: '', class_name: 'JSS 1A' },
      ];

      const res = await validateStudentImport(rows, 'create_only');
      expect(res.errors.length).toBe(3);
      expect(res.errors[0].field).toBe('student_id');
      expect(res.errors[1].field).toBe('first_name');
      expect(res.errors[2].field).toBe('last_name');
    });

    it('detects duplicate student IDs within the same file', async () => {
      const rows = [
        { student_id: 'DUP001', first_name: 'Alice', last_name: 'Smith', class_name: 'JSS 1A' },
        { student_id: 'DUP001', first_name: 'Bob', last_name: 'Jones', class_name: 'JSS 1A' },
      ];

      const res = await validateStudentImport(rows, 'create_only');
      expect(res.valid.length).toBe(1);
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain('Duplicate Student ID in spreadsheet');
    });

    it('rejects unknown or invalid class names', async () => {
      const rows = [
        { student_id: 'NEW005', first_name: 'John', last_name: 'Doe', class_name: 'Grade 99 Unknown' },
      ];

      const res = await validateStudentImport(rows, 'create_only');
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain('does not exist in school records');
    });
  });

  describe('validateSubjectResultImport', () => {
    it('flags scores exceeding component maximums', async () => {
      const rows = [
        { student_id: 'GFS001', ca_score: 35, exam_score: 60 }, // CA exceeds 30
        { student_id: 'GFS002', ca_score: 25, exam_score: 75 }, // Exam exceeds 70
      ];

      const res = await validateSubjectResultImport(rows, 30, 70);
      expect(res.errors.length).toBe(2);
      expect(res.errors[0].message).toContain('exceeds maximum allowed of 30');
      expect(res.errors[1].message).toContain('exceeds maximum allowed of 70');
    });

    it('flags unknown students not enrolled in the database', async () => {
      const rows = [
        { student_id: 'GHOST_STUDENT_999', ca_score: 25, exam_score: 60 },
      ];

      const res = await validateSubjectResultImport(rows, 30, 70);
      expect(res.errors.length).toBe(1);
      expect(res.errors[0].message).toContain('is not enrolled');
    });

    it('accepts valid score records within range', async () => {
      const rows = [
        { student_id: 'GFS001', ca_score: 28, exam_score: 64 },
      ];

      const res = await validateSubjectResultImport(rows, 30, 70);
      expect(res.valid.length).toBe(1);
      expect(res.errors.length).toBe(0);
    });
  });

  describe('Template Generation', () => {
    it('generates a valid spreadsheet buffer', () => {
      const buffer = generateStudentTemplate();
      expect(buffer).toBeDefined();
      expect(buffer.byteLength).toBeGreaterThan(0);
    });
  });
});
