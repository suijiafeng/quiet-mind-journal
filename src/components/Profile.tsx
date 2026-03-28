import { Award, ChevronRight, History, MessageSquareText, Settings, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileProps {
  name: string;
  avatar: string;
}

const items = [
  { label: '打卡记录', icon: History, description: '查看历史打卡详情', path: '/history' },
  { label: '勋章墙', icon: Award, description: '连续早起与睡眠成就', path: '/medals' },
  { label: '设置', icon: Settings, description: '主题、提醒与备份', path: '/settings' },
  { label: '意见反馈', icon: MessageSquareText, description: '提交建议与问题', path: '/feedback' },
];

export default function Profile({ name, avatar }: ProfileProps) {
  return (
    <div className="space-y-6">
      <section className="page-card px-6 py-8 text-center">
        <img src={avatar} alt={name} className="mx-auto h-24 w-24 rounded-full border-2 border-[color:var(--color-accent)] object-cover" />
        <h1 className="mt-4 serif-title text-3xl">{name}</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">内敛记录，持续精进</p>
      </section>

      <section className="page-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <UserCircle2 className="h-4 w-4 text-[color:var(--color-muted)]" />
          <p className="text-sm text-[color:var(--color-muted)]">个人中心</p>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center justify-between rounded-[20px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-[color:var(--color-accent-strong)]" />
                <div>
                  <p>{item.label}</p>
                  <p className="mt-1 text-xs text-[color:var(--color-muted)]">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[color:var(--color-muted)]" />
            </Link>
          ))}
        </div>
      </section>

      <footer className="pb-4 text-center text-xs text-[color:var(--color-muted)]">版本信息 1.0.0</footer>
    </div>
  );
}
