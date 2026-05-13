import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '../components/shared/Card';
import { EmptyState } from '../components/shared/EmptyState';
import { useProgressStore } from '../store/progressStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTemaData } from '../data/temas';
import { percent } from '../lib/scoring';

const ACCENT = '#0d9488';
const ACCENT_DIM = '#94a3b8';

function pickColor(answered: number, pct: number, dark: boolean): string {
  if (answered === 0) return dark ? '#334155' : '#e2e8f0';
  if (pct >= 70) return '#10b981'; // emerald
  if (pct >= 50) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

export function StatsPage() {
  const tema = useTemaData();
  const totalAnswered = useProgressStore((s) => s.totalAnswered);
  const totalCorrect = useProgressStore((s) => s.totalCorrect);
  const byAula = useProgressStore((s) => s.byAula);
  const byBloco = useProgressStore((s) => s.byBloco);
  const byEixo = useProgressStore((s) => s.byEixo);
  const history = useProgressStore((s) => s.history);
  const darkMode = useSettingsStore((s) => s.darkMode);

  const axisColor = darkMode ? '#94a3b8' : '#475569';
  const gridColor = darkMode ? '#1e293b' : '#e2e8f0';
  const tooltipBg = darkMode ? '#0f172a' : '#ffffff';
  const tooltipBorder = darkMode ? '#334155' : '#cbd5e1';
  const tooltipColor = darkMode ? '#f1f5f9' : '#0f172a';

  const aulaData = useMemo(
    () =>
      tema.AULAS.map((a) => {
        const stats = byAula[a.id];
        const answered = stats?.answered ?? 0;
        const correct = stats?.correct ?? 0;
        const pct = percent(correct, answered);
        return {
          id: String(a.id).padStart(2, '0'),
          titulo: a.titulo,
          answered,
          correct,
          pct,
        };
      }),
    [tema, byAula],
  );

  const blocoData = useMemo(
    () =>
      tema.BLOCO_ORDER.map((id) => {
        const stats = byBloco[id];
        const answered = stats?.answered ?? 0;
        const correct = stats?.correct ?? 0;
        return {
          id,
          nome: tema.BLOCOS[id]?.nome ?? id,
          answered,
          correct,
          pct: percent(correct, answered),
        };
      }),
    [tema, byBloco],
  );

  const eixoData = useMemo(
    () =>
      tema.EIXO_ORDER.map((id) => {
        const stats = byEixo[id];
        const answered = stats?.answered ?? 0;
        const correct = stats?.correct ?? 0;
        return {
          id,
          nome: tema.EIXOS[id]?.nome ?? id,
          answered,
          correct,
          pct: percent(correct, answered),
        };
      }),
    [tema, byEixo],
  );

  // Evolução temporal: últimas N sessões em ordem cronológica (mais antigas → mais novas)
  const evoData = useMemo(() => {
    const ordered = [...history].reverse().slice(-20);
    return ordered.map((s, i) => ({
      idx: i + 1,
      pct: percent(s.correct, s.total),
      label: new Date(s.finishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
    }));
  }, [history]);

  const hasAnyData = totalAnswered > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <Link
        to={`/${tema.slug}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Estatísticas
      </h1>

      <Card className="mb-6">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Geral</p>
        <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
          {percent(totalCorrect, totalAnswered)}%
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {totalCorrect} de {totalAnswered} respondidas corretamente
        </p>
      </Card>

      {!hasAnyData && (
        <EmptyState
          title="Sem dados ainda"
          description="Faça pelo menos uma sessão de quiz para começar a ver suas estatísticas."
        />
      )}

      {hasAnyData && (
        <>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            % acerto por aula
          </h2>
          <Card className="mb-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aulaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="id"
                    tick={{ fill: axisColor, fontSize: 11 }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={{ stroke: gridColor }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: axisColor, fontSize: 11 }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={{ stroke: gridColor }}
                    unit="%"
                  />
                  <Tooltip
                    cursor={{ fill: darkMode ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.04)' }}
                    contentStyle={{
                      background: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: 8,
                      color: tooltipColor,
                      fontSize: 12,
                    }}
                    formatter={((value: unknown, _name: unknown, item: { payload: typeof aulaData[number] }) => {
                      const d = item.payload;
                      return [`${value as number}% (${d.correct}/${d.answered})`, `${d.id} ${d.titulo}`];
                    }) as never}
                    labelFormatter={() => ''}
                  />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                    {aulaData.map((d) => (
                      <Cell key={d.id} fill={pickColor(d.answered, d.pct, darkMode)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Verde ≥70%, âmbar ≥50%, vermelho &lt;50%, cinza = não respondida.
            </p>
          </Card>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Por bloco
              </h2>
              <Card>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={blocoData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="id"
                        tick={{ fill: axisColor, fontSize: 11 }}
                        axisLine={{ stroke: gridColor }}
                        tickLine={{ stroke: gridColor }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: axisColor, fontSize: 11 }}
                        axisLine={{ stroke: gridColor }}
                        tickLine={{ stroke: gridColor }}
                        unit="%"
                      />
                      <Tooltip
                        cursor={{
                          fill: darkMode ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.04)',
                        }}
                        contentStyle={{
                          background: tooltipBg,
                          border: `1px solid ${tooltipBorder}`,
                          borderRadius: 8,
                          color: tooltipColor,
                          fontSize: 12,
                        }}
                        formatter={((value: unknown, _name: unknown, item: { payload: { id: string; nome: string; correct: number; answered: number } }) => {
                          const d = item.payload;
                          return [`${value as number}% (${d.correct}/${d.answered})`, `${d.id} ${d.nome}`];
                        }) as never}
                        labelFormatter={() => ''}
                      />
                      <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                        {blocoData.map((d) => (
                          <Cell key={d.id} fill={pickColor(d.answered, d.pct, darkMode)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {eixoData.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Por eixo transversal
              </h2>
              <Card>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={eixoData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="id"
                        tick={{ fill: axisColor, fontSize: 11 }}
                        axisLine={{ stroke: gridColor }}
                        tickLine={{ stroke: gridColor }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: axisColor, fontSize: 11 }}
                        axisLine={{ stroke: gridColor }}
                        tickLine={{ stroke: gridColor }}
                        unit="%"
                      />
                      <Tooltip
                        cursor={{
                          fill: darkMode ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.04)',
                        }}
                        contentStyle={{
                          background: tooltipBg,
                          border: `1px solid ${tooltipBorder}`,
                          borderRadius: 8,
                          color: tooltipColor,
                          fontSize: 12,
                        }}
                        formatter={((value: unknown, _name: unknown, item: { payload: { id: string; nome: string; correct: number; answered: number } }) => {
                          const d = item.payload;
                          return [`${value as number}% (${d.correct}/${d.answered})`, `${d.id} ${d.nome}`];
                        }) as never}
                        labelFormatter={() => ''}
                      />
                      <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                        {eixoData.map((d) => (
                          <Cell key={d.id} fill={pickColor(d.answered, d.pct, darkMode)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            )}
          </div>

          <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Evolução por sessão
          </h2>
          <Card className="mb-6">
            {evoData.length < 2 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Faça pelo menos 2 sessões para ver a evolução temporal.
              </p>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evoData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: axisColor, fontSize: 11 }}
                      axisLine={{ stroke: gridColor }}
                      tickLine={{ stroke: gridColor }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: axisColor, fontSize: 11 }}
                      axisLine={{ stroke: gridColor }}
                      tickLine={{ stroke: gridColor }}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        background: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 8,
                        color: tooltipColor,
                        fontSize: 12,
                      }}
                      formatter={((value: unknown) => [`${value as number}%`, 'Acerto']) as never}
                    />
                    <Line
                      type="monotone"
                      dataKey="pct"
                      stroke={ACCENT}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: ACCENT, stroke: ACCENT_DIM }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Histórico recente
          </h2>
          <div className="space-y-2">
            {history.slice(0, 10).map((s) => (
              <Card key={s.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {s.mode.source}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {new Date(s.finishedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-slate-700 dark:text-slate-300">
                  {s.correct}/{s.total} ({percent(s.correct, s.total)}%)
                </p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
