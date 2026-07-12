import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { Project } from '../types';

function preview(text: string | null, limit = 120) {
  if (!text) return 'Sem descrição.';
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

export function Projects() {
  const load = useCallback(() => api.get<Project[]>('/projects'), []);
  const { data, loading, error, reload } = useFetch(load);

  async function remove(id: number) {
    await api.delete(`/projects/${id}`);
    await reload();
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Projetos" subtitle="Organize links, anotações e a evolução por projeto." />
        <Link to="/projects/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
          Novo projeto
        </Link>
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.length === 0 && <EmptyState title="Nenhum projeto" description="Crie o primeiro projeto para agrupar seus estudos." />}
      <div className="grid gap-3">
        {data?.map((project) => (
          <article key={project.id} className="rounded border border-stone-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 text-xs text-stone-500">
                  <span className="rounded bg-stone-100 px-2 py-1">#{project.id}</span>
                  <span className="rounded bg-stone-100 px-2 py-1">{project.status}</span>
                </div>
                <h3 className="mt-2 font-semibold text-ink">{project.name}</h3>
                <p className="mt-1 text-sm text-stone-600">{preview(project.description)}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {project.repository_url && (
                    <a href={project.repository_url} target="_blank" rel="noreferrer" className="rounded bg-stone-100 px-2 py-1 text-stone-700">
                      Repositório
                    </a>
                  )}
                  {project.project_url && (
                    <a href={project.project_url} target="_blank" rel="noreferrer" className="rounded bg-stone-100 px-2 py-1 text-stone-700">
                      Projeto
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/projects/${project.id}`} className="rounded border border-stone-300 px-3 py-1 text-sm">Ver</Link>
                <Link to={`/projects/${project.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                <button onClick={() => void remove(project.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
