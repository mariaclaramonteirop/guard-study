import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { MarkdownToolbar } from '../components/MarkdownToolbar';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Project, StudyLog, Topic } from '../types';

export function StudyLogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ project_id: '', topic_id: '', title: '', content: '', duration_minutes: '30', studied_at: today });
  const [formError, setFormError] = useState('');
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const load = useCallback(async () => {
    const [projects, topics, log] = await Promise.all([
      api.get<Project[]>('/projects'),
      api.get<Topic[]>('/topics'),
      isEdit ? api.get<StudyLog>(`/study-logs/${id}`) : Promise.resolve(null),
    ]);
    return { projects, topics, log };
  }, [id, isEdit]);
  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data?.log) {
      setForm({
        project_id: data.log.project_id ? String(data.log.project_id) : '',
        topic_id: String(data.log.topic_id),
        title: data.log.title,
        content: data.log.content,
        duration_minutes: String(data.log.duration_minutes),
        studied_at: data.log.studied_at,
      });
    }
  }, [data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.topic_id || !form.title.trim() || !form.content.trim()) {
      setFormError('Escolha o topico e informe titulo e conteudo.');
      return;
    }
    const payload = {
      project_id: form.project_id ? Number(form.project_id) : null,
      topic_id: Number(form.topic_id),
      title: form.title,
      content: form.content,
      duration_minutes: Number(form.duration_minutes),
      studied_at: form.studied_at,
    };
    if (isEdit) await api.put<StudyLog>(`/study-logs/${id}`, payload);
    else await api.post<StudyLog>('/study-logs', payload);
    navigate('/study-logs');
  }

  function applyMarkdown(command: 'h1' | 'h2' | 'bold' | 'italic' | 'list' | 'quote' | 'code') {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart ?? form.content.length;
    const end = textarea.selectionEnd ?? form.content.length;
    const selected = form.content.slice(start, end);
    let nextValue = form.content;
    let nextCursor = end;

    const insert = (prefix: string, suffix = '') => {
      const value = `${prefix}${selected || ''}${suffix}`;
      nextValue = `${form.content.slice(0, start)}${value}${form.content.slice(end)}`;
      nextCursor = start + value.length;
    };

    const prefixLines = (prefix: string) => {
      const value = (selected || textarea.value).split('\n').map((line) => `${prefix}${line}`).join('\n');
      nextValue = `${form.content.slice(0, start)}${value}${form.content.slice(end)}`;
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

    setForm({ ...form, content: nextValue });
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  return (
    <>
      <Link to="/study-logs" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar registro' : 'Cadastrar registro'} subtitle="Registre uma sessao de estudo completa." />
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <select className="rounded border border-stone-300 px-3 py-2" value={form.project_id} onChange={(event) => setForm({ ...form, project_id: event.target.value })}>
          <option value="">Projeto opcional</option>
          {data?.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.topic_id} onChange={(event) => setForm({ ...form, topic_id: event.target.value })}>
          <option value="">Escolha o topico</option>
          {data?.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
        </select>
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-stone-300 px-3 py-2" type="number" min="1" placeholder="Minutos" value={form.duration_minutes} onChange={(event) => setForm({ ...form, duration_minutes: event.target.value })} />
          <input className="rounded border border-stone-300 px-3 py-2" type="date" value={form.studied_at} onChange={(event) => setForm({ ...form, studied_at: event.target.value })} />
        </div>
        <MarkdownToolbar onApply={applyMarkdown} />
        <textarea
          ref={contentRef}
          className="min-h-40 rounded border border-stone-300 px-3 py-2"
          placeholder="Conteudo estudado"
          value={form.content}
          onChange={(event) => setForm({ ...form, content: event.target.value })}
        />
        <section className="rounded border border-stone-200 bg-stone-50 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-stone-500">Preview</p>
          <MarkdownPreview content={form.content || 'Comece a escrever para ver o preview.'} className="prose prose-stone max-w-none text-sm text-stone-700" />
        </section>
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
