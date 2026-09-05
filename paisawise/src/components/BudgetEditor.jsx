import { useState } from 'react';
import { Settings, Check, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { updateCategoryBudget, recalculateBudgets } from '../services/api';

export default function BudgetEditor({ budgets, expenses, onUpdate }) {
  const [editing,   setEditing]   = useState(null);
  const [editVal,   setEditVal]   = useState('');
  const [saving,    setSaving]    = useState(false);
  const [recalcing, setRecalcing] = useState(false);

  async function handleSave(categoryId) {
    if (!editVal || isNaN(Number(editVal))) return;
    setSaving(true);
    await updateCategoryBudget(categoryId, Number(editVal));
    onUpdate(categoryId, Number(editVal));
    setEditing(null);
    setEditVal('');
    setSaving(false);
  }

  async function handleRecalculate() {
    setRecalcing(true);
    const newBudgets = await recalculateBudgets();
    onUpdate(null, null, newBudgets);
    setRecalcing(false);
  }

  return (
    <div className="card px-4 sm:px-5 py-4 sm:py-5 fade-up delay-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings size={15} className="text-ink-400" />
          <h2 className="font-display font-semibold text-[14px] text-ink-800">
            Monthly budgets
          </h2>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={recalcing}
          className="flex items-center gap-1.5 text-[11px] text-rupee-600 font-medium hover:text-rupee-800 bg-rupee-50 px-3 py-1.5 rounded-xl transition-colors"
        >
          <RefreshCw size={11} className={recalcing ? 'animate-spin' : ''} />
          {recalcing ? 'Recalculating...' : 'Auto-calculate'}
        </button>
      </div>

      <p className="text-[11px] text-ink-400 mb-4">
        Tap any limit to edit it. Click "Auto-calculate" to reset based on your income.
      </p>

      <div className="flex flex-col gap-2">
        {CATEGORIES.map(cat => {
          const spent  = expenses[cat.id] || 0;
          const budget = budgets[cat.id]  || 0;
          const pct    = budget > 0 ? Math.round((spent / budget) * 100) : 0;
          const isOver = pct >= 100;
          const isWarn = pct >= 80 && !isOver;
          const barColor = isOver ? '#D85A30' : isWarn ? '#EF9F27' : cat.color;
          const isEditing = editing === cat.id;

          return (
            <div
              key={cat.id}
              className="flex items-center gap-3 py-2.5 border-b border-ink-50 last:border-0"
            >
              {/* Category icon */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[14px] flex-shrink-0"
                style={{ background: cat.bg }}
              >
                {cat.icon}
              </div>

              {/* Name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-ink-700">{cat.label}</span>
                  <div className="flex items-center gap-1">
                    {/* Spent */}
                    <span className="text-[11px] font-mono text-ink-600">
                      ₹{spent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-ink-300">/</span>

                    {/* Editable budget */}
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSave(cat.id)}
                          autoFocus
                          style={{
                            width: '70px',
                            padding: '2px 6px',
                            fontSize: '11px',
                            border: '1.5px solid #1D9E75',
                            borderRadius: '8px',
                            outline: 'none',
                            fontFamily: 'DM Mono, monospace',
                          }}
                        />
                        <button
                          onClick={() => handleSave(cat.id)}
                          disabled={saving}
                          className="w-5 h-5 rounded-lg bg-rupee-400 flex items-center justify-center"
                        >
                          <Check size={10} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditing(cat.id); setEditVal(String(budget)); }}
                        className="text-[11px] font-mono text-ink-500 hover:text-rupee-600 underline decoration-dashed underline-offset-2 transition-colors"
                      >
                        ₹{budget.toLocaleString('en-IN')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      background: barColor,
                    }}
                  />
                </div>

                {/* Status text */}
                <div className="flex justify-between mt-0.5">
                  <span className="text-[10px] text-ink-400">{pct}% used</span>
                  {isOver ? (
                    <span className="text-[10px] text-flame-600 font-medium">
                      ₹{(spent - budget).toLocaleString('en-IN')} over limit
                    </span>
                  ) : budget > 0 ? (
                    <span className="text-[10px] text-ink-400">
                      ₹{(budget - spent).toLocaleString('en-IN')} left
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}