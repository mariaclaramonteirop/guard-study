import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero-guardy.jpg';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-violet-100/70">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Estudo estruturado para desenvolvedores
            </span>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              Organize sua evolução como <span className="text-gradient-primary">programador</span>, sem depender da memória.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-violet-100/70">
              O Guardy Study é o sistema onde você registra tópicos, checkpoints, erros,
              projetos e sessões de estudo e transforma horas dispersas em progresso mensurável.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Entrar no sistema
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#funcionalidades"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-surface"
              >
                Ver funcionalidades
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-primary opacity-20 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-card">
              <img
                src={heroImage}
                alt="Visualização do sistema Guardy Study com checkpoints, sessões de estudo e progresso"
                width={1408}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
