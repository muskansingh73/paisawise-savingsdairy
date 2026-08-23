import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MonthlyStatCard({ label, value, sub, change, accent, delay = 0 }) {
  const accents = {
    green:  { bg: "bg-rupee-50",    text: "text-rupee-800",    border: "border-rupee-100"   },
    red:    { bg: "bg-flame-50",    text: "text-flame-600",    border: "border-flame-100"   },
    blue:   { bg: "bg-sapphire-50", text: "text-sapphire-800", border: "border-sapphire-100"},
    violet: { bg: "bg-violet-50",   text: "text-violet-600",   border: "border-violet-100"  },
    amber:  { bg: "bg-amber-50",    text: "text-amber-800",    border: "border-amber-100"   },
  };
  const a = accents[accent] || accents.green;

  // change: positive = increased, negative = decreased, null = no data
  const ChangeIcon = change === null ? Minus : change > 0 ? TrendingUp : TrendingDown;
  const changeCls  = change === null ? "text-ink-400"
                   : change > 0     ? "text-flame-500"
                   :                  "text-rupee-500";

  return (
    <div className={`card lift px-5 py-4 border ${a.border} fade-up delay-${delay}`}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400 mb-2">
        {label}
      </div>
      <div className={`font-display font-semibold text-[24px] leading-tight ${a.text} count-up`}>
        {value}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] text-ink-400">{sub}</span>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-[10px] font-medium ${changeCls}`}>
            <ChangeIcon size={11} />
            {change === null ? "No data" : `${Math.abs(change)}% vs last month`}
          </div>
        )}
      </div>
    </div>
  );
}