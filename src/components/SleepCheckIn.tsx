import { ArrowLeft, ArrowUpCircle, MoonStar, Sunrise, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SleepEntry } from '../types';

interface SleepCheckInProps {
  sleepAt?: string;
  wakeAt?: string;
  durationMinutes?: number;
  last7Days: SleepEntry[];
  onSleep: () => void;
  onWake: () => void;
}

function formatDuration(durationMinutes?: number) {
  if (!durationMinutes) {
    return '0小时0分钟';
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours}小时${minutes}分钟`;
}

export default function SleepCheckIn({
  sleepAt,
  wakeAt,
  durationMinutes,
  last7Days,
  onSleep,
  onWake,
}: SleepCheckInProps) {
  const [message, setMessage] = useState('');

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const chartPoints = last7Days
    .map((item, index) => {
      const x = 30 + index * 48;
      const y = 86 - (item.durationMinutes / 600) * 52;
      return `${x},${Math.max(18, Math.min(86, y))}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl text-[color:var(--color-brown)]">睡眠打卡</h1>
        <div className="w-10" />
      </header>

      <section className="page-card p-5">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              onSleep();
              showMessage('已记录入睡时间');
            }}
            className="rounded-[24px] border border-[var(--color-line)] bg-[color:var(--color-card-brown)] px-4 py-8"
          >
            <MoonStar className="mx-auto h-9 w-9 text-[color:var(--color-brown)]" />
            <p className="mt-3 serif-title text-xl text-[color:var(--color-text)]">入睡打卡</p>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">{sleepAt ?? '--:--'}</p>
          </button>
          <button
            type="button"
            onClick={() => {
              onWake();
              showMessage('已记录起床时间');
            }}
            className="rounded-[24px] border border-[var(--color-line)] bg-[color:var(--color-surface-soft)] px-4 py-8"
          >
            <Sunrise className="mx-auto h-9 w-9 text-[color:var(--color-accent)]" />
            <p className="mt-3 serif-title text-xl text-[color:var(--color-text)]">起床补卡</p>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">{wakeAt ?? '--:--'}</p>
          </button>
        </div>
        {message ? (
          <div className="mt-4 rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 text-center text-sm text-[color:var(--color-brown)]">
            {message}
          </div>
        ) : null}
      </section>

      <section className="page-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[color:var(--color-muted)]">当日睡眠时长</p>
            <p className="mt-2 serif-title text-3xl text-[color:var(--color-text)]">{formatDuration(durationMinutes)}</p>
          </div>
          <ArrowUpCircle className="h-8 w-8 text-[color:var(--color-brown)]" />
        </div>
      </section>

      <section className="page-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[color:var(--color-muted)]" />
          <p className="text-sm text-[color:var(--color-muted)]">近7天睡眠时长预览</p>
        </div>
        <svg viewBox="0 0 360 110" className="h-[140px] w-full">
          <polyline
            fill="none"
            stroke="var(--color-brown)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={chartPoints}
          />
          {last7Days.map((item, index) => {
            const x = 30 + index * 48;
            const y = 86 - (item.durationMinutes / 600) * 52;
            return <circle key={item.date} cx={x} cy={Math.max(18, Math.min(86, y))} r="4" fill="var(--color-brown)" />;
          })}
        </svg>
        <div className="mt-1 grid grid-cols-7 text-center text-xs text-[color:var(--color-muted)]">
          {last7Days.map((item) => (
            <span key={item.date}>{item.date.slice(5)}</span>
          ))}
        </div>
      </section>

      <Link to="/analysis/sleep" className="page-card flex items-center justify-center gap-2 px-5 py-4 text-[color:var(--color-brown)]">
        <span>查看分析</span>
      </Link>
    </div>
  );
}
