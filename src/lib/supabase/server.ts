import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignore in edge environments
}

const DEFAULT_SUPABASE_URL = 'https://kvwwppudohazrrsfxvgn.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2d3dwcHVkb2hhenJyc2Z4dmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNDUyMTksImV4cCI6MjEwNzgyMTIxOX0.jFCmId39FGOIKmqGdywVpDOsPKooc5uVTadNZw5gm1Q';

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

export async function createClient() {
  const cookieStore = await cookies();

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabaseUrl =
    envUrl && !envUrl.includes('placeholder') && envUrl.startsWith('http')
      ? envUrl
      : DEFAULT_SUPABASE_URL;

  const supabaseAnonKey =
    envAnonKey && !envAnonKey.includes('placeholder')
      ? envAnonKey
      : DEFAULT_SUPABASE_ANON_KEY;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: resilientFetch,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component; session refresh is handled by proxy.ts
        }
      },
    },
  });
}
