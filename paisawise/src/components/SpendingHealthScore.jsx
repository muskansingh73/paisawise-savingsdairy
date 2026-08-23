export default function SpendingHealthScore({ score, breakdown }) {
  const color = score >= 75 ? "#1D9E75" : score >= 50 ? "#EF9F27" : "#D85A30";
  const label = score >= 75 ? "Healthy 💚" : score >= 50 ? "Needs work 🟡" : "Overspending 🔴";

  const circumference = 2 * Math.PI * 40;
  const dash = (score / 100) * circumference;

  return (
    <div className="card px-5 py-5 fade-up delay-1">
      <h2 className="font-display font-semibold text-[14px] text-ink-800 mb-4">
        Spending health score
      </h2>

      <div className="flex items-center gap-6">
        {/* Score ring */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#E4E2DA" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={color} strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-[22px] text-ink-900">{score}</span>
            <span className="text-[9px] text-ink-400">/ 100</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1">
          <div className="text-[13px] font-semibold mb-3" style={{ color }}>
            {label}
          </div>
          <div className="flex flex-col gap-2">
            {breakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-ink-600">{item.label}</span>
                    <span className="text-[11px] font-mono text-ink-700">{item.score}/25</span>
                  </div>
                  <div className="h-1 bg-ink-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(item.score / 25) * 100}%`,
                        background: item.score >= 20 ? "#1D9E75" : item.score >= 12 ? "#EF9F27" : "#D85A30"
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}