import { createClient } from '@supabase/supabase-js';

/**
 * Service role Supabase client for secure backend operations:
 * - Admin student bulk imports
 * - Student account password setup & reset
 * - Audit logging
 * 
 * MUST NEVER BE EXPOSED TO CLIENT-SIDE BUNDLES.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('placeholder')) {
    // Return standard client or null if not configured
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
