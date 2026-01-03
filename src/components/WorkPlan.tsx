import { ArrowLeft, CirclePlus, SquareCheckBig } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { WorkTask } from '../types';
import { cn } from '../lib/utils';

interface WorkPlanProps {
  tasks: WorkTask[];
  checkedIn: boolean;
  completionRate: number;
  onToggleTask: (id: string) => void;
  onAddTask: (text: string) => void;
  onCheckIn: () => void;
}

export default function WorkPlan({
  tasks,
  checkedIn,
  completionRate,
  onToggleTask,
  onAddTask,
  onCheckIn,
}: WorkPlanProps) {
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');

  const submitTask = () => {
    if (!draft.trim()) {
      return;
    }

    onAddTask(draft);
    setDraft('');
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl text-[color:var(--color-accent)]">工作计划打卡</h1>
        <div className="w-10" />
      </header>

      <section className="page-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-[color:var(--color-muted)]">今日工作计划</p>
            <p className="mt-1 serif-title text-xl">整洁有序</p>
          </div>
          <span className="rounded-full bg-[color:var(--color-card-green)] px-3 py-1 text-xs text-[color:var(--color-accent-strong)]">
            完成率 {completionRate}%
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onToggleTask(task.id)}
              className="flex w-full items-start gap-3 rounded-[20px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-4 text-left"
            >
              <span
                className={cn(
                  'mt-1 h-5 w-5 rounded border border-[var(--color-line)]',
                  task.completed && 'bg-[color:var(--color-accent)]',
                )}
              />
              <span
                className={cn(
                  'flex-1 leading-7 text-[color:var(--color-text)]',
                  task.completed && 'text-[color:var(--color-muted)] line-through',
                )}
              >
                {task.text}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={3}
            placeholder="输入当日工作计划，支持换行记录。"
            className="min-h-[96px] flex-1 rounded-[20px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 outline-none"
          />
          <button
            type="button"
            onClick={submitTask}
            className="flex h-14 w-14 items-center justify-center self-end rounded-full bg-[color:var(--color-card-green)] text-[color:var(--color-accent-strong)]"
          >
            <CirclePlus className="h-7 w-7" />
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={() => {
          onCheckIn();
          setMessage('今日计划已完成打卡');
          window.setTimeout(() => setMessage(''), 3000);
        }}
        className="page-card flex w-full items-center justify-center gap-2 px-5 py-4 text-[color:var(--color-accent-strong)]"
      >
        <SquareCheckBig className="h-5 w-5" />
        <span>{checkedIn ? '已完成打卡' : '完成打卡'}</span>
      </button>
      {message ? <p className="text-center text-sm text-[color:var(--color-brown)]">{message}</p> : null}

      <Link to="/analysis/work" className="page-card flex items-center justify-center gap-2 px-5 py-4 text-[color:var(--color-accent-strong)]">
        <span>查看分析</span>
      </Link>
    </div>
  );
}
