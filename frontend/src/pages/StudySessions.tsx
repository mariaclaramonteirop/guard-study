import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Project, StudyLog, StudySession, Topic } from '../types';

type Draft = {
  project_id: string;
  topic_id: string;
  study_log_id: string;
  title: string;
  timer_mode: 'pomodoro' | 'short_break' | 'long_break' | 'custom';
  planned_minutes: string;
  pause_minutes: string;
  notes: string;
};

function formatElapsed(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return [hours, minutes, rest].map((part) => String(part).padStart(2, '0')).join(':');
}

function toDateTimeString(value: Date) {
  return value.toISOString().slice(0, 19).replace('T', ' ');
}

export function StudySessions() {
  const location = useLocation();
  const navigate = useNavigate();
  const load = useCallback(async () => {
    const [projects, topics, logs, sessions] = await Promise.all([
      api.get<Project[]>('/projects'),
      api.get<Topic[]>('/topics'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<StudySession[]>('/study-sessions'),
    ]);
    return { projects, topics, logs, sessions };
  }, []);

  const { data, loading, error, reload } = useFetch(load);
  const [draft, setDraft] = useState<Draft>({
    project_id: '',
    topic_id: '',
    study_log_id: '',
    title: '',
    timer_mode: 'pomodoro',
    planned_minutes: '25',
    pause_minutes: '',
    notes: '',
  });
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const isCreateModalOpen = location.pathname === '/study-sessions/new';

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning]);

  const sessions = useMemo(() => [...(data?.sessions ?? [])].sort((a, b) => b.started_at.localeCompare(a.started_at)), [data]);

  const projectById = useMemo(() => new Map((data?.projects ?? []).map((project) => [project.id, project])), [data]);
  const topicById = useMemo(() => new Map((data?.topics ?? []).map((topic) => [topic.id, topic])), [data]);
  const logById = useMemo(() => new Map((data?.logs ?? []).map((log) => [log.id, log])), [data]);

  function buildPayload(nextStatus: StudySession['status'], endedAt: string | null, actualMinutes: number) {
    return {
      project_id: draft.project_id ? Number(draft.project_id) : null,
      topic_id: draft.topic_id ? Number(draft.topic_id) : null,
      study_log_id: draft.study_log_id ? Number(draft.study_log_id) : null,
      title: draft.title,
      timer_mode: draft.timer_mode,
      planned_minutes: Number(draft.planned_minutes),
      pause_minutes: draft.timer_mode === 'custom' && draft.pause_minutes ? Number(draft.pause_minutes) : null,
      actual_minutes: actualMinutes,
      status: nextStatus,
      started_at: currentSession?.started_at ?? toDateTimeString(new Date()),
      ended_at: endedAt,
      notes: draft.notes || null,
    };
  }

  async function startTimer() {
    setFormError('');
    if (currentSession) {
      setFormError('Ja existe uma sessao ativa.');
      return;
    }
    if (!draft.title.trim() || !draft.planned_minutes) {
      setFormError('Informe o titulo e o tempo planejado.');
      return;
    }
    if (draft.timer_mode === 'custom' && !draft.pause_minutes) {
      setFormError('Informe o tempo de pausa para o timer personalizado.');
      return;
    }

    const session = await api.post<StudySession>('/study-sessions', buildPayload('running', null, 0));
    setCurrentSession(session);
    setElapsedSeconds(0);
    setIsRunning(true);
    setMessage('Timer iniciado.');
    await reload();
  }

  async function pauseTimer() {
    if (!currentSession) {
      return;
    }

    const actualMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const session = await api.put<StudySession>(`/study-sessions/${currentSession.id}`, buildPayload('paused', null, actualMinutes));
    setCurrentSession(session);
    setIsRunning(false);
    setMessage('Timer pausado.');
    await reload();
  }

  async function resumeTimer() {
    if (!currentSession) {
      return;
    }

    const session = await api.put<StudySession>(`/study-sessions/${currentSession.id}`, buildPayload('running', null, Math.max(1, Math.round(elapsedSeconds / 60))));
    setCurrentSession(session);
    setIsRunning(true);
    setMessage('Timer retomado.');
    await reload();
  }

  async function stopTimer() {
    if (!currentSession) {
      return;
    }

    const endedAt = toDateTimeString(new Date());
    const actualMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    const session = await api.put<StudySession>(`/study-sessions/${currentSession.id}`, buildPayload('completed', endedAt, actualMinutes));
    setCurrentSession(session);
    setIsRunning(false);
    setElapsedSeconds(0);
    setCurrentSession(null);
    setMessage('Sessao concluida e salva.');
    await reload();
  }

  const runningLabel = currentSession ? `${currentSession.title} - ${currentSession.timer_mode}` : 'Nenhum timer em andamento';
  const canStartSession = !currentSession;
  const customTimer = draft.timer_mode === 'custom';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Tempo" subtitle="Timer, pomodoro e historico de sessoes de estudo." />
        <Link to="/study-sessions/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Novo registro
        </Link>
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {message && <p className="rounded border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-950">{message}</p>}

      <section className="rounded border border-stone-200 bg-white p-4">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded border border-violet-200 bg-violet-50 p-4">
            <p className="text-xs uppercase tracking-wide text-violet-700">Sessao ativa</p>
            <p className="mt-2 text-sm text-violet-950">{runningLabel}</p>
            <div className="mt-4 rounded bg-white px-4 py-5 text-center">
              <p className="text-xs uppercase tracking-wide text-stone-500">Tempo corrido</p>
              <strong className="mt-2 block text-4xl text-ink">{formatElapsed(elapsedSeconds)}</strong>
              <p className="mt-2 text-sm text-stone-500">{currentSession ? `${currentSession.planned_minutes} min planejados` : 'Use o timer para iniciar uma sessao.'}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate('/study-sessions/new')} disabled={!canStartSession} className="rounded bg-violet-700 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">Nova sessao</button>
              <button type="button" onClick={() => void pauseTimer()} disabled={!currentSession || !isRunning} className="rounded border border-stone-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Pausar</button>
              <button type="button" onClick={() => void resumeTimer()} disabled={!currentSession || isRunning} className="rounded border border-stone-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">Retomar</button>
              <button type="button" onClick={() => void stopTimer()} disabled={!currentSession} className="rounded border border-violet-300 px-4 py-2 text-sm text-violet-900 disabled:cursor-not-allowed disabled:opacity-50">Concluir</button>
            </div>
            {formError && <p className="mt-3 text-sm text-red-700">{formError}</p>}
          </div>

          <div className="rounded border border-stone-200 bg-stone-50 p-4">
            <h3 className="text-sm font-semibold text-ink">Atalhos</h3>
            <p className="mt-2 text-sm text-stone-600">Abra o modal para cadastrar uma sessao manual ou iniciar um timer.</p>
            <button
              type="button"
              onClick={() => navigate('/study-sessions/new')}
              disabled={!canStartSession}
              className="mt-4 rounded border border-violet-300 px-4 py-2 text-sm text-violet-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Abrir cadastro
            </button>
          </div>
        </div>
      </section>

      <section className="rounded border border-stone-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Historico de sessoes</h2>
            <p className="text-sm text-stone-600">Registros do tempo estudado, planejado e concluido.</p>
          </div>
          <p className="text-sm text-stone-500">{sessions.length} sessao(oes)</p>
        </div>

        {sessions.length === 0 ? (
          <EmptyState title="Nenhuma sessao registrada" description="Inicie um timer ou cadastre uma sessao manualmente." />
        ) : (
          <div className="grid gap-3">
            {sessions.map((session) => (
              <article key={session.id} className="rounded border border-stone-200 bg-stone-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                      <span className="rounded bg-stone-100 px-2 py-1">#{session.id}</span>
                      <span className="rounded bg-stone-100 px-2 py-1">{session.timer_mode}</span>
                      <span className="rounded bg-stone-100 px-2 py-1">{session.status}</span>
                    </div>
                    <h3 className="mt-2 font-semibold text-ink">{session.title}</h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {projectById.get(session.project_id ?? 0)?.name ?? 'Projeto nao informado'}
                      {session.topic_id ? ` - ${topicById.get(session.topic_id)?.name ?? 'Topico nao informado'}` : ''}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {session.actual_minutes} min realizados de {session.planned_minutes} planejados
                    </p>
                    {session.timer_mode === 'custom' && session.pause_minutes !== null && (
                      <p className="mt-1 text-xs text-stone-500">Pausa personalizada: {session.pause_minutes} min</p>
                    )}
                    <p className="mt-1 text-xs text-stone-500">
                      Inicio: {session.started_at}
                      {session.ended_at ? ` - Fim: ${session.ended_at}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      {session.study_log_id ? `Registro vinculado: ${logById.get(session.study_log_id)?.title ?? `#${session.study_log_id}`}` : 'Sem registro vinculado'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/study-sessions/${session.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded border border-stone-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">Nova sessao de estudo</h2>
                <p className="text-sm text-stone-500">Cadastre a sessao sem sair da tela de gerenciamento.</p>
              </div>
              <button type="button" onClick={() => navigate('/study-sessions')} className="rounded border border-stone-300 px-3 py-2 text-sm">
                Fechar
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void startTimer();
              }}
              className="grid gap-4 px-5 py-5"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <select className="rounded border border-stone-300 px-3 py-2" value={draft.project_id} onChange={(event) => setDraft({ ...draft, project_id: event.target.value })}>
                  <option value="">Projeto opcional</option>
                  {(data?.projects ?? []).map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
                </select>
                <select className="rounded border border-stone-300 px-3 py-2" value={draft.topic_id} onChange={(event) => setDraft({ ...draft, topic_id: event.target.value })}>
                  <option value="">Topico opcional</option>
                  {(data?.topics ?? []).map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
                </select>
                <select className="rounded border border-stone-300 px-3 py-2 md:col-span-2" value={draft.study_log_id} onChange={(event) => setDraft({ ...draft, study_log_id: event.target.value })}>
                  <option value="">Registro opcional</option>
                  {(data?.logs ?? []).map((log) => <option key={log.id} value={log.id}>{log.title}</option>)}
                </select>
                <input className="rounded border border-stone-300 px-3 py-2 md:col-span-2" placeholder="Titulo da sessao" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
                <select className="rounded border border-stone-300 px-3 py-2" value={draft.timer_mode} onChange={(event) => setDraft({ ...draft, timer_mode: event.target.value as Draft['timer_mode'] })}>
                  <option value="pomodoro">Pomodoro</option>
                  <option value="short_break">Pausa curta</option>
                  <option value="long_break">Pausa longa</option>
                  <option value="custom">Personalizado</option>
                </select>
                <input className="rounded border border-stone-300 px-3 py-2" type="number" min="1" placeholder="Minutos planejados" value={draft.planned_minutes} onChange={(event) => setDraft({ ...draft, planned_minutes: event.target.value })} />
                {customTimer && (
                  <input className="rounded border border-stone-300 px-3 py-2" type="number" min="1" placeholder="Tempo de pausa" value={draft.pause_minutes} onChange={(event) => setDraft({ ...draft, pause_minutes: event.target.value })} />
                )}
                <textarea className="min-h-28 rounded border border-stone-300 px-3 py-2 md:col-span-2" placeholder="Notas da sessao" value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-stone-200 pt-4">
                <button type="submit" className="rounded bg-violet-700 px-4 py-2 text-sm font-medium text-white">
                  Iniciar timer
                </button>
                <button type="button" onClick={() => navigate('/study-sessions')} className="rounded border border-stone-300 px-4 py-2 text-sm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
