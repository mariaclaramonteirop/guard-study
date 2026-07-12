import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section id="entrar" className="px-6 py-24 md:py-32">
      <div className="glass-panel animate-drift-slow relative mx-auto max-w-5xl overflow-hidden rounded-3xl p-10 text-center shadow-card md:p-16">
        <div className="absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
        <div className="relative">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Comece a estudar com <span className="text-gradient-primary">estrutura de verdade.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-violet-100/70">
            Acesse o Guardy Study e transforme cada hora de estudo em progresso técnico registrado.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Entrar no sistema
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#funcionalidades"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/40 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-background/70"
            >
              Explorar funcionalidades
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
