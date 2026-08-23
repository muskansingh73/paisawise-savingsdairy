import { CATEGORIES } from "../data/mockData";

export default function CategoryBar({ categoryId, amount, total, delay = 0 }) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return null;

  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 fade-up delay-${delay}`}>
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[15px] flex-shrink-0"
        style={{ background: cat.bg }}
      >
        {cat.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[12px] font-medium text-ink-700">{cat.label}</span>
          <span className="text-[12px] font-mono font-medium text-ink-800">
            ₹{amount.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: cat.color }}
          />
        </div>
      </div>
      <div className="text-[11px] text-ink-400 w-8 text-right flex-shrink-0">{pct}%</div>
    </div>
  );
}