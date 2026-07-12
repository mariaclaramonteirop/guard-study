export type ModuleKey =
  | 'dashboard'
  | 'projects'
  | 'study_sessions'
  | 'study_goals'
  | 'rewards'
  | 'topics'
  | 'study_logs'
  | 'checkpoints'
  | 'mistakes'
  | 'review_schedules'
  | 'checklists'
  | 'users';

export type ModuleConfig = {
  key: ModuleKey;
  label: string;
  description: string;
  managerOnly?: boolean;
};

export const MODULES: ModuleConfig[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'Resumo geral do painel.' },
  { key: 'projects', label: 'Projetos', description: 'Organização dos projetos de estudo.' },
  { key: 'study_sessions', label: 'Sessões', description: 'Controle de tempo e pomodoro.' },
  { key: 'study_goals', label: 'Metas', description: 'Objetivos e acompanhamento.' },
  { key: 'rewards', label: 'Recompensas', description: 'Recompensas e conquistas.' },
  { key: 'topics', label: 'Tópicos', description: 'Assuntos e trilhas de aprendizado.' },
  { key: 'study_logs', label: 'Registros', description: 'Anotações e relatos de estudo.' },
  { key: 'checkpoints', label: 'Checkpoints', description: 'Marcos e linha do tempo.' },
  { key: 'mistakes', label: 'Erros', description: 'Erros, correções e revisões.' },
  { key: 'review_schedules', label: 'Revisões', description: 'Agendamentos de revisão.' },
  { key: 'checklists', label: 'Checklists', description: 'Itens de conferência por registro.' },
  { key: 'users', label: 'Usuários', description: 'Gerenciamento de usuários.', managerOnly: true },
];
