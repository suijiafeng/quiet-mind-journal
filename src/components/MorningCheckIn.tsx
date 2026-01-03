import { ArrowLeft, CalendarDays, CircleCheckBig, SunMedium } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

interface MorningCheckInProps {
  checkedIn: boolean;
  checkedInAt?: string;
  history: string[];
  onCheckIn: () => void;
}

const weekLabels = ['一', '二', '三', '四', '五', '六', '日'];

export default function MorningCheckIn({
  checkedIn,
  checkedInAt,
  history,
  onCheckIn,
}: MorningCheckInProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const weekDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) + index);
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        label: weekLabels[index],
        day: date.getDate(),
        checked: history.includes(key),
      };
    });
  }, [history]);

  const handleCheckIn = () => {
    onCheckIn();
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl text-[color:var(--color-accent)]">早起打卡</h1>
        <div className="w-10" />
      </header>

      <section className="page-card flex flex-col items-center px-6 py-10">
        <button
          type="button"
          onClick={handleCheckIn}
          className="flex h-44 w-44 items-center justify-center rounded-full border border-[var(--color-line)] bg-[color:var(--color-card-green)] text-[color:var(--color-accent-strong)] shadow-[0_20px_50px_rgba(111,145,133,0.2)]"
        >
          <div className="text-center">
            <SunMedium className="mx-auto h-12 w-12" />
            <p className="mt-3 serif-title text-2xl">朝起有时</p>
          </div>
        </button>
        {showSuccess && (
          <div className="mt-5 rounded-[20px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-5 py-3 text-sm text-[color:var(--color-brown)]">
            打卡成功
          </div>
        )}

        <div className="mt-8 flex w-full items-center justify-between rounded-[20px] bg-[color:var(--color-surface-soft)] px-4 py-4">
          <span className="text-sm text-[color:var(--color-muted)]">当日打卡时间</span>
          <span className="serif-title text-xl text-[color:var(--color-text)]">{checkedInAt ?? '--:--'}</span>
        </div>
      </section>

      <section className="page-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[color:var(--color-muted)]" />
          <p className="text-sm text-[color:var(--color-muted)]">本周打卡日历</p>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((item) => (
            <button
              key={item.key}
              type="button"
              className="flex aspect-square flex-col items-center justify-center rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] text-sm"
            >
              <span className="text-xs text-[color:var(--color-muted)]">{item.label}</span>
              <span className="mt-1 serif-title text-lg">{item.day}</span>
              <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--color-accent)] opacity-0" style={{ opacity: item.checked ? 1 : 0 }} />
            </button>
          ))}
        </div>
      </section>

      <Link to="/analysis/morning" className="page-card flex items-center justify-center gap-2 px-5 py-4 text-[color:var(--color-accent-strong)]">
        <CircleCheckBig className="h-5 w-5" />
        <span>查看分析</span>
      </Link>
    </div>
  );
}
