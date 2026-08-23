import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-black/10 rounded-xl px-3 py-2.5 shadow-sm text-[12px]">
      <div className="font-medium text-ink-700 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-ink-500 capitalize">{p.name}:</span>
          <span className="font-mono font-medium" style={{ color: p.color }}>
            ₹{Number(p.value).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function WeeklyTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gradSpent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#D85A30" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#D85A30" stopOpacity={0}    />
          </linearGradient>
          <linearGradient id="gradSaved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#E4E2DA" vertical={false} />

        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: "#8C8980", fontFamily: "DM Sans" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#8C8980", fontFamily: "DM Mono" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="spent"
          stroke="#D85A30"
          strokeWidth={2}
          fill="url(#gradSpent)"
          dot={{ fill: "#D85A30", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="saved"
          stroke="#1D9E75"
          strokeWidth={2}
          fill="url(#gradSaved)"
          dot={{ fill: "#1D9E75", strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}