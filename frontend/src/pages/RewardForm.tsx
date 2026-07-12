import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
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
    kind: 'custom',
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

  useEffect(() => {
    if (data?.reward) {
      setForm({
        goal_id: data.reward.goal_id ? String(data.reward.goal_id) : '',
        title: data.reward.title,
        description: data.reward.description ?? '',
        points: String(data.reward.points),
        kind: data.reward.kind,
        status: data.reward.status,
        notes: data.reward.notes ?? '',
      });
    }
  }, [data]);

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
      status: form.status,
      notes: form.notes || null,
    };

    if (isEdit) await api.put<Reward>(`/rewards/${id}`, payload);
    else await api.post<Reward>('/rewards', payload);
    navigate('/rewards');
  }

  return (
    <>
      <Link to="/rewards" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar recompensa' : 'Cadastrar recompensa'} subtitle="Defina a recompensa ligada a uma meta ou deixe como item pessoal." />
      {loading && isEdit && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <select className="rounded border border-stone-300 px-3 py-2" value={form.goal_id} onChange={(event) => setForm({ ...form, goal_id: event.target.value })}>
          <option value="">Meta opcional</option>
          {data?.goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.title}</option>)}
        </select>
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <textarea className="min-h-24 rounded border border-stone-300 px-3 py-2" placeholder="Descricao" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded border border-stone-300 px-3 py-2" value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value as FormState['kind'] })}>
            <option value="custom">Personalizada</option>
            <option value="badge">Badge</option>
            <option value="bonus">Bonus</option>
            <option value="streak">Sequencia</option>
          </select>
          <select className="rounded border border-stone-300 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FormState['status'] })}>
            <option value="locked">Bloqueada</option>
            <option value="unlocked">Desbloqueada</option>
            <option value="claimed">Resgatada</option>
          </select>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="0" placeholder="Pontos" value={form.points} onChange={(event) => setForm({ ...form, points: event.target.value })} />
          <textarea className="min-h-24 rounded border border-stone-300 px-3 py-2" placeholder="Notas" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        </div>
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
