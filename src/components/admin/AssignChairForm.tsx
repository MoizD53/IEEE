"use client";

import { useState } from "react";
import { assignPaper } from "@/lib/actions/assignment";
import { Loader2 } from "lucide-react";

type Chair = {
  id: string;
  name: string;
  username: string;
};

export default function AssignChairForm({ paperId, chairs }: { paperId: string, chairs: Chair[] }) {
  const [selectedChair, setSelectedChair] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedChair) return;
    setLoading(true);
    try {
      const res = await assignPaper(paperId, selectedChair);
      if (res && !res.success) {
        alert(res.error || "Failed to assign paper");
        return;
      }
      setSelectedChair("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to assign paper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select 
        value={selectedChair} 
        onChange={(e) => setSelectedChair(e.target.value)}
        className="flex-1 block w-full rounded-xl border-slate-200 shadow-sm p-3 border bg-slate-50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-900 transition-all appearance-none cursor-pointer"
        style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
      >
        <option value="">Select a Chair to Assign...</option>
        {chairs.map(c => (
          <option key={c.id} value={c.id}>{c.name} (@{c.username})</option>
        ))}
      </select>
      <button 
        onClick={handleAssign}
        disabled={loading || !selectedChair}
        className="inline-flex justify-center items-center py-3 px-6 shadow-md shadow-indigo-500/20 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
      >
        {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
        Assign Chair
      </button>
    </div>
  );
}
