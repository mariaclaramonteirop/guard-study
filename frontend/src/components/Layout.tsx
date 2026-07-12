import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((current) => !current)} />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="mx-auto max-w-6xl px-5 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
