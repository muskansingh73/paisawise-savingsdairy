import { CATEGORIES } from "../data/mockData";
import { TrendingUp } from "lucide-react";

export default function DaySummaryPanel({ entries, monthlyExpenses, monthlyIncome }) {
  const dayTotal = entries.reduce((a, e) => a + e.amount, 0);

  // Group entries by category
  const byCategory = {};
  entries.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const categoriesWithSpend = CATEGORIES
    .filter(c => byCategory[c.id])
    .sort((a, b) => byCategory[b.id] - byCategory[a.id]);

  const totalMonthly = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
  const monthPct     = Math.round((totalMonthly / monthlyIncome) * 100);

  return (
    <div className="flex flex-col gap-4">

      {/* Day category breakdown */}
      <div className="card px-4 py-4">
        <h3 className="font-display font-semibold text-[13px] text-ink-800 mb-3">
          Today's breakdown
        </h3>

        {categoriesWithSpend.length === 0 ? (
          <p className="text-[11px] text-ink-300 text-center py-4">Nothing logged yet</p>
        ) : (
          <div className="flex flex-col gap-3">
            {categoriesWithSpend.map(cat => {
              const amt = byCategory[cat.id];
              const pct = dayTotal > 0 ? Math.round((amt / dayTotal) * 100) : 0;
              return (
                <div key={cat.id} className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0"
                    style={{ background: cat.bg }}
                  >
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-medium text-ink-700">{cat.label}</span>
                      <span className="text-[11px] font-mono text-ink-800">₹{amt}</span>
                    </div>
                    <div className="h-1 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Day total */}
        {dayTotal > 0 && (
          <div className="mt-3 pt-3 border-t border-ink-100 flex justify-between items-center">
            <span className="text-[11px] text-ink-500">Day total</span>
            <span className="font-mono font-semibold text-[15px] text-ink-800">
              ₹{dayTotal.toLocaleString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* Monthly progress */}
      <div className="card px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={13} className="text-rupee-400" />
          <h3 className="font-display font-semibold text-[13px] text-ink-800">Monthly progress</h3>
        </div>

        <div className="flex justify-between text-[11px] text-ink-500 mb-1.5">
          <span>Spent so far</span>
          <span className="font-mono font-medium text-ink-800">
            ₹{totalMonthly.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="h-2 bg-ink-100 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-rupee-400 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(monthPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-ink-400">
          <span>{monthPct}% of income</span>
          <span>₹{(monthlyIncome - totalMonthly).toLocaleString("en-IN")} left</span>
        </div>

        {/* Per-category monthly breakdown */}
        <div className="mt-3 pt-3 border-t border-ink-100 flex flex-col gap-2">
          {CATEGORIES.filter(c => monthlyExpenses[c.id]).map(cat => (
            <div key={cat.id} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">{cat.icon}</span>
                <span className="text-[11px] text-ink-600">{cat.label}</span>
              </div>
              <span className="text-[11px] font-mono text-ink-700">
                ₹{monthlyExpenses[cat.id].toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak card */}
      <div className="card px-4 py-4">
        <h3 className="font-display font-semibold text-[13px] text-ink-800 mb-3">
          Logging streak
        </h3>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-[9px] text-ink-400">{d}</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-medium
                ${i < 2 ? "bg-rupee-50 text-rupee-700" : i === 2 ? "bg-rupee-400 text-white" : "bg-ink-50 text-ink-300"}`}>
                {i < 3 ? "✓" : i + 1}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-ink-500">
          <span className="text-rupee-600 font-semibold">3-day streak</span> — keep it up!
        </p>
      </div>

    </div>
  );
}