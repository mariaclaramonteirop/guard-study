import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { getSessionUser } from '../api/session';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
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

  const maxTopicMinutes = Math.max(...topicStats.map((item) => item.minutes), 0);
  const maxProjectMinutes = Math.max(...projectStats.map((item) => item.minutes), 0);

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

          <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded border border-stone-200 bg-white p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-ink">Atividade recente</h3>
                <p className="text-sm text-stone-600">Os itens mais novos do seu fluxo de estudo.</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-ink">Registros</h4>
                  <div className="mt-3 space-y-3">
                    {recentLogs.length === 0 ? (
                      <p className="text-sm text-stone-500">Nenhum registro encontrado.</p>
                    ) : (
                      recentLogs.map((log) => (
                        <article key={log.id} className="rounded border border-stone-200 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-medium text-ink">{log.title}</p>
                              <p className="mt-1 line-clamp-2 text-sm text-stone-600">{log.content}</p>
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

                <div className="grid gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-ink">Checkpoints recentes</h4>
                    <div className="mt-3 space-y-3">
                      {recentCheckpoints.length === 0 ? (
                        <p className="text-sm text-stone-500">Nenhum checkpoint encontrado.</p>
                      ) : (
                        recentCheckpoints.map((checkpoint) => (
                          <article key={checkpoint.id} className="rounded border border-stone-200 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate font-medium text-ink">{checkpoint.title}</p>
                              <span className={`rounded px-2 py-1 text-xs font-medium ${
                                checkpoint.is_completed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {checkpoint.is_completed ? 'concluido' : 'aberto'}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-stone-500">
                              ID {checkpoint.id}
                            </p>
                          </article>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-ink">Erros recentes</h4>
                    <div className="mt-3 space-y-3">
                      {recentMistakes.length === 0 ? (
                        <p className="text-sm text-stone-500">Nenhum erro encontrado.</p>
                      ) : (
                        recentMistakes.map((mistake) => (
                          <article key={mistake.id} className="rounded border border-stone-200 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate font-medium text-ink">{mistake.title}</p>
                              <span className={`rounded px-2 py-1 text-xs font-medium ${
                                mistake.is_reviewed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {mistake.is_reviewed ? 'revisado' : 'pendente'}
                              </span>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm text-stone-600">{mistake.description}</p>
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
