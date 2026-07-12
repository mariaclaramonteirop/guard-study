import { NavLink } from 'react-router-dom';

const sections = [
  {
    label: 'Topicos',
    items: [
      { to: '/topics', label: 'Gerenciar' },
      { to: '/topics/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Registros',
    items: [
      { to: '/study-logs', label: 'Gerenciar' },
      { to: '/study-logs/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Checkpoints',
    items: [
      { to: '/checkpoints', label: 'Gerenciar' },
      { to: '/checkpoints/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Erros',
    items: [
      { to: '/mistakes', label: 'Gerenciar' },
      { to: '/mistakes/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Revisoes',
    items: [
      { to: '/review-schedules', label: 'Gerenciar' },
      { to: '/review-schedules/new', label: 'Cadastro' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="border-r border-stone-200 bg-ink px-3 py-4 text-white md:min-h-screen md:w-72">
      <div className="mb-5 px-3">
        <strong className="block text-lg">Guard Study</strong>
        <span className="text-xs text-stone-300">MVP de aprendizado</span>
      </div>
      <nav className="space-y-4">
        <NavLink to="/" className={({ isActive }) => `block rounded px-3 py-2 text-sm ${isActive ? 'bg-guard text-white' : 'text-stone-200 hover:bg-white/10'}`}>
          Dashboard
        </NavLink>
        {sections.map((section) => (
          <div key={section.label} className="space-y-1">
            <p className="px-3 text-[11px] uppercase tracking-wide text-stone-400">{section.label}</p>
            <div className="grid gap-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `ml-2 block rounded px-3 py-2 text-sm ${
                      isActive ? 'bg-white text-ink' : 'text-stone-200 hover:bg-white/10'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
