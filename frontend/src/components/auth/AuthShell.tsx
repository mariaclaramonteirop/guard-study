import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: Props) {
  useEffect(() => {
    document.body.classList.add('landing-page');
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent text-white">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <Link to="/home" className="mb-10 flex items-center gap-2 self-start">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Guardy <span className="text-primary">Study</span>
          </span>
        </Link>

        <div className="glass-panel rounded-2xl p-8 shadow-card text-white">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-violet-100/70">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>

        <div className="mt-6 text-center text-sm text-violet-100/70">{footer}</div>
      </div>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function Field({ id, label, type = 'text', placeholder, autoComplete, value, onChange }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-lg border border-white/12 bg-[#221433]/80 px-3.5 py-2.5 text-sm text-white placeholder:text-violet-100/45 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

export function SubmitButton({ children, disabled = false }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.01]"
    >
      {children}
    </button>
  );
}
