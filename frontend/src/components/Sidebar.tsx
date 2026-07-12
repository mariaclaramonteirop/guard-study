import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const sections = [
  {
    label: 'Projetos',
    path: '/projects',
    icon: 'projects',
    items: [
      { to: '/projects', label: 'Gerenciar' },
      { to: '/projects/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Tempo',
    path: '/study-sessions',
    icon: 'timer',
    items: [
      { to: '/study-sessions', label: 'Gerenciar' },
      { to: '/study-sessions/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Topicos',
    path: '/topics',
    icon: 'topics',
    items: [
      { to: '/topics', label: 'Gerenciar' },
      { to: '/topics/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Registros',
    path: '/study-logs',
    icon: 'logs',
    items: [
      { to: '/study-logs', label: 'Gerenciar' },
      { to: '/study-logs/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Checkpoints',
    path: '/checkpoints',
    icon: 'checkpoints',
    items: [
      { to: '/checkpoints', label: 'Gerenciar' },
      { to: '/checkpoints/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Erros',
    path: '/mistakes',
    icon: 'mistakes',
    items: [
      { to: '/mistakes', label: 'Gerenciar' },
      { to: '/mistakes/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Revisoes',
    path: '/review-schedules',
    icon: 'reviews',
    items: [
      { to: '/review-schedules', label: 'Gerenciar' },
      { to: '/review-schedules/new', label: 'Cadastro' },
    ],
  },
  {
    label: 'Usuarios',
    path: '/users',
    icon: 'users',
    items: [
      { to: '/users', label: 'Gerenciar' },
      { to: '/users/new', label: 'Cadastro' },
    ],
  },
];

function Icon({ kind }: { kind: string }) {
  switch (kind) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 11.5V20h6v-5.5H14V20h6v-8.5L12 4 4 11.5Z" />
        </svg>
      );
    case 'projects':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7.5h16" />
          <path d="M6 5v4" />
          <path d="M10 5v4" />
          <path d="M4 10.5h16v8H4z" />
        </svg>
      );
    case 'timer':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="13" r="7.5" />
          <path d="M12 9v4l3 2" />
          <path d="M9 3.5h6" />
        </svg>
      );
    case 'topics':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 6.5h14" />
          <path d="M5 11.5h14" />
          <path d="M5 16.5h14" />
        </svg>
      );
    case 'logs':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 4h10v16H7z" />
          <path d="M9.5 8h5" />
          <path d="M9.5 12h5" />
        </svg>
      );
    case 'checkpoints':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 5h14v14H5z" />
          <path d="M8 12h8" />
        </svg>
      );
    case 'mistakes':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 4 3.5 19h17L12 4Z" />
          <path d="M12 9v4" />
          <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'reviews':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 12a8 8 0 1 1 2.3 5.7" />
          <path d="M4 16v2h2" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 20a4 4 0 0 0-8 0" />
          <circle cx="12" cy="8" r="3.5" />
        </svg>
      );
    default:
      return null;
  }
}

type SidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const initialOpen = useMemo(
    () => sections.filter((section) => location.pathname.startsWith(section.path)).map((section) => section.label),
    [location.pathname],
  );
  const [openSections, setOpenSections] = useState<string[]>(initialOpen);

  useEffect(() => {
    setOpenSections((current) => Array.from(new Set([...current, ...initialOpen])));
  }, [initialOpen]);

  function toggleSection(label: string) {
    setOpenSections((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  }

  function handleSectionClick(label: string) {
    if (collapsed) {
      onToggleCollapse();
    }

    toggleSection(label);
  }

  return (
    <aside
      className={`border-r border-violet-900/40 bg-violet-950 px-3 py-4 text-white transition-all duration-200 md:min-h-screen ${
        collapsed ? 'md:w-20' : 'md:w-72'
      }`}
    >
      <div className={`mb-5 flex items-center ${collapsed ? 'justify-center px-0' : 'justify-between px-3'}`}>
        {!collapsed && <strong className="block text-lg">Guard Study</strong>}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded p-2 text-violet-100/80 hover:bg-white/10"
          aria-label={collapsed ? 'Abrir menu lateral' : 'Fechar menu lateral'}
        >
          {collapsed ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 6l6 6-6 6" />
            </svg>
          )}
        </button>
      </div>
      <nav className="space-y-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded px-3 py-2 text-sm ${
              isActive ? 'bg-guard text-white' : 'text-stone-200 hover:bg-white/10'
            } ${collapsed ? 'justify-center px-0' : ''}`
          }
          title="Dashboard"
        >
          <Icon kind="dashboard" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {sections.map((section) => {
          const isOpen = openSections.includes(section.label);
          const IconKind = section.icon;

          return (
            <div key={section.label} className="space-y-1">
              <button
                type="button"
                onClick={() => handleSectionClick(section.label)}
                className={`flex w-full items-center rounded px-3 py-2 text-left text-[11px] uppercase tracking-wide text-violet-200/70 hover:bg-white/5 ${
                  collapsed ? 'justify-center px-0' : 'justify-between'
                }`}
                aria-label={section.label}
                title={section.label}
              >
                <span className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                  <Icon kind={IconKind} />
                  {!collapsed && <span>{section.label}</span>}
                </span>
                {!collapsed && (
                  <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                )}
              </button>

              {!collapsed && isOpen && (
                <div className="grid gap-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `ml-2 block rounded px-3 py-2 text-sm ${
                          isActive ? 'bg-violet-300 text-violet-950' : 'text-violet-100/85 hover:bg-white/10'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
