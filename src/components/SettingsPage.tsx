import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AppState } from '../types';

interface SettingsPageProps {
  state: AppState;
  onUpdate: (updater: Partial<AppState>) => void;
  onUpdateSettings: (key: keyof AppState['settings'], value: string | boolean) => void;
  onBackup: () => void;
}

export default function SettingsPage({ state, onUpdate, onUpdateSettings, onBackup }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl">设置</h1>
        <div className="w-10" />
      </header>

      <section className="page-card p-5">
        <p className="mb-3 serif-title text-lg">打卡提醒</p>
        <div className="space-y-3">
          {[
            ['morningReminder', '早起提醒'],
            ['sleepReminder', '睡眠提醒'],
            ['workReminder', '工作计划提醒'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-[18px] border border-[var(--color-line)] px-4 py-3">
              <span>{label}</span>
              <input
                type="time"
                value={state.settings[key as keyof AppState['settings']] as string}
                onChange={(event) => onUpdateSettings(key as keyof AppState['settings'], event.target.value)}
                className="rounded-xl border border-[var(--color-line)] bg-[color:var(--color-surface)] px-3 py-2"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="page-card p-5">
        <p className="mb-3 serif-title text-lg">主题切换</p>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => onUpdate({ theme: 'elegant' })} className={`rounded-[20px] border px-4 py-5 ${state.theme === 'elegant' ? 'border-[color:var(--color-accent)] bg-[color:var(--color-card-green)]' : 'border-[color:var(--color-line)]'}`}>
            淡雅版
          </button>
          <button type="button" onClick={() => onUpdate({ theme: 'warm' })} className={`rounded-[20px] border px-4 py-5 ${state.theme === 'warm' ? 'border-[color:var(--color-brown)] bg-[color:var(--color-card-brown)]' : 'border-[color:var(--color-line)]'}`}>
            温润版
          </button>
        </div>
      </section>

      <section className="page-card p-5">
        <button type="button" onClick={onBackup} className="flex w-full items-center justify-between rounded-[18px] border border-[var(--color-line)] px-4 py-3">
          <span>立即备份到本地</span>
          <Download className="h-4 w-4 text-[color:var(--color-muted)]" />
        </button>
      </section>
    </div>
  );
}
