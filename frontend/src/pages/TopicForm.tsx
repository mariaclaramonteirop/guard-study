import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Topic } from '../types';

export function TopicForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', description: '', status: 'ativo' });
  const [formError, setFormError] = useState('');
  const load = useCallback(() => (isEdit ? api.get<Topic>(`/topics/${id}`) : Promise.resolve(null)), [id, isEdit]);
  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data) {
      setForm({ name: data.name, description: data.description ?? '', status: data.status });
    }
  }, [data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setFormError('Informe o nome do topico.');
      return;
    }
    if (isEdit) {
      await api.put<Topic>(`/topics/${id}`, form);
    } else {
      await api.post<Topic>('/topics', form);
    }
    navigate('/topics');
  }

  return (
    <>
      <Link to="/topics" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar topico' : 'Cadastrar topico'} subtitle="Mantenha os assuntos de estudo organizados." />
      {loading && isEdit && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <textarea className="rounded border border-stone-300 px-3 py-2" placeholder="Descricao" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <select className="rounded border border-stone-300 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="ativo">Ativo</option>
          <option value="pausado">Pausado</option>
          <option value="concluido">Concluido</option>
        </select>
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
