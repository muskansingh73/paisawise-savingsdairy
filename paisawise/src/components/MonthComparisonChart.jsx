import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-black/10 rounded-xl px-3 py-2 text-[12px]">
      <div className="text-ink-500 mb-1">{label}</div>
      <div className="font-mono font-semibold text-ink-800">
        ₹{Number(payload[0]?.value).toLocaleString("en-IN")}
      </div>
    </div>
  );
}

export default function MonthComparisonChart({ data, currentMonth }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
        barSize={14}
      >
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "#8C8980", fontFamily: "DM Mono" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
        />
        <YAxis
          type="category"
          dataKey="month"
          tick={{ fontSize: 10, fill: "#8C8980", fontFamily: "DM Sans" }}
          axisLine={false}
          tickLine={false}
          width={72}
          tickFormatter={v => v.split(" ")[0]} // Just "June", "May" etc
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F5F4F1" }} />
        <Bar dataKey="totalSpent" radius={[0, 6, 6, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.month === currentMonth ? "#1D9E75" : "#C8C5BB"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}