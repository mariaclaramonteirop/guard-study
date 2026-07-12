import { Link, useNavigate } from 'react-router-dom';
import { clearSessionUser, getSessionUser } from '../api/session';

export function Header() {
  const navigate = useNavigate();
  const user = getSessionUser();

  function logout() {
    clearSessionUser();
    navigate('/login');
  }

  return (
    <header className="border-b border-stone-200 bg-white px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-stone-500">Painel de estudos</p>
          <h1 className="text-xl font-semibold text-ink">Guard Study</h1>
          <p className="mt-1 text-sm text-stone-700">Olá, {user?.name ?? 'Fukano'}, o que vamos estudar hoje?</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-stone-500">
          <span className="rounded-full border border-stone-200 px-3 py-1">
            {user?.role === 'manager' || user?.role === 'admin' ? 'Manager' : 'User'}
          </span>
          <button onClick={logout} className="rounded border border-stone-300 px-3 py-1 text-stone-700">
            Sair
          </button>
          <Link to="/login" className="rounded border border-stone-300 px-3 py-1 text-stone-700">
            Trocar usuário
          </Link>
        </div>
      </div>
    </header>
  );
}
