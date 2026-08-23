import { AlertTriangle, CheckCircle2, Info, Sparkles } from "lucide-react";

const styles = {
  warning: { bg: "bg-amber-50",    border: "border-l-amber-400",    Icon: AlertTriangle, iconCls: "text-amber-600",    titleCls: "text-amber-800"    },
  success: { bg: "bg-rupee-50",    border: "border-l-rupee-400",    Icon: CheckCircle2,  iconCls: "text-rupee-600",    titleCls: "text-rupee-800"    },
  info:    { bg: "bg-sapphire-50", border: "border-l-sapphire-400", Icon: Info,          iconCls: "text-sapphire-600", titleCls: "text-sapphire-800" },
  neutral: { bg: "bg-ink-50",      border: "border-l-ink-300",      Icon: Sparkles,      iconCls: "text-ink-400",      titleCls: "text-ink-700"      },
};

export default function TipCard({ tip, delay = 0 }) {
  const s = styles[tip.type] || styles.neutral;
  const { Icon } = s;

  return (
    <div
      className={`${s.bg} border-l-2 ${s.border} px-3.5 py-3 fade-up delay-${delay}`}
      style={{ borderRadius: "0 12px 12px 0" }}
    >
      <div className="flex gap-2.5">
        <Icon size={14} className={`${s.iconCls} flex-shrink-0 mt-0.5`} />
        <div>
          <div className={`text-[12px] font-semibold ${s.titleCls} mb-0.5`}>{tip.title}</div>
          <div className="text-[11px] text-ink-500 leading-relaxed">{tip.body}</div>
        </div>
      </div>
    </div>
  );
}