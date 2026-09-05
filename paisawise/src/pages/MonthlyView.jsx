import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";

import MonthlyStatCard      from "../components/MonthlyStatCard";
import CategoryBudgetRow    from "../components/CategoryBudgetRow";
import WeeklyTrendChart     from "../components/WeeklyTrendChart";
import MonthComparisonChart from "../components/MonthComparisonChart";
import BudgetEditor         from "../components/BudgetEditor";

import {
  fetchUser, fetchMonthlyExpenses, fetchMonthlyTrend,
  fetchCategoryBudgets, fetchPastMonths, getTotalSpent
} from "../services/api";
import { CATEGORIES } from "../data/mockData";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function MonthlyView() {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [year,       setYear]       = useState(new Date().getFullYear());
  const [user,       setUser]       = useState(null);
  const [expenses,   setExpenses]   = useState({});
  const [budgets,    setBudgets]    = useState({});
  const [trend,      setTrend]      = useState([]);
  const [pastMonths, setPastMonths] = useState([]);
  const [loading,    setLoading]    = useState(true);

  const monthLabel = `${MONTHS[monthIndex]} ${year}`;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchUser(),
      fetchMonthlyExpenses(monthLabel),
      fetchMonthlyTrend(),
      fetchCategoryBudgets(),   // ← index 3 → b
      fetchPastMonths(),        // ← index 4 → pm
    ]).then(([u, exp, t, b, pm]) => {
      setUser(u);
      setExpenses(exp);
      setTrend(t);
      setBudgets(b);       // ← correct
      setPastMonths(pm);   // ← correct
      setLoading(false);
    }).catch(err => {
      console.error('Monthly view error:', err);
      setLoading(false);
    });
  }, [monthIndex, year]);

  function handleBudgetUpdate(categoryId, amount, newBudgets) {
    if (newBudgets) {
      setBudgets(newBudgets);
    } else {
      setBudgets(prev => ({ ...prev, [categoryId]: amount }));
    }
  }

  function goPrev() {
    if (monthIndex === 0) { setMonthIndex(11); setYear(y => y - 1); }
    else setMonthIndex(m => m - 1);
  }

  function goNext() {
    const now = new Date();
    if (monthIndex === now.getMonth() && year === now.getFullYear()) return;
    if (monthIndex === 11) { setMonthIndex(0); setYear(y => y + 1); }
    else setMonthIndex(m => m + 1);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-300 animate-pulse text-sm">Loading monthly data…</p>
      </div>
    );
  }

  const totalSpent = getTotalSpent(expenses);
  const savedAmt   = expenses.savings || 0;
  const balance    = (user?.monthlyIncome || 0) - totalSpent;
  const spentPct   = user?.monthlyIncome > 0
    ? Math.round((totalSpent / user.monthlyIncome) * 100)
    : 0;
  const savingsPct = user?.savingsGoal > 0
    ? Math.round((savedAmt / user.savingsGoal) * 100)
    : 0;

  const currentIdx  = pastMonths.findIndex(m => m.month === monthLabel);
  const prevMonth   = currentIdx > 0 ? pastMonths[currentIdx - 1] : null;
  const spentChange = prevMonth
    ? Math.round(((totalSpent - prevMonth.totalSpent) / prevMonth.totalSpent) * 100)
    : null;
  const savedChange = prevMonth && prevMonth.saved > 0
    ? Math.round(((savedAmt - prevMonth.saved) / prevMonth.saved) * 100)
    : null;

  const sortedCategories = CATEGORIES
    .filter(c => (expenses[c.id] || 0) > 0 || (budgets[c.id] || 0) > 0)
    .sort((a, b) => (expenses[b.id] || 0) - (expenses[a.id] || 0));

  const now = new Date();
  const isCurrentMonth = monthIndex === now.getMonth() && year === now.getFullYear();

  // Safe trend min/max
  const trendSpends  = trend.map(t => t.spent || 0);
  const maxTrend     = trendSpends.length > 0 ? Math.max(...trendSpends) : 0;
  const minTrend     = trendSpends.length > 0 ? Math.min(...trendSpends) : 0;
  const highestWeek  = trend.find(t => t.spent === maxTrend);
  const lowestWeek   = trend.find(t => t.spent === minTrend);

  return (
    <div className="min-h-full">

      {/* Top bar */}
      <header className="bg-white border-b border-black/[0.07] px-4 sm:px-7 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10 fade-in">
        <div className="hidden sm:flex items-center gap-3">
          <BarChart3 size={16} className="text-sapphire-400" />
          <h1 className="font-display font-semibold text-[18px] text-ink-900">Monthly View</h1>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="w-8 h-8 rounded-xl bg-ink-50 hover:bg-ink-100 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={15} className="text-ink-600" />
          </button>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-ink-50 rounded-xl">
            <span className="text-[12px] sm:text-[13px] font-medium text-ink-800">
              {monthLabel}
            </span>
            {isCurrentMonth && (
              <span className="text-[10px] bg-rupee-50 text-rupee-700 font-medium px-2 py-0.5 rounded-full hidden sm:inline">
                Current
              </span>
            )}
          </div>
          <button
            onClick={goNext}
            disabled={isCurrentMonth}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors
              ${isCurrentMonth
                ? "bg-ink-50 opacity-30 cursor-not-allowed"
                : "bg-ink-50 hover:bg-ink-100"
              }`}
          >
            <ChevronRight size={15} className="text-ink-600" />
          </button>
        </div>

        <div className="bg-ink-50 px-3 sm:px-4 py-2 rounded-xl">
          <span className="text-[11px] text-ink-500 hidden sm:inline">Income: </span>
          <span className="font-mono font-semibold text-[12px] sm:text-[13px] text-ink-800">
            ₹{(user?.monthlyIncome || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-7 py-4 lg:py-6 flex flex-col gap-4 lg:gap-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <MonthlyStatCard
            label="Total spent"
            value={`₹${totalSpent.toLocaleString("en-IN")}`}
            sub={`${spentPct}% of income`}
            change={spentChange}
            accent="red"
            delay={1}
          />
          <MonthlyStatCard
            label="Amount saved"
            value={`₹${savedAmt.toLocaleString("en-IN")}`}
            sub={`${savingsPct}% of goal`}
            change={savedChange}
            accent="green"
            delay={2}
          />
          <MonthlyStatCard
            label="Balance left"
            value={`₹${balance.toLocaleString("en-IN")}`}
            sub={`${100 - spentPct}% left`}
            accent="violet"
            delay={3}
          />
          <MonthlyStatCard
            label="Avg daily spend"
            value={`₹${Math.round(totalSpent / 30).toLocaleString("en-IN")}`}
            sub="per day"
            accent="amber"
            delay={4}
          />
        </div>

        {/* Category budgets + Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Category budget rows */}
          <div className="card px-4 sm:px-5 py-4 sm:py-5 fade-up delay-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-[13px] sm:text-[14px] text-ink-800">
                Category budgets
              </h2>
              <div className="hidden sm:flex items-center gap-3 text-[10px] text-ink-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rupee-400 inline-block" /> On track
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Near limit
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-flame-400 inline-block" /> Over
                </span>
              </div>
            </div>

            {sortedCategories.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <span className="text-2xl">📊</span>
                <p className="text-[12px] text-ink-400">No spending data yet</p>
              </div>
            ) : (
              sortedCategories.map((cat, i) => (
                <CategoryBudgetRow
                  key={cat.id}
                  categoryId={cat.id}
                  spent={expenses[cat.id] || 0}
                  budget={budgets[cat.id]  || 0}
                  delay={i + 1}
                />
              ))
            )}
          </div>

          {/* Weekly trend */}
          <div className="card px-4 sm:px-5 py-4 sm:py-5 fade-up delay-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[13px] sm:text-[14px] text-ink-800">
                Week-by-week trend
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-ink-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-flame-400 inline-block" /> Spent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rupee-400 inline-block" /> Saved
                </span>
              </div>
            </div>

            {trend.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <span className="text-2xl">📈</span>
                <p className="text-[12px] text-ink-400">No trend data yet</p>
              </div>
            ) : (
              <>
                <WeeklyTrendChart data={trend} />
                <div className="mt-4 pt-4 border-t border-ink-100 grid grid-cols-2 gap-3">
                  <div className="bg-flame-50 rounded-xl px-3 py-2.5">
                    <div className="text-[10px] text-flame-600 font-medium mb-0.5">Highest week</div>
                    <div className="font-mono font-semibold text-[13px] sm:text-[14px] text-flame-700">
                      ₹{maxTrend.toLocaleString("en-IN")}
                    </div>
                    {highestWeek && (
                      <div className="text-[10px] text-flame-500">{highestWeek.week}</div>
                    )}
                  </div>
                  <div className="bg-rupee-50 rounded-xl px-3 py-2.5">
                    <div className="text-[10px] text-rupee-600 font-medium mb-0.5">Lowest week</div>
                    <div className="font-mono font-semibold text-[13px] sm:text-[14px] text-rupee-700">
                      ₹{minTrend.toLocaleString("en-IN")}
                    </div>
                    {lowestWeek && (
                      <div className="text-[10px] text-rupee-500">{lowestWeek.week}</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Month comparison + Budget editor + Savings ring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Month comparison — spans 2 cols on desktop */}
          <div className="card px-4 sm:px-5 py-4 sm:py-5 lg:col-span-2 fade-up delay-2">
            <h2 className="font-display font-semibold text-[13px] sm:text-[14px] text-ink-800 mb-4">
              Month comparison
            </h2>
            {pastMonths.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <span className="text-2xl">📅</span>
                <p className="text-[12px] text-ink-400">No historical data yet</p>
              </div>
            ) : (
              <>
                <MonthComparisonChart data={pastMonths} currentMonth={monthLabel} />
                <div className="mt-3 pt-3 border-t border-ink-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {pastMonths.map((m, i) => (
                    <div
                      key={i}
                      className={`rounded-xl px-3 py-2 text-center ${
                        m.month === monthLabel ? "bg-rupee-50" : "bg-ink-50"
                      }`}
                    >
                      <div className="text-[10px] text-ink-400 mb-0.5">
                        {m.month.split(" ")[0]}
                      </div>
                      <div className={`font-mono font-semibold text-[12px] sm:text-[13px] ${
                        m.month === monthLabel ? "text-rupee-700" : "text-ink-700"
                      }`}>
                        ₹{(m.totalSpent / 1000).toFixed(1)}k
                      </div>
                      <div className="text-[10px] text-ink-400">
                        saved ₹{(m.saved / 1000).toFixed(1)}k
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Savings ring */}
          <div className="card px-4 sm:px-5 py-4 sm:py-5 fade-up delay-3">
            <h2 className="font-display font-semibold text-[13px] sm:text-[14px] text-ink-800 mb-4">
              Savings summary
            </h2>
            <div className="flex justify-center mb-4">
              <div className="relative w-24 sm:w-28 h-24 sm:h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E4E2DA" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="#1D9E75" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40 * Math.min(savingsPct, 100) / 100} ${2 * Math.PI * 40}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display font-bold text-[18px] sm:text-[20px] text-ink-800">
                    {savingsPct}%
                  </span>
                  <span className="text-[9px] text-ink-400">of goal</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Saved",        value: `₹${savedAmt.toLocaleString("en-IN")}` },
                { label: "Goal",         value: `₹${(user?.savingsGoal || 0).toLocaleString("en-IN")}` },
                { label: "Still needed", value: `₹${Math.max(0, (user?.savingsGoal || 0) - savedAmt).toLocaleString("en-IN")}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-1.5 border-b border-ink-50 last:border-0 text-[11px] sm:text-[12px]">
                  <span className="text-ink-500">{r.label}</span>
                  <span className="font-mono font-semibold text-ink-800">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget editor — full width at bottom */}
        <BudgetEditor
          budgets={budgets}
          expenses={expenses}
          onUpdate={handleBudgetUpdate}
        />

      </div>
    </div>
  );
}