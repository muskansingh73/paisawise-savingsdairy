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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Logo ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '12px',
            background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <IndianRupee size={17} color="white" />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', color: '#1A1917' }}>
            Paisa<span style={{ color: '#1D9E75' }}>Wise</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden"
          style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: '#F5F3EE', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={15} color="#8C8980" />
        </button>
      </div>

      {/* ── Nav items ── */}
      <nav style={{ padding: '12px', flexShrink: 0 }}>
        <p style={{
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#C8C5BB',
          padding: '0 12px', marginBottom: '8px'
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
                width: '100%', padding: '12px', borderRadius: '16px',
                marginBottom: '4px', border: 'none', cursor: 'pointer',
                background: isActive ? '#1D9E75' : 'transparent',
                color: isActive ? 'white' : '#5C5A54',
                fontSize: '14px', fontWeight: 500,
                fontFamily: 'DM Sans, sans-serif',
                textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = '#F5F3EE';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{emoji}</span>
              {label}
            </button>
          );
        })}
      </nav>

      {/* ── Spacer — pushes bottom section down ── */}
      <div style={{ flex: 1 }} />

      {/* ── Bottom section — always visible, never scrolls away ── */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        flexShrink: 0,
        background: 'white',
      }}>

        {/* Month badge */}
        <div style={{
          background: 'linear-gradient(135deg, #E1F5EE, #d4f0e6)',
          borderRadius: '16px', padding: '12px 16px', marginBottom: '8px'
        }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#0F6E56', marginBottom: '2px' }}>
            {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
          <p style={{ fontSize: '12px', color: '#1D9E75', fontWeight: 500 }}>
            Day {new Date().getDate()} of {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
          </p>
        </div>

        {/* User info */}
        {user && (
          <div style={{
            background: '#F5F3EE', borderRadius: '16px',
            padding: '10px 14px', marginBottom: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'
          }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize: '13px', fontWeight: 600, color: '#1A1917',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {user.name}
              </p>
              <p style={{
                fontSize: '11px', color: '#8C8980',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                {user.email}
              </p>
            </div>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#1D9E75', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0
            }}>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            width: '100%', padding: '11px 14px', borderRadius: '16px',
            border: '1.5px solid #F5C4B3', background: '#FAECE7',
            color: '#993C1D', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F5C4B3';
            e.currentTarget.style.borderColor = '#D85A30';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#FAECE7';
            e.currentTarget.style.borderColor = '#F5C4B3';
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
      {/* Desktop sidebar — always visible */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-black/[0.05] z-20"
        style={{ width: 'var(--sidebar-w)' }}
      >
        {content}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30"
          style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
          onClick={onClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="lg:hidden fixed top-0 left-0 h-screen bg-white z-40"
        style={{
          width: '280px',
          height: '100vh',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {content}
      </aside>
    </>
  );
}