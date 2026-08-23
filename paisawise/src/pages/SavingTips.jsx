import { useState, useEffect } from "react";
import { Lightbulb, Filter } from "lucide-react";

import TipDetailCard       from "../components/TipDetailCard";
import SpendingHealthScore from "../components/SpendingHealthScore";
import RuleCalculator      from "../components/RuleCalculator";

import {
  fetchUser, fetchMonthlyExpenses,
  fetchDetailedTips, getTotalSpent
} from "../services/api";

function computeHealthScore(expenses, income) {
  const totalSpent = getTotalSpent(expenses);
  const saved      = expenses.savings || 0;
  const spentPct   = totalSpent / income;
  const savingsScore  = Math.round(Math.min((saved / (income * 0.20)) * 25, 25));
  const spendingScore = Math.round(Math.max(0, (1 - (spentPct - 0.5)) * 25));
  const foodScore     = Math.round(Math.min(25, Math.max(0, 25 - ((expenses.food || 0) / income - 0.15) * 100)));
  const travelScore   = Math.round(Math.min(25, Math.max(0, 25 - ((expenses.travel || 0) / income - 0.10) * 100)));
  return {
    total: Math.min(100, savingsScore + spendingScore + foodScore + travelScore),
    breakdown: [
      { label: "Savings rate",     score: savingsScore  },
      { label: "Overall spending", score: spendingScore },
      { label: "Food budget",      score: foodScore     },
      { label: "Travel budget",    score: travelScore   },
    ],
  };
}

const FILTER_CATEGORIES = [
  { id: "all",           label: "All",          icon: "✨" },
  { id: "food",          label: "Food",         icon: "🍕" },
  { id: "travel",        label: "Travel",       icon: "🚌" },
  { id: "shopping",      label: "Shopping",     icon: "🛍️" },
  { id: "savings",       label: "Savings",      icon: "💰" },
  { id: "entertainment", label: "Fun",          icon: "🎮" },
];

export default function SavingTips() {
  const [user,     setUser]     = useState(null);
  const [expenses, setExpenses] = useState({});
  const [tips,     setTips]     = useState([]);
  const [filter,   setFilter]   = useState("all");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([fetchUser(), fetchMonthlyExpenses(), fetchDetailedTips()])
      .then(([u, exp, t]) => { setUser(u); setExpenses(exp); setTips(t); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-300 animate-pulse text-sm">Analysing your spending…</p>
      </div>
    );
  }

  const totalSpent   = getTotalSpent(expenses);
  const saved        = expenses.savings || 0;
  const health       = computeHealthScore(expenses, user.monthlyIncome);
  const filteredTips = filter === "all" ? tips : tips.filter(t => t.category === filter);
  const totalSaving  = tips.filter(t => t.saving > 0).reduce((a, t) => a + t.saving, 0);

  return (
    <div className="min-h-full">

      {/* Top bar */}
      <header className="bg-white border-b border-black/[0.07] px-4 sm:px-7 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10 fade-in">
        <div className="hidden sm:flex items-center gap-3">
          <Lightbulb size={16} className="text-amber-400" />
          <h1 className="font-display font-semibold text-[18px] text-ink-900">Saving Tips</h1>
        </div>
        <div className="flex items-center gap-2 bg-rupee-50 px-3 sm:px-4 py-2 rounded-xl">
          <span className="text-[11px] text-rupee-600 font-medium hidden sm:inline">Potential savings:</span>
          <span className="font-mono font-bold text-[13px] sm:text-[14px] text-rupee-700">
            ₹{totalSaving.toLocaleString("en-IN")}/mo
          </span>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-7 py-4 lg:py-6 flex flex-col gap-4 lg:gap-6">

        {/* Health score + 50/30/20 — stacked mobile, side by side desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendingHealthScore score={health.total} breakdown={health.breakdown} />
          <RuleCalculator income={user.monthlyIncome} spent={totalSpent} saved={saved} />
        </div>

        {/* Filter tabs — scrollable on mobile */}
        <div>
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
            <Filter size={13} className="text-ink-400 flex-shrink-0" />
            <div className="flex items-center gap-1.5">
              {FILTER_CATEGORIES.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap flex-shrink-0
                    ${filter === f.id
                      ? "bg-rupee-400 text-white"
                      : "bg-white border border-ink-100 text-ink-600 hover:border-ink-200"
                    }`}
                >
                  <span>{f.icon}</span> {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tips — 1 col mobile, 2 col desktop */}
          {filteredTips.length === 0 ? (
            <div className="card px-5 py-12 flex flex-col items-center gap-2 text-center">
              <div className="text-3xl mb-1">🎉</div>
              <p className="text-[13px] font-medium text-ink-500">No tips for this category</p>
              <p className="text-[11px] text-ink-300">You're doing great here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTips.map((tip, i) => (
                <TipDetailCard key={tip.id} tip={tip} delay={(i % 4) + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-rupee-400 to-rupee-600 rounded-2xl px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between fade-up delay-3">
          <div>
            <div className="font-display font-bold text-[14px] sm:text-[16px] text-white mb-1">
              Save ₹{totalSaving.toLocaleString("en-IN")} more this month 🚀
            </div>
            <div className="text-[11px] sm:text-[12px] text-rupee-100">
              Small changes add up. Even 2-3 of these tips make a big difference.
            </div>
          </div>
          <div className="text-[32px] sm:text-[40px] ml-4 flex-shrink-0">💰</div>
        </div>

      </div>
    </div>
  );
}
