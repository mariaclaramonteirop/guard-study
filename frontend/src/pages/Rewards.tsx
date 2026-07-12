import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Reward } from '../types';

export function Rewards() {
  const load = useCallback(() => api.get<Reward[]>('/rewards'), []);
  const { data, loading, error, reload } = useFetch(load);

  async function claim(id: number) {
    await api.patch(`/rewards/${id}/claim`);
    await reload();
  }

  async function remove(id: number) {
    await api.delete(`/rewards/${id}`);
    await reload();
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Recompensas" subtitle="Controle as recompensas que voce quer desbloquear ou ja ganhou." />
        <Link to="/rewards/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Nova recompensa
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.length === 0 && <EmptyState title="Nenhuma recompensa cadastrada" description="Crie recompensas para associar ao seu progresso." />}

      <div className="grid gap-3">
        {data?.map((reward) => (
          <article key={reward.id} className="rounded border border-stone-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                  <span className="rounded bg-stone-100 px-2 py-1">#{reward.id}</span>
                  <span className="rounded bg-stone-100 px-2 py-1">{reward.kind}</span>
                  <span className="rounded bg-stone-100 px-2 py-1">{reward.status}</span>
                </div>
                <h3 className="mt-2 font-semibold text-ink">{reward.title}</h3>
                <p className="mt-1 text-sm text-stone-600">{reward.description || 'Sem descricao.'}</p>
                <p className="mt-2 text-xs text-stone-500">{reward.points} ponto(s)</p>
                {reward.notes && <p className="mt-1 text-xs text-stone-500">{reward.notes}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {reward.status === 'unlocked' && (
                  <button onClick={() => void claim(reward.id)} className="rounded border border-violet-300 px-3 py-1 text-sm text-violet-900">
                    Resgatar
                  </button>
                )}
                <Link to={`/rewards/${reward.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                <button onClick={() => void remove(reward.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
