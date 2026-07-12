import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { BADGES } from '../config/badges';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Reward } from '../types';

const categoryLabels: Record<string, string> = {
  metas: 'Metas',
  constancia: 'Constância',
  tempo: 'Tempo',
  revisao: 'Revisão',
  projetos: 'Projetos',
  exploracao: 'Exploração',
  qualidade: 'Qualidade',
  colecao: 'Coleção',
};

function getImageForReward(reward: Reward) {
  return reward.image_url ?? BADGES.find((badge) => badge.key === reward.badge_key)?.image ?? null;
}

function getBadgeFallback(reward: Reward) {
  return (reward.title || reward.badge_key || 'B').slice(0, 1).toUpperCase();
}

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

  const rewards = data ?? [];
  const stats = useMemo(() => {
    return {
      total: rewards.length,
      badges: rewards.filter((reward) => reward.kind === 'badge').length,
      unlocked: rewards.filter((reward) => reward.status === 'unlocked').length,
      claimed: rewards.filter((reward) => reward.status === 'claimed').length,
      categories: Object.entries(
        rewards.reduce<Record<string, number>>((acc, reward) => {
          acc[reward.category || 'metas'] = (acc[reward.category || 'metas'] ?? 0) + 1;
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
    };
  }, [rewards]);

  const catalogStatus = useMemo(() => {
    return BADGES.map((badge) => ({
      ...badge,
      acquired: rewards.some((reward) => reward.badge_key === badge.key && reward.status !== 'locked'),
    }));
  }, [rewards]);

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Recompensas" subtitle="Colecione insígnias, bônus e conquistas do seu progresso." />
        <Link to="/rewards/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Nova recompensa
        </Link>
      </div>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Total</p>
          <strong className="mt-1 block text-2xl text-ink">{stats.total}</strong>
        </div>
        <div className="rounded border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Insígnias</p>
          <strong className="mt-1 block text-2xl text-ink">{stats.badges}</strong>
        </div>
        <div className="rounded border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Desbloqueadas</p>
          <strong className="mt-1 block text-2xl text-ink">{stats.unlocked}</strong>
        </div>
        <div className="rounded border border-stone-200 bg-white p-4">
          <p className="text-sm text-stone-500">Resgatadas</p>
          <strong className="mt-1 block text-2xl text-ink">{stats.claimed}</strong>
        </div>
      </div>

      <section className="mb-6 rounded border border-stone-200 bg-white p-4">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">Coleção de insígnias</h3>
            <p className="text-sm text-stone-600">As artes enviadas já ficam disponíveis aqui e podem ser ligadas às recompensas.</p>
          </div>
          <p className="text-sm text-stone-500">{catalogStatus.filter((badge) => badge.acquired).length}/{catalogStatus.length} coletadas</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {catalogStatus.map((badge) => (
            <article key={badge.key} className="rounded border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-stone-200 bg-white">
                  <img
                    src={badge.image}
                    alt={badge.title}
                    className={`h-full w-full object-contain ${badge.acquired ? '' : 'opacity-45'}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase text-stone-500">
                    <span className="rounded bg-white px-2 py-1">{categoryLabels[badge.category] ?? badge.category}</span>
                    <span className="rounded bg-white px-2 py-1">{badge.acquired ? 'coletada' : 'bloqueada'}</span>
                  </div>
                  <h4 className="mt-2 truncate font-semibold text-ink">{badge.title}</h4>
                  <p className="mt-1 text-sm text-stone-600">{badge.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.length === 0 && <EmptyState title="Nenhuma recompensa cadastrada" description="Crie insígnias e bônus para associar ao progresso." />}

      {stats.categories.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {stats.categories.map(([category, count]) => (
            <span key={category} className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
              {categoryLabels[category] ?? category} · {count}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rewards.map((reward) => {
          const image = getImageForReward(reward);

          return (
            <article key={reward.id} className="rounded border border-stone-200 bg-white p-4">
              <div className="flex items-start gap-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 text-lg font-semibold text-violet-700">
                  {image ? <img src={image} alt={reward.title} className="h-full w-full object-contain" /> : getBadgeFallback(reward)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase text-stone-500">
                    <span className="rounded bg-stone-100 px-2 py-1">#{reward.id}</span>
                    <span className="rounded bg-stone-100 px-2 py-1">{categoryLabels[reward.category] ?? reward.category}</span>
                    <span className="rounded bg-stone-100 px-2 py-1">{reward.kind}</span>
                    <span className="rounded bg-stone-100 px-2 py-1">{reward.status}</span>
                  </div>
                  <h3 className="mt-2 truncate font-semibold text-ink">{reward.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600">{reward.description || 'Sem descricao.'}</p>
                  <p className="mt-2 text-xs text-stone-500">{reward.points} ponto(s)</p>
                  {reward.badge_key && <p className="mt-1 text-xs text-stone-500">Chave: {reward.badge_key}</p>}
                  {reward.notes && <p className="mt-1 text-xs text-stone-500">{reward.notes}</p>}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {reward.status === 'unlocked' && (
                  <button onClick={() => void claim(reward.id)} className="rounded border border-violet-300 px-3 py-1 text-sm text-violet-900">
                    Resgatar
                  </button>
                )}
                <Link to={`/rewards/${reward.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">
                  Editar
                </Link>
                <button onClick={() => void remove(reward.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">
                  Excluir
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
