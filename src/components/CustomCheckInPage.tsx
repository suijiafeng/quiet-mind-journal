import { ArrowLeft, BookOpenText, Coffee, Droplets, Heart, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { AppState } from '../types';

interface CustomCheckInPageProps {
  items: AppState['customCheckIns'];
  onCheckIn: (id: string, note: string) => void;
}

export default function CustomCheckInPage({ items, onCheckIn }: CustomCheckInPageProps) {
  const params = useParams();
  const item = items.find((entry) => entry.id === params.id);
  const [note, setNote] = useState(item?.note ?? '');
  const [message, setMessage] = useState('');

  if (!item) {
    return <div className="page-card px-5 py-8 text-center text-[color:var(--color-muted)]">未找到对应打卡项。</div>;
  }

  const recentDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: key.slice(5), checked: item.history.includes(key) };
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/checkins" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl">{item.name}打卡</h1>
        <div className="w-10" />
      </header>

      <section className="page-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[color:var(--color-muted)]">当前频率</p>
            <p className="mt-2 serif-title text-3xl">
              {item.frequency === 'daily' ? '每日' : item.frequency === 'weekly' ? '每周' : '自定义'}
            </p>
          </div>
          <div className="rounded-[20px] bg-[color:var(--color-card-green)] px-4 py-3 text-right text-sm text-[color:var(--color-accent-strong)]">
            <p>连续打卡</p>
            <p className="mt-1 serif-title text-2xl">{item.streak}天</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onCheckIn(item.id, note.trim() || `${item.name}已完成`);
            setMessage('打卡成功');
            window.setTimeout(() => setMessage(''), 3000);
          }}
          className="mt-6 flex w-full items-center justify-center rounded-[28px] bg-[color:var(--color-card-brown)] px-5 py-6 text-[color:var(--color-text)]"
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/60">
              {item.icon === 'heart' ? <Heart className="h-7 w-7" /> : item.icon === 'book' ? <BookOpenText className="h-7 w-7" /> : item.icon === 'droplet' ? <Droplets className="h-7 w-7" /> : item.icon === 'cup' ? <Coffee className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
            </div>
            <p className="mt-3 serif-title text-2xl">完成今日{item.name}</p>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">今日状态：{item.completedToday ? '已打卡' : '未打卡'}</p>
          </div>
        </button>
        {message ? <p className="mt-4 text-center text-sm text-[color:var(--color-brown)]">{message}</p> : null}
      </section>

      <section className="page-card p-5">
        <p className="mb-3 text-sm text-[color:var(--color-muted)]">今日备注</p>
        <textarea
          rows={4}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={`记录今日${item.name}的时长、感受或完成情况。`}
          className="w-full rounded-[20px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-4 outline-none"
        />
        <div className="mt-4 flex items-center justify-between text-sm text-[color:var(--color-muted)]">
          <span>最近打卡时间</span>
          <span>{item.checkedInAt ?? '--:--'}</span>
        </div>
      </section>

      <section className="page-card p-5">
        <p className="mb-3 text-sm text-[color:var(--color-muted)]">近7次打卡</p>
        <div className="grid grid-cols-7 gap-2">
          {recentDays.map((day) => (
            <div key={day.key} className="rounded-[16px] border border-[var(--color-line)] px-2 py-3 text-center">
              <p className="text-xs text-[color:var(--color-muted)]">{day.label}</p>
              <div className={`mx-auto mt-2 h-2.5 w-2.5 rounded-full ${day.checked ? 'bg-[color:var(--color-accent)]' : 'bg-[color:var(--color-line)]'}`} />
            </div>
          ))}
        </div>
      </section>

      <Link to={`/analysis/custom/${item.id}`} className="page-card flex items-center justify-center gap-2 px-5 py-4 text-[color:var(--color-accent-strong)]">
        查看分析
      </Link>
    </div>
  );
}
