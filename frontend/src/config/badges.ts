export type BadgeDefinition = {
  key: string;
  title: string;
  category: string;
  description: string;
  image: string;
};

export const BADGES: BadgeDefinition[] = [
  {
    key: 'primeira-meta',
    title: 'Primeira Meta',
    category: 'metas',
    description: 'Primeira conquista de objetivo.',
    image: '/badges/primeira-meta-primeira-conquista-de-objetivo.png',
  },
  {
    key: 'meta-cumprida',
    title: 'Meta Cumprida',
    category: 'metas',
    description: 'Meta batida com sucesso.',
    image: '/badges/meta-cumprida-meta-batida.png',
  },
  {
    key: 'sequencia-7-dias',
    title: 'Sequência 7 Dias',
    category: 'constancia',
    description: 'Consistência semanal.',
    image: '/badges/sequencia-7-dias-consistencia.png',
  },
  {
    key: 'sequencia-30-dias',
    title: 'Sequência 30 Dias',
    category: 'constancia',
    description: 'Consistência alta.',
    image: '/badges/sequencia-30-dias-consistencia-alta.png',
  },
  {
    key: '100-minutos',
    title: '100 Minutos',
    category: 'tempo',
    description: 'Tempo acumulado inicial.',
    image: '/badges/100-minutos-tempo-acumulado.png',
  },
  {
    key: '500-minutos',
    title: '500 Minutos',
    category: 'tempo',
    description: 'Tempo acumulado avançado.',
    image: '/badges/500-minutos-tempo-acumulado-avancado.png',
  },
  {
    key: 'erro-revisado',
    title: 'Erro Revisado',
    category: 'revisao',
    description: 'Revisão de erro concluída.',
    image: '/badges/erro-revisado-revisao-de-erro.png',
  },
  {
    key: 'checkpoint-concluido',
    title: 'Checkpoint Concluído',
    category: 'revisao',
    description: 'Avanço de aprendizado concluído.',
    image: '/badges/checkpoint-concluido-avanco-de-aprendizado.png',
  },
  {
    key: 'projeto-entregue',
    title: 'Projeto Entregue',
    category: 'projetos',
    description: 'Entrega de projeto finalizada.',
    image: '/badges/projeto-entregue-entrega-de-projeto.png',
  },
  {
    key: 'explorador-de-topicos',
    title: 'Explorador de Tópicos',
    category: 'exploracao',
    description: 'Estudo de novos tópicos.',
    image: '/badges/explorador-de-topicos-estudo-de-novos-topicos.png',
  },
  {
    key: 'registro-completo',
    title: 'Registro Completo',
    category: 'qualidade',
    description: 'Anotação bem preenchida.',
    image: '/badges/registro-completo-anotacao-bem-preenchida.png',
  },
  {
    key: 'colecionador',
    title: 'Colecionador',
    category: 'colecao',
    description: 'Coleção fechada.',
    image: '/badges/colecionador-badge-especial-por-colecao-fechada.png',
  },
];
