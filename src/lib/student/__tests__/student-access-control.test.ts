import { describe, it, expect } from 'vitest';
import { getStudentSingleResult } from '../student-service';

describe('Student Access Control Boundaries (Supabase)', () => {
  const AUTHORIZED_STUDENT_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; // Daniel Okafor (GFS001)
  const ATTACKER_STUDENT_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'; // Sarah Adamu (GFS002)
  const PUBLISHED_RESULT_ID = 'c0000000-0000-0000-0000-000000000001';

  it('allows student to access their own published result from Supabase', async () => {
    const result = await getStudentSingleResult(
      AUTHORIZED_STUDENT_ID,
      PUBLISHED_RESULT_ID
    );
    expect(result).not.toBeNull();
    expect(result?.id).toBe(PUBLISHED_RESULT_ID);
    expect(result?.student_id).toBe(AUTHORIZED_STUDENT_ID);
    expect(result?.status).toBe('published');
  });

  it('denies access when a different student attempts to query the same result ID (Cross-Student Access Prevention)', async () => {
    const result = await getStudentSingleResult(
      ATTACKER_STUDENT_ID,
      PUBLISHED_RESULT_ID
    );
    expect(result).toBeNull();
  });

  it('denies access to non-existent or tampered result IDs', async () => {
    const result = await getStudentSingleResult(
      AUTHORIZED_STUDENT_ID,
      '00000000-0000-0000-0000-000000000999'
    );
    expect(result).toBeNull();
  });
});
