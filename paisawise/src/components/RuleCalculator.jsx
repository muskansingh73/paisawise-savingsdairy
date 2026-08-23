export default function RuleCalculator({ income, spent, saved }) {
  const needs   = Math.round(income * 0.50);
  const wants   = Math.round(income * 0.30);
  const savings = Math.round(income * 0.20);

  // Estimate needs vs wants from spend (rent is always needs)
  const actualNeeds   = Math.round(spent * 0.60);
  const actualWants   = Math.round(spent * 0.40);
  const actualSavings = saved;

  const rows = [
    {
      label:    "Needs",
      sub:      "Rent, food, travel, health",
      ideal:    needs,
      actual:   actualNeeds,
      color:    "#185FA5",
      bg:       "#E6F1FB",
    },
    {
      label:    "Wants",
      sub:      "Shopping, entertainment",
      ideal:    wants,
      actual:   actualWants,
      color:    "#EF9F27",
      bg:       "#FAEEDA",
    },
    {
      label:    "Savings",
      sub:      "Emergency fund, investments",
      ideal:    savings,
      actual:   actualSavings,
      color:    "#1D9E75",
      bg:       "#E1F5EE",
    },
  ];

  return (
    <div className="card px-5 py-5 fade-up delay-2">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-[14px] text-ink-800">50 / 30 / 20 rule</h2>
          <p className="text-[11px] text-ink-400 mt-0.5">Ideal split for ₹{income.toLocaleString("en-IN")}/month</p>
        </div>
        <div className="bg-ink-50 px-2.5 py-1 rounded-full text-[10px] text-ink-500 font-medium">
          Rule of thumb
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => {
          const isOver = row.actual > row.ideal;
          const pctActual = Math.round((row.actual / income) * 100);
          const pctIdeal  = Math.round((row.ideal  / income) * 100);

          return (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-[12px] font-semibold text-ink-700">{row.label}</span>
                  <span className="text-[10px] text-ink-400 ml-2">{row.sub}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[12px] font-semibold text-ink-800">
                    ₹{row.actual.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-ink-400 ml-1">
                    / ₹{row.ideal.toLocaleString("en-IN")} ideal
                  </span>
                </div>
              </div>

              {/* Stacked bar: ideal vs actual */}
              <div className="relative h-2 bg-ink-100 rounded-full overflow-hidden">
                {/* Ideal marker */}
                <div
                  className="absolute top-0 h-full rounded-full opacity-20"
                  style={{ width: `${pctIdeal}%`, background: row.color }}
                />
                {/* Actual fill */}
                <div
                  className="absolute top-0 h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(pctActual, 100)}%`,
                    background: isOver ? "#D85A30" : row.color,
                  }}
                />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-ink-400">
                  {pctActual}% actual · {pctIdeal}% ideal
                </span>
                {isOver ? (
                  <span className="text-[10px] text-flame-600 font-medium">
                    ₹{(row.actual - row.ideal).toLocaleString("en-IN")} over
                  </span>
                ) : (
                  <span className="text-[10px] text-rupee-600 font-medium">
                    ₹{(row.ideal - row.actual).toLocaleString("en-IN")} under
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}