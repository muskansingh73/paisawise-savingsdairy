import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '../data/mockData';

export default function BudgetWarningBanner({ expenses, budgets }) {
  const [dismissed, setDismissed] = useState([]);

  const warnings = CATEGORIES
    .filter(cat => {
      const spent  = expenses[cat.id] || 0;
      const budget = budgets[cat.id]  || 0;
      if (budget === 0 || dismissed.includes(cat.id)) return false;
      const pct = (spent / budget) * 100;
      return pct >= 80; // warn at 80%
    })
    .map(cat => {
      const spent  = expenses[cat.id] || 0;
      const budget = budgets[cat.id]  || 0;
      const pct    = Math.round((spent / budget) * 100);
      const isOver = pct >= 100;
      return { ...cat, spent, budget, pct, isOver };
    });

  if (warnings.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 fade-up">
      {warnings.map(w => (
        <div
          key={w.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-2xl border ${
            w.isOver
              ? 'bg-flame-50 border-flame-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          {/* Icon */}
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
            w.isOver ? 'bg-flame-100' : 'bg-amber-100'
          }`}>
            <AlertTriangle
              size={15}
              className={w.isOver ? 'text-flame-600' : 'text-amber-600'}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className={`text-[13px] font-semibold mb-0.5 ${
              w.isOver ? 'text-flame-800' : 'text-amber-800'
            }`}>
              {w.isOver
                ? `${w.icon} ${w.label} budget exceeded!`
                : `${w.icon} ${w.label} budget almost full`
              }
            </div>
            <div className={`text-[11px] ${
              w.isOver ? 'text-flame-600' : 'text-amber-600'
            }`}>
              {w.isOver
                ? `You've spent ₹${w.spent.toLocaleString('en-IN')} — ₹${(w.spent - w.budget).toLocaleString('en-IN')} over your ₹${w.budget.toLocaleString('en-IN')} limit`
                : `₹${w.spent.toLocaleString('en-IN')} of ₹${w.budget.toLocaleString('en-IN')} used (${w.pct}%) — ₹${(w.budget - w.spent).toLocaleString('en-IN')} remaining`
              }
            </div>

            {/* Mini progress bar */}
            <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(w.pct, 100)}%`,
                  background: w.isOver ? '#D85A30' : '#EF9F27',
                }}
              />
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(d => [...d, w.id])}
            className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              w.isOver
                ? 'text-flame-400 hover:bg-flame-100'
                : 'text-amber-400 hover:bg-amber-100'
            }`}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}