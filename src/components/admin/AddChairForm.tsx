"use client";

import { useState } from "react";
import { createChair } from "@/lib/actions/chair";
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react";

export default function AddChairForm() {
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
      const res = await createChair(formData);
      if (res && !res.success) {
        setError(res.error || "Failed to create chair");
        setLoading(false);
        return;
      }
      setSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to create chair");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-7 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-200/90 space-y-5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
      
      <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-100/80">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <UserPlus size={20} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Add Session Chair</h2>
      </div>
      
      {error && <div className="text-rose-600 bg-rose-50/80 p-3.5 rounded-xl text-xs font-bold border border-rose-100 shadow-sm">{error}</div>}
      {success && (
        <div className="text-emerald-700 bg-emerald-50/80 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-100 shadow-sm">
          <CheckCircle2 size={16} className="shrink-0" /> Chair account successfully provisioned!
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Profile Information</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name (e.g. Dr. John Doe)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="username"
              required
              minLength={3}
              pattern="^[a-zA-Z0-9_]+$"
              title="Username must contain only letters, numbers, and underscores (min 3 chars)"
              placeholder="Username *"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
            />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Password *"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Contact & Affiliation</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
            />
          </div>
          <input
            type="text"
            name="institution"
            placeholder="Institution (e.g. Karnavati University)"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all font-medium"
          />
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="w-full justify-center inline-flex items-center py-3 px-6 shadow-md shadow-emerald-500/20 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          Provision Session Chair Account
        </button>
      </div>
    </form>
  );
}
