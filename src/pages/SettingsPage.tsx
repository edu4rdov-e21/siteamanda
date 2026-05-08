import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from '../components/shared/Button';
import { Card } from '../components/shared/Card';
import { useProgressStore } from '../store/progressStore';
import { useSettingsStore } from '../store/settingsStore';

export function SettingsPage() {
  const resetAll = useProgressStore((s) => s.resetAll);
  const exportJSON = useProgressStore((s) => s.exportJSON);
  const importJSON = useProgressStore((s) => s.importJSON);
  const darkMode = useSettingsStore((s) => s.darkMode);
  const toggleDarkMode = useSettingsStore((s) => s.toggleDarkMode);

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-cirurgia-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      const text = await f.text();
      const ok = importJSON(text);
      alert(ok ? 'Importado com sucesso.' : 'Falha ao importar.');
    };
    input.click();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">Ajustes</h1>

      <div className="space-y-3">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                Aparência
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {darkMode ? 'Tema escuro' : 'Tema claro'}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              role="switch"
              aria-checked={darkMode}
              aria-label="Alternar tema escuro"
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${
                darkMode ? 'bg-accent-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              >
                {darkMode ? (
                  <Moon size={12} className="text-accent-700" />
                ) : (
                  <Sun size={12} className="text-amber-500" />
                )}
              </span>
            </button>
          </div>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
            Backup do progresso
          </p>
          <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
            Exporte ou importe seu progresso em JSON. Útil pra mover entre dispositivos.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleExport}>
              Exportar JSON
            </Button>
            <Button variant="secondary" onClick={handleImport}>
              Importar JSON
            </Button>
          </div>
        </Card>

        <Card>
          <p className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">Reset</p>
          <p className="mb-3 text-xs text-slate-600 dark:text-slate-400">
            Apaga todo o progresso, histórico, erros e marcações. Sem volta.
          </p>
          <Button
            variant="danger"
            onClick={() => {
              if (confirm('Apagar todo o progresso? Esta ação não pode ser desfeita.')) {
                resetAll();
              }
            }}
          >
            Resetar progresso
          </Button>
        </Card>
      </div>
    </div>
  );
}
