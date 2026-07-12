import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Project, StudyGoal } from '../types';

type FormState = {
  project_id: string;
  title: string;
  description: string;
  target_minutes: string;
  target_sessions: string;
  reward_title: string;
  reward_points: string;
  status: 'active' | 'paused' | 'achieved';
  notes: string;
};

export function GoalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<FormState>({
    project_id: '',
    title: '',
    description: '',
    target_minutes: '300',
    target_sessions: '',
    reward_title: '',
    reward_points: '0',
    status: 'active',
    notes: '',
  });
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    const [projects, goal] = await Promise.all([
      api.get<Project[]>('/projects'),
      isEdit ? api.get<StudyGoal>(`/goals/${id}`) : Promise.resolve(null),
    ]);
    return { projects, goal };
  }, [id, isEdit]);

  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data?.goal) {
      setForm({
        project_id: data.goal.project_id ? String(data.goal.project_id) : '',
        title: data.goal.title,
        description: data.goal.description ?? '',
        target_minutes: String(data.goal.target_minutes),
        target_sessions: data.goal.target_sessions === null ? '' : String(data.goal.target_sessions),
        reward_title: data.goal.reward_title,
        reward_points: String(data.goal.reward_points),
        status: data.goal.status,
        notes: data.goal.notes ?? '',
      });
    }
  }, [data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.target_minutes || !form.reward_title.trim()) {
      setFormError('Informe titulo, meta em minutos e recompensa.');
      return;
    }

    const payload = {
      project_id: form.project_id ? Number(form.project_id) : null,
      title: form.title,
      description: form.description || null,
      target_minutes: Number(form.target_minutes),
      target_sessions: form.target_sessions ? Number(form.target_sessions) : null,
      reward_title: form.reward_title,
      reward_points: Number(form.reward_points),
      status: form.status,
      notes: form.notes || null,
    };

    if (isEdit) await api.put<StudyGoal>(`/goals/${id}`, payload);
    else await api.post<StudyGoal>('/goals', payload);
    navigate('/goals');
  }

  return (
    <>
      <Link to="/goals" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar meta' : 'Cadastrar meta'} subtitle="Defina objetivos e a recompensa pessoal associada." />
      {loading && isEdit && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <select className="rounded border border-stone-300 px-3 py-2" value={form.project_id} onChange={(event) => setForm({ ...form, project_id: event.target.value })}>
          <option value="">Projeto opcional</option>
          {data?.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <textarea className="min-h-24 rounded border border-stone-300 px-3 py-2" placeholder="Descricao" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="1" placeholder="Minutos alvo" value={form.target_minutes} onChange={(event) => setForm({ ...form, target_minutes: event.target.value })} />
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="1" placeholder="Sessoes alvo" value={form.target_sessions} onChange={(event) => setForm({ ...form, target_sessions: event.target.value })} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo da recompensa" value={form.reward_title} onChange={(event) => setForm({ ...form, reward_title: event.target.value })} />
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="0" placeholder="Pontos" value={form.reward_points} onChange={(event) => setForm({ ...form, reward_points: event.target.value })} />
        </div>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FormState['status'] })}>
          <option value="active">Ativa</option>
          <option value="paused">Pausada</option>
          <option value="achieved">Concluida</option>
        </select>
        <textarea className="min-h-24 rounded border border-stone-300 px-3 py-2" placeholder="Notas" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
