import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Project, StudyGoal, StudySession } from '../types';

export function Goals() {
  const load = useCallback(async () => {
    const [goals, projects, sessions] = await Promise.all([
      api.get<StudyGoal[]>('/goals'),
      api.get<Project[]>('/projects'),
      api.get<StudySession[]>('/study-sessions'),
    ]);
    return { goals, projects, sessions };
  }, []);

  const { data, loading, error, reload } = useFetch(load);

  const projectById = useMemo(() => new Map((data?.projects ?? []).map((project) => [project.id, project])), [data]);

  async function completeGoal(id: number) {
    await api.patch(`/goals/${id}/complete`);
    await reload();
  }

  async function remove(id: number) {
    await api.delete(`/goals/${id}`);
    await reload();
  }

  const sortedGoals = useMemo(() => {
    return [...(data?.goals ?? [])].sort((a, b) => b.id - a.id);
  }, [data]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Metas" subtitle="Acompanhe progresso, recompensa e status das metas pessoais." />
        <Link to="/goals/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Nova meta
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {sortedGoals.length === 0 && <EmptyState title="Nenhuma meta cadastrada" description="Crie uma meta para acompanhar o progresso dos estudos." />}

      <div className="grid gap-3">
        {sortedGoals.map((goal) => {
          const relevantSessions = (data?.sessions ?? []).filter((session) => session.status === 'completed' && (goal.project_id ? session.project_id === goal.project_id : true));
          const minutes = relevantSessions.reduce((total, session) => total + session.actual_minutes, 0);
          const sessionsCount = relevantSessions.length;
          const progress = goal.target_minutes > 0 ? Math.min((minutes / goal.target_minutes) * 100, 100) : 0;
          const project = goal.project_id ? projectById.get(goal.project_id) : null;

          return (
            <article key={goal.id} className="rounded border border-stone-200 bg-white p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                    <span className="rounded bg-stone-100 px-2 py-1">#{goal.id}</span>
                    <span className="rounded bg-stone-100 px-2 py-1">{goal.status}</span>
                    {project && <span className="rounded bg-stone-100 px-2 py-1">{project.name}</span>}
                  </div>
                  <h3 className="mt-2 font-semibold text-ink">{goal.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">{goal.description || 'Sem descricao.'}</p>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-stone-100">
                    <div className="h-full rounded-full bg-violet-600" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-stone-500">
                    {minutes} min de {goal.target_minutes} min
                    {goal.target_sessions ? ` - ${sessionsCount}/${goal.target_sessions} sessoes` : ` - ${sessionsCount} sessoes`}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Recompensa: {goal.reward_title} - {goal.reward_points} ponto(s)
                  </p>
                  {goal.notes && <p className="mt-1 whitespace-pre-wrap text-xs text-stone-500">{goal.notes}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {goal.status !== 'achieved' && (
                    <button onClick={() => void completeGoal(goal.id)} className="rounded border border-violet-300 px-3 py-1 text-sm text-violet-900">
                      Concluir
                    </button>
                  )}
                  <Link to={`/goals/${goal.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                  <button onClick={() => void remove(goal.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">Excluir</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
