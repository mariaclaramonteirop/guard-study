import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#140d24] px-5 text-white">
      <div className="absolute inset-0 bg-hero-glow animate-pulse-soft" aria-hidden />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="inline-flex rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-medium text-violet-100/70">
          404
        </p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">Página não encontrada</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-violet-100/75">
          A rota que você tentou abrir não existe ou foi movida. Volte para a home ou entre no sistema.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/home"
            className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
          >
            Ir para a home
          </Link>
          <Link
            to="/login"
            className="rounded-xl border border-border bg-surface/50 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-surface"
          >
            Entrar no sistema
          </Link>
        </div>
      </div>
    </div>
  );
}
