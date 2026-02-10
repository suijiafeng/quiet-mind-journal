import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import MorningCheckIn from './components/MorningCheckIn';
import SleepCheckIn from './components/SleepCheckIn';
import WorkPlan from './components/WorkPlan';
import Analysis from './components/Analysis';
import Profile from './components/Profile';
import CheckInListPage from './components/CheckInListPage';
import CustomCheckInPage from './components/CustomCheckInPage';
import AnalysisDetailPage from './components/AnalysisDetailPage';
import SettingsPage from './components/SettingsPage';
import CustomAnalysisPage from './components/CustomAnalysisPage';
import HistoryPage from './components/HistoryPage';
import MedalPage from './components/MedalPage';
import FeedbackPage from './components/FeedbackPage';
import type { AppState, CustomCheckIn, SleepEntry, WorkTask } from './types';

const storageKey = 'quiet-mind-journal-state';

const defaultSleepEntries: SleepEntry[] = [
  { date: '03-22', durationMinutes: 430, sleepTime: '23:20', wakeTime: '06:30' },
  { date: '03-23', durationMinutes: 450, sleepTime: '23:05', wakeTime: '06:35' },
  { date: '03-24', durationMinutes: 420, sleepTime: '23:45', wakeTime: '06:45' },
  { date: '03-25', durationMinutes: 465, sleepTime: '22:55', wakeTime: '06:40' },
  { date: '03-26', durationMinutes: 440, sleepTime: '23:18', wakeTime: '06:38' },
  { date: '03-27', durationMinutes: 455, sleepTime: '23:10', wakeTime: '06:45' },
  { date: '03-28', durationMinutes: 450, sleepTime: '23:12', wakeTime: '06:42' },
];

function todayKey(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

const initialState: AppState = {
  lastActiveDate: todayKey(),
  theme: 'elegant',
  morning: { checkedIn: false, history: ['2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27'] },
  sleep: { sleepAt: '23:12', wakeAt: '06:42', durationMinutes: 450, last7Days: defaultSleepEntries },
  work: {
    tasks: [
      { id: '1', text: '梳理本周重点项目与推进节奏', completed: true },
      { id: '2', text: '完成产品首页结构与文案初稿', completed: true },
      { id: '3', text: '复盘未完成事项并标注原因', completed: false },
    ],
    checkedIn: false,
    completionRate: 67,
    incompleteReasons: ['任务拆分不够细', '会议打断较多'],
  },
  checkInOrder: ['morning', 'sleep', 'work', 'exercise', 'reading', 'water'],
  customCheckIns: [
    { id: 'exercise', name: '运动', icon: 'heart', frequency: 'daily', completedToday: false, streak: 3, history: ['2026-03-25', '2026-03-26', '2026-03-27'], note: '建议在晚饭后完成轻运动。' },
    { id: 'reading', name: '阅读', icon: 'book', frequency: 'daily', completedToday: true, checkedInAt: '21:10', streak: 6, history: ['2026-03-23', '2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28'], note: '今日已完成 30 分钟深度阅读。' },
    { id: 'water', name: '喝水', icon: 'droplet', frequency: 'custom', completedToday: false, streak: 2, history: ['2026-03-26', '2026-03-27'], note: '建议分时段补水，避免集中饮用。' },
  ],
  settings: { morningReminder: '06:20', sleepReminder: '22:50', workReminder: '09:00', hideStats: false, autoBackup: true },
  user: { name: '林见山', avatar: 'https://picsum.photos/seed/quietmind/240/240' },
};

function normalizeAppState(state: AppState): AppState {
  const requiredIds = ['morning', 'sleep', 'work', ...state.customCheckIns.map((item) => item.id)];
  const existingOrder = Array.isArray(state.checkInOrder) ? state.checkInOrder : [];
  return {
    ...state,
    lastActiveDate: state.lastActiveDate ?? todayKey(),
    checkInOrder: [
      ...existingOrder.filter((id) => requiredIds.includes(id)),
      ...requiredIds.filter((id) => !existingOrder.includes(id)),
    ],
  };
}

function nowTime() {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function calculateCompletionRate(completed: number, total: number) {
  return total ? Math.round((completed / total) * 100) : 0;
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportReport(title: string, lines: string[]) {
  const reportWindow = window.open('', '_blank', 'width=820,height=960');
  if (!reportWindow) return;
  reportWindow.document.write(`<html lang="zh-CN"><head><title>${title}</title><style>body{font-family:"Noto Serif SC",serif;background:#f7f1e7;color:#342d28;padding:40px}.card{background:#fff8ef;border:1px solid #d3c6b8;border-radius:18px;padding:24px;margin-top:16px}h1{font-size:28px;margin-bottom:8px}p{line-height:1.9;font-size:15px}</style></head><body><h1>${title}</h1><p>导出时间：${new Date().toLocaleString('zh-CN')}</p>${lines.map((line) => `<div class="card"><p>${line}</p></div>`).join('')}</body></html>`);
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}

function AppRoutes() {
  const [state, setState] = useState<AppState>(() => {
    const saved = window.localStorage.getItem(storageKey);
    const parsed = saved ? (JSON.parse(saved) as AppState) : initialState;
    return rolloverState(parsed, todayKey());
  });
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    document.body.dataset.theme = state.theme;
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const activeDate = todayKey();
    setState((current) => (current.lastActiveDate === activeDate ? current : rolloverState(current, activeDate)));
  }, []);

  const completedWorkTasks = state.work.tasks.filter((task) => task.completed).length;

  const createCustomCheckIn = (payload: Pick<CustomCheckIn, 'name' | 'frequency' | 'icon'>) => {
    const id = `${Date.now()}`;
    setState((current) => ({
      ...current,
      customCheckIns: [
        ...current.customCheckIns,
        { id, name: payload.name, icon: payload.icon, frequency: payload.frequency, completedToday: false, streak: 0, history: [], note: '可添加今日完成备注。' },
      ],
      checkInOrder: [...current.checkInOrder, id],
    }));
  };

  const updateCustomCheckIn = (id: string, payload: Pick<CustomCheckIn, 'name' | 'frequency' | 'icon'>) => {
    setState((current) => ({
      ...current,
      customCheckIns: current.customCheckIns.map((item) => (item.id === id ? { ...item, name: payload.name, frequency: payload.frequency, icon: payload.icon } : item)),
    }));
  };

  const deleteCustomCheckIn = (id: string) => {
    setState((current) => ({
      ...current,
      customCheckIns: current.customCheckIns.filter((item) => item.id !== id),
      checkInOrder: current.checkInOrder.filter((itemId) => itemId !== id),
    }));
  };

  const deleteCheckInFromList = (id: string) => {
    if (['morning', 'sleep', 'work'].includes(id)) {
      setState((current) => ({ ...current, checkInOrder: current.checkInOrder.filter((itemId) => itemId !== id) }));
      return;
    }
    deleteCustomCheckIn(id);
  };

  const analysisCards = [
    { title: '早起', value: period === 'week' ? '本周早起率 80%' : period === 'month' ? '本月早起率 76%' : '本季度早起率 78%', detail: '平均早起时间 06:38', path: '/analysis/morning', tone: 'green' as const, chart: [58, 74, 81, 72, 84], progress: 80 },
    { title: '睡眠', value: period === 'week' ? '平均睡眠 7.5 小时' : period === 'month' ? '平均睡眠 7.3 小时' : '平均睡眠 7.4 小时', detail: '入睡时间较上周提前 12 分钟', path: '/analysis/sleep', tone: 'brown' as const, chart: [62, 68, 64, 78, 82], progress: 75 },
    { title: '工作计划', value: period === 'week' ? '计划完成率 70%' : period === 'month' ? '计划完成率 68%' : '计划完成率 72%', detail: '未完成多与任务切换有关', path: '/analysis/work', tone: 'green' as const, chart: [46, 55, 61, 69, 74], progress: 70 },
  ];

  const historyItems = useMemo(
    () =>
      [
        ...state.morning.history.map((date) => ({ date, type: '早起打卡', detail: `打卡时间 ${state.morning.checkedInAt ?? '06:40'}` })),
        ...(state.sleep.wakeAt ? [{ date: todayKey(), type: '睡眠打卡', detail: `入睡 ${state.sleep.sleepAt ?? '--:--'}，起床 ${state.sleep.wakeAt ?? '--:--'}` }] : []),
        ...(state.work.tasks.length ? [{ date: todayKey(), type: '工作计划', detail: `完成 ${completedWorkTasks}/${state.work.tasks.length} 项，完成率 ${state.work.completionRate}%` }] : []),
        ...state.customCheckIns.flatMap((item) => item.history.map((date) => ({ date, type: item.name, detail: `${item.frequency === 'daily' ? '每日' : item.frequency === 'weekly' ? '每周' : '自定义'}打卡，${date === todayKey() && item.checkedInAt ? `记录时间 ${item.checkedInAt}` : '已完成记录'}` }))),
      ].sort((left, right) => right.date.localeCompare(left.date)),
    [completedWorkTasks, state.customCheckIns, state.morning.checkedInAt, state.morning.history, state.sleep.sleepAt, state.sleep.wakeAt, state.work.completionRate, state.work.tasks.length],
  );

  const medals = [
    { name: '连续早起 7 天', unlocked: state.morning.history.length >= 7, description: '坚持早起，作息更稳。' },
    { name: '睡眠规律 7 天', unlocked: state.sleep.last7Days.length >= 7, description: '近一周睡眠记录完整。' },
    { name: '计划完成达人', unlocked: state.work.completionRate >= 80, description: '工作计划完成率达到 80%。' },
  ];

  const checkInItems = useMemo(() => {
    const allItems = [
      { id: 'morning', name: '早起打卡', status: state.morning.checkedIn ? '已打卡' : '未打卡', path: '/checkin/morning', icon: 'sun', isCustom: false },
      { id: 'sleep', name: '睡眠打卡', status: state.sleep.wakeAt ? '已打卡' : '未打卡', path: '/checkin/sleep', icon: 'moon', isCustom: false },
      { id: 'work', name: '工作计划打卡', status: state.work.checkedIn ? '已打卡' : '未打卡', path: '/checkin/work', icon: 'work', isCustom: false },
      ...state.customCheckIns.map((item) => ({ id: item.id, name: item.name, status: item.completedToday ? '已打卡' : '未打卡', path: `/checkin/custom/${item.id}`, icon: item.icon, isCustom: true })),
    ];
    const map = new Map(allItems.map((item) => [item.id, item]));
    return state.checkInOrder.map((id) => map.get(id)).filter(Boolean) as typeof allItems;
  }, [state.checkInOrder, state.customCheckIns, state.morning.checkedIn, state.sleep.wakeAt, state.work.checkedIn]);

  const homeCards = checkInItems.slice(0, 3).map((item, index) => ({ key: item.id, title: item.name, status: item.status, path: item.path, icon: item.icon, tone: index === 1 ? 'brown' as const : 'green' as const }));
  const homeCompleted = homeCards.filter((item) => item.status === '已打卡').length;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home progress={{ completed: homeCompleted, total: homeCards.length || 1 }} cards={homeCards} />} />
        <Route path="/checkin/morning" element={<MorningCheckIn checkedIn={state.morning.checkedIn} checkedInAt={state.morning.checkedInAt} history={state.morning.history} onCheckIn={() => setState((current) => ({ ...current, morning: { ...current.morning, checkedIn: true, checkedInAt: nowTime(), history: Array.from(new Set([...current.morning.history, todayKey()])) } }))} />} />
        <Route path="/checkin/sleep" element={<SleepCheckIn sleepAt={state.sleep.sleepAt} wakeAt={state.sleep.wakeAt} durationMinutes={state.sleep.durationMinutes} last7Days={state.sleep.last7Days} onSleep={() => setState((current) => ({ ...current, sleep: { ...current.sleep, sleepAt: nowTime() } }))} onWake={() => setState((current) => ({ ...current, sleep: { ...current.sleep, wakeAt: nowTime(), durationMinutes: current.sleep.durationMinutes ?? 450 } }))} />} />
        <Route path="/checkin/work" element={<WorkPlan tasks={state.work.tasks} checkedIn={state.work.checkedIn} completionRate={state.work.completionRate} onToggleTask={(id) => setState((current) => { const tasks = current.work.tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)); const doneCount = tasks.filter((task) => task.completed).length; return { ...current, work: { ...current.work, tasks, completionRate: calculateCompletionRate(doneCount, tasks.length) } }; })} onAddTask={(text) => setState((current) => { const tasks = [...current.work.tasks, { id: `${Date.now()}`, text, completed: false }]; const doneCount = tasks.filter((task) => task.completed).length; return { ...current, work: { ...current.work, tasks, completionRate: calculateCompletionRate(doneCount, tasks.length) } }; })} onCheckIn={() => setState((current) => ({ ...current, work: { ...current.work, checkedIn: true, checkedInAt: nowTime(), completionRate: calculateCompletionRate(completedWorkTasks, current.work.tasks.length) } }))} />} />
        <Route path="/checkins" element={<CheckInListPage customItems={state.customCheckIns} customCount={state.customCheckIns.length} items={checkInItems} onAddCustom={createCustomCheckIn} onUpdateCustom={updateCustomCheckIn} onDeleteCustom={deleteCheckInFromList} onReorder={(order) => setState((current) => ({ ...current, checkInOrder: order }))} />} />
        <Route path="/checkin/custom/:id" element={<CustomCheckInPage items={state.customCheckIns} onCheckIn={(id, note) => setState((current) => ({ ...current, customCheckIns: current.customCheckIns.map((item) => (item.id === id ? { ...item, completedToday: true, checkedInAt: nowTime(), note, streak: item.history.includes(todayKey()) ? item.streak : item.streak + 1, history: Array.from(new Set([...item.history, todayKey()])) } : item)) }))} />} />
        <Route path="/analysis" element={<Analysis period={period} onPeriodChange={setPeriod} cards={[...(state.settings.hideStats ? analysisCards.map((card) => ({ ...card, value: '数据已隐藏', detail: '可在设置中重新显示' })) : analysisCards), ...state.customCheckIns.slice(0, 3).map((item) => ({ title: item.name, value: state.settings.hideStats ? '数据已隐藏' : `连续打卡 ${item.streak} 天`, detail: state.settings.hideStats ? '可在设置中重新显示' : `${item.frequency === 'daily' ? '每日' : item.frequency === 'weekly' ? '每周' : '自定义'}打卡，今日${item.completedToday ? '已完成' : '未完成'}`, path: `/analysis/custom/${item.id}`, tone: 'green' as const, chart: [36, 48, 52, 65, Math.min(90, item.streak * 10)], progress: Math.min(100, item.streak * 12) }))]} />} />
        <Route path="/analysis/:type" element={<AnalysisDetailPage morningRate={state.morning.history.length} sleepEntries={state.sleep.last7Days} workCompletion={state.work.completionRate} incompleteReasons={state.work.incompleteReasons} hidden={state.settings.hideStats} onExport={exportReport} />} />
        <Route path="/analysis/custom/:id" element={<CustomAnalysisPage items={state.customCheckIns} hidden={state.settings.hideStats} onExport={exportReport} />} />
        <Route path="/profile" element={<Profile name={state.user.name} avatar={state.user.avatar} />} />
        <Route path="/history" element={<HistoryPage items={historyItems} />} />
        <Route path="/medals" element={<MedalPage medals={medals} />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/settings" element={<SettingsPage state={state} onUpdate={(updater) => setState((current) => ({ ...current, ...updater }))} onUpdateSettings={(key, value) => setState((current) => ({ ...current, settings: { ...current.settings, [key]: value } }))} onBackup={() => downloadFile(`quiet-mind-journal-backup-${todayKey()}.json`, JSON.stringify(state, null, 2), 'application/json')} />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
