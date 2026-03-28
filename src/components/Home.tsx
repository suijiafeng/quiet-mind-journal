import { BookOpenText, ChevronRight, Coffee, Droplets, Heart, MoonStar, Settings, Sparkles, SunMedium } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface HomeProps {
  progress: {
    completed: number;
    total: number;
  };
  cards: Array<{
    key: string;
    title: string;
    status: string;
    path: string;
    icon: string;
    tone: 'green' | 'brown';
  }>;
}

const iconMap = {
  morning: SunMedium,
  sleep: MoonStar,
  work: BookOpenText,
  sun: SunMedium,
  moon: MoonStar,
  book: BookOpenText,
  heart: Heart,
  cup: Coffee,
  droplet: Droplets,
  spark: Sparkles,
};

export default function Home({ progress, cards }: HomeProps) {
  const progressRate = (progress.completed / progress.total) * 100;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between rounded-[28px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-4">
        <button>
        </button>
        <div className="text-center">
          <p className="ink-title text-4xl tracking-[0.2em] text-[color:var(--color-accent-strong)]">朝暮打卡</p>
          <p className="mt-1 text-xs tracking-[0.3em] text-[color:var(--color-muted)]">一目了然</p>
        </div>
        <Link
          to="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] text-[color:var(--color-muted)]"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </header>

      <section className="page-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="serif-title text-xl text-[color:var(--color-text)]">今日打卡</p>
            <p className="mt-1 text-sm text-[color:var(--color-muted)]">主次分明，先完成最重要的三项</p>
          </div>
          <span className="rounded-full bg-[color:var(--color-surface-soft)] px-3 py-1 text-xs text-[color:var(--color-muted)]">
            今日进度
          </span>
        </div>

        <div className="space-y-4">
          {cards.map((card, index) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap] ?? Sparkles;
            const bgClass =
              card.tone === 'green' ? 'bg-[color:var(--color-card-green)]' : 'bg-[color:var(--color-card-brown)]';

            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={card.path}
                  className={`flex items-center justify-between rounded-[24px] border border-[var(--color-line)] ${bgClass} px-5 py-5`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white/50 text-[color:var(--color-accent-strong)]">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="serif-title text-lg text-[color:var(--color-text)]">{card.title}</p>
                      <p className="mt-1 text-sm text-[color:var(--color-muted)]">今日状态：{card.status}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[color:var(--color-muted)]" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="page-card p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-[color:var(--color-muted)]">当日打卡进度</span>
          <span className="serif-title text-lg text-[color:var(--color-accent-strong)]">
            {progress.completed}/{progress.total}
          </span>
        </div>
        <div className="h-2 rounded-full bg-[color:var(--color-surface-soft)]">
          <div
            className="h-2 rounded-full bg-[color:var(--color-accent)] transition-all"
            style={{ width: `${progressRate}%` }}
          />
        </div>
        <Link
          to="/checkins"
          className="mt-5 flex items-center justify-center gap-1 text-sm text-[color:var(--color-muted)]"
        >
          更多打卡
          <ChevronRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
