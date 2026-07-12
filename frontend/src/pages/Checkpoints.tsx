import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, Mistake, ReviewSchedule, StudyLog, Topic } from '../types';

export function Checkpoints() {
  const load = useCallback(async () => {
    const [topics, checkpoints, logs, mistakes, reviews] = await Promise.all([
      api.get<Topic[]>('/topics'),
      api.get<Checkpoint[]>('/checkpoints'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<Mistake[]>('/mistakes'),
      api.get<ReviewSchedule[]>('/review-schedules'),
    ]);
    return { topics, checkpoints, logs, mistakes, reviews };
  }, []);

  const { data, loading, error, reload } = useFetch(load);

  async function complete(id: number) {
    await api.patch<Checkpoint>(`/checkpoints/${id}/complete`);
    await reload();
  }

  async function remove(id: number) {
    await api.delete(`/checkpoints/${id}`);
    await reload();
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Checkpoints" subtitle="Acompanhe marcos ligados a registros, erros e revisoes." />
        <Link to="/checkpoints/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Novo checkpoint
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.checkpoints.length === 0 && <EmptyState title="Nenhum checkpoint" description="Crie um marco simples para medir sua evolucao." />}

      {data && data.checkpoints.length > 0 && (
        <>
          <div className="rounded border border-stone-200 bg-white p-4 md:p-5">
            <div className="relative grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] md:gap-5">
              <div className="absolute bottom-0 left-7 top-0 w-0.5 bg-stone-200 md:left-8 md:right-8 md:top-7 md:h-0.5 md:w-auto" />
              {data.checkpoints.map((checkpoint) => {
                const log = data.logs.find((item) => item.id === checkpoint.study_log_id);
                const checkpointMistakes = data.mistakes.filter((item) => item.checkpoint_id === checkpoint.id || item.study_log_id === checkpoint.study_log_id);
                const checkpointReviews = data.reviews.filter((item) => item.checkpoint_id === checkpoint.id || item.study_log_id === checkpoint.study_log_id);

                return (
                  <div key={checkpoint.id} className="group relative grid grid-cols-[56px_1fr] gap-3 md:flex md:flex-col md:items-center md:text-center">
                    <button
                      onClick={() => !checkpoint.is_completed && void complete(checkpoint.id)}
                      className={`z-10 h-14 w-14 rounded-full border-4 bg-white text-sm font-semibold ${
                        checkpoint.is_completed ? 'border-guard text-guard' : 'border-amber text-amber'
                      }`}
                    >
                      {checkpoint.id}
                    </button>
                    <div className="min-w-0 rounded border border-stone-100 bg-stone-50 p-3 md:border-0 md:bg-transparent md:p-0">
                      <h3 className="text-sm font-semibold">{checkpoint.title}</h3>
                      <p className="mt-1 text-xs text-stone-500">{checkpoint.is_completed ? 'Completo' : 'Aberto'}</p>
                    </div>
                    <div className="pointer-events-none z-20 col-span-2 hidden rounded border border-stone-200 bg-ink p-4 text-left text-white shadow-xl group-hover:block md:absolute md:left-1/2 md:top-20 md:w-72 md:-translate-x-1/2">
                      <p className="text-sm font-semibold">{checkpoint.title}</p>
                      <p className="mt-1 whitespace-pre-wrap text-xs text-stone-300">{checkpoint.description || 'Sem descricao.'}</p>
                      <div className="mt-3 border-t border-white/10 pt-3">
                        <p className="text-xs font-semibold text-stone-200">Registro relacionado</p>
                        <p className="mt-1 text-sm">{log ? log.title : 'Registro nao encontrado'}</p>
                        {log && <p className="mt-1 text-xs text-stone-300">{log.studied_at} - {log.duration_minutes} min</p>}
                      </div>
                      <div className="mt-3 border-t border-white/10 pt-3">
                        <p className="text-xs font-semibold text-stone-200">Erros vinculados</p>
                        {checkpointMistakes.length === 0 ? <p className="mt-1 text-xs text-stone-300">Nenhum erro registrado.</p> : checkpointMistakes.map((mistake) => <p key={mistake.id} className="mt-1 text-xs text-stone-100">{mistake.title}</p>)}
                      </div>
                      <div className="mt-3 border-t border-white/10 pt-3">
                        <p className="text-xs font-semibold text-stone-200">Revisoes vinculadas</p>
                        {checkpointReviews.length === 0 ? <p className="mt-1 text-xs text-stone-300">Nenhuma revisao agendada.</p> : checkpointReviews.map((review) => <p key={review.id} className="mt-1 text-xs text-stone-100">{review.scheduled_for} - {review.title}</p>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <h3 className="text-lg font-semibold text-ink">Lista de checkpoints</h3>
            {data.checkpoints.map((checkpoint) => {
              const log = data.logs.find((item) => item.id === checkpoint.study_log_id);
              const topic = data.topics.find((item) => item.id === checkpoint.topic_id);
              const checkpointMistakes = data.mistakes.filter((item) => item.checkpoint_id === checkpoint.id || item.study_log_id === checkpoint.study_log_id);
              const checkpointReviews = data.reviews.filter((item) => item.checkpoint_id === checkpoint.id || item.study_log_id === checkpoint.study_log_id);

              return (
                <article key={`list-${checkpoint.id}`} className="rounded border border-stone-200 bg-white p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                        <span className="rounded bg-stone-100 px-2 py-1">#{checkpoint.id}</span>
                        <span className="rounded bg-stone-100 px-2 py-1">{checkpoint.is_completed ? 'Completo' : 'Aberto'}</span>
                      </div>
                      <h4 className="mt-2 font-semibold text-ink">{checkpoint.title}</h4>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-stone-600">{checkpoint.description || 'Sem descricao.'}</p>
                      <p className="mt-2 text-xs text-stone-500">
                        {topic ? `Topico: ${topic.name}` : 'Topico nao informado'} - {log ? `Registro: ${log.title}` : 'Registro nao encontrado'}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {checkpointMistakes.length} erro(s) vinculado(s) - {checkpointReviews.length} revisao(oes) vinculada(s)
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/checkpoints/${checkpoint.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                      {!checkpoint.is_completed && (
                        <button onClick={() => void complete(checkpoint.id)} className="rounded border border-guard px-3 py-1 text-sm text-guard">
                          Concluir
                        </button>
                      )}
                      <button onClick={() => void remove(checkpoint.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">Excluir</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
