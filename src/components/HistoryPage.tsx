import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface HistoryPageProps {
  items: Array<{ date: string; type: string; detail: string }>;
}

export default function HistoryPage({ items }: HistoryPageProps) {
  const [type, setType] = useState('全部');
  const [date, setDate] = useState('');
  const filtered = items.filter((item) => (type === '全部' || item.type === type) && (!date || item.date === date));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl">打卡记录</h1>
        <div className="w-10" />
      </header>

      <section className="page-card grid gap-3 p-5 sm:grid-cols-2">
        <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 outline-none">
          <option>全部</option>
          <option>早起打卡</option>
          <option>睡眠打卡</option>
          <option>工作计划</option>
        </select>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 outline-none" />
      </section>

      <section className="space-y-3">
        {filtered.map((item, index) => (
          <article key={`${item.date}-${item.type}-${index}`} className="page-card px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="serif-title text-lg">{item.type}</p>
              <span className="text-sm text-[color:var(--color-muted)]">{item.date}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--color-muted)]">{item.detail}</p>
          </article>
        ))}
        {!filtered.length ? <div className="page-card px-4 py-6 text-center text-sm text-[color:var(--color-muted)]">当前筛选条件下暂无记录。</div> : null}
      </section>
    </div>
  );
}
