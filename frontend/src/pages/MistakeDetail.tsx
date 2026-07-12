import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Mistake } from '../types';

export function MistakeDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(() => api.get<Mistake>(`/mistakes/${id}`));

  return (
    <>
      <Link to="/mistakes" className="mb-4 inline-block text-sm text-guard">Voltar para erros</Link>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <>
          <SectionTitle title={data.title} subtitle={`Erro #${data.id} - Registro #${data.study_log_id}`} />
          <article className="grid gap-4 rounded border border-stone-200 bg-white p-5">
            <section>
              <h3 className="text-sm font-semibold text-ink">O que aconteceu</h3>
              <p className="mt-2 whitespace-pre-wrap text-stone-700">{data.description}</p>
            </section>
            <section>
              <h3 className="text-sm font-semibold text-ink">Como corrigir</h3>
              <p className="mt-2 whitespace-pre-wrap text-guard">{data.correction}</p>
            </section>
            <div className="flex flex-wrap gap-2 text-sm text-stone-600">
              <span className="rounded bg-stone-100 px-2 py-1">Registro #{data.study_log_id}</span>
              {data.checkpoint_id && <span className="rounded bg-stone-100 px-2 py-1">Checkpoint #{data.checkpoint_id}</span>}
              <span className="rounded bg-stone-100 px-2 py-1">{data.is_reviewed ? 'Revisado' : 'Pendente'}</span>
            </div>
          </article>
        </>
      )}
    </>
  );
}
