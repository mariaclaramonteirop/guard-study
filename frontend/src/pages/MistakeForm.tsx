import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, Mistake, StudyLog } from '../types';

export function MistakeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ study_log_id: '', checkpoint_id: '', title: '', description: '', correction: '' });
  const [formError, setFormError] = useState('');
  const load = useCallback(async () => {
    const [logs, checkpoints, mistake] = await Promise.all([
      api.get<StudyLog[]>('/study-logs'),
      api.get<Checkpoint[]>('/checkpoints'),
      isEdit ? api.get<Mistake>(`/mistakes/${id}`) : Promise.resolve(null),
    ]);
    return { logs, checkpoints, mistake };
  }, [id, isEdit]);
  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data?.mistake) {
      setForm({
        study_log_id: String(data.mistake.study_log_id),
        checkpoint_id: data.mistake.checkpoint_id ? String(data.mistake.checkpoint_id) : '',
        title: data.mistake.title,
        description: data.mistake.description,
        correction: data.mistake.correction,
      });
    }
  }, [data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.study_log_id || !form.title.trim() || !form.description.trim() || !form.correction.trim()) {
      setFormError('Escolha o registro e informe titulo, erro e correcao.');
      return;
    }
    const payload = { ...form, study_log_id: Number(form.study_log_id), checkpoint_id: form.checkpoint_id ? Number(form.checkpoint_id) : null };
    if (isEdit) await api.put<Mistake>(`/mistakes/${id}`, payload);
    else await api.post<Mistake>('/mistakes', payload);
    navigate('/mistakes');
  }

  return (
    <>
      <Link to="/mistakes" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar erro' : 'Cadastrar erro'} subtitle="Registre o erro e a forma correta de resolver." />
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <select className="rounded border border-stone-300 px-3 py-2" value={form.study_log_id} onChange={(event) => setForm({ ...form, study_log_id: event.target.value, checkpoint_id: '' })}>
          <option value="">Escolha o registro</option>
          {data?.logs.map((log) => <option key={log.id} value={log.id}>{log.title}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.checkpoint_id} onChange={(event) => setForm({ ...form, checkpoint_id: event.target.value })}>
          <option value="">Checkpoint opcional</option>
          {data?.checkpoints.filter((checkpoint) => !form.study_log_id || checkpoint.study_log_id === Number(form.study_log_id)).map((checkpoint) => <option key={checkpoint.id} value={checkpoint.id}>{checkpoint.title}</option>)}
        </select>
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <textarea className="min-h-32 rounded border border-stone-300 px-3 py-2" placeholder="O que aconteceu" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <textarea className="min-h-32 rounded border border-stone-300 px-3 py-2" placeholder="Como corrigir" value={form.correction} onChange={(event) => setForm({ ...form, correction: event.target.value })} />
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
