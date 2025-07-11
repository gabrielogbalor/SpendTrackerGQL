// src/layouts/SidebarLayout.tsx
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { label: '🌱 AI Entry', path: '/' },
    { label: '🏠 Dashboard', path: '/dashboard' },
    { label: '🌳 Transactions', path: '/transactions' },
    { label: '💰 Budgets', path: '/budgets' },
    { label: '📊 Analytics', path: '/analytics' },
    { label: '⚙️ Settings', path: '/settings' }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-blue-900 text-white p-4 space-y-6 shadow-xl">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          SpendTracker AI
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 hover:scale-105 ${
                location.pathname === item.path 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default SidebarLayout;
