import { Trash2, SunMedium, Sunset, Moon } from "lucide-react";
import { CATEGORIES } from "../data/mockData";

function getTimeGroup(time) {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

const groupIcons = {
  Morning:   { Icon: SunMedium, color: "text-amber-400" },
  Afternoon: { Icon: Sunset,    color: "text-flame-400"  },
  Evening:   { Icon: Moon,      color: "text-sapphire-400" },
};

export default function DayEntriesList({ entries, onDelete }) {
  if (entries.length === 0) {
    return (
      <div className="card px-5 py-12 flex flex-col items-center gap-2 text-center">
        <div className="text-3xl mb-1">📭</div>
        <p className="text-[13px] font-medium text-ink-400">No entries yet for this day</p>
        <p className="text-[11px] text-ink-300">Use the form above to add your first expense</p>
      </div>
    );
  }

  // Group entries by time of day
  const groups = { Morning: [], Afternoon: [], Evening: [] };
  entries.forEach(e => {
    const g = getTimeGroup(e.time);
    groups[g].push(e);
  });

  return (
    <div className="card px-5 py-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-[14px] text-ink-800">
          Today's entries
        </h2>
        <span className="text-[11px] text-ink-400">
          {entries.length} item{entries.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(groups).map(([groupName, groupEntries]) => {
          if (groupEntries.length === 0) return null;
          const { Icon, color } = groupIcons[groupName];
          return (
            <div key={groupName}>
              {/* Group header */}
              <div className="flex items-center gap-2 mb-2">
                <Icon size={12} className={color} />
                <span className="text-[10px] font-medium uppercase tracking-widest text-ink-400">
                  {groupName}
                </span>
                <div className="flex-1 h-px bg-ink-100" />
              </div>

              {/* Entries */}
              <div className="flex flex-col gap-1.5">
                {groupEntries.map(entry => {
                  const cat = CATEGORIES.find(c => c.id === entry.category);
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-ink-50/60 hover:bg-ink-50 transition-colors group"
                    >
                      {/* Category icon */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[14px] flex-shrink-0"
                        style={{ background: cat?.bg || "#F5F4F1" }}
                      >
                        {cat?.icon || "💸"}
                      </div>

                      {/* Name + meta */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-ink-800 truncate">
                          {entry.name}
                        </div>
                        <div className="text-[10px] text-ink-400">
                          {cat?.label} · {entry.time}
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="font-mono font-medium text-[14px] text-ink-800">
                        ₹{entry.amount.toLocaleString("en-IN")}
                      </div>

                      {/* Delete button — appears on hover */}
                      <button
                        onClick={() => onDelete(entry.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-flame-50 text-ink-300 hover:text-flame-600 transition-all"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}