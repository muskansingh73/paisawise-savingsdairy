import { useEffect } from 'react';
import { IndianRupee, X, LogOut } from 'lucide-react';

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>

      {/* ── Logo — fixed at top ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '12px',
            background: '#1D9E75', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <IndianRupee size={16} color="white" />
          </div>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            fontSize: '16px', color: '#1A1917',
          }}>
            Paisa<span style={{ color: '#1D9E75' }}>Wise</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden"
          style={{
            width: '30px', height: '30px', borderRadius: '10px',
            background: '#F5F3EE', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={14} color="#8C8980" />
        </button>
      </div>

      {/* ── Nav — scrollable middle section ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        minHeight: 0,
      }}>
        <p style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#C8C5BB',
          padding: '0 10px', marginBottom: '6px',
        }}>
          Menu
        </p>
        {navItems.map(({ id, label, emoji }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', padding: '11px 12px', borderRadius: '14px',
                marginBottom: '3px', border: 'none', cursor: 'pointer',
                background: isActive ? '#1D9E75' : 'transparent',
                color: isActive ? 'white' : '#5C5A54',
                fontSize: '14px', fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '17px', lineHeight: 1 }}>{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Bottom — ALWAYS pinned to bottom, never scrolls away ── */}
      <div style={{
        flexShrink: 0,
        padding: '10px 12px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        background: 'white',
      }}>

        {/* Month */}
        <div style={{
          background: 'linear-gradient(135deg, #E1F5EE, #d4f0e6)',
          borderRadius: '14px', padding: '10px 14px', marginBottom: '8px',
        }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#0F6E56', margin: 0 }}>
            {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          <p style={{ fontSize: '11px', color: '#1D9E75', margin: '2px 0 0', fontWeight: 500 }}>
            Day {new Date().getDate()} of {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
          </p>
        </div>

        {/* User */}
        {user && (
          <div style={{
            background: '#F5F3EE', borderRadius: '14px',
            padding: '9px 12px', marginBottom: '8px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '8px',
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize: '13px', fontWeight: 600, color: '#1A1917',
                margin: 0, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user.name}
              </p>
              <p style={{
                fontSize: '10px', color: '#8C8980', margin: '2px 0 0',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {user.email}
              </p>
            </div>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: '#1D9E75', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Logout — always visible */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '10px 14px', borderRadius: '14px',
            border: '1.5px solid #F5C4B3', background: '#FAECE7',
            color: '#993C1D', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            boxSizing: 'border-box',
          }}
        >
          <LogOut size={15} color="#D85A30" />
          Logout
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 bg-white border-r border-black/[0.05] z-20"
        style={{ width: 'var(--sidebar-w)', height: '100dvh' }}
      >
        {content}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="lg:hidden fixed top-0 left-0 bg-white z-40"
        style={{
          width: '280px',
          height: '100dvh',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {content}
      </aside>
    </>
  );
}