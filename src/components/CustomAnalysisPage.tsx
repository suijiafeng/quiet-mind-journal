import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AppState } from '../types';
import WeeklyHeatCalendar, { buildHeatColumnsFromDates } from './WeeklyHeatCalendar';

interface CustomAnalysisPageProps {
  items: AppState['customCheckIns'];
  hidden: boolean;
  onExport: (title: string, lines: string[]) => void;
}

export default function CustomAnalysisPage({ items, hidden, onExport }: CustomAnalysisPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const item = items.find((entry) => entry.id === params.id);

  if (!item) {
    return <div className="page-card px-5 py-8 text-center text-[color:var(--color-muted)]">未找到对应分析项。</div>;
  }

  const completionRate = Math.min(100, item.history.length * 12);
  const bars = Array.from({ length: 7 }, (_, index) => (item.history.length > index ? 78 - index * 4 : 24 + index * 2));
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - completionRate / 100);
  const trendPoints = bars.map((value, index) => `${20 + index * 46},${138 - value}`).join(' ');
  const heatColumns = buildHeatColumnsFromDates(item.history);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <button type="button" onClick={() => navigate('/checkins')} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </button>
        <h1 className="serif-title text-2xl">{item.name}打卡分析</h1>
        <div className="w-10" />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: '完成率', value: `${completionRate}%`, delta: '近阶段保持稳定' },
          { label: '连续打卡', value: `${item.streak}天`, delta: '坚持越久越容易形成习惯' },
          { label: '记录频率', value: item.frequency === 'daily' ? '每日' : item.frequency === 'weekly' ? '每周' : '自定义', delta: '可在列表页继续扩展' },
        ].map((metric) => (
          <div key={metric.label} className="page-card px-4 py-5 text-center">
            <p className="text-sm text-[color:var(--color-muted)]">{metric.label}</p>
            <p className="mt-3 serif-title text-2xl">{hidden ? '已隐藏' : metric.value}</p>
            <p className="mt-2 text-xs text-[color:var(--color-muted)]">{hidden ? '隐私模式已开启' : metric.delta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="page-card flex flex-col items-center justify-center px-5 py-6">
          <p className="mb-4 text-sm text-[color:var(--color-muted)]">完成环比</p>
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-40 w-40 -rotate-90">
              <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(129,120,108,0.18)" strokeWidth="10" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="var(--color-accent-strong)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={hidden ? circumference * 0.64 : offset} />
            </svg>
            <div className="absolute text-center">
              <p className="serif-title text-3xl">{hidden ? '--' : `${completionRate}%`}</p>
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">完成率</p>
            </div>
          </div>
        </div>

        <div className="page-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[color:var(--color-muted)]">趋势曲线</p>
            <span className="text-xs text-[color:var(--color-muted)]">近 7 次</span>
          </div>
          <svg viewBox="0 0 320 170" className="h-48 w-full">
            <polyline fill="rgba(111,145,133,0.14)" stroke="none" points={`20,138 ${trendPoints} 296,138`} />
            <polyline fill="none" stroke="var(--color-accent-strong)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={hidden ? bars.map((_, index) => `${20 + index * 46},94`).join(' ') : trendPoints} />
            {bars.map((value, index) => (
              <circle key={`${value}-${index}`} cx={20 + index * 46} cy={hidden ? 94 : 138 - value} r="4" fill="var(--color-accent-strong)" />
            ))}
          </svg>
          <div className="mt-2 grid grid-cols-7 text-center text-xs text-[color:var(--color-muted)]">
            {bars.map((_, index) => (
              <span key={index}>{index + 1}次</span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="page-card px-5 py-5">
          <p className="mb-2 serif-title text-lg">规律总结</p>
          <p className="text-sm leading-7 text-[color:var(--color-muted)]">
            {hidden ? '隐私模式开启时不展示详细记录，仅保留概括信息。' : `${item.name}近期完成节奏${item.completedToday ? '较稳定' : '仍可加强'}，建议继续用备注记录时长与感受，便于后续复盘。`}
          </p>
        </div>
        <WeeklyHeatCalendar columns={heatColumns} hidden={hidden} caption="按历史记录回看" />
      </section>

      <button
        type="button"
        onClick={() =>
          onExport(`${item.name}打卡分析`, [
            `完成率：${hidden ? '已隐藏' : `${completionRate}%`}`,
            `连续打卡：${hidden ? '已隐藏' : `${item.streak}天`}`,
            `记录频率：${hidden ? '已隐藏' : item.frequency}`,
            `备注摘要：${item.note ?? '暂无备注'}`,
          ])
        }
        className="page-card flex w-full items-center justify-center gap-2 px-5 py-4 text-[color:var(--color-accent-strong)]"
      >
        <Download className="h-4 w-4" />
        导出报告
      </button>
    </div>
  );
}
