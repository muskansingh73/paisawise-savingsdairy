import { useState, useEffect } from 'react';
import Sidebar     from './components/Sidebar';
import TopBar      from './components/TopBar';
import Dashboard   from './pages/Dashboard';
import DailyLog    from './pages/DailyLog';
import MonthlyView from './pages/MonthlyView';
import SavingTips  from './pages/SavingTips';
import Login       from './pages/Login';
import { getToken, fetchUser, logoutUser } from './services/api';

export default function App() {
  const [page,        setPage]        = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user,        setUser]        = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // On app load — check if user is already logged in
  useEffect(() => {
    const token = getToken();
    if (!token) { setAuthLoading(false); return; }

    fetchUser()
      .then(u => setUser(u))
      .catch(() => { logoutUser(); })
      .finally(() => setAuthLoading(false));
  }, []);

  function handleAuth(userData) {
    setUser(userData);
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setPage('dashboard');
  }

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rupee-400 animate-pulse" />
          <span className="font-display font-semibold text-ink-400">Loading...</span>
        </div>
      </div>
    );
  }

  // Not logged in — show login page
  if (!user) {
    return <Login onAuth={handleAuth} />;
  }

  const pages = {
    dashboard: <Dashboard onNavigate={setPage} user={user} />,
    daily:     <DailyLog />,
    monthly:   <MonthlyView />,
    tips:      <SavingTips />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF9F7]">
      <Sidebar
        active={page}
        onNavigate={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
        user={user}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[220px]">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          {pages[page] || pages.dashboard}
        </main>
      </div>
    </div>
  );
}