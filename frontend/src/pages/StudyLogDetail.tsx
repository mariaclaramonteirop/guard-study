import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { StudyLog } from '../types';

export function StudyLogDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(() => api.get<StudyLog>(`/study-logs/${id}`));

  return (
    <>
      <Link to="/study-logs" className="mb-4 inline-block text-sm text-guard">Voltar para registros</Link>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data && (
        <>
          <SectionTitle title={data.title} subtitle={`Registro #${data.id} - Topico #${data.topic_id}`} />
          <article className="rounded border border-stone-200 bg-white p-5">
            <div className="mb-4 flex flex-wrap gap-2 text-sm text-stone-600">
              <span className="rounded bg-stone-100 px-2 py-1">{data.studied_at}</span>
              <span className="rounded bg-stone-100 px-2 py-1">{data.duration_minutes} minutos</span>
            </div>
            <p className="whitespace-pre-wrap text-stone-700">{data.content}</p>
          </article>
        </>
      )}
    </>
  );
}
