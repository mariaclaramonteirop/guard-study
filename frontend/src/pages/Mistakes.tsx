import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Mistake } from '../types';

function preview(text: string, limit = 110) {
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

export function Mistakes() {
  const load = useCallback(() => api.get<Mistake[]>('/mistakes'), []);
  const { data, loading, error, reload } = useFetch(load);

  async function remove(id: number) {
    await api.delete(`/mistakes/${id}`);
    await reload();
  }

  async function review(id: number) {
    await api.patch<Mistake>(`/mistakes/${id}/review`);
    await reload();
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Erros" subtitle="Gerencie os erros anotados e suas correcoes." />
        <Link to="/mistakes/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Novo erro
        </Link>
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.length === 0 && <EmptyState title="Nenhum erro registrado" description="Anote erros para revisar antes de repeti-los." />}
      <div className="grid gap-3">
        {data?.map((mistake) => (
          <article key={mistake.id} className="rounded border border-stone-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">{mistake.title}</h3>
                <p className="mt-1 text-sm text-stone-600">{preview(mistake.description)}</p>
                <p className="mt-2 text-sm text-guard">{preview(mistake.correction)}</p>
                <p className="mt-2 text-xs text-stone-500">Registro #{mistake.study_log_id}{mistake.checkpoint_id ? ` - Checkpoint #${mistake.checkpoint_id}` : ''}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/mistakes/${mistake.id}`} className="rounded border border-stone-300 px-3 py-1 text-sm">Ver completo</Link>
                <Link to={`/mistakes/${mistake.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                {mistake.is_reviewed ? (
                  <span className="rounded bg-green-100 px-3 py-1 text-sm text-guard">Revisado</span>
                ) : (
                  <button onClick={() => void review(mistake.id)} className="rounded border border-guard px-3 py-1 text-sm text-guard">Revisar</button>
                )}
                <button onClick={() => void remove(mistake.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
