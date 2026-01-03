import { ArrowLeft, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MedalPageProps {
  medals: Array<{ name: string; unlocked: boolean; description: string }>;
}

export default function MedalPage({ medals }: MedalPageProps) {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl">勋章墙</h1>
        <div className="w-10" />
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {medals.map((medal) => (
          <article key={medal.name} className={`page-card px-5 py-5 ${medal.unlocked ? 'bg-[color:var(--color-surface)]' : 'opacity-55 grayscale'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-card-brown)] text-[color:var(--color-brown)]">
                <Medal className="h-6 w-6" />
              </div>
              <div>
                <p className="serif-title text-lg">{medal.name}</p>
                <p className="mt-1 text-xs text-[color:var(--color-muted)]">{medal.unlocked ? '已解锁' : '未解锁'}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[color:var(--color-muted)]">{medal.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
