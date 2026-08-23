import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

import AddExpenseForm  from "../components/AddExpenseForm";
import DayEntriesList  from "../components/DayEntriesList";
import DaySummaryPanel from "../components/DaySummaryPanel";

import {
  fetchTodayEntries, fetchMonthlyExpenses, fetchUser,
  addExpenseEntry, deleteExpenseEntry
} from "../services/api";

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long"
  });
}
function formatDateShort(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric", month: "short"
  });
}
function toKey(date) {
  return date.toISOString().slice(0, 10);
}

export default function DailyLog() {
  const [date,     setDate]     = useState(new Date());
  const [entries,  setEntries]  = useState([]);
  const [expenses, setExpenses] = useState({});
  const [user,     setUser]     = useState(null);
  const [loading,  setLoading]  = useState(true);

  const today   = new Date();
  const isToday = toKey(date) === toKey(today);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTodayEntries(toKey(date)),
      fetchMonthlyExpenses(),
      fetchUser(),
    ]).then(([e, exp, u]) => {
      setEntries(e); setExpenses(exp); setUser(u); setLoading(false);
    });
  }, [date]);

  function goBack()    { setDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; }); }
  function goForward() {
    if (isToday) return;
    setDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
  }

  async function handleAdd(entry) {
    const saved = await addExpenseEntry(entry);
    setEntries(prev => [...prev, saved]);
  }
  async function handleDelete(id) {
    await deleteExpenseEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-300 animate-pulse text-sm">Loading…</p>
      </div>
    );
  }

  const dayTotal = entries.reduce((a, e) => a + e.amount, 0);

  return (
    <div className="min-h-full">

      {/* Top bar */}
      <header className="bg-white border-b border-black/[0.07] px-4 sm:px-7 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10">
        {/* Title — hidden on mobile to save space */}
        <div className="hidden sm:flex items-center gap-3">
          <CalendarDays size={16} className="text-rupee-400" />
          <h1 className="font-display font-semibold text-[18px] text-ink-900">Daily Log</h1>
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-xl bg-ink-50 hover:bg-ink-100 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={15} className="text-ink-600" />
          </button>

          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-ink-50 rounded-xl">
            {/* Short date on mobile, full on desktop */}
            <span className="text-[12px] sm:text-[13px] font-medium text-ink-800">
              <span className="sm:hidden">{formatDateShort(date)}</span>
              <span className="hidden sm:inline">{formatDate(date)}</span>
            </span>
            {isToday && (
              <span className="text-[10px] bg-rupee-50 text-rupee-700 font-medium px-2 py-0.5 rounded-full">
                Today
              </span>
            )}
          </div>

          <button
            onClick={goForward}
            disabled={isToday}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors
              ${isToday ? "bg-ink-50 opacity-30 cursor-not-allowed" : "bg-ink-50 hover:bg-ink-100"}`}
          >
            <ChevronRight size={15} className="text-ink-600" />
          </button>
        </div>

        {/* Day total */}
        <div className="bg-rupee-50 px-3 sm:px-4 py-2 rounded-xl">
          <span className="text-[11px] text-rupee-600 font-medium hidden sm:inline">Total: </span>
          <span className="font-mono font-semibold text-[12px] sm:text-[13px] text-rupee-800">
            ₹{dayTotal.toLocaleString("en-IN")}
          </span>
        </div>
      </header>

      {/* Body
          Mobile:  stacked (form → entries → summary panel)
          Tablet:  stacked but wider
          Desktop: 2/3 + 1/3 side-by-side */}
      <div className="px-4 sm:px-6 lg:px-7 py-4 lg:py-6">
        <div className="flex flex-col lg:grid lg:gap-5" style={{ gridTemplateColumns: "1fr 280px" }}>

          {/* Left — form + entries */}
          <div className="flex flex-col gap-4 min-w-0">
            <AddExpenseForm onAdd={handleAdd} />
            <DayEntriesList entries={entries} onDelete={handleDelete} />
          </div>

          {/* Right — summary panel (below on mobile, sidebar on desktop) */}
          <div className="mt-4 lg:mt-0">
            <DaySummaryPanel
              entries={entries}
              monthlyExpenses={expenses}
              monthlyIncome={user?.monthlyIncome || 45000}
            />
          </div>

        </div>
      </div>
    </div>
  );
}