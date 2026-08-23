import { Trash2 } from "lucide-react";
import { CATEGORIES } from "../data/mockData";

export default function EntryRow({ entry, onDelete }) {
  const cat = CATEGORIES.find(c => c.id === entry.category);

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-ink-50/60 hover:bg-ink-50 transition-colors group">
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: cat?.color || "#888" }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-ink-800 truncate">{entry.name}</div>
        <div className="text-[10px] text-ink-400">{cat?.label} · {entry.time}</div>
      </div>
      <div className="text-[13px] font-mono font-medium text-ink-800">
        ₹{entry.amount}
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(entry.id)}
          className="w-6 h-6 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-flame-50 text-ink-300 hover:text-flame-600 transition-all"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}