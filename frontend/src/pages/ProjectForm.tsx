import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { MarkdownToolbar } from '../components/MarkdownToolbar';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Project } from '../types';

export function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', description: '', repository_url: '', project_url: '', notes: '', status: 'ativo' });
  const [formError, setFormError] = useState('');
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  const load = useCallback(() => (isEdit ? api.get<Project>(`/projects/${id}`) : Promise.resolve(null)), [id, isEdit]);
  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        description: data.description ?? '',
        repository_url: data.repository_url ?? '',
        project_url: data.project_url ?? '',
        notes: data.notes ?? '',
        status: data.status,
      });
    }
  }, [data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setFormError('Informe o nome do projeto.');
      return;
    }

    const payload = {
      ...form,
      repository_url: form.repository_url || null,
      project_url: form.project_url || null,
      notes: form.notes || null,
    };

    if (isEdit) await api.put<Project>(`/projects/${id}`, payload);
    else await api.post<Project>('/projects', payload);
    navigate('/projects');
  }

  function applyMarkdown(command: 'h1' | 'h2' | 'bold' | 'italic' | 'list' | 'quote' | 'code') {
    const textarea = notesRef.current;
    if (!textarea) return;

    const currentValue = form.notes;
    const start = textarea.selectionStart ?? currentValue.length;
    const end = textarea.selectionEnd ?? currentValue.length;
    const selected = currentValue.slice(start, end);
    let nextValue = currentValue;
    let nextCursor = end;

    const insert = (prefix: string, suffix = '') => {
      const value = `${prefix}${selected || ''}${suffix}`;
      nextValue = `${currentValue.slice(0, start)}${value}${currentValue.slice(end)}`;
      nextCursor = start + value.length;
    };

    const prefixLines = (prefix: string) => {
      const value = (selected || textarea.value).split('\n').map((line) => `${prefix}${line}`).join('\n');
      nextValue = `${currentValue.slice(0, start)}${value}${currentValue.slice(end)}`;
      nextCursor = start + value.length;
    };

    switch (command) {
      case 'h1':
        insert('# ');
        break;
      case 'h2':
        insert('## ');
        break;
      case 'bold':
        insert('**', '**');
        break;
      case 'italic':
        insert('*', '*');
        break;
      case 'list':
        prefixLines('- ');
        break;
      case 'quote':
        prefixLines('> ');
        break;
      case 'code':
        insert('`', '`');
        break;
    }

    setForm({ ...form, notes: nextValue });
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  return (
    <>
      <Link to="/projects" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar projeto' : 'Cadastrar projeto'} subtitle="Centralize links, anotações e contexto do trabalho em estudo." />
      {loading && isEdit && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <textarea className="min-h-24 rounded border border-stone-300 px-3 py-2" placeholder="Descricao" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Link do repositorio" value={form.repository_url} onChange={(event) => setForm({ ...form, repository_url: event.target.value })} />
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Link do projeto" value={form.project_url} onChange={(event) => setForm({ ...form, project_url: event.target.value })} />
        <select className="rounded border border-stone-300 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="ativo">Ativo</option>
          <option value="pausado">Pausado</option>
          <option value="concluido">Concluido</option>
        </select>
        <MarkdownToolbar onApply={applyMarkdown} />
        <textarea ref={notesRef} className="min-h-40 rounded border border-stone-300 px-3 py-2" placeholder="Anotações" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
        <section className="rounded border border-stone-200 bg-stone-50 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-stone-500">Preview das anotações</p>
          <MarkdownPreview content={form.notes || 'Escreva as anotações para ver o preview.'} className="prose prose-stone max-w-none text-sm text-stone-700" />
        </section>
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
