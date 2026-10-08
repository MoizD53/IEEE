"use client";

import { useState } from "react";
import { createPaper } from "@/lib/actions/paper";
import { Loader2, PlusCircle, CheckCircle2 } from "lucide-react";

export default function AddPaperForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const res = await createPaper(formData);
      if (res && !res.success) {
        setError(res.error || "Failed to create paper");
        setLoading(false);
        return;
      }
      setSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to create paper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-7 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-200/90 space-y-5 relative overflow-hidden group h-full flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
      
      <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-100/80">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <PlusCircle size={20} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Register New Paper</h2>
      </div>
      
      {error && <div className="text-rose-600 bg-rose-50/80 p-3.5 rounded-xl text-xs font-bold border border-rose-100 shadow-sm">{error}</div>}
      {success && (
        <div className="text-emerald-700 bg-emerald-50/80 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-100 shadow-sm">
          <CheckCircle2 size={16} className="shrink-0" /> Paper registered successfully!
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 flex-1">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
            Paper ID Reference
          </label>
          <input
            type="text"
            name="paperId"
            required
            placeholder="e.g., IEEE-2026-001"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
            Manuscript Title
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Full title of the paper"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">
            Authors list
          </label>
          <input
            type="text"
            name="authors"
            required
            placeholder="John Doe, Jane Smith (comma separated)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium"
          />
        </div>
      </div>
      
      <div className="pt-4 mt-auto border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="w-full justify-center inline-flex items-center py-3 px-6 shadow-md shadow-blue-500/20 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          Register Manuscript
        </button>
      </div>
    </form>
  );
}
