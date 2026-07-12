import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import { MODULES, type ModuleKey } from '../config/permissions';
import type { User } from '../types';

type PermissionState = Record<ModuleKey, boolean>;

function buildDefaultPermissions(role: User['role']): PermissionState {
  return MODULES.reduce((acc, module) => {
    acc[module.key] = role === 'user' ? !module.managerOnly : true;
    return acc;
  }, {} as PermissionState);
}

export function UserPermissions() {
  const [searchParams] = useSearchParams();
  const initialUser = Number(searchParams.get('user') ?? 0) || null;
  const [selectedUserId, setSelectedUserId] = useState<number | null>(initialUser);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<PermissionState>(buildDefaultPermissions('user'));
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadUsers = useFetch(() => api.get<User[]>('/users'));
  const users = loadUsers.data ?? [];

  useEffect(() => {
    if (selectedUserId !== null || users.length === 0) {
      return;
    }

    setSelectedUserId(initialUser && users.some((user) => user.id === initialUser) ? initialUser : users[0].id);
  }, [initialUser, selectedUserId, users]);

  useEffect(() => {
    if (selectedUserId === null) {
      setSelectedUser(null);
      return;
    }

    let active = true;

    async function loadSelectedUser() {
      try {
        setFormError(null);
        const user = await api.get<User>(`/users/${selectedUserId}`);
        if (!active) {
          return;
        }

        setSelectedUser(user);
        setPermissions({
          ...buildDefaultPermissions(user.role),
          ...user.permissions,
        });
      } catch (caught) {
        if (!active) {
          return;
        }

        setSelectedUser(null);
        setFormError(caught instanceof Error ? caught.message : 'Nao foi possivel carregar as permissoes.');
      }
    }

    void loadSelectedUser();

    return () => {
      active = false;
    };
  }, [selectedUserId]);

  const enabledCount = useMemo(() => Object.values(permissions).filter(Boolean).length, [permissions]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedUserId) {
      setFormError('Selecione um usuario.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      await api.put<User>(`/users/${selectedUserId}`, { permissions });
      const refreshed = await api.get<User>(`/users/${selectedUserId}`);
      setSelectedUser(refreshed);
      setPermissions({
        ...buildDefaultPermissions(refreshed.role),
        ...refreshed.permissions,
      });
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : 'Nao foi possivel salvar as permissoes.');
    } finally {
      setSaving(false);
    }
  }

  if (loadUsers.loading) {
    return <Loading />;
  }

  if (loadUsers.error) {
    return <ErrorMessage message={loadUsers.error} />;
  }

  if (users.length === 0) {
    return <EmptyState title="Nenhum usuario" description="Cadastre usuarios para configurar permissões por modulo." />;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SectionTitle title="Permissões" subtitle="Escolha quais módulos cada usuário pode acessar." />
        <Link to="/users" className="w-fit rounded border border-stone-300 px-4 py-2 text-sm">
          Voltar para usuários
        </Link>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 rounded border border-stone-200 bg-white p-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-ink">Usuário</span>
          <select
            className="rounded border border-stone-300 px-3 py-2"
            value={selectedUserId ?? ''}
            onChange={(event) => setSelectedUserId(Number(event.target.value))}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.role}
              </option>
            ))}
          </select>
        </label>

        {selectedUser && (
          <div className="rounded border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
            Editando <strong>{selectedUser.name}</strong> ({selectedUser.role})
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module) => (
            <label key={module.key} className="flex items-start gap-3 rounded border border-stone-200 p-4">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-stone-300 text-guard"
                checked={permissions[module.key] ?? false}
                disabled={module.managerOnly && selectedUser?.role === 'user'}
                onChange={(event) =>
                  setPermissions((current) => ({
                    ...current,
                    [module.key]: event.target.checked,
                  }))
                }
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{module.label}</span>
                  {module.managerOnly && (
                    <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] uppercase text-stone-500">
                      manager
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-stone-600">{module.description}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-stone-600">
            {enabledCount} modulo(s) liberado(s) para este usuario.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPermissions(buildDefaultPermissions(selectedUser?.role ?? 'user'))}
              className="rounded border border-stone-300 px-4 py-2 text-sm"
            >
              Restaurar padrão
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-guard px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar permissões'}
            </button>
          </div>
        </div>

        {formError && <ErrorMessage message={formError} />}
      </form>
    </>
  );
}
