import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Topic } from '../types';

function preview(text: string | null, limit = 100) {
  if (!text) return 'Sem descricao.';
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

export function Topics() {
  const load = useCallback(() => api.get<Topic[]>('/topics'), []);
  const { data, loading, error, reload } = useFetch(load);

  async function remove(id: number) {
    await api.delete(`/topics/${id}`);
    await reload();
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Topicos" subtitle="Gerencie os assuntos que voce esta estudando." />
        <Link to="/topics/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Novo topico
        </Link>
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.length === 0 && <EmptyState title="Nenhum topico cadastrado" description="Crie o primeiro topico para agrupar seus estudos." />}
      <div className="grid gap-3">
        {data?.map((topic) => (
          <article key={topic.id} className="rounded border border-stone-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-semibold">{topic.name}</h3>
                <p className="text-sm text-stone-600">{preview(topic.description)}</p>
                <span className="mt-2 inline-block rounded bg-stone-100 px-2 py-1 text-xs">{topic.status}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/topics/${topic.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                <button onClick={() => void remove(topic.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
