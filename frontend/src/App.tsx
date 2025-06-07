import { Routes, Route } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';

const Budgets = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Budgets</h1>
    <p>Manage your budgets here.</p>
  </div>
);

const Analytics = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Analytics</h1>
    <p>View your spending analytics here.</p>
  </div>
);

const Settings = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <p>Adjust your settings here.</p>
  </div>
);

function App() {
  return (
    <SidebarLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </SidebarLayout>
  );
}

export default App; 