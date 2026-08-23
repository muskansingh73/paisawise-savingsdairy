import { useState } from 'react';
import { IndianRupee, ChevronRight, ChevronLeft } from 'lucide-react';
import { registerUser, loginUser } from '../services/api';

export default function Login({ onAuth }) {
  const [isRegister, setIsRegister] = useState(true);
  const [step,       setStep]       = useState(1); // step 1 = basic info, step 2 = income setup
  const [form,       setForm]       = useState({
    name: '', email: '', password: '',
    monthly_income: '', savings_goal: ''
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  function handleNext() {
    if (!form.name.trim())     return setError('Please enter your name.');
    if (!form.email.trim())    return setError('Please enter your email.');
    if (!form.password.trim()) return setError('Please enter a password.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    setStep(2);
  }

  async function handleSubmit() {
  if (!form.monthly_income || Number(form.monthly_income) <= 0)
    return setError('Please enter your monthly income.');
  if (!form.savings_goal || Number(form.savings_goal) <= 0)
    return setError('Please enter your savings goal.');

  setLoading(true);
  setError('');
  try {
    const data = await registerUser({
      name:           form.name,
      email:          form.email,
      password:       form.password,
      monthly_income: Number(form.monthly_income),  // ← must be Number
      savings_goal:   Number(form.savings_goal),    // ← must be Number
    });
    onAuth(data.user);
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong.');
    setStep(1);
  } finally {
    setLoading(false);
  }
}

  async function handleLogin() {
    if (!form.email.trim() || !form.password.trim())
      return setError('Email and password are required.');

    setLoading(true);
    setError('');
    try {
      const data = await loginUser({ email: form.email, password: form.password });
      onAuth(data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  // ── Preset savings suggestions ──
  const savingsPresets = [10, 20, 30];

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-rupee-400 flex items-center justify-center shadow-sm">
            <IndianRupee size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-[24px] text-ink-900">
            Paisa<span className="text-rupee-400">Wise</span>
          </span>
        </div>

        <div className="card px-6 py-7">

          {/* ── LOGIN ── */}
          {!isRegister && (
            <>
              <h2 className="font-display font-semibold text-[18px] text-ink-900 mb-1">
                Welcome back 👋
              </h2>
              <p className="text-[12px] text-ink-400 mb-6">Sign in to your account</p>

              <div className="flex flex-col gap-3">
                <input
                  className="input-field"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                />
                <input
                  className="input-field"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {error && (
                <div className="mt-3 text-[12px] text-flame-600 bg-flame-50 px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="btn-primary w-full justify-center mt-4 py-3 text-[14px]"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </>
          )}

          {/* ── REGISTER STEP 1 — Basic info ── */}
          {isRegister && step === 1 && (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display font-semibold text-[18px] text-ink-900">
                  Create account
                </h2>
                <span className="text-[11px] bg-ink-100 text-ink-500 px-2 py-0.5 rounded-full font-medium">
                  Step 1 of 2
                </span>
              </div>
              <p className="text-[12px] text-ink-400 mb-6">
                Let's get you started with PaisaWise
              </p>

              <div className="flex flex-col gap-3">
                <input
                  className="input-field"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                />
                <input
                  className="input-field"
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                />
                <input
                  className="input-field"
                  name="password"
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={form.password}
                  onChange={handleChange}
                  onKeyDown={e => e.key === 'Enter' && handleNext()}
                />
              </div>

              {error && (
                <div className="mt-3 text-[12px] text-flame-600 bg-flame-50 px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleNext}
                className="btn-primary w-full justify-center mt-4 py-3 text-[14px]"
              >
                Continue <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* ── REGISTER STEP 2 — Income setup ── */}
          {isRegister && step === 2 && (
            <>
              <button
                onClick={() => { setStep(1); setError(''); }}
                className="flex items-center gap-1 text-[12px] text-ink-400 hover:text-ink-700 mb-4 transition-colors"
              >
                <ChevronLeft size={14} /> Back
              </button>

              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display font-semibold text-[18px] text-ink-900">
                  Set your budget
                </h2>
                <span className="text-[11px] bg-rupee-50 text-rupee-600 px-2 py-0.5 rounded-full font-medium">
                  Step 2 of 2
                </span>
              </div>
              <p className="text-[12px] text-ink-400 mb-6">
                This helps PaisaWise give you accurate insights
              </p>

              {/* Monthly income */}
              <div className="mb-4">
                <label className="text-[12px] font-semibold text-ink-600 mb-1.5 block">
                  Monthly income (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-ink-400">₹</span>
                  <input
                    className="input-field"
                    style={{ paddingLeft: '28px' }}
                    name="monthly_income"
                    type="number"
                    placeholder="e.g. 45000"
                    value={form.monthly_income}
                    onChange={handleChange}
                  />
                </div>
                {/* Quick presets */}
                <div className="flex gap-2 mt-2">
                  {[20000, 35000, 50000, 75000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setForm(f => ({ ...f, monthly_income: String(amt) }))}
                      className={`flex-1 py-1.5 rounded-xl text-[11px] font-medium border transition-all
                        ${form.monthly_income === String(amt)
                          ? 'bg-rupee-400 text-white border-rupee-400'
                          : 'border-ink-200 text-ink-500 hover:border-rupee-300'
                        }`}
                    >
                      ₹{(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Savings goal */}
              <div className="mb-4">
                <label className="text-[12px] font-semibold text-ink-600 mb-1.5 block">
                  Monthly savings goal (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-semibold text-ink-400">₹</span>
                  <input
                    className="input-field"
                    style={{ paddingLeft: '28px' }}
                    name="savings_goal"
                    type="number"
                    placeholder="e.g. 9000"
                    value={form.savings_goal}
                    onChange={handleChange}
                  />
                </div>

                {/* % suggestions based on income */}
                {form.monthly_income > 0 && (
                  <div className="flex gap-2 mt-2">
                    {savingsPresets.map(pct => {
                      const amt = Math.round(Number(form.monthly_income) * pct / 100);
                      return (
                        <button
                          key={pct}
                          onClick={() => setForm(f => ({ ...f, savings_goal: String(amt) }))}
                          className={`flex-1 py-1.5 rounded-xl text-[11px] font-medium border transition-all
                            ${form.savings_goal === String(amt)
                              ? 'bg-rupee-400 text-white border-rupee-400'
                              : 'border-ink-200 text-ink-500 hover:border-rupee-300'
                            }`}
                        >
                          {pct}% · ₹{amt.toLocaleString('en-IN')}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Summary */}
              {form.monthly_income > 0 && form.savings_goal > 0 && (
                <div className="bg-rupee-50 rounded-2xl px-4 py-3 mb-4">
                  <p className="text-[11px] text-rupee-700 font-medium mb-1">Your budget plan</p>
                  <div className="flex justify-between text-[12px] text-rupee-800">
                    <span>Income</span>
                    <span className="font-mono font-semibold">₹{Number(form.monthly_income).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[12px] text-rupee-800 mt-0.5">
                    <span>Savings goal</span>
                    <span className="font-mono font-semibold">₹{Number(form.savings_goal).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px bg-rupee-200 my-2" />
                  <div className="flex justify-between text-[12px] text-rupee-900">
                    <span className="font-medium">Available to spend</span>
                    <span className="font-mono font-bold">
                      ₹{(Number(form.monthly_income) - Number(form.savings_goal)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-3 text-[12px] text-flame-600 bg-flame-50 px-3 py-2 rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-[14px]"
              >
                {loading ? 'Creating account...' : 'Start tracking 🚀'}
              </button>
            </>
          )}

          {/* Switch between login/register */}
          <p className="text-center text-[12px] text-ink-400 mt-4">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button
              onClick={() => { setIsRegister(r => !r); setStep(1); setError(''); }}
              className="text-rupee-600 font-semibold hover:text-rupee-800"
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>

        <p className="text-center text-[11px] text-ink-300 mt-4">
          Your money data stays private and secure 🔒
        </p>
      </div>
    </div>
  );
}