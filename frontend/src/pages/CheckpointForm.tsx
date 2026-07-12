import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, Mistake, ReviewSchedule, StudyLog, Topic } from '../types';

export function CheckpointForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ topic_id: '', study_log_id: '', mistake_id: '', review_schedule_id: '', title: '', description: '' });
  const [formError, setFormError] = useState('');
  const load = useCallback(async () => {
    const [topics, logs, mistakes, reviews, checkpoint] = await Promise.all([
      api.get<Topic[]>('/topics'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<Mistake[]>('/mistakes'),
      api.get<ReviewSchedule[]>('/review-schedules'),
      isEdit ? api.get<Checkpoint>(`/checkpoints/${id}`) : Promise.resolve(null),
    ]);
    return { topics, logs, mistakes, reviews, checkpoint };
  }, [id, isEdit]);
  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data?.checkpoint) {
      setForm({
        topic_id: data.checkpoint.topic_id ? String(data.checkpoint.topic_id) : '',
        study_log_id: String(data.checkpoint.study_log_id),
        mistake_id: '',
        review_schedule_id: '',
        title: data.checkpoint.title,
        description: data.checkpoint.description ?? '',
      });
    }
  }, [data]);

  const filteredLogs = useMemo(() => {
    if (!data) return [];
    return form.topic_id ? data.logs.filter((log) => log.topic_id === Number(form.topic_id)) : data.logs;
  }, [data, form.topic_id]);

  const filteredMistakes = useMemo(() => {
    if (!data) return [];
    return form.study_log_id ? data.mistakes.filter((mistake) => mistake.study_log_id === Number(form.study_log_id)) : data.mistakes;
  }, [data, form.study_log_id]);

  const filteredReviews = useMemo(() => {
    if (!data) return [];
    return form.study_log_id ? data.reviews.filter((review) => review.study_log_id === Number(form.study_log_id)) : data.reviews;
  }, [data, form.study_log_id]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.study_log_id || !form.title.trim()) {
      setFormError('Escolha o registro e informe o titulo.');
      return;
    }

    const selectedMistake = data?.mistakes.find((mistake) => mistake.id === Number(form.mistake_id));
    const selectedReview = data?.reviews.find((review) => review.id === Number(form.review_schedule_id));
    const description = [
      form.description,
      selectedMistake ? `Erro relacionado: #${selectedMistake.id} - ${selectedMistake.title}` : '',
      selectedReview ? `Revisao relacionada: #${selectedReview.id} - ${selectedReview.title}` : '',
    ].filter(Boolean).join('\n');

    const payload = {
      topic_id: form.topic_id ? Number(form.topic_id) : null,
      study_log_id: Number(form.study_log_id),
      title: form.title,
      description,
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
        <select className="rounded border border-stone-300 px-3 py-2" value={form.topic_id} onChange={(event) => setForm({ ...form, topic_id: event.target.value, study_log_id: '' })}>
          <option value="">Escolha o topico</option>
          {data?.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.study_log_id} onChange={(event) => setForm({ ...form, study_log_id: event.target.value })}>
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
