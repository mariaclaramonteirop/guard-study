import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { StudyLog } from '../types';

function preview(text: string, limit = 120) {
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

export function StudyLogs() {
  const load = useCallback(() => api.get<StudyLog[]>('/study-logs'), []);
  const { data, loading, error, reload } = useFetch(load);

  async function remove(id: number) {
    await api.delete(`/study-logs/${id}`);
    await reload();
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Registros de estudo" subtitle="Gerencie as sessoes registradas." />
        <Link to="/study-logs/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Novo registro
        </Link>
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.length === 0 && <EmptyState title="Nenhum registro" description="Registre sua proxima sessao de estudos." />}
      <div className="grid gap-3">
        {data?.map((log) => (
          <article key={log.id} className="rounded border border-stone-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-semibold">{log.title}</h3>
                <p className="text-sm text-stone-600">{preview(log.content)}</p>
                <p className="mt-2 text-xs text-stone-500">{log.duration_minutes} min em {log.studied_at} - Topico #{log.topic_id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/study-logs/${log.id}`} className="rounded border border-stone-300 px-3 py-1 text-sm">Ver completo</Link>
                <Link to={`/study-logs/${log.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                <button onClick={() => void remove(log.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
