import { useEffect } from "react";
import {
  LayoutDashboard, CalendarDays, BarChart3, Lightbulb,
  Home, UtensilsCrossed, Bus, ShoppingBag, HeartPulse,
  Gamepad2, PiggyBank, IndianRupee, X, LogOut
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard",    Icon: LayoutDashboard },
  { id: "daily",     label: "Daily Log",    Icon: CalendarDays },
  { id: "monthly",   label: "Monthly View", Icon: BarChart3 },
  { id: "tips",      label: "Saving Tips",  Icon: Lightbulb },
];

const categoryItems = [
  { id: "rent",          label: "Rent & EMIs",   Icon: Home },
  { id: "food",          label: "Food",           Icon: UtensilsCrossed },
  { id: "travel",        label: "Travel",         Icon: Bus },
  { id: "shopping",      label: "Shopping",       Icon: ShoppingBag },
  { id: "health",        label: "Health",         Icon: HeartPulse },
  { id: "entertainment", label: "Entertainment",  Icon: Gamepad2 },
  { id: "savings",       label: "Savings",        Icon: PiggyBank },
];

export default function Sidebar({ active, onNavigate, isOpen, onClose, onLogout }) {
  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleNav = (id) => {
    onNavigate(id);
    onClose(); // close drawer on mobile after nav
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-black/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rupee-400 flex items-center justify-center">
            <IndianRupee size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-[17px] tracking-tight text-ink-900">
            Paisa<span className="text-rupee-400">Wise</span>
          </span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-xl bg-ink-50 flex items-center justify-center text-ink-500 hover:bg-ink-100 transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-2">
        <div className="flex flex-col gap-0.5">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] transition-all text-left
                  ${isActive
                    ? "bg-rupee-50 text-rupee-800 font-medium"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                  }`}
              >
                <Icon size={15} className={isActive ? "text-rupee-600" : "text-ink-400"} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 mb-1.5 px-3">
          <span className="text-[10px] font-medium tracking-widest uppercase text-ink-400">
            Categories
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          {categoryItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[12px] text-ink-500 hover:bg-ink-50 hover:text-ink-900 transition-all text-left"
            >
              <Icon size={14} className="text-ink-300" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Month badge */}
      <div className="px-3 pb-4 border-t border-black/[0.07]">
        <div className="bg-ink-50 rounded-xl px-3 py-2.5 mb-3">
          <div className="text-[11px] text-ink-400 mb-0.5">Current period</div>
          <div className="font-display font-semibold text-[13px] text-ink-800">June 2026</div>
          <div className="text-[10px] text-ink-400 mt-0.5">Day 7 of 30</div>
        </div>

        {/* Logout button */}
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] text-red-600 hover:bg-red-50 transition-all text-left font-medium"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar — always visible on lg+ ── */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-black/[0.07] z-20"
        style={{ width: "var(--sidebar-w)" }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile/Tablet drawer ── */}
      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30 fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen bg-white z-40 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "280px" }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}