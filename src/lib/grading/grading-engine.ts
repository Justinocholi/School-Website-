import { GradingRule } from '@/types/database.types';

export const DEFAULT_GRADING_RULES: GradingRule[] = [
  { grade: 'A', min_score: 75, max_score: 100, remark: 'Distinction', gpa_point: 5.0 },
  { grade: 'B', min_score: 65, max_score: 74.99, remark: 'Very Good', gpa_point: 4.0 },
  { grade: 'C', min_score: 50, max_score: 64.99, remark: 'Credit', gpa_point: 3.0 },
  { grade: 'D', min_score: 45, max_score: 49.99, remark: 'Pass', gpa_point: 2.0 },
  { grade: 'E', min_score: 40, max_score: 44.99, remark: 'Weak Pass', gpa_point: 1.0 },
  { grade: 'F', min_score: 0, max_score: 39.99, remark: 'Fail', gpa_point: 0.0 },
];

export interface GradingEvaluation {
  grade: string;
  remark: string;
  gpaPoint: number;
}

/**
 * Calculates grade and remark for a given numeric total score based on configured rules.
 */
export function evaluateGrade(score: number, rules: GradingRule[] = DEFAULT_GRADING_RULES): GradingEvaluation {
  const rounded = Math.round((score + Number.EPSILON) * 100) / 100;
  
  // Sort rules descending by min_score to ensure highest applicable band matches first
  const sortedRules = [...rules].sort((a, b) => b.min_score - a.min_score);

  for (const rule of sortedRules) {
    if (rounded >= rule.min_score && rounded <= rule.max_score) {
      return {
        grade: rule.grade,
        remark: rule.remark,
        gpaPoint: rule.gpa_point,
      };
    }
  }

  // Edge case: if score exceeds 100, clamp to top rule if exists
  if (rounded > 100 && sortedRules.length > 0) {
    const topRule = sortedRules[0];
    return {
      grade: topRule.grade,
      remark: topRule.remark,
      gpaPoint: topRule.gpa_point,
    };
  }

  // Fallback to lowest rule
  const lowestRule = sortedRules[sortedRules.length - 1];
  return {
    grade: lowestRule ? lowestRule.grade : 'F',
    remark: lowestRule ? lowestRule.remark : 'Fail',
    gpaPoint: lowestRule ? lowestRule.gpa_point : 0,
  };
}

/**
 * Calculates sum of assessment component scores (e.g. CA + Exam)
 */
export function calculateTotalScore(scores: number[]): number {
  const total = scores.reduce((sum, current) => {
    const val = typeof current === 'number' && !isNaN(current) ? current : 0;
    return sum + val;
  }, 0);
  return Math.round((total + Number.EPSILON) * 100) / 100;
}

/**
 * Validates whether scores fall within valid bounds for each component.
 */
export function validateComponentScore(score: number, maxScore: number, componentName: string): { isValid: boolean; error?: string } {
  if (isNaN(score)) {
    return { isValid: false, error: `${componentName} score must be a valid number` };
  }
  if (score < 0) {
    return { isValid: false, error: `${componentName} score cannot be negative (${score})` };
  }
  if (score > maxScore) {
    return { isValid: false, error: `${componentName} score (${score}) exceeds maximum allowed of ${maxScore}` };
  }
  return { isValid: true };
}

/**
 * Summarizes a student's term performance across all subjects.
 */
export function calculateTermPerformance(
  subjectResults: Array<{ total_score: number; grade: string; gpaPoint?: number }>
) {
  if (!subjectResults || subjectResults.length === 0) {
    return {
      totalSubjects: 0,
      totalScore: 0,
      averageScore: 0,
      gpa: 0,
      passedSubjects: 0,
    };
  }

  let totalScore = 0;
  let totalGpa = 0;
  let passedCount = 0;

  for (const item of subjectResults) {
    totalScore += item.total_score;
    const gpa = item.gpaPoint ?? (item.grade === 'A' ? 5 : item.grade === 'B' ? 4 : item.grade === 'C' ? 3 : item.grade === 'D' ? 2 : item.grade === 'E' ? 1 : 0);
    totalGpa += gpa;
    if (item.grade !== 'F') {
      passedCount += 1;
    }
  }

  const averageScore = Math.round((totalScore / subjectResults.length + Number.EPSILON) * 100) / 100;
  const gpa = Math.round((totalGpa / subjectResults.length + Number.EPSILON) * 100) / 100;

  return {
    totalSubjects: subjectResults.length,
    totalScore: Math.round((totalScore + Number.EPSILON) * 100) / 100,
    averageScore,
    gpa,
    passedSubjects: passedCount,
  };
}
