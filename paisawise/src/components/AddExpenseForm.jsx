import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { CATEGORIES, QUICK_ADD } from '../data/mockData';

export default function AddExpenseForm({ onAdd }) {
  const [name,     setName]     = useState('');
  const [category, setCategory] = useState('');
  const [amount,   setAmount]   = useState('');
  const [error,    setError]    = useState('');
  const [adding,   setAdding]   = useState(false);

  function handleQuickAdd(chip) {
    setName(chip.name);
    setCategory(chip.category);
    if (chip.amount > 0) setAmount(String(chip.amount));
    setError('');
  }

  async function handleSubmit() {
    if (!name.trim())   return setError('What did you spend on?');
    if (!category)      return setError('Pick a category.');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
                        return setError('Enter a valid amount.');
    setAdding(true);
    const time = new Date().toTimeString().slice(0, 5);
    await onAdd({ id: Date.now(), name: name.trim(), category, amount: Number(amount), time });
    setName(''); setCategory(''); setAmount(''); setError('');
    setAdding(false);
  }

  return (
    <div className="card px-4 sm:px-5 py-4 sm:py-5">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-xl bg-rupee-50 flex items-center justify-center">
          <Plus size={14} className="text-rupee-500" />
        </div>
        <h2 className="font-display font-semibold text-[14px] text-ink-800">
          Add expense
        </h2>
      </div>

      {/* Form fields — all stacked */}
      <div className="flex flex-col gap-3">

        {/* Item name */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
            Item name
          </label>
          <input
            type="text"
            placeholder="e.g. Pizza, Bus ticket, Groceries"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '13px',
              border: '1.5px solid #C8C5BB',
              borderRadius: '12px',
              background: '#fff',
              color: '#1A1917',
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#1D9E75';
              e.target.style.boxShadow = '0 0 0 3px rgba(29,158,117,0.12)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#C8C5BB';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
            Category
          </label>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setError(''); }}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '13px',
              border: '1.5px solid #C8C5BB',
              borderRadius: '12px',
              background: '#fff',
              color: category ? '#1A1917' : '#C8C5BB',
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238C8980' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              paddingRight: '36px',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#1D9E75';
              e.target.style.boxShadow = '0 0 0 3px rgba(29,158,117,0.12)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#C8C5BB';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Select a category...</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount + Add button */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
            Amount
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: '600',
                  color: '#8C8980',
                  fontSize: '14px',
                  pointerEvents: 'none',
                }}
              >
                ₹
              </span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 28px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1.5px solid #C8C5BB',
                  borderRadius: '12px',
                  background: '#fff',
                  color: '#1A1917',
                  outline: 'none',
                  fontFamily: 'DM Mono, monospace',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#1D9E75';
                  e.target.style.boxShadow = '0 0 0 3px rgba(29,158,117,0.12)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#C8C5BB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Green Add button */}
            <button
              onClick={handleSubmit}
              disabled={adding}
              style={{
                background: adding ? '#9FE1CB' : '#1D9E75',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: adding ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease',
                boxShadow: '0 2px 8px rgba(29,158,117,0.25)',
              }}
              onMouseEnter={e => {
                if (!adding) {
                  e.target.style.background = '#0F6E56';
                  e.target.style.boxShadow = '0 4px 12px rgba(29,158,117,0.35)';
                }
              }}
              onMouseLeave={e => {
                if (!adding) {
                  e.target.style.background = '#1D9E75';
                  e.target.style.boxShadow = '0 2px 8px rgba(29,158,117,0.25)';
                }
              }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Plus size={15} />
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '10px',
            padding: '8px 12px',
            background: '#FAECE7',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#993C1D',
          }}
        >
          <X size={12} /> {error}
        </div>
      )}

      {/* Quick add chips */}
      <div className="mt-4">
        <span className="text-[10px] text-ink-400 font-semibold uppercase tracking-wider">
          Quick add:
        </span>
        <div className="flex flex-wrap gap-2 mt-2">
          {QUICK_ADD.map((chip, i) => {
            const cat = CATEGORIES.find(c => c.id === chip.category);
            return (
              <button
                key={i}
                onClick={() => handleQuickAdd(chip)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '99px',
                  border: '1.5px solid #E4E2DA',
                  background: '#FAF9F7',
                  fontSize: '12px',
                  color: '#5C5A54',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'DM Sans, sans-serif',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#E1F5EE';
                  e.currentTarget.style.borderColor = '#1D9E75';
                  e.currentTarget.style.color = '#0F6E56';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#FAF9F7';
                  e.currentTarget.style.borderColor = '#E4E2DA';
                  e.currentTarget.style.color = '#5C5A54';
                }}
              >
                <span>{cat?.icon}</span>
                {chip.name}
                {chip.amount > 0 && (
                  <span style={{ color: '#8C8980', fontSize: '11px' }}>
                    ₹{chip.amount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}