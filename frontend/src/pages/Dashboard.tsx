import { useCallback } from 'react';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, DashboardSummary, Mistake, StudyLog, Topic } from '../types';

export function Dashboard() {
  const load = useCallback(async (): Promise<{
    summary: DashboardSummary;
    topics: Topic[];
    logs: StudyLog[];
  }> => {
    const [topics, logs, checkpoints, mistakes] = await Promise.all([
      api.get<Topic[]>('/topics'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<Checkpoint[]>('/checkpoints'),
      api.get<Mistake[]>('/mistakes'),
    ]);

    return {
      summary: {
        topics: topics.length,
        studyLogs: logs.length,
        checkpointsOpen: checkpoints.filter((item) => !item.is_completed).length,
        mistakesToReview: mistakes.filter((item) => !item.is_reviewed).length,
      },
      topics,
      logs,
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

  const maxMinutes = Math.max(...topicStats.map((item) => item.minutes), 0);

  return (
    <>
      <SectionTitle title="Dashboard" subtitle="Resumo rapido da sua evolucao nos estudos." />
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Topicos" value={data.summary.topics} tone="violet" />
          <StatCard label="Registros" value={data.summary.studyLogs} />
          <StatCard label="Checkpoints abertos" value={data.summary.checkpointsOpen} tone="amber" />
          <StatCard label="Erros para revisar" value={data.summary.mistakesToReview} tone="amber" />
        </div>

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
                    const width = maxMinutes > 0 ? Math.max((item.minutes / maxMinutes) * 100, 8) : 0;
                    return (
                      <div key={item.id} className="grid gap-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="min-w-0 truncate font-medium text-ink">{item.label}</span>
                          <span className="shrink-0 text-stone-500">
                            {item.minutes} min · {item.sessions} registro(s)
                          </span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-700 to-violet-400"
                            style={{ width: `${width}%` }}
                          />
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
        </div>
      )}
    </>
  );
}
