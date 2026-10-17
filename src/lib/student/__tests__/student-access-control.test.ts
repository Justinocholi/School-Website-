import { describe, it, expect } from 'vitest';
import { getStudentSingleResult } from '../student-service';

describe('Student Access Control Boundaries', () => {
  const AUTHORIZED_STUDENT_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; // Daniel Okafor (GFS001)
  const ATTACKER_STUDENT_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';   // Another student

  it('allows student to access their own published result', async () => {
    const result = await getStudentSingleResult(AUTHORIZED_STUDENT_ID, 'res-001');
    expect(result).not.toBeNull();
    expect(result?.id).toBe('res-001');
    expect(result?.student_id).toBe(AUTHORIZED_STUDENT_ID);
    expect(result?.status).toBe('published');
  });

  it('denies access when a different student attempts to query the same result ID (Cross-Student Access Prevention)', async () => {
    // Attacker modifies URL to view Daniel's result res-001
    const result = await getStudentSingleResult(ATTACKER_STUDENT_ID, 'res-001');
    expect(result).toBeNull();
  });

  it('denies access to non-existent or tampered result IDs', async () => {
    const result = await getStudentSingleResult(AUTHORIZED_STUDENT_ID, 'res-999-tampered');
    expect(result).toBeNull();
  });
});
