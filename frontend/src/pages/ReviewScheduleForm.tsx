import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { MarkdownToolbar } from '../components/MarkdownToolbar';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, Mistake, Project, ReviewSchedule, StudyLog } from '../types';

export function ReviewScheduleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }, []);
  const [form, setForm] = useState({ project_id: '', study_log_id: '', checkpoint_id: '', mistake_id: '', title: '', scheduled_for: tomorrow, status: 'pending', notes: '' });
  const [formError, setFormError] = useState('');
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  const load = useCallback(async () => {
    const [projects, logs, checkpoints, mistakes, review] = await Promise.all([
      api.get<Project[]>('/projects'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<Checkpoint[]>('/checkpoints'),
      api.get<Mistake[]>('/mistakes'),
      isEdit ? api.get<ReviewSchedule>(`/review-schedules/${id}`) : Promise.resolve(null),
    ]);
    return { projects, logs, checkpoints, mistakes, review };
  }, [id, isEdit]);
  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data?.review) {
      setForm({
        project_id: data.review.project_id ? String(data.review.project_id) : '',
        study_log_id: String(data.review.study_log_id),
        checkpoint_id: data.review.checkpoint_id ? String(data.review.checkpoint_id) : '',
        mistake_id: data.review.mistake_id ? String(data.review.mistake_id) : '',
        title: data.review.title,
        scheduled_for: data.review.scheduled_for,
        status: data.review.status,
        notes: data.review.notes ?? '',
      });
    }
  }, [data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.study_log_id || !form.title.trim() || !form.scheduled_for) {
      setFormError('Escolha o registro e informe titulo e data.');
      return;
    }
    const payload = {
      project_id: form.project_id ? Number(form.project_id) : null,
      study_log_id: Number(form.study_log_id),
      checkpoint_id: form.checkpoint_id ? Number(form.checkpoint_id) : null,
      mistake_id: form.mistake_id ? Number(form.mistake_id) : null,
      title: form.title,
      scheduled_for: form.scheduled_for,
      status: form.status,
      notes: form.notes || null,
    };
    if (isEdit) await api.put<ReviewSchedule>(`/review-schedules/${id}`, payload);
    else await api.post<ReviewSchedule>('/review-schedules', payload);
    navigate('/review-schedules');
  }

  const filteredLogs = data?.logs.filter((log) => !form.project_id || log.project_id === Number(form.project_id)) ?? [];
  const filteredCheckpoints = data?.checkpoints.filter((checkpoint) => {
    const projectMatches = !form.project_id || checkpoint.project_id === Number(form.project_id);
    const logMatches = !form.study_log_id || checkpoint.study_log_id === Number(form.study_log_id);
    return projectMatches && logMatches;
  }) ?? [];
  const filteredMistakes = data?.mistakes.filter((mistake) => {
    const projectMatches = !form.project_id || mistake.project_id === Number(form.project_id);
    const logMatches = !form.study_log_id || mistake.study_log_id === Number(form.study_log_id);
    return projectMatches && logMatches;
  }) ?? [];

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
      <Link to="/review-schedules" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar revisao' : 'Agendar revisao'} subtitle="Planeje uma revisao ligada ao estudo." />
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <select className="rounded border border-stone-300 px-3 py-2" value={form.project_id} onChange={(event) => setForm({ ...form, project_id: event.target.value, study_log_id: '', checkpoint_id: '', mistake_id: '' })}>
          <option value="">Projeto opcional</option>
          {data?.projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.study_log_id} onChange={(event) => setForm({ ...form, study_log_id: event.target.value, checkpoint_id: '', mistake_id: '' })}>
          <option value="">Escolha o registro</option>
          {filteredLogs.map((log) => <option key={log.id} value={log.id}>{log.title}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.checkpoint_id} onChange={(event) => setForm({ ...form, checkpoint_id: event.target.value })}>
          <option value="">Checkpoint opcional</option>
          {filteredCheckpoints.map((checkpoint) => <option key={checkpoint.id} value={checkpoint.id}>{checkpoint.title}</option>)}
        </select>
        <select className="rounded border border-stone-300 px-3 py-2" value={form.mistake_id} onChange={(event) => setForm({ ...form, mistake_id: event.target.value })}>
          <option value="">Erro opcional</option>
          {filteredMistakes.map((mistake) => <option key={mistake.id} value={mistake.id}>{mistake.title}</option>)}
        </select>
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Titulo" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <input className="rounded border border-stone-300 px-3 py-2" type="date" value={form.scheduled_for} onChange={(event) => setForm({ ...form, scheduled_for: event.target.value })} />
        <select className="rounded border border-stone-300 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="pending">Pendente</option>
          <option value="done">Concluida</option>
        </select>
        <MarkdownToolbar onApply={applyMarkdown} />
        <textarea
          ref={notesRef}
          className="min-h-32 rounded border border-stone-300 px-3 py-2"
          placeholder="Notas"
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
        />
        <section className="rounded border border-stone-200 bg-stone-50 p-3">
          <p className="mb-2 text-xs uppercase tracking-wide text-stone-500">Preview das notas</p>
          <MarkdownPreview content={form.notes || 'Escreva as notas para ver o preview.'} className="prose prose-stone max-w-none text-sm text-stone-700" />
        </section>
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
