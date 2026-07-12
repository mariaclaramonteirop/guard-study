import { useCallback } from 'react';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, DashboardSummary, Mistake, Project, Reward, StudyGoal, StudyLog, StudySession, Topic } from '../types';

export function Dashboard() {
  const load = useCallback(async (): Promise<{
    summary: DashboardSummary;
    projects: Project[];
    topics: Topic[];
    logs: StudyLog[];
    sessions: StudySession[];
    goals: StudyGoal[];
    rewards: Reward[];
  }> => {
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
          return {
            id: topic.id,
            label: topic.name,
            minutes,
            sessions: logs.length,
          };
        })
        .sort((a, b) => b.minutes - a.minutes)
    : [];

  const projectStats = data
    ? data.projects
        .map((project) => {
          const sessions = data.sessions.filter((session) => session.project_id === project.id && session.status === 'completed');
          const minutes = sessions.reduce((total, session) => total + session.actual_minutes, 0);
          return {
            id: project.id,
            label: project.name,
            minutes,
            sessions: sessions.length,
          };
        })
        .sort((a, b) => b.minutes - a.minutes)
    : [];

  const maxTopicMinutes = Math.max(...topicStats.map((item) => item.minutes), 0);
  const maxProjectMinutes = Math.max(...projectStats.map((item) => item.minutes), 0);

  return (
    <>
      <SectionTitle title="Dashboard" subtitle="Resumo rapido da sua evolucao nos estudos." />
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <div className="space-y-6">
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

          <section className="rounded border border-stone-200 bg-white p-4">
            <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Minutos por topico</h2>
                <p className="text-sm text-stone-600">Carga de estudo acumulada por assunto.</p>
              </div>
              <p className="text-sm text-stone-500">Baseado em registros de estudo.</p>
            </div>

            {topicStats.length === 0 ? (
              <p className="text-sm text-stone-600">Ainda nao ha registros para montar o grafico.</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <div className="space-y-3">
                  {topicStats.map((item) => {
                    const width = maxTopicMinutes > 0 ? Math.max((item.minutes / maxTopicMinutes) * 100, 8) : 0;
                    return (
                      <div key={item.id} className="grid gap-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="min-w-0 truncate font-medium text-ink">{item.label}</span>
                          <span className="shrink-0 text-stone-500">
                            {item.minutes} min · {item.sessions} registro(s)
                          </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                          <div className="h-full rounded-full bg-violet-500" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded border border-violet-200 bg-violet-50 p-4">
                  <h3 className="text-sm font-semibold text-violet-950">Leitura rapida</h3>
                  <ul className="mt-3 space-y-3 text-sm text-violet-950">
                    {topicStats.slice(0, 3).map((item, index) => (
                      <li key={item.id} className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate">
                          {index + 1}. {item.label}
                        </span>
                        <strong>{item.minutes} min</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          <section className="rounded border border-stone-200 bg-white p-4">
            <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ink">Minutos por projeto</h2>
                <p className="text-sm text-stone-600">Visao consolidada por projeto de estudo.</p>
              </div>
              <p className="text-sm text-stone-500">Baseado nas sessoes concluidas.</p>
            </div>

            {projectStats.length === 0 ? (
              <p className="text-sm text-stone-600">Ainda nao ha projetos com tempo registrado.</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <div className="space-y-3">
                  {projectStats.map((item) => {
                    const width = maxProjectMinutes > 0 ? Math.max((item.minutes / maxProjectMinutes) * 100, 8) : 0;
                    return (
                      <div key={item.id} className="grid gap-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="min-w-0 truncate font-medium text-ink">{item.label}</span>
                          <span className="shrink-0 text-stone-500">
                            {item.minutes} min · {item.sessions} sessao(oes)
                          </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                          <div className="h-full rounded-full bg-violet-700" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded border border-stone-200 bg-stone-50 p-4">
                  <h3 className="text-sm font-semibold text-ink">Projetos em destaque</h3>
                  <ul className="mt-3 space-y-3 text-sm text-stone-700">
                    {projectStats.slice(0, 3).map((item, index) => (
                      <li key={item.id} className="flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate">
                          {index + 1}. {item.label}
                        </span>
                        <strong>{item.minutes} min</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
