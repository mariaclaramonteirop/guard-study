import { Layers, RotateCw, TrendingUp, UserCircle2 } from 'lucide-react';
import { Section } from './Section';

const items = [
  { icon: Layers, title: 'Estudos e projetos separados', desc: 'Distinga o que é aprendizado do que é aplicação prática, sem misturar contextos.' },
  { icon: UserCircle2, title: 'Organização por usuário', desc: 'Cada desenvolvedor tem seu espaço, suas metas e sua trilha individual.' },
  { icon: TrendingUp, title: 'Foco em progresso real', desc: 'Métricas que refletem evolução técnica e não apenas horas contabilizadas.' },
  { icon: RotateCw, title: 'Revisão contínua', desc: 'Fluxos que trazem de volta o que você já estudou, no momento certo.' },
];

export function Differentials() {
  return (
    <Section
      id="diferenciais"
      eyebrow="Diferenciais"
      title="Feito para quem leva o próprio aprendizado a sério."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {items.map(({ icon: Icon, title, desc }) => (
          <article key={title} className="flex gap-5 rounded-2xl border border-border bg-surface/60 p-7">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-violet-100/70">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
