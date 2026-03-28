import { useState } from 'react';
import { Reorder } from 'motion/react';
import { ArrowLeft, BookOpenText, ChevronRight, Coffee, Droplets, FilePenLine, Heart, Plus, Sparkles, SunMedium } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AppState, CheckInFrequency, CustomCheckIn } from '../types';

interface CheckInListPageProps {
  items: Array<{ id: string; name: string; status: string; path: string; icon: string; isCustom: boolean }>;
  customItems: AppState['customCheckIns'];
  customCount: number;
  onAddCustom: (payload: Pick<CustomCheckIn, 'name' | 'frequency' | 'icon'>) => void;
  onUpdateCustom: (id: string, payload: Pick<CustomCheckIn, 'name' | 'frequency' | 'icon'>) => void;
  onDeleteCustom: (id: string) => void;
  onReorder: (order: string[]) => void;
}

export default function CheckInListPage({
  items,
  customItems,
  customCount,
  onAddCustom,
  onUpdateCustom,
  onDeleteCustom,
  onReorder,
}: CheckInListPageProps) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<CheckInFrequency>('daily');
  const [icon, setIcon] = useState<CustomCheckIn['icon']>('spark');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionOpenId, setActionOpenId] = useState<string | null>(null);
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const iconOptions: Array<{ value: CustomCheckIn['icon']; label: string }> = [
    { value: 'spark', label: '星标' },
    { value: 'book', label: '书卷' },
    { value: 'heart', label: '心形' },
    { value: 'cup', label: '茶杯' },
    { value: 'droplet', label: '水滴' },
  ];

  const iconLabel = (iconName: string) => {
    if (iconName === 'sun') return <SunMedium className="h-5 w-5" />;
    if (iconName === 'moon') return <Sparkles className="h-5 w-5" />;
    if (iconName === 'work') return <BookOpenText className="h-5 w-5" />;
    if (iconName === 'book') return <BookOpenText className="h-5 w-5" />;
    if (iconName === 'heart') return <Heart className="h-5 w-5" />;
    if (iconName === 'cup') return <Coffee className="h-5 w-5" />;
    if (iconName === 'droplet') return <Droplets className="h-5 w-5" />;
    return <Sparkles className="h-5 w-5" />;
  };

  const resetForm = () => {
    setName('');
    setFrequency('daily');
    setIcon('spark');
    setEditingId(null);
    setActionOpenId(null);
    setIconDropdownOpen(false);
    setFormModalOpen(false);
  };

  const submitForm = () => {
    if (!name.trim()) {
      return;
    }

    const payload = {
      name: name.trim(),
      frequency,
      icon,
    };

    if (editingId) {
      onUpdateCustom(editingId, payload);
    } else {
      onAddCustom(payload);
    }

    resetForm();
  };

  const editingItem = editingId ? customItems.find((item) => item.id === editingId) : null;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl">全部打卡</h1>
        <div className="w-10" />
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="text-sm text-[color:var(--color-muted)]">长按可上下拖动排序</p>
        </div>
        <Reorder.Group axis="y" values={items.map((item) => item.id)} onReorder={onReorder} className="space-y-3">
          {items.map((item) => (
            <Reorder.Item key={item.id} value={item.id} className="list-none">
              <div className="page-card flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <Link to={item.path} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[color:var(--color-surface-soft)] text-[color:var(--color-accent-strong)]">
                      {iconLabel(item.icon)}
                    </div>
                    <div>
                      <p>{item.name}</p>
                      <p className="mt-1 text-sm text-[color:var(--color-muted)]">{item.status}</p>
                    </div>
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  {actionOpenId === item.id ? (
                    <div className="flex items-center gap-2">
                      {item.isCustom ? (
                        <button
                          type="button"
                          onClick={() => {
                            const target = customItems.find((entry) => entry.id === item.id);
                            if (!target) return;
                            setEditingId(item.id);
                            setName(target.name);
                            setFrequency(target.frequency);
                            setIcon(target.icon);
                            setIconDropdownOpen(false);
                            setFormModalOpen(true);
                          }}
                          className="rounded-full border border-[var(--color-line)] px-3 py-2 text-sm text-[color:var(--color-muted)]"
                        >
                          修改
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          const targetLabel = ['morning', 'sleep', 'work'].includes(item.id)
                            ? `确认将“${item.name}”从全部打卡中移除吗？`
                            : `确认删除“${item.name}”吗？此操作不可撤销。`;
                          if (window.confirm(targetLabel)) {
                            onDeleteCustom(item.id);
                            if (editingId === item.id) {
                              resetForm();
                            } else {
                              setActionOpenId(null);
                            }
                          }
                        }}
                        className="rounded-full border border-[var(--color-line)] px-3 py-2 text-sm text-[color:#e40404]"
                      >
                        删除
                      </button>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setActionOpenId((current) => (current === item.id ? null : item.id))}
                    className="rounded-full border border-[var(--color-line)] p-2 text-[color:var(--color-muted)]"
                  >
                    <ChevronRight className={`h-4 w-4 transition-transform ${actionOpenId === item.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </section>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => {
            setName('');
            setFrequency('daily');
            setIcon('spark');
            setEditingId(null);
            setIconDropdownOpen(false);
            setFormModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[color:var(--color-surface)] px-5 py-3 text-sm text-[color:var(--color-muted)]"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>

      {formModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
          <div className="w-full max-w-md rounded-[24px] border border-[var(--color-line)] bg-[color:var(--color-surface)] p-5 shadow-[0_18px_50px_rgba(93,89,79,0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="serif-title text-xl">{editingId ? '修改打卡' : '添加打卡'}</p>
              <button type="button" onClick={resetForm} className="text-sm text-[color:var(--color-muted)]">
                关闭
              </button>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIconDropdownOpen((current) => !current)}
                  className="flex w-full items-center justify-between rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3"
                >
                  <span className="flex h-6 w-6 items-center justify-center text-[color:var(--color-accent-strong)]">
                    {iconLabel(icon)}
                  </span>
                  <ChevronRight className={`h-4 w-4 text-[color:var(--color-muted)] transition-transform ${iconDropdownOpen ? 'rotate-90' : ''}`} />
                </button>
                {iconDropdownOpen ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] p-3 shadow-[0_14px_30px_rgba(93,89,79,0.12)]">
                    <div className="grid grid-cols-5 gap-2">
                      {iconOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setIcon(option.value);
                            setIconDropdownOpen(false);
                          }}
                          className={`flex h-11 items-center justify-center rounded-[14px] border ${
                            icon === option.value
                              ? 'border-[color:var(--color-line)] bg-[color:var(--color-surface-soft)] text-[color:var(--color-text)]'
                              : 'border-transparent text-[color:var(--color-muted)]'
                          }`}
                        >
                          {iconLabel(option.value)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="如：运动、阅读、喝水"
                className="w-full rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 outline-none"
              />
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value as CheckInFrequency)}
                className="w-full rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 outline-none"
              >
                <option value="daily">每日</option>
                <option value="weekly">每周</option>
                <option value="custom">自定义</option>
              </select>
              {editingItem ? (
                <div className="rounded-[18px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-muted)]">
                  当前编辑：{editingItem.name}
                </div>
              ) : null}
              <button type="button" onClick={submitForm} className="w-full rounded-[18px] bg-[color:var(--color-card-green)] px-4 py-3 text-[color:var(--color-accent-strong)]">
                保存
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
