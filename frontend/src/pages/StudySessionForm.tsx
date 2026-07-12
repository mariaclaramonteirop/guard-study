import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Project, StudyLog, StudySession, Topic } from '../types';

type FormState = {
  project_id: string;
  topic_id: string;
  study_log_id: string;
  title: string;
  timer_mode: 'pomodoro' | 'short_break' | 'long_break' | 'custom';
  planned_minutes: string;
  pause_minutes: string;
  actual_minutes: string;
  status: 'running' | 'paused' | 'completed' | 'cancelled';
  started_at: string;
  ended_at: string;
  notes: string;
};

function toInputDateTime(value: string) {
  return value ? value.slice(0, 16).replace(' ', 'T') : '';
}

function toApiDateTime(value: string) {
  return value ? value.replace('T', ' ') + ':00' : '';
}

export function StudySessionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const now = toInputDateTime(new Date().toISOString().slice(0, 19).replace('T', ' '));
  const [form, setForm] = useState<FormState>({
    project_id: '',
    topic_id: '',
    study_log_id: '',
    title: '',
    timer_mode: 'pomodoro',
    planned_minutes: '25',
    pause_minutes: '',
    actual_minutes: '0',
    status: 'running',
    started_at: now,
    ended_at: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    const [projects, topics, logs, session] = await Promise.all([
      api.get<Project[]>('/projects'),
      api.get<Topic[]>('/topics'),
      api.get<StudyLog[]>('/study-logs'),
      isEdit ? api.get<StudySession>(`/study-sessions/${id}`) : Promise.resolve(null),
    ]);
    return { projects, topics, logs, session };
  }, [id, isEdit]);

  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data?.session) {
      setForm({
        project_id: data.session.project_id ? String(data.session.project_id) : '',
        topic_id: data.session.topic_id ? String(data.session.topic_id) : '',
        study_log_id: data.session.study_log_id ? String(data.session.study_log_id) : '',
        title: data.session.title,
        timer_mode: data.session.timer_mode,
        planned_minutes: String(data.session.planned_minutes),
        pause_minutes: data.session.pause_minutes === null ? '' : String(data.session.pause_minutes),
        actual_minutes: String(data.session.actual_minutes),
        status: data.session.status,
        started_at: toInputDateTime(data.session.started_at),
        ended_at: data.session.ended_at ? toInputDateTime(data.session.ended_at) : '',
        notes: data.session.notes ?? '',
      });
    }
  }, [data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.planned_minutes || !form.started_at) {
      setFormError('Informe titulo, minutos planejados e inicio.');
      return;
    }

    const payload = {
      project_id: form.project_id ? Number(form.project_id) : null,
      topic_id: form.topic_id ? Number(form.topic_id) : null,
      study_log_id: form.study_log_id ? Number(form.study_log_id) : null,
      title: form.title,
      timer_mode: form.timer_mode,
      planned_minutes: Number(form.planned_minutes),
      pause_minutes: form.timer_mode === 'custom' && form.pause_minutes ? Number(form.pause_minutes) : null,
      actual_minutes: Number(form.actual_minutes),
      status: form.status,
      started_at: toApiDateTime(form.started_at),
      ended_at: form.ended_at ? toApiDateTime(form.ended_at) : null,
      notes: form.notes || null,
    };

    if (isEdit) {
      await api.put<StudySession>(`/study-sessions/${id}`, payload);
    } else {
      await api.post<StudySession>('/study-sessions', payload);
    }

    navigate('/study-sessions');
  }

  return (
    <>
      <Link to="/study-sessions" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar sessao de estudo' : 'Cadastrar sessao de estudo'} subtitle="Registre tempo estudado, tipo de timer e vinculos com os modulos." />
      {loading && isEdit && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <select className="rounded border border-stone-300 px-3 py-2" value={form.project_id} onChange={(event) => setForm({ ...form, project_id: event.target.value })}>
          <option value="">Projeto opcional</option>
          {data?.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.topic_id} onChange={(event) => setForm({ ...form, topic_id: event.target.value })}>
          <option value="">Topico opcional</option>
          {data?.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.study_log_id} onChange={(event) => setForm({ ...form, study_log_id: event.target.value })}>
          <option value="">Registro opcional</option>
          {data?.logs.map((log) => <option key={log.id} value={log.id}>{log.title}</option>)}
        </select>
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded border border-stone-300 px-3 py-2" value={form.timer_mode} onChange={(event) => setForm({ ...form, timer_mode: event.target.value as FormState['timer_mode'] })}>
            <option value="pomodoro">Pomodoro</option>
            <option value="short_break">Pausa curta</option>
            <option value="long_break">Pausa longa</option>
            <option value="custom">Personalizado</option>
          </select>
          <select className="rounded border border-stone-300 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FormState['status'] })}>
            <option value="running">Em andamento</option>
            <option value="paused">Pausada</option>
            <option value="completed">Concluida</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="1" placeholder="Minutos planejados" value={form.planned_minutes} onChange={(event) => setForm({ ...form, planned_minutes: event.target.value })} />
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="0" placeholder="Minutos realizados" value={form.actual_minutes} onChange={(event) => setForm({ ...form, actual_minutes: event.target.value })} />
        </div>
        {form.timer_mode === 'custom' && (
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="1" placeholder="Tempo de pausa" value={form.pause_minutes} onChange={(event) => setForm({ ...form, pause_minutes: event.target.value })} />
        )}
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-stone-300 px-3 py-2" type="datetime-local" value={form.started_at} onChange={(event) => setForm({ ...form, started_at: event.target.value })} />
          <input className="rounded border border-stone-300 px-3 py-2" type="datetime-local" value={form.ended_at} onChange={(event) => setForm({ ...form, ended_at: event.target.value })} />
        </div>
        <textarea className="min-h-32 rounded border border-stone-300 px-3 py-2" placeholder="Notas" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
