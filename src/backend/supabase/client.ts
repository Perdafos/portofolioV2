import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSecretKey = Boolean(supabaseKey?.startsWith("sb_secret_"));

export const supabaseConfigError = !supabaseUrl
  ? "VITE_SUPABASE_URL is missing."
  : !supabaseKey
    ? "VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY is missing."
    : isSecretKey
      ? "Forbidden use of secret API key in browser. Use publishable or anon key instead."
      : null;

export const isSupabaseConfigured = supabaseConfigError === null;

let supabaseClient = null;

if (supabaseUrl && supabaseKey && !isSecretKey) {
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = supabaseClient;

export function createSupabaseClientWithAccessToken(accessToken: string) {
  if (!supabaseUrl || !supabaseKey || isSecretKey) {
    throw new Error(supabaseConfigError ?? "Supabase client is not configured.");
  }

  if (!accessToken) {
    throw new Error("Missing Clerk access token for Supabase.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}