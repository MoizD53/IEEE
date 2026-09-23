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
      const formData = new FormData(e.currentTarget);
      await createChair(formData);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || "Failed to create chair");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/90 space-y-4">
      <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
        <UserPlus size={20} className="text-emerald-600" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Add New Session Chair</h2>
      </div>
      
      {error && <div className="text-red-600 bg-red-50 p-3 rounded-xl text-sm border border-red-200">{error}</div>}
      {success && (
        <div className="text-emerald-700 bg-emerald-50 p-3 rounded-xl text-sm flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 size={16} /> Chair created successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Dr. John Doe"
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">Username *</label>
          <input
            type="text"
            name="username"
            required
            placeholder="e.g. jdoe"
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">Password *</label>
          <input
            type="password"
            name="password"
            required
            placeholder="Set password"
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="chair@university.edu"
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="+91 9876543210"
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1">Institution</label>
          <input
            type="text"
            name="institution"
            placeholder="e.g. Karnavati University"
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center items-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          Create Chair
        </button>
      </div>
    </form>
  );
}
