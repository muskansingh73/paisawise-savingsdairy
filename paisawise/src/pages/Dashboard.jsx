import { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Wallet, TrendingDown, PiggyBank,
  CircleDollarSign, Plus, ArrowRight, Sun
} from 'lucide-react';

import StatCard              from '../components/StatCard';
import CategoryBar           from '../components/CategoryBar';
import EntryRow              from '../components/EntryRow';
import TipCard               from '../components/TipCard';
import BudgetWarningBanner   from '../components/BudgetWarningBanner';  // ← new

import {
  fetchUser,
  fetchMonthlyExpenses,
  fetchTodayEntries,
  fetchWeeklySpend,
  fetchSavingTips,
  fetchCategoryBudgets,   // ← new
  getTotalSpent,
  getTodayTotal,
} from '../services/api';

import { CATEGORIES } from '../data/mockData';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-black/10 rounded-xl px-3 py-2 text-[12px] shadow-sm">
      <div className="text-ink-400 mb-1">{label}</div>
      <div className="font-mono font-medium" style={{ color: payload[0]?.color }}>
        ₹{Number(payload[0]?.value).toLocaleString('en-IN')}
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const [user,         setUser]     = useState(null);
  const [expenses,     setExpenses] = useState({});
  const [budgets,      setBudgets]  = useState({});   // ← new
  const [todayEntries, setToday]    = useState([]);
  const [weeklySpend,  setWeekly]   = useState([]);
  const [tips,         setTips]     = useState([]);
  const [loading,      setLoading]  = useState(true);
  const [error,        setError]    = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchUser(),
      fetchMonthlyExpenses(),
      fetchTodayEntries(),
      fetchWeeklySpend(),
      fetchSavingTips(),
      fetchCategoryBudgets(),   // ← new
    ])
      .then(([u, exp, today, weekly, t, b]) => {
        setUser(u);
        setExpenses(exp);
        setToday(today);
        setWeekly(weekly);
        setTips(t);
        setBudgets(b);          // ← new
      })
      .catch(err => {
        console.error('Dashboard load error:', err);
        setError('Failed to load data. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-300 animate-pulse text-sm">Loading your finances…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-flame-500 text-sm">{error}</p>
      </div>
    );
  }

  const income     = user?.monthlyIncome || 0;
  const goalAmt    = user?.savingsGoal   || 0;
  const totalSpent = getTotalSpent(expenses);
  const savedAmt   = expenses.savings || 0;
  const balance    = income - totalSpent;
  const todayTotal = getTodayTotal(todayEntries);
  const spentPct   = income > 0 ? Math.round((totalSpent / income) * 100) : 0;
  const savingsPct = goalAmt > 0 ? Math.round((savedAmt  / goalAmt)  * 100) : 0;

  const donutData = CATEGORIES
    .filter(c => c.id !== 'savings' && expenses[c.id] > 0)
    .map(c => ({ name: c.label, value: expenses[c.id], color: c.color }));

  const sortedCategories = CATEGORIES
    .filter(c => expenses[c.id] > 0)
    .sort((a, b) => (expenses[b.id] || 0) - (expenses[a.id] || 0));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-full">

      {/* Desktop top bar */}
      <header className="hidden lg:flex bg-white border-b border-black/[0.07] px-7 py-4 items-center justify-between sticky top-0 z-10 fade-in">
        <div>
          <div className="flex items-center gap-2">
            <Sun size={14} className="text-amber-400" />
            <span className="text-[11px] text-ink-400">{greeting}</span>
          </div>
          <h1 className="font-display font-semibold text-[18px] text-ink-900 mt-0.5">
            {user?.name}'s Dashboard
          </h1>
        </div>
        <button onClick={() => onNavigate('daily')} className="btn-primary">
          <Plus size={14} /> Add expense
        </button>
      </header>

      {/* Mobile greeting */}
      <div className="lg:hidden px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Sun size={12} className="text-amber-400" />
            <span className="text-[11px] text-ink-400">{greeting}</span>
          </div>
          <h1 className="font-display font-semibold text-[16px] text-ink-900">
            {user?.name}'s Dashboard
          </h1>
        </div>
        <button onClick={() => onNavigate('daily')} className="btn-primary px-3 py-2 text-[12px]">
          <Plus size={13} /> Add
        </button>
      </div>

      <div className="px-4 sm:px-6 lg:px-7 py-4 lg:py-6 flex flex-col gap-4 lg:gap-5">

        {/* ── Budget warnings — shows when near/over limit ── */}
        <BudgetWarningBanner expenses={expenses} budgets={budgets} />

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard label="Monthly income" value={`₹${income.toLocaleString('en-IN')}`}       sub={user?.month || ''}             accent="green"  icon={Wallet}           emoji="💰" gradient="bg-rupee-400" delay={1} />
          <StatCard label="Total spent"    value={`₹${totalSpent.toLocaleString('en-IN')}`}   sub={`${spentPct}% of income`}      accent="red"    icon={TrendingDown}     emoji="📉" gradient="bg-flame-400" delay={2} />
          <StatCard label="Saved so far"   value={`₹${savedAmt.toLocaleString('en-IN')}`}     sub={`${savingsPct}% of goal`}      accent="blue"   icon={PiggyBank}        emoji="🐷" gradient="bg-sapphire-400" delay={3} />
          <StatCard label="Balance left"   value={`₹${balance.toLocaleString('en-IN')}`}      sub={`${100 - spentPct}% remaining`} accent="violet" icon={CircleDollarSign} emoji="🏦" gradient="bg-violet-400" delay={4} />
        </div>

        {/* Category breakdown + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Category bars — now shows budget comparison */}
          <div className="card px-4 sm:px-5 py-4 sm:py-5 fade-up delay-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[14px] text-ink-800">
                Spending vs budget
              </h2>
              <span className="text-[11px] text-ink-400">{user?.month}</span>
            </div>

            {sortedCategories.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <span className="text-3xl">📭</span>
                <p className="text-[12px] text-ink-400">No expenses yet this month</p>
                <button onClick={() => onNavigate('daily')} className="text-[12px] text-rupee-600 font-medium">
                  Add your first expense →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {sortedCategories.map((cat, i) => {
                  const spent  = expenses[cat.id] || 0;
                  const budget = budgets[cat.id]  || 0;
                  const pct    = budget > 0 ? Math.round((spent / budget) * 100) : 0;
                  const isOver = pct >= 100;
                  const isWarn = pct >= 80 && !isOver;

                  return (
                    <div key={cat.id} className={`fade-up delay-${i + 1}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-[15px] flex-shrink-0"
                          style={{ background: cat.bg }}>
                          {cat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[12px] font-medium text-ink-700">{cat.label}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] font-mono font-semibold text-ink-800">
                                ₹{spent.toLocaleString('en-IN')}
                              </span>
                              {budget > 0 && (
                                <span className="text-[10px] text-ink-400">
                                  / ₹{budget.toLocaleString('en-IN')}
                                </span>
                              )}
                              {isOver && (
                                <span className="text-[10px] bg-flame-50 text-flame-600 font-semibold px-1.5 py-0.5 rounded-full">
                                  Over!
                                </span>
                              )}
                              {isWarn && (
                                <span className="text-[10px] bg-amber-50 text-amber-600 font-semibold px-1.5 py-0.5 rounded-full">
                                  {pct}%
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${budget > 0 ? Math.min(pct, 100) : Math.min((spent / totalSpent) * 100, 100)}%`,
                                background: isOver ? '#D85A30' : isWarn ? '#EF9F27' : cat.color,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Donut + savings goal */}
          <div className="card px-4 sm:px-5 py-4 sm:py-5 fade-up delay-3">
            <h2 className="font-display font-semibold text-[14px] text-ink-800 mb-4">
              Budget overview
            </h2>
            {donutData.length === 0 ? (
              <div className="flex flex-col items-center py-8 gap-2">
                <span className="text-3xl">🍩</span>
                <p className="text-[12px] text-ink-400">Add expenses to see your breakdown</p>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div style={{ width: 130, height: 130, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={donutData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value">
                        {donutData.map((d, i) => <Cell key={i} fill={d.color} stroke="none" />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  {donutData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-[11px] text-ink-600 flex-1 truncate">{d.name}</span>
                      <span className="text-[11px] font-mono text-ink-500">
                        {Math.round((d.value / totalSpent) * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-black/[0.06]">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-ink-500">Savings goal</span>
                <span className="font-mono font-medium text-rupee-600">
                  ₹{savedAmt.toLocaleString('en-IN')} / ₹{goalAmt.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                <div className="h-full bg-rupee-400 rounded-full" style={{ width: `${Math.min(savingsPct, 100)}%` }} />
              </div>
              <div className="text-[10px] text-ink-400 mt-1">{savingsPct}% of goal reached</div>
            </div>
          </div>
        </div>

        {/* Weekly + Today + Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <div className="card px-4 sm:px-5 py-4 sm:py-5 md:col-span-2 lg:col-span-1 fade-up delay-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-[14px] text-ink-800">This week</h2>
              <span className="text-[11px] text-ink-400">Daily spend</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weeklySpend} barSize={16} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8C8980' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#8C8980' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F4F1' }} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {weeklySpend.map((entry, i) => (
                    <Cell key={i} fill={entry.amount === Math.max(...weeklySpend.map(w => w.amount)) ? '#1D9E75' : '#DDD9D0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card px-4 sm:px-5 py-4 sm:py-5 fade-up delay-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-[14px] text-ink-800">Today's log</h2>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-ink-700">₹{todayTotal.toLocaleString('en-IN')}</span>
                <button onClick={() => onNavigate('daily')} className="flex items-center gap-1 text-[10px] text-rupee-600 font-medium">
                  All <ArrowRight size={10} />
                </button>
              </div>
            </div>
            {todayEntries.length === 0 ? (
              <div className="flex flex-col items-center py-6 gap-2">
                <span className="text-2xl">☀️</span>
                <p className="text-[12px] text-ink-400 text-center">No expenses today</p>
                <button onClick={() => onNavigate('daily')} className="text-[11px] text-rupee-600 font-medium">Log first expense →</button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: 200 }}>
                {todayEntries.slice(0, 6).map(entry => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>

          <div className="card px-4 sm:px-5 py-4 sm:py-5 fade-up delay-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-[14px] text-ink-800">Saving tips</h2>
              <button onClick={() => onNavigate('tips')} className="flex items-center gap-1 text-[10px] text-rupee-600 font-medium">
                All <ArrowRight size={10} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {tips.slice(0, 4).map((tip, i) => <TipCard key={i} tip={tip} delay={i + 1} />)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}