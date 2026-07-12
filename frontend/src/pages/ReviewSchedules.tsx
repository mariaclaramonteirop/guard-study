import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { ReviewSchedule } from '../types';

export function ReviewSchedules() {
  const load = useCallback(() => api.get<ReviewSchedule[]>('/review-schedules'), []);
  const { data, loading, error, reload } = useFetch(load);

  async function complete(id: number) {
    await api.patch<ReviewSchedule>(`/review-schedules/${id}/complete`);
    await reload();
  }

  async function remove(id: number) {
    await api.delete(`/review-schedules/${id}`);
    await reload();
  }

  const sorted = [...(data ?? [])].sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Revisoes" subtitle="Gerencie revisoes agendadas para os estudos." />
        <Link to="/review-schedules/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Nova revisao
        </Link>
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {sorted.length === 0 && !loading && <EmptyState title="Nenhuma revisao agendada" description="Crie uma revisao para manter o conteudo fresco." />}

      <div className="grid gap-3">
        {sorted.map((review) => (
          <article key={review.id} className="rounded border border-stone-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-stone-500">{review.scheduled_for}</p>
                <h3 className="font-semibold text-ink">{review.title}</h3>
                {review.notes ? (
                  <MarkdownPreview content={review.notes} className="mt-1 text-sm text-stone-600" />
                ) : (
                  <p className="mt-1 text-sm text-stone-600">Sem notas.</p>
                )}
                <p className="mt-2 text-xs text-stone-500">
                  Registro #{review.study_log_id}
                  {review.checkpoint_id ? ` - Checkpoint #${review.checkpoint_id}` : ''}
                  {review.mistake_id ? ` - Erro #${review.mistake_id}` : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/review-schedules/${review.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                {review.status === 'done' ? (
                  <span className="w-fit rounded bg-green-100 px-3 py-1 text-sm text-guard">Concluida</span>
                ) : (
                  <button onClick={() => void complete(review.id)} className="w-fit rounded border border-guard px-3 py-1 text-sm text-guard">Concluir</button>
                )}
                <button onClick={() => void remove(review.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
