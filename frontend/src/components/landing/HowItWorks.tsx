import { Section } from './Section';

const steps = [
  ['01', 'Registre o estudo', 'Crie tópicos, abra uma sessão e capture anotações enquanto aprende.'],
  ['02', 'Crie checkpoints', 'Marque avanços concretos e transforme progresso em algo visível.'],
  ['03', 'Revise seus erros', 'Documente equívocos e volte a eles até se tornarem naturais.'],
  ['04', 'Meça sua evolução', 'Acompanhe horas, tópicos concluídos e projetos entregues.'],
  ['05', 'Acompanhe metas', 'Defina objetivos técnicos e comemore quando eles forem batidos.'],
];

export function HowItWorks() {
  return (
    <Section
      id="como-funciona"
      eyebrow="Como funciona"
      title="Um ciclo simples, aplicado com consistência."
      description="Do primeiro registro à revisão contínua, o Guardy Study te acompanha em cada etapa."
    >
      <ol className="relative space-y-6 border-l border-border pl-8">
        {steps.map(([number, title, desc]) => (
          <li key={number} className="relative">
            <span className="absolute -left-[41px] grid h-8 w-8 place-items-center rounded-full border border-border bg-surface font-display text-xs font-semibold text-primary">
              {number}
            </span>
            <div className="glass-panel rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-violet-100/75">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
