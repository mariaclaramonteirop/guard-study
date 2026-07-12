import { BookOpen, Bug, Flag, FolderKanban, NotebookPen, Target, Timer } from 'lucide-react';
import { Section } from './Section';

const features = [
  { icon: BookOpen, name: 'Topics', desc: 'Mapeie tópicos e subtemas técnicos que você precisa dominar.' },
  { icon: NotebookPen, name: 'Study Logs', desc: 'Registre cada sessão de estudo com contexto e anotações.' },
  { icon: Flag, name: 'Checkpoints', desc: 'Marque avanços concretos dentro de cada tópico ou projeto.' },
  { icon: Bug, name: 'Mistakes', desc: 'Documente erros e revise-os até virarem repertório.' },
  { icon: FolderKanban, name: 'Projects', desc: 'Separe estudos pessoais dos projetos aplicados que você constrói.' },
  { icon: Timer, name: 'Timer & Sessões', desc: 'Estude com sessões cronometradas e histórico persistente.' },
  { icon: Target, name: 'Metas & Recompensas', desc: 'Defina objetivos e comemore cada conquista técnica.' },
];

export function Features() {
  return (
    <Section
      id="funcionalidades"
      eyebrow="Funcionalidades"
      title="Um sistema pensado para o estudo real de programação."
      description="Cada recurso existe para resolver um problema específico de quem estuda código todos os dias."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, name, desc }) => (
          <div key={name} className="glass-panel p-7">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="font-display text-lg font-semibold text-white">{name}</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-violet-100/70">{desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
