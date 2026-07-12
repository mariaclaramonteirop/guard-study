import { FormEvent, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { ChecklistItem, StudyLog } from '../types';

export function StudyLogDetail() {
  const { id } = useParams();
  const [itemTitle, setItemTitle] = useState('');
  const { data, loading, error, reload } = useFetch(async () => {
    const [log, checklistItems] = await Promise.all([
      api.get<StudyLog>(`/study-logs/${id}`),
      api.get<ChecklistItem[]>('/checklists'),
    ]);
    return { log, checklistItems };
  });

  const checklist = useMemo(
    () => data?.checklistItems.filter((item) => item.study_log_id === Number(id)) ?? [],
    [data?.checklistItems, id],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!itemTitle.trim()) return;
    await api.post<ChecklistItem>('/checklists', { study_log_id: Number(id), title: itemTitle, is_completed: 0 });
    setItemTitle('');
    await reload();
  }

  async function toggle(itemId: number) {
    await api.patch<ChecklistItem>(`/checklists/${itemId}/toggle`);
    await reload();
  }

  return (
    <>
      <Link to="/study-logs" className="mb-4 inline-block text-sm text-guard">Voltar para registros</Link>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.log && (
        <>
          <SectionTitle title={data.log.title} subtitle={`Registro #${data.log.id} - Topico #${data.log.topic_id}`} />
          <article className="rounded border border-stone-200 bg-white p-5">
            <div className="mb-4 flex flex-wrap gap-2 text-sm text-stone-600">
              <span className="rounded bg-stone-100 px-2 py-1">{data.log.studied_at}</span>
              <span className="rounded bg-stone-100 px-2 py-1">{data.log.duration_minutes} minutos</span>
            </div>
            <MarkdownPreview content={data.log.content} className="prose prose-stone max-w-none text-stone-700" />
          </article>

          <article className="mt-6 rounded border border-stone-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">Checklist</h2>
                <p className="text-sm text-stone-600">Adicione passos pequenos da sessao.</p>
              </div>
              <span className="text-sm text-stone-500">{checklist.length} item(s)</span>
            </div>

            <form onSubmit={submit} className="mb-4 flex gap-2">
              <input
                className="min-w-0 flex-1 rounded border border-stone-300 px-3 py-2"
                placeholder="Novo item"
                value={itemTitle}
                onChange={(event) => setItemTitle(event.target.value)}
              />
              <button className="rounded bg-guard px-4 py-2 text-white">Adicionar</button>
            </form>

            <div className="grid gap-2">
              {checklist.length === 0 ? (
                <p className="text-sm text-stone-600">Nenhum item ainda.</p>
              ) : (
                checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => void toggle(item.id)}
                    className={`flex items-center gap-3 rounded border px-3 py-2 text-left text-sm ${
                      item.is_completed ? 'border-violet-300 bg-violet-50 text-violet-950' : 'border-stone-200 bg-white text-stone-700'
                    }`}
                  >
                    <span className="text-base">{item.is_completed ? '☑' : '☐'}</span>
                    <span>{item.title}</span>
                  </button>
                ))
              )}
            </div>
          </article>
        </>
      )}
    </>
  );
}
