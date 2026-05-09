import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { isEmailAllowed, supabase } from '../lib/supabase';
import { setupCloudSync, teardownCloudSync } from '../lib/cloudSync';

type Status = 'loading' | 'anonymous' | 'authenticated' | 'unauthorized';

interface AuthState {
  status: Status;
  user: User | null;
  session: Session | null;
  errorMessage: string | null;

  bootstrap: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  user: null,
  session: null,
  errorMessage: null,

  /**
   * Inicializa: lê sessão atual, registra listener pra mudanças,
   * checa whitelist e atualiza status.
   */
  bootstrap: async () => {
    const { data } = await supabase.auth.getSession();
    applySession(data.session, set);

    supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session, set);
    });
  },

  signInWithMagicLink: async (email) => {
    const cleaned = email.toLowerCase().trim();
    if (!isEmailAllowed(cleaned)) {
      return {
        ok: false,
        message: 'Esse email não está autorizado a usar o app.',
      };
    }
    const redirectTo = `${window.location.origin}/login`;
    const { error } = await supabase.auth.signInWithOtp({
      email: cleaned,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Magic link enviado. Confere seu email.' };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ status: 'anonymous', user: null, session: null, errorMessage: null });
  },
}));

function applySession(
  session: Session | null,
  set: (s: Partial<AuthState>) => void,
) {
  if (!session) {
    teardownCloudSync();
    set({ status: 'anonymous', user: null, session: null });
    return;
  }
  if (!isEmailAllowed(session.user.email)) {
    // Sessão válida, mas email não autorizado — derruba.
    void supabase.auth.signOut();
    teardownCloudSync();
    set({
      status: 'unauthorized',
      user: null,
      session: null,
      errorMessage: 'Email não autorizado.',
    });
    return;
  }
  set({
    status: 'authenticated',
    user: session.user,
    session,
    errorMessage: null,
  });
  // Dispara sync (não bloqueia render — store já tem dados locais)
  void setupCloudSync(session.user.id);
}

/** Helper pra outros stores: retorna user_id atual ou null. */
export function currentUserId(): string | null {
  const { user } = useAuthStore.getState();
  return user?.id ?? null;
}
