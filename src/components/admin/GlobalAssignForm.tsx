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
      const res = await assignPaper(selectedPaper, selectedChair);
      if (res && !res.success) {
        alert(res.error || "Failed to assign paper");
        return;
      }
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
    <div className="bg-white p-7 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-200/90 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 to-indigo-500"></div>
      
      <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-100/80">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <PlusCircle size={20} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Assign Paper to Chair</h2>
      </div>

      <div className="space-y-5 flex-1 flex flex-col justify-center">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
            Select Paper
          </label>
          <select 
            value={selectedPaper} 
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all font-medium appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
          >
            <option value="">-- Choose a paper --</option>
            {papers.map(p => (
              <option key={p.id} value={p.id}>{p.paperId} - {p.title.length > 50 ? p.title.substring(0, 50) + "..." : p.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
            Select Session Chair
          </label>
          <select 
            value={selectedChair} 
            onChange={(e) => setSelectedChair(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all font-medium appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
          >
            <option value="">-- Choose a chair --</option>
            {chairs.map(c => (
              <option key={c.id} value={c.id}>{c.name} (@{c.username})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 mt-auto border-t border-slate-100">
        <button 
          onClick={handleAssign}
          disabled={loading || !selectedPaper || !selectedChair}
          className="w-full justify-center inline-flex items-center py-3 px-6 shadow-md shadow-indigo-500/20 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          Assign Paper to Chair
        </button>
      </div>
    </div>
  );
}
