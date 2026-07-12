import { Section } from './Section';
import { AlertTriangle, Compass, LineChart, RefreshCcw, Target, Trophy } from 'lucide-react';

const items = [
  { icon: Compass, title: 'Organize seus estudos', desc: 'Estruture tópicos, subtemas e projetos em um único lugar coerente.' },
  { icon: LineChart, title: 'Acompanhe sua evolução', desc: 'Veja o que aprendeu, quanto estudou e onde precisa avançar.' },
  { icon: AlertTriangle, title: 'Registre erros', desc: 'Transforme cada equívoco em um ponto claro de aprendizado.' },
  { icon: RefreshCcw, title: 'Planeje revisões', desc: 'Reforce conteúdos com revisões cíclicas e consistentes.' },
  { icon: Target, title: 'Defina metas', desc: 'Estabeleça objetivos técnicos com prazos e critérios claros.' },
  { icon: Trophy, title: 'Ganhe recompensas', desc: 'Comemore conquistas reais que refletem progresso técnico.' },
];

export function Benefits() {
  return (
    <Section
      id="beneficios"
      eyebrow="Benefícios"
      title="Estudo com propósito, não com ansiedade."
      description="O Guardy Study substitui abas soltas, cadernos esquecidos e planilhas improvisadas por um fluxo pensado para quem quer evoluir de verdade."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <article key={title} className="glass-panel rounded-2xl p-6">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-violet-100/70">{desc}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
