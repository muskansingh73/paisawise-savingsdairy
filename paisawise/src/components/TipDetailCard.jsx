import { AlertTriangle, CheckCircle2, Info, Sparkles, IndianRupee, Zap } from "lucide-react";

const styles = {
  warning: {
    border:    "border-amber-200",
    iconBg:    "bg-amber-50",
    icon:      AlertTriangle,
    iconColor: "text-amber-500",
    tagBg:     "bg-amber-50 text-amber-700",
    titleColor:"text-amber-900",
  },
  success: {
    border:    "border-rupee-200",
    iconBg:    "bg-rupee-50",
    icon:      CheckCircle2,
    iconColor: "text-rupee-500",
    tagBg:     "bg-rupee-50 text-rupee-700",
    titleColor:"text-rupee-900",
  },
  info: {
    border:    "border-sapphire-100",
    iconBg:    "bg-sapphire-50",
    icon:      Info,
    iconColor: "text-sapphire-500",
    tagBg:     "bg-sapphire-50 text-sapphire-700",
    titleColor:"text-sapphire-900",
  },
  neutral: {
    border:    "border-ink-200",
    iconBg:    "bg-ink-50",
    icon:      Sparkles,
    iconColor: "text-ink-400",
    tagBg:     "bg-ink-50 text-ink-600",
    titleColor:"text-ink-800",
  },
};

const effortColors = {
  Low:    "bg-rupee-50 text-rupee-700",
  Medium: "bg-amber-50 text-amber-700",
  High:   "bg-flame-50 text-flame-700",
  None:   "bg-ink-50 text-ink-500",
};

export default function TipDetailCard({ tip, delay = 0 }) {
  const s = styles[tip.type] || styles.neutral;
  const Icon = s.icon;

  return (
    <div
      className={`card border ${s.border} px-5 py-4 fade-up delay-${delay} hover:shadow-md transition-shadow`}
    >
      <div className="flex gap-4">

        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon size={18} className={s.iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Top row: title + tags */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className={`font-display font-semibold text-[14px] ${s.titleColor}`}>
              {tip.title}
            </h3>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.tagBg}`}>
                {tip.tag}
              </span>
            </div>
          </div>

          {/* Body */}
          <p className="text-[12px] text-ink-500 leading-relaxed mb-3">
            {tip.body}
          </p>

          {/* Footer: potential saving + effort */}
          <div className="flex items-center gap-3">
            {tip.saving > 0 && (
              <div className="flex items-center gap-1 bg-rupee-50 px-2.5 py-1 rounded-full">
                <IndianRupee size={11} className="text-rupee-600" />
                <span className="text-[11px] font-semibold text-rupee-700">
                  Save up to ₹{tip.saving.toLocaleString("en-IN")}/month
                </span>
              </div>
            )}
            {tip.saving === 0 && (
              <div className="flex items-center gap-1 bg-rupee-50 px-2.5 py-1 rounded-full">
                <CheckCircle2 size={11} className="text-rupee-600" />
                <span className="text-[11px] font-semibold text-rupee-700">On track</span>
              </div>
            )}
            {tip.effort !== "None" && (
              <div className="flex items-center gap-1">
                <Zap size={11} className="text-ink-400" />
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${effortColors[tip.effort]}`}>
                  {tip.effort} effort
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}