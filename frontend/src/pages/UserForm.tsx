import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { getSessionUser } from '../api/session';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { SectionTitle } from '../components/SectionTitle';
import { useFetch } from '../hooks/useFetch';
import type { User } from '../types';

export function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const currentUser = getSessionUser();
  const canAssignRole = currentUser?.role === 'manager';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' as User['role'] });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const load = useCallback(() => (isEdit ? api.get<User>(`/users/${id}`) : Promise.resolve(null)), [id, isEdit]);
  const { data, loading, error } = useFetch(load);

  useEffect(() => {
    if (data) {
      setForm({ name: data.name, email: data.email, password: '', role: data.role });
    }
  }, [data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setFormError('Informe o nome.');
      return;
    }
    if (!form.email.trim()) {
      setFormError('Informe o email.');
      return;
    }
    if (!isEdit && !form.password.trim()) {
      setFormError('Informe a senha.');
      return;
    }

    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    if (canAssignRole) {
      payload.role = form.role;
    }

    if (isEdit) {
      await api.put<User>(`/users/${id}`, payload);
    } else {
      await api.post<User>('/users', payload);
    }
    navigate('/users');
  }

  return (
    <>
      <Link to="/users" className="mb-4 inline-block text-sm text-guard">Voltar</Link>
      <SectionTitle title={isEdit ? 'Editar usuario' : 'Cadastrar usuario'} subtitle="Controle quem entra e qual acesso cada perfil recebe." />
      {loading && isEdit && <Loading />}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={submit} className="grid gap-3 rounded border border-stone-200 bg-white p-4">
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Nome" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="rounded border border-stone-300 px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded border border-stone-300 px-3 py-2"
            placeholder={isEdit ? 'Nova senha (opcional)' : 'Senha'}
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="rounded border border-stone-300 px-3 py-2 text-stone-700"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 3l18 18" />
                <path d="M10.58 10.58A2 2 0 1 0 13.4 13.4" />
                <path d="M9.88 5.08A10.94 10.94 0 0 1 12 5c5.5 0 9.5 7 9.5 7a18.56 18.56 0 0 1-4.35 4.88" />
                <path d="M6.1 6.1A18.85 18.85 0 0 0 2.5 12s4 7 9.5 7a9.9 9.9 0 0 0 3.38-.59" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M2.5 12S6.5 5 12 5s9.5 7 9.5 7-4 7-9.5 7S2.5 12 2.5 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {canAssignRole ? (
          <select className="rounded border border-stone-300 px-3 py-2" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as User['role'] })}>
            <option value="user">Usuario</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        ) : (
          <input className="rounded border border-stone-300 px-3 py-2 bg-stone-50" value="Usuario" disabled />
        )}
        {formError && <p className="text-sm text-red-700">{formError}</p>}
        <button className="w-fit rounded bg-guard px-4 py-2 font-medium text-white">Salvar</button>
      </form>
    </>
  );
}
