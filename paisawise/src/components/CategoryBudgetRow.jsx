import { CATEGORIES } from "../data/mockData";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function CategoryBudgetRow({ categoryId, spent, budget, delay = 0 }) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return null;

  const pct      = budget > 0 ? Math.round((spent / budget) * 100) : 100;
  const isOver   = pct >= 100;
  const isWarn   = pct >= 80 && !isOver;
  const barColor = isOver ? "#D85A30" : isWarn ? "#EF9F27" : cat.color;
  const statusCls = isOver ? "text-flame-600" : isWarn ? "text-amber-600" : "text-rupee-600";

  return (
    <div className={`flex items-center gap-3 py-2.5 border-b border-ink-50 last:border-0 fade-up delay-${delay}`}>
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[15px] flex-shrink-0"
        style={{ background: cat.bg }}
      >
        {cat.icon}
      </div>

      {/* Name + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[12px] font-medium text-ink-700">{cat.label}</span>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-mono text-ink-800">
              ₹{spent.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-ink-400">
              / ₹{budget.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
          />
        </div>
      </div>

      {/* Status badge */}
      <div className={`flex items-center gap-1 text-[10px] font-medium w-16 justify-end ${statusCls}`}>
        {isOver
          ? <><AlertCircle size={10} /> Over</>
          : isWarn
          ? <><AlertCircle size={10} /> {pct}%</>
          : <><CheckCircle2 size={10} /> {pct}%</>
        }
      </div>
    </div>
  );
}