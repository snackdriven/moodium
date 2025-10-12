import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
      flowType: 'pkce',
      storage: {
        getItem: (key) => cookieStore.get(key)?.value ?? null,
        setItem: () => {},
        removeItem: () => {},
      },
    },
  });
}
