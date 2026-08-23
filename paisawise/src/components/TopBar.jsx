import { Menu, IndianRupee } from "lucide-react";

const pageTitles = {
  dashboard: "Dashboard",
  daily:     "Daily Log",
  monthly:   "Monthly View",
  tips:      "Saving Tips",
};

export default function TopBar({ page, onMenuClick }) {
  return (
    <header className="lg:hidden flex items-center justify-between bg-white border-b border-black/[0.07] px-4 py-3 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="w-9 h-9 rounded-xl bg-ink-50 flex items-center justify-center text-ink-600 hover:bg-ink-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-rupee-400 flex items-center justify-center">
          <IndianRupee size={13} className="text-white" />
        </div>
        <span className="font-display font-bold text-[15px] text-ink-900">
          Paisa<span className="text-rupee-400">Wise</span>
        </span>
      </div>

      <div className="w-9" /> {/* spacer to center logo */}
    </header>
  );
}