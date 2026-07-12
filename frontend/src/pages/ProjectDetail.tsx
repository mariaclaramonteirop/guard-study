import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Checkpoint, Mistake, Project, ReviewSchedule, StudyLog, Topic } from '../types';

export function ProjectDetail() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(async () => {
    const [project, topics, logs, checkpoints, mistakes, reviews] = await Promise.all([
      api.get<Project>(`/projects/${id}`),
      api.get<Topic[]>('/topics'),
      api.get<StudyLog[]>('/study-logs'),
      api.get<Checkpoint[]>('/checkpoints'),
      api.get<Mistake[]>('/mistakes'),
      api.get<ReviewSchedule[]>('/review-schedules'),
    ]);
    return { project, topics, logs, checkpoints, mistakes, reviews };
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const relatedTopics = data.topics.filter((topic) => topic.project_id === data.project.id);
  const relatedLogs = data.logs.filter((log) => log.project_id === data.project.id);
  const relatedCheckpoints = data.checkpoints.filter((checkpoint) => checkpoint.project_id === data.project.id);
  const relatedMistakes = data.mistakes.filter((mistake) => mistake.project_id === data.project.id);
  const relatedReviews = data.reviews.filter((review) => review.project_id === data.project.id);

  return (
    <div className="space-y-6">
      <SectionTitle title={data.project.name} subtitle={`Projeto #${data.project.id} - ${data.project.status}`} />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-600">{data.project.description || 'Sem descrição.'}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {data.project.repository_url && <a className="rounded border border-stone-300 px-3 py-1" href={data.project.repository_url} target="_blank" rel="noreferrer">Repositório</a>}
            {data.project.project_url && <a className="rounded border border-stone-300 px-3 py-1" href={data.project.project_url} target="_blank" rel="noreferrer">Projeto</a>}
          </div>
        </article>
        <article className="rounded border border-stone-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Resumo do projeto</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-700">
            <li>Topicos: {relatedTopics.length}</li>
            <li>Registros: {relatedLogs.length}</li>
            <li>Checkpoints: {relatedCheckpoints.length}</li>
            <li>Erros: {relatedMistakes.length}</li>
            <li>Revisoes: {relatedReviews.length}</li>
          </ul>
        </article>
      </div>

      <article className="rounded border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-ink">Anotações</h2>
        <MarkdownPreview content={data.project.notes || 'Sem anotações.'} className="prose prose-stone mt-3 max-w-none text-sm text-stone-700" />
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded border border-stone-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Topicos</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-700">
            {relatedTopics.length === 0 ? <li>Sem tópicos vinculados.</li> : relatedTopics.map((topic) => <li key={topic.id}>#{topic.id} {topic.name}</li>)}
          </ul>
        </article>
        <article className="rounded border border-stone-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink">Registros</h2>
          <ul className="mt-3 space-y-2 text-sm text-stone-700">
            {relatedLogs.length === 0 ? <li>Sem registros vinculados.</li> : relatedLogs.map((log) => <li key={log.id}>#{log.id} {log.title}</li>)}
          </ul>
        </article>
      </div>
    </div>
  );
}
