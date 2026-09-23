"use client";

import { useState } from "react";
import { assignPaper } from "@/lib/actions/assignment";
import { Loader2, PlusCircle } from "lucide-react";

type Chair = {
  id: string;
  name: string;
  username: string;
};

type Paper = {
  id: string;
  paperId: string;
  title: string;
};

export default function GlobalAssignForm({ papers, chairs }: { papers: Paper[], chairs: Chair[] }) {
  const [selectedPaper, setSelectedPaper] = useState("");
  const [selectedChair, setSelectedChair] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedPaper || !selectedChair) return;
    setLoading(true);
    try {
      await assignPaper(selectedPaper, selectedChair);
      setSelectedPaper("");
      setSelectedChair("");
      alert("Paper assigned successfully.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to assign paper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/90 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <PlusCircle size={18} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assign Paper to Chair</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Paper
          </label>
          <select 
            value={selectedPaper} 
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="block w-full rounded-xl border-gray-200 shadow-sm px-4 py-3 border focus:border-blue-500 focus:ring-blue-500 text-sm transition-all bg-slate-50 hover:bg-white"
          >
            <option value="">-- Choose a paper --</option>
            {papers.map(p => (
              <option key={p.id} value={p.id}>{p.paperId} - {p.title.length > 50 ? p.title.substring(0, 50) + "..." : p.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Session Chair
          </label>
          <select 
            value={selectedChair} 
            onChange={(e) => setSelectedChair(e.target.value)}
            className="block w-full rounded-xl border-gray-200 shadow-sm px-4 py-3 border focus:border-blue-500 focus:ring-blue-500 text-sm transition-all bg-slate-50 hover:bg-white"
          >
            <option value="">-- Choose a chair --</option>
            {chairs.map(c => (
              <option key={c.id} value={c.id}>{c.name} (@{c.username})</option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleAssign}
          disabled={loading || !selectedPaper || !selectedChair}
          className="w-full mt-2 inline-flex justify-center items-center py-3 px-4 border border-transparent shadow-sm text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all hover:shadow-md active:scale-[0.98]"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          Assign Paper
        </button>
      </div>
    </div>
  );
}
