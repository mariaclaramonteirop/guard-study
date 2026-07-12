import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { setSessionUser } from '../api/session';
import { ErrorMessage } from '../components/ErrorMessage';
import { SectionTitle } from '../components/SectionTitle';

type LoginResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('fukano@guardstudy.local');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await api.post<LoginResponse>('/auth/login', { email: login, password });
      setSessionUser({ id: user.id, role: user.role, name: user.name });
      navigate('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <SectionTitle title="Entrar" subtitle="Acesse com email e senha para carregar seus dados." />
      {error && <ErrorMessage message={error} />}
      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded border border-stone-200 bg-white p-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Email ou usuario</span>
          <input
            type="text"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            className="w-full rounded border border-stone-300 px-3 py-2"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Senha</span>
          <div className="flex gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-w-0 flex-1 rounded border border-stone-300 px-3 py-2"
              required
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
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-guard px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
