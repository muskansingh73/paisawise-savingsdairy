import { useState } from "react";
import { Plus, X } from "lucide-react";
import { CATEGORIES, QUICK_ADD } from "../data/mockData";

export default function AddExpenseForm({ onAdd }) {
  const [name,     setName]     = useState("");
  const [category, setCategory] = useState("");
  const [amount,   setAmount]   = useState("");
  const [error,    setError]    = useState("");

  function handleQuickAdd(chip) {
    setName(chip.name);
    setCategory(chip.category);
    if (chip.amount > 0) setAmount(String(chip.amount));
  }

  function handleSubmit() {
    if (!name.trim())    return setError("Enter an item name.");
    if (!category)       return setError("Pick a category.");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
                         return setError("Enter a valid amount.");

    const now = new Date();
    const time = now.toTimeString().slice(0, 5); // "HH:MM"

    onAdd({
      id:       Date.now(),
      name:     name.trim(),
      category,
      amount:   Number(amount),
      time,
    });

    // Reset
    setName(""); setCategory(""); setAmount(""); setError("");
  }

  return (
    <div className="card px-5 py-5">
      <h2 className="font-display font-semibold text-[14px] text-ink-800 mb-4 flex items-center gap-2">
        <Plus size={15} className="text-rupee-400" />
        Add new expense
      </h2>

      {/* Input row */}
      <div className="grid grid-cols-4 gap-2 mb-3">

        {/* Item name */}
        <input
          type="text"
          placeholder="What did you spend on?"
          value={name}
          onChange={e => { setName(e.target.value); setError(""); }}
          className="col-span-2 px-3 py-2 text-[12px] rounded-xl border border-ink-100 bg-ink-50 text-ink-800 placeholder-ink-300 focus:outline-none focus:border-rupee-400 focus:bg-white transition-colors"
        />

        {/* Category */}
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setError(""); }}
          className="px-3 py-2 text-[12px] rounded-xl border border-ink-100 bg-ink-50 text-ink-800 focus:outline-none focus:border-rupee-400 focus:bg-white transition-colors"
        >
          <option value="">Category</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>

        {/* Amount */}
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="₹ Amount"
            value={amount}
            onChange={e => { setAmount(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            className="flex-1 px-3 py-2 text-[12px] rounded-xl border border-ink-100 bg-ink-50 text-ink-800 placeholder-ink-300 focus:outline-none focus:border-rupee-400 focus:bg-white transition-colors min-w-0"
          />
          <button
            onClick={handleSubmit}
            className="bg-rupee-400 hover:bg-rupee-600 text-white px-3 py-2 rounded-xl text-[12px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 text-[11px] text-flame-600 mb-3">
          <X size={11} /> {error}
        </div>
      )}

      {/* Quick add chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-ink-400 font-medium uppercase tracking-wider">Quick add:</span>
        {QUICK_ADD.map((chip, i) => {
          const cat = CATEGORIES.find(c => c.id === chip.category);
          return (
            <button
              key={i}
              onClick={() => handleQuickAdd(chip)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-ink-100 bg-ink-50 hover:bg-white hover:border-ink-200 text-[11px] text-ink-600 hover:text-ink-900 transition-all"
            >
              <span>{cat?.icon}</span>
              {chip.name}
              {chip.amount > 0 && (
                <span className="text-ink-400">₹{chip.amount}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}