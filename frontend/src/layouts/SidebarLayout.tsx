// src/layouts/SidebarLayout.tsx
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Transactions', path: '/transactions' },
    { label: 'Budgets', path: '/budgets' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-6">
        <div className="text-xl font-bold">SpendTracker</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded hover:bg-gray-700 ${
                location.pathname === item.path ? 'bg-gray-800' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default SidebarLayout;
