import { Section } from './Section';

const steps = [
  ['01', 'Registre o estudo', 'Crie topicos, abra uma sessao e capture anotacoes enquanto aprende.'],
  ['02', 'Crie checkpoints', 'Marque avancos concretos e transforme progresso em algo visivel.'],
  ['03', 'Revise seus erros', 'Documente equivocos e volte a eles ate se tornarem naturais.'],
  ['04', 'Meca sua evolucao', 'Acompanhe horas, topicos concluidos e projetos entregues.'],
  ['05', 'Acompanhe metas', 'Defina objetivos tecnicos e comemore quando eles forem batidos.'],
];

export function HowItWorks() {
  return (
    <Section
      id="como-funciona"
      eyebrow="Como funciona"
      title="Um ciclo simples, aplicado com consistencia."
      description="Do primeiro registro a revisao continua, o Guardy Study te acompanha em cada etapa."
    >
      <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {steps.map(([number, title, desc]) => (
          <li key={number} className="glass-panel rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-surface font-display text-sm font-semibold text-primary">
                {number}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-violet-100/75">{desc}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
