import type { ReactNode } from 'react';
import { BarChart3, Home, Settings, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/analysis', label: '分析', icon: BarChart3 },
  { path: '/profile', label: '我的', icon: UserRound },
  { path: '/settings', label: '设置', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <main className="page-shell">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between rounded-[28px] border border-[var(--color-line)] bg-[color:var(--color-surface)]/95 px-3 py-2 shadow-[0_-8px_30px_rgba(93,89,79,0.08)] backdrop-blur">
          {navItems.map((item) => {
            const active =
              item.path === '/'
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative flex min-w-[68px] flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs transition-colors',
                  active ? 'text-[color:var(--color-accent-strong)]' : 'text-[color:var(--color-muted)]',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-[color:var(--color-card-green)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-5 w-5" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
