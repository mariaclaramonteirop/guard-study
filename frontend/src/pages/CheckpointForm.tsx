import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, Mistake, Project, ReviewSchedule, StudyLog, Topic } from '../types';

export function CheckpointForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ project_id: '', topic_id: '', study_log_id: '', mistake_id: '', review_schedule_id: '', title: '', description: '' });
  const [formError, setFormError] = useState('');
  const load = useCallback(async () => {
    const [projects, topics, logs, mistakes, reviews, checkpoint] = await Promise.allSettled([
      api.get<Project[]>('/projects'),
      api.get<Topic[]>('/topics'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<Mistake[]>('/mistakes'),
      api.get<ReviewSchedule[]>('/review-schedules'),
      isEdit ? api.get<Checkpoint>(`/checkpoints/${id}`) : Promise.resolve(null),
    ]);
    return {
      projects: projects.status === 'fulfilled' ? projects.value : [],
      topics: topics.status === 'fulfilled' ? topics.value : [],
      logs: logs.status === 'fulfilled' ? logs.value : [],
      mistakes: mistakes.status === 'fulfilled' ? mistakes.value : [],
      reviews: reviews.status === 'fulfilled' ? reviews.value : [],
      checkpoint: checkpoint.status === 'fulfilled' ? checkpoint.value : null,
    };
  }, [id, isEdit]);
  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data?.checkpoint) {
      setForm({
        project_id: data.checkpoint.project_id ? String(data.checkpoint.project_id) : '',
        topic_id: data.checkpoint.topic_id ? String(data.checkpoint.topic_id) : '',
        study_log_id: String(data.checkpoint.study_log_id),
        mistake_id: data.checkpoint.mistake_id ? String(data.checkpoint.mistake_id) : '',
        review_schedule_id: data.checkpoint.review_schedule_id ? String(data.checkpoint.review_schedule_id) : '',
        title: data.checkpoint.title,
        description: data.checkpoint.description ?? '',
      });
    }
  }, [data]);

  const filteredLogs = useMemo(() => {
    if (!data) return [];
    return data.logs.filter((log) => {
      const topicMatches = !form.topic_id || log.topic_id === Number(form.topic_id);
      const projectMatches = !form.project_id || log.project_id === Number(form.project_id);
      return topicMatches && projectMatches;
    });
  }, [data, form.project_id, form.topic_id]);

  const filteredMistakes = useMemo(() => {
    if (!data) return [];
    return data.mistakes.filter((mistake) => {
      const logMatches = !form.study_log_id || mistake.study_log_id === Number(form.study_log_id);
      const projectMatches = !form.project_id || mistake.project_id === Number(form.project_id);
      return logMatches && projectMatches;
    });
  }, [data, form.project_id, form.study_log_id]);

  const filteredReviews = useMemo(() => {
    if (!data) return [];
    return data.reviews.filter((review) => {
      const logMatches = !form.study_log_id || review.study_log_id === Number(form.study_log_id);
      const projectMatches = !form.project_id || review.project_id === Number(form.project_id);
      return logMatches && projectMatches;
    });
  }, [data, form.project_id, form.study_log_id]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.study_log_id || !form.title.trim()) {
      setFormError('Escolha o registro e informe o titulo.');
      return;
    }

    const payload = {
      project_id: form.project_id ? Number(form.project_id) : null,
      topic_id: form.topic_id ? Number(form.topic_id) : null,
      study_log_id: Number(form.study_log_id),
      mistake_id: form.mistake_id ? Number(form.mistake_id) : null,
      review_schedule_id: form.review_schedule_id ? Number(form.review_schedule_id) : null,
      title: form.title,
      description: form.description || null,
    };
    if (isEdit) await api.put<Checkpoint>(`/checkpoints/${id}`, payload);
    else await api.post<Checkpoint>('/checkpoints', payload);
    navigate('/checkpoints');
  }

  return (
    <>
      <Link to="/checkpoints" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar checkpoint' : 'Cadastrar checkpoint'} subtitle="Associe checkpoint a topico, registro, erro e revisao." />
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <select className="rounded border border-stone-300 px-3 py-2" value={form.project_id} onChange={(event) => setForm({ ...form, project_id: event.target.value, topic_id: '', study_log_id: '', mistake_id: '', review_schedule_id: '' })}>
          <option value="">Projeto opcional</option>
          {data?.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.topic_id} onChange={(event) => setForm({ ...form, topic_id: event.target.value, study_log_id: '', mistake_id: '', review_schedule_id: '' })}>
          <option value="">Escolha o topico</option>
          {data?.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.study_log_id} onChange={(event) => setForm({ ...form, study_log_id: event.target.value, mistake_id: '', review_schedule_id: '' })}>
          <option value="">Escolha o registro</option>
          {filteredLogs.map((log) => <option key={log.id} value={log.id}>{log.title}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.mistake_id} onChange={(event) => setForm({ ...form, mistake_id: event.target.value })}>
          <option value="">Erro relacionado</option>
          {filteredMistakes.map((mistake) => <option key={mistake.id} value={mistake.id}>{mistake.title}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.review_schedule_id} onChange={(event) => setForm({ ...form, review_schedule_id: event.target.value })}>
          <option value="">Revisao relacionada</option>
          {filteredReviews.map((review) => <option key={review.id} value={review.id}>{review.title}</option>)}
        </select>
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <textarea className="min-h-32 rounded border border-stone-300 px-3 py-2" placeholder="Descricao" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
