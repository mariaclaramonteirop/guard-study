import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-semibold text-white">
            Guardy <span className="text-primary">Study</span>
          </span>
        </div>
        <p className="text-xs text-violet-100/70">
          © {new Date().getFullYear()} Guardy Study. Estudo estruturado para desenvolvedores.
        </p>
      </div>
    </footer>
  );
}
