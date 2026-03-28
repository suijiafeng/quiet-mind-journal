import { ArrowLeft, MessageSquareText } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FeedbackPage() {
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between px-1">
        <Link to="/profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)]">
          <ArrowLeft className="h-4 w-4 text-[color:var(--color-muted)]" />
        </Link>
        <h1 className="serif-title text-2xl">意见反馈</h1>
        <div className="w-10" />
      </header>

      <section className="page-card p-5">
        <div className="mb-3 flex items-center gap-2 text-[color:var(--color-accent-strong)]">
          <MessageSquareText className="h-4 w-4" />
          <span className="text-sm">留下你的建议</span>
        </div>
        <textarea
          rows={8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="例如：希望增加按周复盘、提醒铃声、自定义统计维度。"
          className="w-full rounded-[20px] border border-[var(--color-line)] bg-[color:var(--color-surface)] px-4 py-4 outline-none"
        />
        <button
          type="button"
          onClick={() => {
            if (!content.trim()) return;
            setSubmitted(true);
            setContent('');
            window.setTimeout(() => setSubmitted(false), 3000);
          }}
          className="mt-4 w-full rounded-[18px] bg-[color:var(--color-card-green)] px-4 py-3 text-[color:var(--color-accent-strong)]"
        >
          提交反馈
        </button>
        {submitted ? <p className="mt-3 text-center text-sm text-[color:var(--color-brown)]">反馈已记录，感谢你的建议。</p> : null}
      </section>
    </div>
  );
}
