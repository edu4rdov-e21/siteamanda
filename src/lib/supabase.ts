import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  throw new Error(
    'Supabase env vars ausentes. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local',
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // necessário pro magic link callback
    storage: localStorage,
    storageKey: 'quiz-cirurgia:auth:v1',
  },
});

/**
 * Quando false, o app não exige login (volta pra modo local-first puro).
 * Toggle pra true quando quiser reativar a tela de /login forçada.
 * Login segue funcionando normalmente quem quiser entrar via /login —
 * só que ninguém é redirecionado pra lá.
 */
export const AUTH_ENABLED = false;

/** Lista de emails autorizados a usar o app. */
export const ALLOWED_EMAILS = [
  'edu4rdov@gmail.com',
  'amandabazzani21@gmail.com',
];

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(email.toLowerCase().trim());
}
