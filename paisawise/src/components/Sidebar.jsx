import { useEffect } from 'react';
import {
  LayoutDashboard, CalendarDays, BarChart3, Lightbulb,
  IndianRupee, X, LogOut
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard',    emoji: '🏠' },
  { id: 'daily',     label: 'Daily Log',    emoji: '📅' },
  { id: 'monthly',   label: 'Monthly View', emoji: '📊' },
  { id: 'tips',      label: 'Saving Tips',  emoji: '💡' },
];

export default function Sidebar({ active, onNavigate, isOpen, onClose, user, onLogout }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleNav = (id) => { onNavigate(id); onClose(); };

  const content = (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-black/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rupee-400 flex items-center justify-center shadow-sm">
            <IndianRupee size={17} className="text-white" />
          </div>
          <span className="font-display font-bold text-[17px] text-ink-900">
            Paisa<span className="text-rupee-400">Wise</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-xl bg-[#F5F3EE] flex items-center justify-center text-ink-400 hover:bg-ink-100 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-300 px-3 mb-2">
          Menu
        </p>
        <div className="flex flex-col gap-1">
          {navItems.map(({ id, label, emoji }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-2xl text-[13px] font-medium transition-all text-left
                  ${isActive
                    ? 'bg-rupee-400 text-white shadow-sm'
                    : 'text-ink-600 hover:bg-[#F5F3EE] hover:text-ink-900'
                  }`}
              >
                <span className="text-[16px] leading-none">{emoji}</span>
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Bottom section ── */}
      <div className="px-3 pb-4 flex flex-col gap-3 border-t border-black/[0.05] pt-3">

        {/* Month progress */}
        <div className="bg-gradient-to-br from-rupee-50 to-[#E8F5F0] rounded-2xl px-4 py-3">
          <p className="text-[11px] text-rupee-600 font-semibold mb-0.5">
            {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-[12px] text-rupee-800 font-medium">
            Day {new Date().getDate()} of {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
          </p>
        </div>

        {/* User info */}
        {user && (
          <div className="bg-[#F5F3EE] rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink-800 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-ink-400 truncate">
                  {user.email}
                </p>
              </div>
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-rupee-400 flex items-center justify-center flex-shrink-0 ml-2">
                <span className="text-white text-[12px] font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Logout button — always visible */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 w-full px-4 py-3 rounded-2xl text-[13px] font-medium text-flame-600 hover:bg-flame-50 transition-all"
        >
          <LogOut size={15} className="text-flame-500" />
          Logout
        </button>

      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-black/[0.05] z-20"
        style={{ width: 'var(--sidebar-w)' }}
      >
        {content}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30 fade-in backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen bg-white z-40 flex flex-col transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '280px' }}
      >
        {content}
      </aside>
    </>
  );
}