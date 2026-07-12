import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { setSessionUser } from '../api/session';
import { AuthShell, Field, SubmitButton } from '../components/auth/AuthShell';
import { ErrorMessage } from '../components/ErrorMessage';

type LoginResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions?: Record<string, boolean>;
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
      setSessionUser({ id: user.id, role: user.role, name: user.name, permissions: user.permissions });
      navigate('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
      <AuthShell
      title="Entrar"
      subtitle="Bem-vindo de volta. Continue de onde parou."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </>
      }
    >
      {error && <ErrorMessage message={error} />}
      <form onSubmit={onSubmit} className="space-y-5">
        <Field
          id="login"
          label="E-mail ou usuário"
          type="text"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          value={login}
          onChange={setLogin}
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Senha
            </label>
            <a href="#" className="text-xs text-violet-100/70 hover:text-primary">
              Esqueci a senha
            </a>
          </div>
          <div className="flex gap-2">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-white/12 bg-[#221433]/80 px-3.5 py-2.5 text-sm text-white placeholder:text-violet-100/45 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              className="rounded-lg border border-white/12 bg-[#221433]/80 px-3 py-2 text-violet-100/75"
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
        </div>
        <SubmitButton disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</SubmitButton>
      </form>
    </AuthShell>
  );
}
