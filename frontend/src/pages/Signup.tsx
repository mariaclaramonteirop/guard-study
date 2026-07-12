import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { setSessionUser } from '../api/session';
import { ErrorMessage } from '../components/ErrorMessage';
import { AuthShell, Field, SubmitButton } from '../components/auth/AuthShell';
import type { User } from '../types';

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await api.post<User>('/auth/signup', { name, email, password });
      setSessionUser({ id: user.id, role: user.role, name: user.name, permissions: user.permissions });
      navigate('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel criar a conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Comece a organizar seus estudos em minutos."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        {error && <ErrorMessage message={error} />}
        <Field id="name" label="Nome" placeholder="Seu nome" autoComplete="name" value={name} onChange={setName} />
        <Field
          id="email"
          label="E-mail"
          type="email"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />
        <Field
          id="password"
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
        />
        <SubmitButton disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</SubmitButton>
        <p className="text-center text-xs text-violet-100/70">Ao continuar, você concorda com nossos termos de uso.</p>
      </form>
    </AuthShell>
  );
}
