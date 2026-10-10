import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, Users, CheckCircle, Clock, Star, TrendingUp, Sparkles, User, FileOutput } from "lucide-react";

async function ChairProgressBars() {
  const chairs = await prisma.user.findMany({
    where: { role: "SESSION_CHAIR" },
    include: {
      assignments: {
        where: { status: "ACTIVE" },
        include: { paper: true }
      }
    }
  });

  const chairStats = chairs
    .map(chair => {
      const total = chair.assignments.length;
      const evaluatedPapers = chair.assignments
        .filter(a => ['EVALUATED', 'RECOMMENDED', 'FINALIZED'].includes(a.paper.status))
        .map(a => a.paper.paperId);
      
      const absentPapers = chair.assignments
        .filter(a => a.paper.status === 'ABSENT')
        .map(a => a.paper.paperId);

      const pendingPapers = chair.assignments
        .filter(a => !['EVALUATED', 'RECOMMENDED', 'FINALIZED', 'ABSENT'].includes(a.paper.status))
        .map(a => a.paper.paperId);

      const completed = evaluatedPapers.length + absentPapers.length;

      let date = "";
      if (chair.assignments.length > 0 && chair.assignments[0].paper.session) {
        const match = chair.assignments[0].paper.session.match(/(\d{2}-\d{2}-\d{4})/);
        if (match) date = match[1];
      }

      return {
        name: chair.name,
        date,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
        evaluatedPapers,
        absentPapers,
        pendingPapers
      };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.percentage - a.percentage); // Sort by highest progress

  if (chairStats.length === 0) {
    return (
      <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl">
        <p className="text-slate-500 font-medium">No session chair data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chairStats.map((chair, idx) => (
        <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h4 className="font-bold text-sm text-slate-800 leading-tight flex-1">
              {chair.name}
              {chair.date && <span className="text-xs font-medium text-slate-500 ml-2 bg-slate-200 px-2 py-0.5 rounded-full">{chair.date}</span>}
            </h4>
            <span className="text-sm font-black text-indigo-600 shrink-0">{chair.completed} / {chair.total}</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden flex">
            <div 
              className="bg-emerald-500 h-2.5 transition-all duration-1000 ease-out" 
              style={{ width: `${chair.total > 0 ? (chair.evaluatedPapers.length / chair.total) * 100 : 0}%` }}
              title="Evaluated"
            ></div>
            <div 
              className="bg-rose-500 h-2.5 transition-all duration-1000 ease-out" 
              style={{ width: `${chair.total > 0 ? (chair.absentPapers.length / chair.total) * 100 : 0}%` }}
              title="Absent"
            ></div>
          </div>
          <div className="flex justify-between items-start">
            <details className="text-[11px] text-slate-500 cursor-pointer group">
              <summary className="hover:text-indigo-600 transition-colors font-medium outline-none">
                View Paper IDs
              </summary>
              <div className="mt-2 space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-sm leading-relaxed max-w-lg">
                <div>
                  <span className="font-semibold text-emerald-600 uppercase tracking-wider text-[10px]">Evaluated:</span>{" "}
                  {chair.evaluatedPapers.length > 0 ? chair.evaluatedPapers.join(", ") : "None"}
                </div>
                <div>
                  <span className="font-semibold text-rose-600 uppercase tracking-wider text-[10px]">Absent:</span>{" "}
                  {chair.absentPapers.length > 0 ? chair.absentPapers.join(", ") : "None"}
                </div>
                <div>
                  <span className="font-semibold text-amber-600 uppercase tracking-wider text-[10px]">Pending:</span>{" "}
                  {chair.pendingPapers.length > 0 ? chair.pendingPapers.join(", ") : "None"}
                </div>
              </div>
            </details>
            <div className="text-[10px] font-bold text-slate-400 text-right mt-1">{chair.percentage}% Completed</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [
    totalPapers,
    totalChairs,
    totalEvaluations,
    completedEvaluations,
    recommendedPapers,
    absentPapersCount,
  ] = await Promise.all([
    prisma.paper.count(),
    prisma.user.count({ where: { role: "SESSION_CHAIR" } }),
    prisma.evaluation.count(),
    prisma.evaluation.count({ where: { status: "SUBMITTED" } }),
    prisma.evaluation.count({ where: { status: "SUBMITTED", recommended: true } }),
    prisma.paper.count({ where: { status: "ABSENT" } }),
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
            <div className="text-3xl font-black text-slate-800 tracking-tight">
              {completedEvaluations + absentPapersCount}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">Evaluated Papers</div>
          </div>
        </Link>

        <Link href="/admin/reports" className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300 shadow-sm"><FileText size={20} strokeWidth={2.5} /></div>
          <div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{absentPapersCount}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-1">Absent Papers</div>
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

      {/* Session Progress Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mt-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Session Chair Progress</h2>
              <p className="text-sm text-slate-500 mt-0.5">Track evaluation completion rates across all session chairs</p>
            </div>
          </div>
        </div>

        <ChairProgressBars />
      </div>
    </div>
  );
}
