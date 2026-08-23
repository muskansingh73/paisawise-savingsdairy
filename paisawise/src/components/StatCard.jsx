export default function StatCard({ label, value, sub, accent, icon: Icon, delay = 0 }) {
  const accents = {
    green:  { bg: "bg-rupee-50",    text: "text-rupee-800",    icon: "text-rupee-400"    },
    red:    { bg: "bg-flame-50",    text: "text-flame-400",    icon: "text-flame-400"    },
    blue:   { bg: "bg-sapphire-50", text: "text-sapphire-800", icon: "text-sapphire-400" },
    violet: { bg: "bg-violet-50",   text: "text-violet-600",   icon: "text-violet-400"   },
    amber:  { bg: "bg-amber-50",    text: "text-amber-800",    icon: "text-amber-400"    },
  };
  const a = accents[accent] || accents.green;

  return (
    <div className={`card lift px-4 py-3.5 fade-up delay-${delay}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] sm:text-[11px] font-medium tracking-wide uppercase text-ink-400 leading-tight">
          {label}
        </span>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg ${a.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={14} className={a.icon} />
          </div>
        )}
      </div>
      <div className={`font-display font-semibold text-[20px] sm:text-[24px] leading-tight count-up ${a.text}`}>
        {value}
      </div>
      {sub && <div className="text-[10px] sm:text-[11px] text-ink-400 mt-1">{sub}</div>}
    </div>
  );
}