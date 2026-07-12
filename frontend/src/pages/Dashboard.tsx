import { useCallback } from 'react';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { StatCard } from '../components/StatCard';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, DashboardSummary, Mistake, StudyLog, Topic } from '../types';

export function Dashboard() {
  const load = useCallback(async (): Promise<DashboardSummary> => {
    const [topics, logs, checkpoints, mistakes] = await Promise.all([
      api.get<Topic[]>('/topics'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<Checkpoint[]>('/checkpoints'),
      api.get<Mistake[]>('/mistakes'),
    ]);

    return {
      topics: topics.length,
      studyLogs: logs.length,
      checkpointsOpen: checkpoints.filter((item) => !item.is_completed).length,
      mistakesToReview: mistakes.filter((item) => !item.is_reviewed).length,
    };
  }, []);

  const { data, loading, error } = useFetch(load);

  return (
    <>
      <SectionTitle title="Dashboard" subtitle="Resumo rapido da sua evolucao nos estudos." />
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Topicos" value={data.topics} tone="violet" />
          <StatCard label="Registros" value={data.studyLogs} />
          <StatCard label="Checkpoints abertos" value={data.checkpointsOpen} tone="amber" />
          <StatCard label="Erros para revisar" value={data.mistakesToReview} tone="amber" />
        </div>
      )}
    </>
  );
}
