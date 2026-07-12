import type { ReactNode } from 'react';

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, description, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          {eyebrow && <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{eyebrow}</span>}
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {description && <p className="mt-5 text-lg leading-relaxed text-violet-100/70">{description}</p>}
        </div>
        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
}
