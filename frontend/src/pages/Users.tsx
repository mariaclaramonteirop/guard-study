import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import { getSessionUser } from '../api/session';
import type { User } from '../types';

export function Users() {
  const currentUser = getSessionUser();
  const load = useCallback(() => api.get<User[]>('/users'), []);
  const { data, loading, error, reload } = useFetch(load);

  async function remove(id: number) {
    await api.delete(`/users/${id}`);
    await reload();
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Usuarios" subtitle="Gerencie acessos e perfis do sistema." />
        {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
          <Link to="/users/new" className="w-fit rounded bg-guard px-4 py-2 text-sm font-medium text-white">
            Novo usuario
          </Link>
        )}
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {data?.length === 0 && <EmptyState title="Nenhum usuario" description="Crie o primeiro usuario para liberar acesso." />}
      <div className="grid gap-3">
        {data?.map((user) => (
          <article key={user.id} className="rounded border border-stone-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-stone-600">{user.email}</p>
                <span className="mt-2 inline-block rounded bg-stone-100 px-2 py-1 text-xs">{user.role}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/users/permissions?user=${user.id}`} className="rounded border border-stone-300 px-3 py-1 text-sm">
                  Permissões
                </Link>
                <Link to={`/users/${user.id}/edit`} className="rounded border border-stone-300 px-3 py-1 text-sm">Editar</Link>
                {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
                  <button onClick={() => void remove(user.id)} className="rounded border border-stone-300 px-3 py-1 text-sm">
                    Excluir
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
