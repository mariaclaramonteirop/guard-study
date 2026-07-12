import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthShell, Field, SubmitButton } from '../components/auth/AuthShell';

export function Signup() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
        <Field id="name" label="Nome" placeholder="Seu nome" autoComplete="name" />
        <Field id="email" label="E-mail" type="email" placeholder="voce@exemplo.com" autoComplete="email" />
        <Field id="password" label="Senha" type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
        <SubmitButton>Criar conta</SubmitButton>
        <p className="text-center text-xs text-violet-100/70">
          Ao continuar, você concorda com nossos Termos e Política de Privacidade.
        </p>
      </form>
    </AuthShell>
  );
}
