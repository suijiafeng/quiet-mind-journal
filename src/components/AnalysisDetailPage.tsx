import { ArrowLeft, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { MainCheckInType, SleepEntry } from '../types';
import WeeklyHeatCalendar, { buildHeatColumnsFromSequence } from './WeeklyHeatCalendar';

interface AnalysisDetailPageProps {
  morningRate: number;
  sleepEntries: SleepEntry[];
  workCompletion: number;
  incompleteReasons: string[];
  hidden: boolean;
  onExport: (title: string, lines: string[]) => void;
}

export default function AnalysisDetailPage({
  morningRate,
  sleepEntries,
  workCompletion,
  incompleteReasons,
  hidden,
  onExport,
}: AnalysisDetailPageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const type = (params.type as MainCheckInType) ?? 'sleep';

  const summaries = {
    morning: {
      title: '早起打卡分析',
      metrics: [
        { label: '早起率', value: `${Math.min(100, morningRate * 10)}%`, delta: '较上周 +6%' },
        { label: '平均早起时间', value: '06:38', delta: '较上周 -8 分钟' },
        { label: '趋势变化', value: '更稳定', delta: '连续 4 天早起' },
      ],
      summary: '近一周早起状态较稳，建议继续保持固定起床时间，减少周末波动。',
      bars: [70, 82, 85, 78, 88, 90, 84],
      heatmap: [1, 2, 2, 1, 3, 3, 2],
    },
    sleep: {
      title: '睡眠打卡分析',
      metrics: [
        { label: '平均睡眠时长', value: '7.5 小时', delta: '较上周 +12 分钟' },
        { label: '入睡平均时间', value: '23:11', delta: '较上周 -9 分钟' },
        { label: '起床平均时间', value: '06:40', delta: '较上周 +3 分钟' },
      ],
      summary: '近一周睡眠较规律，建议保持 23 点前入睡，晚间减少屏幕使用。',
      bars: sleepEntries.map((item) => Math.round(item.durationMinutes / 6)),
      heatmap: [2, 2, 1, 3, 2, 2, 3],
    },
    work: {
      title: '工作计划分析',
      metrics: [
        { label: '计划完成率', value: `${workCompletion}%`, delta: '较上周 +5%' },
        { label: '未完成原因', value: `${incompleteReasons.length} 类`, delta: '主要为节奏被打断' },
        { label: '效率趋势', value: '稳步提升', delta: '上午完成度更高' },
      ],
      summary: `未完成原因集中在：${incompleteReasons.join('、')}。建议将复杂任务拆分为可执行小项。`,
      bars: [58, 64, 66, 71, 69, 76, workCompletion],
      heatmap: [1, 1, 2, 2, 2, 3, 3],
    },
  }[type];

  const radialValue = type === 'morning' ? Math.min(100, morningRate * 10) : type === 'sleep' ? 75 : workCompletion;
  const radialCircumference = 2 * Math.PI * 34;
  const radialOffset = radialCircumference * (1 - radialValue / 100);
  const trendPoints = summaries.bars.map((value, index) => `${20 + index * 46},${138 - value}`).join(' ');
  const heatColumns = buildHeatColumnsFromSequence(summaries.heatmap);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <button type="button" onClick={() => navigate('/analysis')} className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </button>
        <h1 className="serif-title text-2xl">{summaries.title}</h1>
        <div className="w-10" />
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {summaries.metrics.map((metric) => (
          <div key={metric.label} className="page-card px-4 py-5 text-center">
            <p className="text-sm text-[color:var(--color-muted)]">{metric.label}</p>
            <p className="mt-3 serif-title text-2xl">{hidden ? '已隐藏' : metric.value}</p>
            <p className="mt-2 text-xs text-[color:var(--color-muted)]">{hidden ? '隐私模式已开启' : metric.delta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="page-card flex flex-col items-center justify-center px-5 py-6">
          <p className="mb-4 text-sm text-[color:var(--color-muted)]">综合达成</p>
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-40 w-40 -rotate-90">
              <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(129,120,108,0.18)" strokeWidth="10" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="var(--color-accent-strong)" strokeWidth="10" strokeLinecap="round" strokeDasharray={radialCircumference} strokeDashoffset={hidden ? radialCircumference * 0.64 : radialOffset} />
            </svg>
            <div className="absolute text-center">
              <p className="serif-title text-3xl">{hidden ? '--' : `${radialValue}%`}</p>
              <p className="mt-1 text-xs text-[color:var(--color-muted)]">本期表现</p>
            </div>
          </div>
        </div>

        <div className="page-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[color:var(--color-muted)]">趋势曲线</p>
            <span className="text-xs text-[color:var(--color-muted)]">近 7 日</span>
          </div>
          <svg viewBox="0 0 320 170" className="h-48 w-full">
            <polyline fill="rgba(111,145,133,0.14)" stroke="none" points={`20,138 ${trendPoints} 296,138`} />
            <polyline fill="none" stroke="var(--color-accent-strong)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={hidden ? summaries.bars.map((_, index) => `${20 + index * 46},94`).join(' ') : trendPoints} />
            {summaries.bars.map((value, index) => (
              <circle key={`${value}-${index}`} cx={20 + index * 46} cy={hidden ? 94 : 138 - value} r="4" fill="var(--color-accent-strong)" />
            ))}
          </svg>
          <div className="mt-2 grid grid-cols-7 text-center text-xs text-[color:var(--color-muted)]">
            {summaries.bars.map((_, index) => (
              <span key={index}>{index + 1}日</span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="page-card rounded-[24px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-5 py-5">
          <p className="mb-2 serif-title text-lg">规律总结</p>
          <p className="text-sm leading-7 text-[color:var(--color-muted)]">{hidden ? '隐私模式开启时不展示详细数值，已保留规律总结。' : summaries.summary}</p>
        </div>
        <WeeklyHeatCalendar columns={heatColumns} hidden={hidden} caption="最近 4 周" />
      </section>

      <button
        type="button"
        onClick={() =>
          onExport(summaries.title, [
            ...summaries.metrics.map((metric) => `${metric.label}：${hidden ? '已隐藏' : metric.value}，${metric.delta}`),
            `规律总结：${hidden ? '隐私模式已开启，仅导出概要。' : summaries.summary}`,
          ])
        }
        className="page-card flex w-full items-center justify-center gap-2 px-5 py-4 text-center text-[color:var(--color-accent-strong)]"
      >
        <Download className="h-4 w-4" />
        导出报告
      </button>
    </div>
  );
}
