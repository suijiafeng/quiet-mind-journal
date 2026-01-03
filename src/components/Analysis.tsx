import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnalysisCard {
  title: string;
  value: string;
  detail: string;
  path: string;
  tone: 'green' | 'brown';
  chart: number[];
  progress: number;
}

interface AnalysisProps {
  period: 'week' | 'month' | 'quarter';
  onPeriodChange: (period: 'week' | 'month' | 'quarter') => void;
  cards: AnalysisCard[];
}

function MiniTrend({ data, tone }: { data: number[]; tone: 'green' | 'brown' }) {
  const points = data.map((value, index) => `${10 + index * 34},${64 - value * 0.5}`).join(' ');
  const fill = tone === 'brown' ? 'rgba(139,113,92,0.12)' : 'rgba(111,145,133,0.12)';

  return (
    <svg viewBox="0 0 160 70" className="h-16 w-full">
      <polyline
        fill={fill}
        stroke="none"
        points={`10,64 ${points} 146,64`}
      />
      <polyline
        fill="none"
        stroke="var(--color-accent-strong)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {data.map((value, index) => (
        <circle
          key={`${value}-${index}`}
          cx={10 + index * 34}
          cy={64 - value * 0.5}
          r="3.5"
          fill="var(--color-accent-strong)"
        />
      ))}
    </svg>
  );
}

export default function Analysis({ period, onPeriodChange, cards }: AnalysisProps) {
  const focus = cards[0];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl text-[color:var(--color-text)]">打卡分析</h1>
        <div className="w-10" />
      </header>
      <section className="page-card p-5">
        <p className="mb-3 text-sm text-[color:var(--color-muted)]">时间筛选</p>
        <select
          value={period}
          onChange={(event) => onPeriodChange(event.target.value as 'week' | 'month' | 'quarter')}
          className="w-full rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 outline-none"
        >
          <option value="week">周</option>
          <option value="month">月</option>
          <option value="quarter">季度</option>
        </select>
      </section>
      {focus ? (
        <section className="page-card overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
            <div className="bg-[color:var(--color-card-green)] px-5 py-6">
              <p className="text-sm text-[color:var(--color-muted)]">本期概览</p>
              <h2 className="mt-2 serif-title text-3xl">{focus.title}</h2>
              <p className="mt-4 text-3xl text-[color:var(--color-text)]">{focus.value}</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--color-muted)]">{focus.detail}</p>
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs text-[color:var(--color-muted)]">
                  <span>当前完成度</span>
                  <span>{focus.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/50">
                  <div className="h-2 rounded-full bg-[color:var(--color-accent-strong)]" style={{ width: `${focus.progress}%` }} />
                </div>
              </div>
            </div>
            <div className="px-5 py-6">
              <p className="text-sm text-[color:var(--color-muted)]">近阶段走势</p>
              <div className="mt-4">
                <MiniTrend data={focus.chart} tone={focus.tone} />
              </div>
              <div className="mt-5 grid grid-cols-5 gap-2 text-center text-xs text-[color:var(--color-muted)]">
                {['一', '二', '三', '四', '五'].map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className="page-card px-5 py-5 transition-colors hover:bg-[color:var(--color-surface-soft)]/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p className="serif-title text-xl">{card.title}</p>
                  <span className="rounded-full bg-[color:var(--color-surface-soft)] px-3 py-1 text-xs text-[color:var(--color-muted)]">
                    {card.progress}%
                  </span>
                </div>
                <p className="text-2xl text-[color:var(--color-text)]">{card.value}</p>
                <p className="mt-2 text-sm text-[color:var(--color-muted)]">{card.detail}</p>
                <div className="mt-4 grid gap-4 md:grid-cols-[160px_1fr] md:items-center">
                  <MiniTrend data={card.chart} tone={card.tone} />
                  <div className="h-2 rounded-full bg-[color:var(--color-surface-soft)]">
                    <div className="h-2 rounded-full bg-[color:var(--color-accent-strong)]" style={{ width: `${card.progress}%` }} />
                  </div>
                </div>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[color:var(--color-muted)]" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
