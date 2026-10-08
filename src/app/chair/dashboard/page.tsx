import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, CheckCircle, Clock, Star, ArrowRight, Activity, TrendingUp } from "lucide-react";

export default async function ChairDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const assignments = await prisma.paperAssignment.findMany({
    where: { chairId: userId, status: "ACTIVE" },
    include: {
      paper: {
        include: {
          evaluations: {
            where: { chairId: userId }
          }
        }
      }
    }
  });

  const totalAssigned = assignments.length;
  const completed = assignments.filter(a => a.paper.evaluations.some(e => e.status === "SUBMITTED")).length;
  const pending = totalAssigned - completed;
  const recommended = assignments.filter(a => a.paper.evaluations.some(e => e.status === "SUBMITTED" && e.recommended)).length;

  const progress = totalAssigned === 0 ? 0 : Math.round((completed / totalAssigned) * 100);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Track your paper evaluation progress and metrics.</p>
        </div>
        {totalAssigned > 0 && (
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-3">
            <div className="text-sm font-bold text-slate-700">Completion</div>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="text-sm font-black text-indigo-600">{progress}%</div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <FileText size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Assigned</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{totalAssigned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20">
              <CheckCircle size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Completed</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl shadow-lg shadow-amber-500/20">
              <Clock size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Pending</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3.5 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-lg shadow-purple-500/20">
              <Star size={24} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Recommended</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{recommended}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Activity className="text-indigo-500" size={24} />
              Recent Assignments
            </h2>
          </div>
          <Link href="/chair/papers" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
            View all <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {assignments.length === 0 ? (
              <li className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-900 font-bold text-lg">No papers assigned yet.</p>
                <p className="text-slate-500 text-sm mt-1">Check back later when the admin assigns papers to your track.</p>
              </li>
            ) : (
              assignments.slice(0, 5).map(a => {
                const evalData = a.paper.evaluations[0];
                const isEvaluated = evalData?.status === "SUBMITTED";
                return (
                  <li key={a.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${isEvaluated ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'}`} />
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{a.paper.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-semibold text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">{a.paper.paperId}</span>
                          {a.paper.track && <span className="flex items-center gap-1"><TrendingUp size={12} /> {a.paper.track}</span>}
                          {a.paper.session && <span className="text-slate-400">&bull; Session: {a.paper.session}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-6 sm:ml-0">
                      {isEvaluated ? (
                        <span className="px-3 py-1.5 text-xs font-bold bg-emerald-50/80 text-emerald-700 border border-emerald-200/60 rounded-xl shadow-sm">
                          Evaluated ({evalData.totalScore}/50)
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 text-xs font-bold bg-amber-50/80 text-amber-700 border border-amber-200/60 rounded-xl shadow-sm">
                          Pending Review
                        </span>
                      )}
                      <Link 
                        href={`/chair/evaluate/${a.paperId}`} 
                        className={`text-sm px-5 py-2.5 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2
                          ${isEvaluated 
                            ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/25 hover:shadow-lg"}`}
                      >
                        {isEvaluated ? "View" : "Evaluate"}
                      </Link>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
