import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { useAuthStore } from '../store/authStore';

type FormState = 'idle' | 'sending' | 'sent' | 'error';

export function LoginPage() {
  const status = useAuthStore((s) => s.status);
  const errorMessage = useAuthStore((s) => s.errorMessage);
  const signInWithMagicLink = useAuthStore((s) => s.signInWithMagicLink);

  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [feedback, setFeedback] = useState<string>('');

  // Detecta se o usuário acabou de chegar via magic link callback (#access_token=...)
  // Nesse caso supabase-js já processa por baixo e o status vai mudar pra authenticated.
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      setFeedback('Validando link…');
      setFormState('sending');
    }
  }, []);

  if (status === 'authenticated') {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setFormState('sending');
    setFeedback('Enviando magic link…');
    const { ok, message } = await signInWithMagicLink(email);
    setFeedback(message);
    setFormState(ok ? 'sent' : 'error');
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-10">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Quiz Cirurgia
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Entre com seu email pra receber o link de acesso.
        </p>
      </header>

      <Card>
        {status === 'unauthorized' && (
          <div className="mb-3 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorMessage ?? 'Email não autorizado.'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoFocus
              disabled={formState === 'sending' || formState === 'sent'}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
            />
          </label>

          <Button type="submit" full disabled={formState === 'sending' || formState === 'sent'}>
            {formState === 'sending' ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando…
              </>
            ) : formState === 'sent' ? (
              <>
                <CheckCircle2 size={16} />
                Link enviado
              </>
            ) : (
              <>
                <Mail size={16} />
                Receber link de acesso
              </>
            )}
          </Button>
        </form>

        {feedback && formState !== 'idle' && (
          <p
            className={`mt-3 text-sm ${
              formState === 'error'
                ? 'text-red-700 dark:text-red-300'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {feedback}
          </p>
        )}

        {formState === 'sent' && (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Abra o email no celular ou no laptop e clique no link. Pode levar alguns segundos
            pra chegar.
          </p>
        )}
      </Card>
    </div>
  );
}
