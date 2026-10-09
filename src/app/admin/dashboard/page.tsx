import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, Users, CheckCircle, Clock, Star, TrendingUp, Sparkles } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalPapers,
    totalChairs,
    totalEvaluations,
    completedEvaluations,
    recommendedPapers,
  ] = await Promise.all([
    prisma.paper.count(),
    prisma.user.count({ where: { role: "SESSION_CHAIR" } }),
    prisma.evaluation.count(),
    prisma.evaluation.count({ where: { status: "SUBMITTED" } }),
    prisma.evaluation.count({ where: { status: "SUBMITTED", recommended: true } }),
  ]);

  const pendingEvaluations = totalEvaluations - completedEvaluations;

  // Calculate average score
  const allSubmissions = await prisma.evaluation.findMany({
    where: { status: "SUBMITTED" },
    select: { totalScore: true }
  });
  
  const avgScore = allSubmissions.length > 0
    ? (allSubmissions.reduce((a, b) => a + b.totalScore, 0) / allSubmissions.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Sparkles size={120} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Welcome to the Administrator Portal</h1>
          <p className="text-blue-200/80 max-w-2xl text-sm font-medium leading-relaxed">
            Manage session chairs, oversee paper assignments, and track real-time conference evaluation progress.
          </p>
        </div>
      </div>
      
      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        <Link href="/admin/papers" className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm"><FileText size={20} strokeWidth={2.5} /></div>
          <div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{totalPapers}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">Total Papers</div>
          </div>
        </Link>

        <Link href="/admin/chairs" className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm"><Users size={20} strokeWidth={2.5} /></div>
          <div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{totalChairs}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">Session Chairs</div>
          </div>
        </Link>

        <Link href="/admin/papers" className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm"><CheckCircle size={20} strokeWidth={2.5} /></div>
          <div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{completedEvaluations}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">Evaluated Papers</div>
          </div>
        </Link>

        <Link href="/admin/papers" className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm"><Clock size={20} strokeWidth={2.5} /></div>
          <div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{pendingEvaluations}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">Pending Evals</div>
          </div>
        </Link>

        <Link href="/admin/analytics" className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm"><Star size={20} strokeWidth={2.5} /></div>
          <div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{recommendedPapers}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">Recommended</div>
          </div>
        </Link>

        <Link href="/admin/analytics" className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-sm"><TrendingUp size={20} strokeWidth={2.5} /></div>
          <div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{avgScore} <span className="text-sm font-medium text-slate-400">/ 50</span></div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">Average Score</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
