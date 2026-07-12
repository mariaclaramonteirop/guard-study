import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { getSessionUser } from '../api/session';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
import { BADGES } from '../config/badges';
import { useFetch } from '../hooks/useFetch';
import type {
  Checkpoint,
  DashboardSummary,
  Mistake,
  Project,
  Reward,
  StudyGoal,
  StudyLog,
  StudySession,
  Topic,
} from '../types';

type DashboardData = {
  summary: DashboardSummary;
  projects: Project[];
  topics: Topic[];
  logs: StudyLog[];
  sessions: StudySession[];
  checkpoints: Checkpoint[];
  mistakes: Mistake[];
  goals: StudyGoal[];
  rewards: Reward[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatShortDay(value: Date) {
  return value.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

function toDateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

const rewardCategoryLabels: Record<string, string> = {
  metas: 'Metas',
  constancia: 'Constancia',
  tempo: 'Tempo',
  revisao: 'Revisao',
  projetos: 'Projetos',
  exploracao: 'Exploracao',
  qualidade: 'Qualidade',
  colecao: 'Colecao',
};

function getRewardImage(reward: Reward) {
  return reward.image_url ?? BADGES.find((badge) => badge.key === reward.badge_key)?.image ?? null;
}

function getRewardDate(reward: Reward) {
  return reward.claimed_at ?? reward.unlocked_at;
}

function getRewardInitial(reward: Reward) {
  return (reward.title || reward.badge_key || 'I').slice(0, 1).toUpperCase();
}

function previewMarkdown(value: string | null, limit = 160) {
  if (!value) {
    return '';
  }

  return value.length > limit ? `${value.slice(0, limit).trim()}...` : value;
}

const recentMarkdownPreviewClass = 'mt-1 max-h-12 overflow-hidden break-words text-sm text-stone-600 [&_*]:my-0 [&_*]:max-w-full [&_*]:break-words [&_code]:break-all [&_pre]:hidden';

export function Dashboard() {
  const user = getSessionUser();

  const load = useCallback(async (): Promise<DashboardData> => {
    const [projects, topics, logs, checkpoints, mistakes, sessions, goals, rewards] = await Promise.all([
      api.get<Project[]>('/projects'),
      api.get<Topic[]>('/topics'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<Checkpoint[]>('/checkpoints'),
      api.get<Mistake[]>('/mistakes'),
      api.get<StudySession[]>('/study-sessions'),
      api.get<StudyGoal[]>('/goals'),
      api.get<Reward[]>('/rewards'),
    ]);

    return {
      summary: {
        projects: projects.length,
        topics: topics.length,
        studyLogs: logs.length,
        studySessions: sessions.length,
        studySessionMinutes: sessions.filter((session) => session.status === 'completed').reduce((total, session) => total + session.actual_minutes, 0),
        goalsActive: goals.filter((goal) => goal.status === 'active').length,
        rewardsClaimed: rewards.filter((reward) => reward.status === 'claimed').length,
        rewardPoints: rewards.filter((reward) => reward.status === 'claimed').reduce((total, reward) => total + reward.points, 0),
        checkpointsOpen: checkpoints.filter((item) => !item.is_completed).length,
        mistakesToReview: mistakes.filter((item) => !item.is_reviewed).length,
      },
      projects,
      topics,
      logs,
      sessions,
      checkpoints,
      mistakes,
      goals,
      rewards,
    };
  }, []);

  const { data, loading, error } = useFetch(load);

  const topicStats = data
    ? data.topics
        .map((topic) => {
          const logs = data.logs.filter((log) => log.topic_id === topic.id);
          const minutes = logs.reduce((total, log) => total + log.duration_minutes, 0);
          return { id: topic.id, label: topic.name, minutes, logs: logs.length };
        })
        .sort((a, b) => b.minutes - a.minutes)
    : [];

  const projectStats = data
    ? data.projects
        .map((project) => {
          const sessions = data.sessions.filter((session) => session.project_id === project.id && session.status === 'completed');
          const minutes = sessions.reduce((total, session) => total + session.actual_minutes, 0);
          return { id: project.id, label: project.name, minutes, sessions: sessions.length };
        })
        .sort((a, b) => b.minutes - a.minutes)
    : [];

  const recentLogs = data
    ? [...data.logs]
        .sort((a, b) => b.studied_at.localeCompare(a.studied_at))
        .slice(0, 4)
    : [];

  const recentCheckpoints = data ? [...data.checkpoints].sort((a, b) => b.id - a.id).slice(0, 4) : [];
  const recentMistakes = data ? [...data.mistakes].sort((a, b) => b.id - a.id).slice(0, 4) : [];
  const earnedRewards = data
    ? data.rewards
        .filter((reward) => reward.status !== 'locked')
        .sort((a, b) => {
          const dateA = getRewardDate(a);
          const dateB = getRewardDate(b);

          if (dateA && dateB) {
            return dateB.localeCompare(dateA);
          }

          if (dateA) {
            return -1;
          }

          if (dateB) {
            return 1;
          }

          return b.id - a.id;
        })
    : [];
  const latestReward = earnedRewards[0];

  const maxTopicMinutes = Math.max(...topicStats.map((item) => item.minutes), 0);
  const maxProjectMinutes = Math.max(...projectStats.map((item) => item.minutes), 0);
  const dailyStudyStats = data
    ? Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - (6 - index));

        const key = toDateKey(date);
        const minutes = data.sessions
          .filter((session) => session.status === 'completed' && session.ended_at?.slice(0, 10) === key)
          .reduce((total, session) => total + session.actual_minutes, 0);

        return {
          key,
          label: formatShortDay(date),
          minutes,
        };
      })
    : [];
  const maxDailyMinutes = Math.max(...dailyStudyStats.map((item) => item.minutes), 0);
  const completedCheckpoints = data ? data.checkpoints.filter((checkpoint) => checkpoint.is_completed).length : 0;
  const openCheckpoints = data ? data.checkpoints.length - completedCheckpoints : 0;
  const checkpointTotal = completedCheckpoints + openCheckpoints;
  const checkpointCompletionPercent = checkpointTotal > 0 ? Math.round((completedCheckpoints / checkpointTotal) * 100) : 0;
  const checkpointStroke = checkpointTotal > 0 ? `${checkpointCompletionPercent} ${100 - checkpointCompletionPercent}` : '0 100';

  return (
    <>
      <SectionTitle title="Dashboard" subtitle="Resumo rapido da sua evolucao nos estudos." />
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      {data && (
        <div className="space-y-6">
          <section className="rounded border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-stone-50 p-5 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-violet-700">Painel de estudos</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">
                  Olá, {user?.name ?? 'Fukano'}, o que vamos estudar hoje?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  Aqui você acompanha tempo estudado, checkpoints, revisões e o que ainda precisa de atenção.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link to="/study-logs/new" className="rounded bg-guard px-4 py-2 text-sm font-medium text-white">
                  Novo registro
                </Link>
                <Link to="/checkpoints/new" className="rounded border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-ink">
                  Novo checkpoint
                </Link>
                <Link to="/users/permissions" className="rounded border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-ink">
                  Permissões
                </Link>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Projetos" value={data.summary.projects} tone="violet" />
            <StatCard label="Topicos" value={data.summary.topics} />
            <StatCard label="Registros" value={data.summary.studyLogs} />
            <StatCard label="Checkpoints abertos" value={data.summary.checkpointsOpen} tone="amber" />
            <StatCard label="Erros para revisar" value={data.summary.mistakesToReview} tone="amber" />
          </div>

          <section className="rounded border border-stone-200 bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard label="Sessoes de estudo" value={data.summary.studySessions} tone="violet" />
              <StatCard label="Minutos nas sessoes" value={data.summary.studySessionMinutes} />
              <StatCard label="Metas ativas" value={data.summary.goalsActive} tone="violet" />
              <StatCard label="Recompensas resgatadas" value={data.summary.rewardsClaimed} />
              <StatCard label="Pontos ganhos" value={data.summary.rewardPoints} tone="amber" />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr]">
            <div className="rounded border border-violet-200 bg-gradient-to-br from-violet-950 via-violet-900 to-stone-950 p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-200">Ultima insignia conquistada</p>
                  {latestReward ? (
                    <>
                      <h3 className="mt-2 text-xl font-semibold">{latestReward.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-violet-100">
                        {latestReward.description || latestReward.notes || 'Conquista registrada no seu progresso de estudo.'}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-2 text-xl font-semibold">Nenhuma insignia ainda</h3>
                      <p className="mt-2 text-sm leading-relaxed text-violet-100">
                        Complete metas, checkpoints, sessoes e revisoes para comecar sua colecao.
                      </p>
                    </>
                  )}
                </div>

                <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded border border-white/20 bg-white/10 text-3xl font-semibold text-violet-100">
                  {latestReward && getRewardImage(latestReward) ? (
                    <img src={getRewardImage(latestReward) ?? ''} alt={latestReward.title} className="h-full w-full object-contain" />
                  ) : (
                    getRewardInitial(latestReward ?? { title: 'Insignia', badge_key: null } as Reward)
                  )}
                </div>
              </div>

              {latestReward && (
                <div className="mt-5 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-white/10 px-2 py-1 text-violet-100">
                    {rewardCategoryLabels[latestReward.category] ?? latestReward.category}
                  </span>
                  <span className="rounded bg-white/10 px-2 py-1 text-violet-100">
                    {latestReward.points} ponto(s)
                  </span>
                  {getRewardDate(latestReward) && (
                    <span className="rounded bg-white/10 px-2 py-1 text-violet-100">
                      {formatDate(getRewardDate(latestReward) ?? '')}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="rounded border border-stone-200 bg-white p-5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">Insignias conquistadas</h3>
                  <p className="text-sm text-stone-600">Suas recompensas desbloqueadas aparecem aqui.</p>
                </div>
                <Link to="/rewards" className="shrink-0 text-sm font-medium text-violet-700 hover:text-violet-900">
                  Ver todas
                </Link>
              </div>

              {earnedRewards.length === 0 ? (
                <p className="rounded border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-600">
                  Nenhuma insignia conquistada por enquanto.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-6">
                  {earnedRewards.slice(0, 12).map((reward) => {
                    const image = getRewardImage(reward);

                    return (
                      <div
                        key={reward.id}
                        className="grid gap-2 rounded border border-stone-200 bg-stone-50 p-2 text-center"
                        title={reward.title}
                      >
                        <span className="grid aspect-square place-items-center overflow-hidden rounded bg-white text-lg font-semibold text-violet-700">
                          {image ? <img src={image} alt={reward.title} className="h-full w-full object-contain" /> : getRewardInitial(reward)}
                        </span>
                        <span className="line-clamp-2 min-h-8 text-xs font-medium leading-4 text-stone-700">
                          {reward.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded border border-stone-200 bg-white p-5">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">Tempo estudado</h3>
                  <p className="text-sm text-stone-600">Minutos registrados nas sessoes dos ultimos 7 dias.</p>
                </div>
                <span className="rounded bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                  {dailyStudyStats.reduce((total, item) => total + item.minutes, 0)} min
                </span>
              </div>

              <div className="flex h-56 items-end gap-3 rounded border border-stone-100 bg-stone-50 px-4 py-5">
                {dailyStudyStats.map((item) => {
                  const height = maxDailyMinutes > 0 ? Math.max((item.minutes / maxDailyMinutes) * 100, item.minutes > 0 ? 12 : 0) : 0;

                  return (
                    <div key={item.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-xs font-medium text-stone-500">{item.minutes}</span>
                      <div className="flex h-36 w-full items-end">
                        <div
                          className="w-full rounded-t bg-violet-500 transition hover:bg-violet-700"
                          style={{ height: `${height}%` }}
                          title={`${item.label}: ${item.minutes} minuto(s)`}
                        />
                      </div>
                      <span className="truncate text-xs text-stone-500">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded border border-stone-200 bg-white p-5">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-ink">Checkpoints</h3>
                <p className="text-sm text-stone-600">Progresso entre abertos e concluidos.</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative h-44 w-44">
                  <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="5" />
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#7c3aed"
                      strokeWidth="5"
                      strokeDasharray={checkpointStroke}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <strong className="block text-3xl text-ink">{checkpointCompletionPercent}%</strong>
                      <span className="text-xs text-stone-500">concluido</span>
                    </div>
                  </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-3 text-sm">
                  <div className="rounded bg-violet-50 p-3">
                    <p className="text-stone-500">Concluidos</p>
                    <strong className="mt-1 block text-xl text-violet-800">{completedCheckpoints}</strong>
                  </div>
                  <div className="rounded bg-amber-50 p-3">
                    <p className="text-stone-500">Abertos</p>
                    <strong className="mt-1 block text-xl text-amber-700">{openCheckpoints}</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded border border-stone-200 bg-white p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-ink">Atividade recente</h3>
                <p className="text-sm text-stone-600">Os itens mais novos do seu fluxo de estudo.</p>
              </div>

              <div className="grid min-w-0 gap-4 md:grid-cols-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-ink">Registros</h4>
                  <div className="mt-3 space-y-3">
                    {recentLogs.length === 0 ? (
                      <p className="text-sm text-stone-500">Nenhum registro encontrado.</p>
                    ) : (
                      recentLogs.map((log) => (
                        <article key={log.id} className="min-w-0 overflow-hidden rounded border border-stone-200 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-medium text-ink">{log.title}</p>
                              <MarkdownPreview content={previewMarkdown(log.content)} className={recentMarkdownPreviewClass} />
                            </div>
                            <span className="shrink-0 rounded bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700">
                              {log.duration_minutes} min
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-stone-500">
                            {formatDate(log.studied_at)}
                          </p>
                        </article>
                      ))
                    )}
                  </div>
                </div>

                <div className="grid min-w-0 gap-4">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-ink">Checkpoints recentes</h4>
                    <div className="mt-3 space-y-3">
                      {recentCheckpoints.length === 0 ? (
                        <p className="text-sm text-stone-500">Nenhum checkpoint encontrado.</p>
                      ) : (
                        recentCheckpoints.map((checkpoint) => (
                          <article key={checkpoint.id} className="min-w-0 overflow-hidden rounded border border-stone-200 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="min-w-0 truncate font-medium text-ink">{checkpoint.title}</p>
                              <span className={`rounded px-2 py-1 text-xs font-medium ${
                                checkpoint.is_completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {checkpoint.is_completed ? 'concluido' : 'aberto'}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-stone-500">
                              ID {checkpoint.id}
                            </p>
                            {checkpoint.description && (
                              <MarkdownPreview content={previewMarkdown(checkpoint.description, 120)} className={recentMarkdownPreviewClass} />
                            )}
                          </article>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-ink">Erros recentes</h4>
                    <div className="mt-3 space-y-3">
                      {recentMistakes.length === 0 ? (
                        <p className="text-sm text-stone-500">Nenhum erro encontrado.</p>
                      ) : (
                        recentMistakes.map((mistake) => (
                          <article key={mistake.id} className="min-w-0 overflow-hidden rounded border border-stone-200 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="min-w-0 truncate font-medium text-ink">{mistake.title}</p>
                              <span className={`rounded px-2 py-1 text-xs font-medium ${
                                mistake.is_reviewed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {mistake.is_reviewed ? 'revisado' : 'pendente'}
                              </span>
                            </div>
                            <MarkdownPreview content={previewMarkdown(mistake.description)} className={recentMarkdownPreviewClass} />
                          </article>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="grid gap-4">
              <div className="rounded border border-stone-200 bg-white p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-ink">Topicos em foco</h3>
                  <p className="text-sm text-stone-600">Tempo acumulado por assunto.</p>
                </div>

                {topicStats.length === 0 ? (
                  <p className="text-sm text-stone-600">Ainda nao ha registros para montar o grafico.</p>
                ) : (
                  <div className="space-y-3">
                    {topicStats.slice(0, 5).map((item) => {
                      const width = maxTopicMinutes > 0 ? Math.max((item.minutes / maxTopicMinutes) * 100, 8) : 0;
                      return (
                        <div key={item.id} className="grid gap-2">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="min-w-0 truncate font-medium text-ink">{item.label}</span>
                            <span className="shrink-0 text-stone-500">
                              {item.minutes} min
                            </span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                            <div className="h-full rounded-full bg-violet-500" style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded border border-stone-200 bg-white p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-ink">Projetos em destaque</h3>
                  <p className="text-sm text-stone-600">Mais tempo investido nos projetos ativos.</p>
                </div>

                {projectStats.length === 0 ? (
                  <p className="text-sm text-stone-600">Ainda nao ha projetos com tempo registrado.</p>
                ) : (
                  <div className="space-y-3">
                    {projectStats.slice(0, 5).map((item) => {
                      const width = maxProjectMinutes > 0 ? Math.max((item.minutes / maxProjectMinutes) * 100, 8) : 0;
                      return (
                        <div key={item.id} className="grid gap-2">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="min-w-0 truncate font-medium text-ink">{item.label}</span>
                            <span className="shrink-0 text-stone-500">
                              {item.sessions} sessao(oes)
                            </span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                            <div className="h-full rounded-full bg-violet-700" style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </section>
        </div>
      )}
    </>
  );
}
