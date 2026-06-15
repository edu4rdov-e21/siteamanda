import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Lightbulb,
  Trophy,
  Target,
  Wrench,
  Award,
  Layers3,
  Zap,
} from 'lucide-react';
import { Card } from '../components/shared/Card';

// ────────────────────────────────────────────────────────────
// Conteúdo (Revisão de Gestão da Qualidade — prova 15/06)
// ────────────────────────────────────────────────────────────

const GURUS = [
  {
    nome: 'Juran',
    frente: 'Juran',
    cor: 'from-teal-500 to-emerald-500',
    definicao: 'Qualidade = adequação ao uso',
    detalhe: 'Atender às necessidades do cliente. Foco no cliente.',
  },
  {
    nome: 'Deming',
    frente: 'Deming',
    cor: 'from-sky-500 to-blue-500',
    definicao: 'Atendimento às expectativas do cliente',
    detalhe: 'Criador do PDCA e dos 14 pontos. Foco na redução da variação.',
  },
  {
    nome: 'Crosby',
    frente: 'Crosby',
    cor: 'from-amber-500 to-orange-500',
    definicao: 'Qualidade = conformidade aos requisitos',
    detalhe: 'Lema "zero defeito". NÃO é foco no cliente, é conformidade.',
  },
  {
    nome: 'Feigenbaum',
    frente: 'Feigenbaum',
    cor: 'from-violet-500 to-purple-500',
    definicao: 'TQC — Controle Total da Qualidade',
    detalhe: 'Qualidade é responsabilidade de todos.',
  },
  {
    nome: 'Ishikawa',
    frente: 'Ishikawa',
    cor: 'from-rose-500 to-pink-500',
    definicao: 'Diagrama de causa-efeito (espinha de peixe)',
    detalhe: 'Criou os Círculos de Controle da Qualidade (CCQ).',
  },
];

const ERAS = [
  {
    n: 1,
    nome: 'Inspeção',
    autor: 'Taylor',
    resumo: 'Administração científica. Separa o produto bom do defeituoso, ao FINAL.',
  },
  {
    n: 2,
    nome: 'Controle Estatístico',
    autor: 'Shewhart, 1931',
    resumo: 'Cartas de controle e amostragem. Foco no PROCESSO.',
  },
  {
    n: 3,
    nome: 'Garantia da Qualidade',
    autor: 'Prevenção',
    resumo: 'Custos da qualidade, confiabilidade. Abordagem sistêmica.',
  },
  {
    n: 4,
    nome: 'Gestão Estratégica',
    autor: 'Toda a organização',
    resumo: 'Qualidade total, foco no cliente, vantagem competitiva.',
  },
];

const METODOS = [
  {
    sigla: 'PDCA',
    nome: 'Ciclo de Deming',
    desc: 'Planejar (a mais importante) → Executar → Verificar → Agir.',
  },
  { sigla: 'MASP', nome: '8 etapas', desc: 'Identificação → observação → análise → plano → ação → verificação → padronização → conclusão.' },
  { sigla: 'FMEA', nome: 'NPR = S × O × D', desc: 'Severidade × Ocorrência × Detecção. Multiplicação, nunca soma.' },
  { sigla: 'FTA', nome: 'Árvore de falhas', desc: 'Raciocínio dedutivo, top-down (do evento de topo para as causas).' },
  { sigla: 'DMAIC', nome: 'Seis Sigma', desc: 'Define, Measure, Analyze, Improve, Control.' },
];

const FERRAMENTAS = [
  { nome: 'Pareto', desc: 'Prioriza causas — 20% das causas geram 80% dos efeitos.' },
  { nome: 'Ishikawa (causa-efeito)', desc: 'Relaciona causas e o efeito de um problema.' },
  { nome: 'Histograma', desc: 'Distribuição e frequência dos dados.' },
  { nome: 'Folha de verificação', desc: 'Coleta organizada de dados.' },
  { nome: 'Gráfico de dispersão', desc: 'Correlação entre duas variáveis.' },
  { nome: 'Cartas de controle', desc: 'Monitoram o processo ao longo do tempo.' },
  { nome: 'Estratificação', desc: 'Separa os dados em grupos por origem.' },
];

const NORMAS = [
  { item: 'ISO fundada em', resposta: '1947', nota: 'Genebra. Não certifica diretamente.' },
  { item: 'Série ISO 9000 publicada em', resposta: '1987', nota: 'Não confunda com 1947!' },
  { item: 'Norma certificável da série 9000', resposta: 'ISO 9001', nota: 'A ÚNICA certificável. 9000 = vocabulário, 9004 = diretrizes.' },
  { item: 'ISO de gestão ambiental', resposta: 'ISO 14000', nota: 'Não é qualidade.' },
  { item: 'PNQ criado em', resposta: '1991', nota: 'Pela FNQ. Modelo MEG, 8 critérios.' },
  { item: 'Prêmio do Japão', resposta: 'Deming', nota: 'Baldrige = EUA · EFQM = Europa.' },
];

const TRES_TERMOS = [
  {
    termo: 'Gestão',
    cor: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
    desc: 'O guarda-chuva, engloba tudo. Estratégica, toda a organização.',
  },
  {
    termo: 'Garantia',
    cor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
    desc: 'Planejamento. Assegura plano ↔ resultado ↔ cliente. PREVENTIVA.',
  },
  {
    termo: 'Controle',
    cor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    desc: 'Verificação da conformidade das etapas. Foco na DETECÇÃO.',
  },
];

const PEGADINHAS = [
  { trap: 'Crosby foca no cliente', truth: 'NÃO. Crosby = conformidade. Juran e Deming = cliente.' },
  { trap: 'Shewhart é da era da Inspeção', truth: 'NÃO. Shewhart = Controle Estatístico (1931). Taylor = Inspeção.' },
  { trap: 'ISO foi fundada em 1987', truth: 'NÃO. ISO fundada em 1947. A série 9000 que foi publicada em 1987.' },
  { trap: 'Toda a série ISO 9000 é certificável', truth: 'NÃO. Só a ISO 9001 é certificável.' },
  { trap: 'FMEA: R = S + O + D', truth: 'NÃO. É MULTIPLICAÇÃO: R = S × O × D.' },
  { trap: 'Benchmarking é uma das 7 ferramentas', truth: 'NÃO. Benchmarking é ferramenta de apoio, não das 7.' },
  { trap: 'No 5W2H, "How much" define o responsável', truth: 'NÃO. "How much" = CUSTO. O responsável é o "Who".' },
  { trap: 'Existe princípio de "gerência centralizada"', truth: 'NÃO. O princípio é gerência PARTICIPATIVA.' },
  { trap: 'SIG é uma certificação única', truth: 'NÃO. SIG = ISO 9000 + 14000 + OHSAS 18000 = 3 SEPARADAS.' },
  { trap: 'Ishikawa prioriza causas por frequência', truth: 'NÃO. Ishikawa = causa-efeito. Quem prioriza é o Pareto.' },
];

// Quiz relâmpago — perguntas rápidas
const QUIZ = [
  {
    q: 'Quem definiu qualidade como "conformidade aos requisitos"?',
    opcoes: ['Juran', 'Deming', 'Crosby', 'Ishikawa'],
    correta: 2,
    exp: 'Crosby = conformidade + "zero defeito". Juran/Deming focam no cliente.',
  },
  {
    q: 'No FMEA, o NPR é calculado por:',
    opcoes: ['S + O + D', 'S × O × D', 'S − O − D', 'S ÷ (O × D)'],
    correta: 1,
    exp: 'Severidade × Ocorrência × Detecção. Multiplicação, nunca soma.',
  },
  {
    q: 'A ISO foi fundada em:',
    opcoes: ['1931', '1947', '1987', '1991'],
    correta: 1,
    exp: '1947 em Genebra. A série 9000 é que foi publicada em 1987.',
  },
  {
    q: 'Qual NÃO é uma das 7 ferramentas da qualidade?',
    opcoes: ['Histograma', 'Benchmarking', 'Pareto', 'Estratificação'],
    correta: 1,
    exp: 'Benchmarking é ferramenta de apoio (junto com 5W2H, fluxograma).',
  },
  {
    q: 'Shewhart (1931) está associado a qual era?',
    opcoes: ['Inspeção', 'Controle Estatístico', 'Garantia', 'Gestão Estratégica'],
    correta: 1,
    exp: 'Controle Estatístico, com as cartas de controle. Taylor = Inspeção.',
  },
  {
    q: 'O PNQ foi criado em 1991 por qual entidade?',
    opcoes: ['ISO', 'FNQ', 'INMETRO', 'ABNT'],
    correta: 1,
    exp: 'Fundação Nacional da Qualidade (FNQ). Modelo MEG, 8 critérios.',
  },
  {
    q: 'No 5W2H, o "How much" se refere a:',
    opcoes: ['Responsável', 'Custo', 'Prazo', 'Método'],
    correta: 1,
    exp: '"How much" = custo. O responsável é o "Who".',
  },
  {
    q: 'Quantas etapas tem o MASP?',
    opcoes: ['4', '5', '8', '12'],
    correta: 2,
    exp: '8 etapas, da identificação à conclusão.',
  },
  {
    q: 'Qual etapa do PDCA é considerada a mais importante?',
    opcoes: ['Planejar', 'Executar', 'Verificar', 'Agir'],
    correta: 0,
    exp: 'Planejar (P) — define metas e métodos antes de tudo.',
  },
  {
    q: 'A garantia da qualidade caracteriza-se por:',
    opcoes: ['Detecção no produto final', 'Prevenção / planejamento', 'Apenas inspeção', 'Correção pós-entrega'],
    correta: 1,
    exp: 'Garantia = preventiva, planejamento. Controle = detecção/verificação.',
  },
];

// Treinador de asserção-razão
const AR_EXEMPLOS = [
  {
    I: 'O Prêmio Deming é japonês.',
    II: 'O Prêmio Malcolm Baldrige é o prêmio nacional dos EUA.',
    resposta: 'nao-justifica',
    exp: 'Ambas verdadeiras, mas tratam de prêmios DISTINTOS (Japão × EUA) — temas separados. A II não explica a I.',
  },
  {
    I: 'A garantia da qualidade é preventiva.',
    II: 'Ela atua no planejamento, assegurando coerência entre plano, resultado e cliente.',
    resposta: 'justifica',
    exp: 'Mesmo tema, encadeadas: a II explica POR QUE a garantia é preventiva. A II justifica a I.',
  },
  {
    I: 'A ISO 9001 é a única norma certificável da série 9000.',
    II: 'A ISO 14000 trata de gestão ambiental.',
    resposta: 'nao-justifica',
    exp: 'I verdadeira, II verdadeira — mas a 14000 (ambiental) é de tema separado. Não explica a certificação da 9001.',
  },
  {
    I: 'O Princípio de Pareto ajuda a priorizar ações.',
    II: 'Cerca de 20% das causas respondem por 80% dos efeitos.',
    resposta: 'justifica',
    exp: 'Mesmo tema, encadeadas: a regra 80/20 (II) é exatamente o motivo pelo qual Pareto prioriza (I). Justifica.',
  },
];

// ────────────────────────────────────────────────────────────
// Componentes interativos
// ────────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof Target;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-lg bg-accent-50 p-1.5 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function GuruFlip({ guru }: { guru: (typeof GURUS)[number] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="group relative h-32 w-full [perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-xl"
      aria-label={`Card ${guru.nome}`}
    >
      <div
        className={`relative h-full w-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* frente */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br ${guru.cor} p-3 text-white shadow-sm [backface-visibility:hidden]`}
        >
          <span className="text-xl font-bold">{guru.frente}</span>
          <span className="mt-1 text-[11px] opacity-90">clique pra virar</span>
        </div>
        {/* verso */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3 text-center [backface-visibility:hidden] [transform:rotateY(180deg)] dark:border-slate-700 dark:bg-slate-900">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {guru.definicao}
          </span>
          <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {guru.detalhe}
          </span>
        </div>
      </div>
    </button>
  );
}

function EraTimeline() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {ERAS.map((era) => {
        const isOpen = open === era.n;
        return (
          <button
            key={era.n}
            type="button"
            onClick={() => setOpen(isOpen ? null : era.n)}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-accent-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-accent-500"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
              {era.n}
            </span>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {era.nome}
                </span>
                <span className="text-xs text-accent-600 dark:text-accent-400">{era.autor}</span>
              </div>
              {isOpen && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{era.resumo}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function NormaReveal({ norma }: { norma: (typeof NORMAS)[number] }) {
  const [show, setShow] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-accent-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:border-slate-700 dark:bg-slate-900"
    >
      <span className="text-sm text-slate-700 dark:text-slate-300">{norma.item}…</span>
      {show ? (
        <span className="text-right">
          <span className="block text-sm font-bold text-accent-600 dark:text-accent-400">
            {norma.resposta}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">{norma.nota}</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <Eye size={12} /> revelar
        </span>
      )}
    </button>
  );
}

function PegadinhaCard({ p }: { p: (typeof PEGADINHAS)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="w-full rounded-lg border border-amber-200 bg-amber-50 p-3 text-left transition-colors hover:border-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-900/60 dark:bg-amber-950/30"
    >
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-900 line-through decoration-amber-400 dark:text-amber-200">
            {p.trap}
          </p>
          {open && (
            <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {p.truth}
            </p>
          )}
          {!open && (
            <p className="mt-0.5 text-[11px] text-amber-700/70 dark:text-amber-300/60">
              clique pra ver a verdade
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function QuizRelampago() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [done, setDone] = useState(false);
  const ordem = useMemo(() => QUIZ, []);

  const q = ordem[idx];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correta) setAcertos((a) => a + 1);
  };

  const next = () => {
    if (idx + 1 >= ordem.length) {
      setDone(true);
    } else {
      setIdx((n) => n + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setPicked(null);
    setAcertos(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((acertos / ordem.length) * 100);
    return (
      <Card className="text-center">
        <Trophy size={32} className="mx-auto text-amber-500" />
        <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {acertos}/{ordem.length}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {pct >= 90
            ? 'Mandou bem! Tá pronto pra GQ. 🎓'
            : pct >= 70
              ? 'Bom! Revisa as pegadinhas e cravou.'
              : 'Bora revisar de novo, foca nas pegadinhas de ouro.'}
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
        >
          <RotateCw size={14} /> Jogar de novo
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Pergunta {idx + 1} de {ordem.length}
        </span>
        <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">
          {acertos} acertos
        </span>
      </div>
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-accent-600 transition-all"
          style={{ width: `${((idx + (picked !== null ? 1 : 0)) / ordem.length) * 100}%` }}
        />
      </div>

      <p className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">{q.q}</p>

      <div className="space-y-2">
        {q.opcoes.map((op, i) => {
          const isCorrect = i === q.correta;
          const isPicked = picked === i;
          let cls =
            'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500';
          let Icon: typeof CheckCircle2 | null = null;
          if (picked !== null) {
            if (isCorrect) {
              cls = 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40';
              Icon = CheckCircle2;
            } else if (isPicked) {
              cls = 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/40';
              Icon = XCircle;
            } else {
              cls = 'border-slate-200 bg-white opacity-60 dark:border-slate-700 dark:bg-slate-900';
            }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`flex w-full items-center gap-2 rounded-lg border-2 p-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${cls}`}
            >
              {Icon ? (
                <Icon
                  size={16}
                  className={isCorrect ? 'text-emerald-600' : 'text-red-600'}
                />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600" />
              )}
              <span className="text-slate-900 dark:text-slate-100">{op}</span>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-3 animate-fade-in rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-sm text-slate-700 dark:text-slate-300">{q.exp}</p>
          <button
            type="button"
            onClick={next}
            className="mt-3 w-full rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            {idx + 1 >= ordem.length ? 'Ver resultado' : 'Próxima'}
          </button>
        </div>
      )}
    </Card>
  );
}

function AssercaoTrainer() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const ex = AR_EXEMPLOS[idx];
  const acertou = picked === ex.resposta;

  const next = () => {
    setPicked(null);
    setIdx((n) => (n + 1) % AR_EXEMPLOS.length);
  };

  return (
    <Card>
      <div className="mb-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
        <strong className="text-slate-800 dark:text-slate-200">Regra da disciplina:</strong> duas
        verdadeiras e encadeadas no <em>mesmo tema</em> → "a II justifica a I". Temas{' '}
        <em>separados</em> → "não justifica".
      </div>

      <div className="space-y-2">
        <p className="rounded-lg border border-slate-200 p-2.5 text-sm text-slate-800 dark:border-slate-700 dark:text-slate-200">
          <strong className="text-accent-600 dark:text-accent-400">I.</strong> {ex.I}
        </p>
        <p className="text-center text-xs font-bold uppercase tracking-wide text-slate-400">
          porque
        </p>
        <p className="rounded-lg border border-slate-200 p-2.5 text-sm text-slate-800 dark:border-slate-700 dark:text-slate-200">
          <strong className="text-accent-600 dark:text-accent-400">II.</strong> {ex.II}
        </p>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
        A II justifica a I?
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(['justifica', 'nao-justifica'] as const).map((opt) => {
          const label = opt === 'justifica' ? 'Justifica' : 'Não justifica';
          const isCorrectOpt = opt === ex.resposta;
          let cls =
            'border-slate-200 bg-white hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500';
          if (picked !== null) {
            if (isCorrectOpt)
              cls = 'border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/40';
            else if (picked === opt)
              cls = 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/40';
            else cls = 'opacity-60 border-slate-200 dark:border-slate-700';
          }
          return (
            <button
              key={opt}
              type="button"
              onClick={() => picked === null && setPicked(opt)}
              disabled={picked !== null}
              className={`rounded-lg border-2 p-2.5 text-sm font-medium text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 dark:text-slate-100 ${cls}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-3 animate-fade-in rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
          <p
            className={`mb-1 text-sm font-semibold ${
              acertou ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'
            }`}
          >
            {acertou ? '✓ Isso!' : '✗ Quase…'}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{ex.exp}</p>
          <button
            type="button"
            onClick={next}
            className="mt-3 w-full rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700"
          >
            Próximo exemplo
          </button>
        </div>
      )}
    </Card>
  );
}

// ────────────────────────────────────────────────────────────
// Página
// ────────────────────────────────────────────────────────────

export function RevisaoGQPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <Link
        to="/edn"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft size={16} />
        Voltar
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Revisão — Gestão da Qualidade
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Prova 15/06 · foco no que cai. Toque, vire e teste — fixa muito mais que ler.
        </p>
      </header>

      <Section
        icon={Lightbulb}
        title="Os gurus"
        subtitle="Vire o card. Pegadinha: Juran/Deming = cliente · Crosby = conformidade."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {GURUS.map((g) => (
            <GuruFlip key={g.nome} guru={g} />
          ))}
        </div>
      </Section>

      <Section icon={Layers3} title="As 4 Eras" subtitle="Toque pra expandir. Decore a ordem!">
        <EraTimeline />
      </Section>

      <Section icon={Target} title="Métodos" subtitle="As siglas que sempre caem">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {METODOS.map((m) => (
            <div
              key={m.sigla}
              className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-baseline gap-2">
                <span className="rounded-md bg-accent-600 px-2 py-0.5 text-xs font-bold text-white">
                  {m.sigla}
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {m.nome}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        icon={Wrench}
        title="As 7 Ferramentas"
        subtitle="Benchmarking NÃO é uma delas (é de apoio)"
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {FERRAMENTAS.map((f, i) => (
            <div
              key={f.nome}
              className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[11px] font-bold text-accent-700 dark:bg-accent-950/60 dark:text-accent-300">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{f.nome}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Award} title="Normas e datas" subtitle="Adivinha antes de revelar">
        <div className="space-y-2">
          {NORMAS.map((n) => (
            <NormaReveal key={n.item} norma={n} />
          ))}
        </div>
      </Section>

      <Section
        icon={Layers3}
        title="Os 3 termos (o mais cobrado)"
        subtitle="Gestão engloba Garantia e Controle"
      >
        <div className="space-y-2">
          {TRES_TERMOS.map((t) => (
            <div
              key={t.termo}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
            >
              <span className={`rounded-md px-2.5 py-1 text-sm font-bold ${t.cor}`}>{t.termo}</span>
              <p className="flex-1 text-xs text-slate-600 dark:text-slate-400">{t.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        icon={AlertTriangle}
        title="Pegadinhas de ouro"
        subtitle="Clique pra ver a verdade. Releia antes da prova!"
      >
        <div className="space-y-2">
          {PEGADINHAS.map((p) => (
            <PegadinhaCard key={p.trap} p={p} />
          ))}
        </div>
      </Section>

      <Section
        icon={Zap}
        title="Treinador de Asserção-Razão"
        subtitle="Pratique a técnica dos 3 passos"
      >
        <AssercaoTrainer />
      </Section>

      <Section icon={Trophy} title="Quiz Relâmpago" subtitle="10 perguntas pra cravar a nota">
        <QuizRelampago />
      </Section>

      <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        Boa prova, Eduardo. Você consegue. 🎯
      </p>
    </div>
  );
}
