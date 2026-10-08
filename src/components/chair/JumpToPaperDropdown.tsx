"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Paper = { id: string; paperId: string; title: string };

export default function JumpToPaperDropdown({ papers }: { papers: Paper[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState("");

  if (papers.length === 0) {
    return (
      <div className="w-full sm:w-auto px-6 py-3 bg-emerald-50 text-emerald-600 font-bold text-sm rounded-xl text-center border border-emerald-200 shadow-sm">
        🎉 All Done! No more papers to evaluate.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Jump to Un-evaluated:</label>
      <select
        value={selected}
        onChange={(e) => {
          const val = e.target.value;
          setSelected(val);
          if (val) {
            router.push(`/chair/evaluate/${val}`);
          }
        }}
        className="w-full sm:max-w-xs rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="">-- Select a paper --</option>
        {papers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.paperId} - {p.title.length > 30 ? p.title.substring(0, 30) + '...' : p.title}
          </option>
        ))}
      </select>
    </div>
  );
}
