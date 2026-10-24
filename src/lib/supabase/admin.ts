import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in edge environments without Node dns module
}

const DEFAULT_SUPABASE_URL = 'https://kvwwppudohazrrsfxvgn.supabase.co';
const DEFAULT_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2d3dwcHVkb2hhenJyc2Z4dmduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjI0NTIxOSwiZXhwIjoyMTA3ODIxMjE5fQ.oPbn-iFSWRI5kTC8f3NYsvbgQJJkcJWZ8j2A0ku0Y64';

async function resilientFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 5; attempt++) {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const fetchPromise = fetch(input, {
        ...init,
        signal: controller.signal,
      });
      fetchPromise.catch(() => {});

      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error(`Supabase request timed out (attempt ${attempt + 1})`));
        }, 6000);
      });

      const res = await Promise.race([fetchPromise, timeoutPromise]);
      if (timer) clearTimeout(timer);
      return res;
    } catch (err) {
      if (timer) clearTimeout(timer);
      lastError = err;
      if (attempt < 4) {
        await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

let adminClientInstance: SupabaseClient | null = null;

/**
 * Service role Supabase client for authoritative backend operations.
 * Reuses a singleton client instance with IPv4-first DNS resolution and retry-hardened fetch.
 * MUST NEVER BE EXPOSED TO CLIENT-SIDE BUNDLES.
 */
export function createAdminClient(): SupabaseClient {
  if (adminClientInstance) {
    return adminClientInstance;
  }

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const supabaseUrl =
    envUrl && !envUrl.includes('placeholder') && envUrl.startsWith('http')
      ? envUrl
      : DEFAULT_SUPABASE_URL;

  const serviceRoleKey =
    envKey && !envKey.includes('placeholder')
      ? envKey
      : DEFAULT_SERVICE_ROLE_KEY;

  adminClientInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: resilientFetch,
    },
  });

  return adminClientInstance;
}
