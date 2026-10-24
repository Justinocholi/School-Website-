import { createBrowserClient } from '@supabase/ssr';

const DEFAULT_SUPABASE_URL = 'https://kvwwppudohazrrsfxvgn.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2d3dwcHVkb2hhenJyc2Z4dmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNDUyMTksImV4cCI6MjEwNzgyMTIxOX0.jFCmId39FGOIKmqGdywVpDOsPKooc5uVTadNZw5gm1Q';

export function createClient() {
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

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
