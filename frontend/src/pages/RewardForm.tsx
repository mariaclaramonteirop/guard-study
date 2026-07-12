import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { BADGES } from '../config/badges';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Reward, StudyGoal } from '../types';

type FormState = {
  goal_id: string;
  title: string;
  description: string;
  points: string;
  kind: 'badge' | 'bonus' | 'streak' | 'custom';
  category: string;
  badge_key: string;
  image_url: string;
  status: 'locked' | 'unlocked' | 'claimed';
  notes: string;
};

export function RewardForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<FormState>({
    goal_id: '',
    title: '',
    description: '',
    points: '0',
    kind: 'badge',
    category: 'metas',
    badge_key: '',
    image_url: '',
    status: 'locked',
    notes: '',
  });
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    const [goals, reward] = await Promise.all([
      api.get<StudyGoal[]>('/goals'),
      isEdit ? api.get<Reward>(`/rewards/${id}`) : Promise.resolve(null),
    ]);
    return { goals, reward };
  }, [id, isEdit]);

  const { data, loading, error } = useFetch(load);

  const badgeOptions = useMemo(() => BADGES, []);
  const selectedBadge = badgeOptions.find((badge) => badge.key === form.badge_key) ?? null;

  useEffect(() => {
    if (data?.reward) {
      setForm({
        goal_id: data.reward.goal_id ? String(data.reward.goal_id) : '',
        title: data.reward.title,
        description: data.reward.description ?? '',
        points: String(data.reward.points),
        kind: data.reward.kind,
        category: data.reward.category ?? 'metas',
        badge_key: data.reward.badge_key ?? '',
        image_url: data.reward.image_url ?? '',
        status: data.reward.status,
        notes: data.reward.notes ?? '',
      });
    }
  }, [data]);

  function handleBadgeKeyChange(nextKey: string) {
    const selected = badgeOptions.find((badge) => badge.key === nextKey);
    setForm((current) => ({
      ...current,
      badge_key: nextKey,
      title: selected?.title ?? current.title,
      description: selected?.description ?? current.description,
      category: selected?.category ?? current.category,
      image_url: selected?.image ?? current.image_url,
      kind: selected ? 'badge' : current.kind,
    }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!form.title.trim()) {
      setFormError('Informe o titulo da recompensa.');
      return;
    }

    const payload = {
      goal_id: form.goal_id ? Number(form.goal_id) : null,
      title: form.title,
      description: form.description || null,
      points: Number(form.points),
      kind: form.kind,
      category: form.category,
      badge_key: form.badge_key || null,
      image_url: form.image_url || null,
      status: form.status,
      notes: form.notes || null,
    };

    if (isEdit) await api.put<Reward>(`/rewards/${id}`, payload);
    else await api.post<Reward>('/rewards', payload);
    navigate('/rewards');
  }

  return (
    <>
      <Link to="/rewards" className="mb-4 inline-block text-sm text-guard">
        Voltar
      </Link>
      <SectionTitle
        title={isEdit ? 'Editar recompensa' : 'Cadastrar recompensa'}
        subtitle="Cadastre insígnias, bônus e conquistas que o usuário vai colecionar."
      />
      {loading && isEdit && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <select className="rounded border border-stone-300 px-3 py-2" value={form.goal_id} onChange={(event) => setForm({ ...form, goal_id: event.target.value })}>
          <option value="">Meta opcional</option>
          {data?.goals.map((goal) => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </select>

        <select className="rounded border border-stone-300 px-3 py-2" value={form.badge_key} onChange={(event) => handleBadgeKeyChange(event.target.value)}>
          <option value="">Selecionar insígnia pronta</option>
          {badgeOptions.map((badge) => (
            <option key={badge.key} value={badge.key}>
              {badge.title} - {badge.category}
            </option>
          ))}
        </select>

        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <select className="rounded border border-stone-300 px-3 py-2" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            <option value="metas">Metas</option>
            <option value="constancia">Constancia</option>
            <option value="tempo">Tempo</option>
            <option value="revisao">Revisao</option>
            <option value="projetos">Projetos</option>
            <option value="exploracao">Exploracao</option>
            <option value="qualidade">Qualidade</option>
            <option value="colecao">Colecao</option>
          </select>
        </div>

        <textarea className="min-h-24 rounded border border-stone-300 px-3 py-2" placeholder="Descricao" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />

        <div className="rounded border border-stone-200 bg-stone-50 p-3">
          <p className="text-xs uppercase tracking-wide text-stone-500">Preview</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
              {selectedBadge || form.image_url ? (
                <img
                  src={form.image_url || selectedBadge?.image || ''}
                  alt={form.title || selectedBadge?.title || 'Prévia da insígnia'}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-lg font-semibold text-violet-700">B</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-ink">{form.title || selectedBadge?.title || 'Sem título'}</p>
              <p className="text-sm text-stone-600">{selectedBadge?.description || 'Escolha uma insígnia ou envie uma imagem.'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded border border-stone-300 px-3 py-2" value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as FormState['kind'] })}>
            <option value="badge">Badge</option>
            <option value="bonus">Bonus</option>
            <option value="streak">Sequencia</option>
            <option value="custom">Personalizada</option>
          </select>
          <select className="rounded border border-stone-300 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FormState['status'] })}>
            <option value="locked">Bloqueada</option>
            <option value="unlocked">Desbloqueada</option>
            <option value="claimed">Resgatada</option>
          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="0" placeholder="Pontos" value={form.points} onChange={(event) => setForm({ ...form, points: event.target.value })} />
          <input className="rounded border border-stone-300 px-3 py-2" placeholder="URL da imagem" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
        </div>

        <textarea className="min-h-24 rounded border border-stone-300 px-3 py-2" placeholder="Notas" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />

        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
