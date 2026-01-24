const dayLabels = ['一', '二', '三', '四', '五', '六', '日'];

const toneClasses = [
  'bg-[color:var(--color-surface-soft)] border-[color:var(--color-line)]/70',
  'bg-[color:var(--color-card-green)] border-[color:var(--color-line)]',
  'bg-[color:var(--color-accent)]/70 border-[color:var(--color-accent)]/20',
  'bg-[color:var(--color-accent-strong)] border-[color:var(--color-accent-strong)]/20',
];

interface WeeklyHeatCalendarProps {
  columns: number[][];
  hidden: boolean;
  title?: string;
  caption?: string;
}

export function buildHeatColumnsFromSequence(levels: number[], stacks = 4): number[][] {
  return dayLabels.map((_, dayIndex) =>
    Array.from({ length: stacks }, (_, stackIndex) => {
      const sourceIndex = (dayIndex + stackIndex * 2) % levels.length;
      return levels[sourceIndex] ?? 1;
    }),
  );
}

export function buildHeatColumnsFromDates(dates: string[], stacks = 4): number[][] {
  const active = new Set(dates);
  const now = new Date();
  const jsDay = now.getDay();
  const mondayOffset = (jsDay + 6) % 7;

  return dayLabels.map((_, dayIndex) =>
    Array.from({ length: stacks }, (_, stackIndex) => {
      const target = new Date(now);
      target.setHours(0, 0, 0, 0);
      target.setDate(now.getDate() - mondayOffset + dayIndex - stackIndex * 7);

      const iso = target.toISOString().slice(0, 10);
      if (!active.has(iso)) return 1;

      const recencyBoost = Math.max(0, stacks - stackIndex - 1);
      return Math.min(4, 2 + recencyBoost);
    }),
  );
}

export default function WeeklyHeatCalendar({
  columns,
  hidden,
  title = '周历热力',
  caption = '最近 4 周',
}: WeeklyHeatCalendarProps) {
  return (
    <div className="page-card p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-[color:var(--color-muted)]">{title}</p>
        <span className="text-xs text-[color:var(--color-muted)]">{caption}</span>
      </div>

      <div className="rounded-[22px] border border-[var(--color-line)] bg-[color:var(--color-surface-soft)]/35 px-4 py-4">
        <div className="grid grid-cols-7 gap-3">
          {columns.map((levels, index) => (
            <div key={dayLabels[index]} className="flex flex-col items-center gap-2">
              <div className="flex h-28 w-full flex-col-reverse items-center justify-start gap-1">
                {levels.map((level, stackIndex) => (
                  <div
                    key={`${dayLabels[index]}-${stackIndex}`}
                    className={`h-5 w-full max-w-9 rounded-[9px] border ${toneClasses[hidden ? 0 : Math.max(0, Math.min(toneClasses.length - 1, level - 1))]} shadow-[0_4px_10px_rgba(95,124,115,0.08)]`}
                  />
                ))}
              </div>
              <p className="text-xs text-[color:var(--color-muted)]">{dayLabels[index]}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-[color:var(--color-muted)]">
          <span>低频</span>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((tone) => (
              <span
                key={tone}
                className={`h-2.5 w-4 rounded-full border ${toneClasses[hidden ? 0 : tone]}`}
              />
            ))}
          </div>
          <span>高频</span>
        </div>
      </div>
    </div>
  );
}
