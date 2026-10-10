import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, CheckCircle, Clock, Star, Activity, TrendingUp } from "lucide-react";
import AutoRefresh from "@/components/AutoRefresh";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <AutoRefresh interval={5000} />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 text-sm">Track your paper evaluation progress and metrics.</p>
        </div>
        {totalAssigned > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completion</div>
            <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <div className="text-sm font-semibold text-slate-700">{progress}%</div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Assigned</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{totalAssigned}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Completed</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{completed}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{pending}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <Star size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Recommended</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{recommended}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Assigned Papers</h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {assignments.length === 0 ? (
              <li className="p-10 text-center flex flex-col items-center justify-center">
                <FileText className="text-slate-300 mb-3" size={32} />
                <p className="text-slate-900 font-medium">No papers assigned yet.</p>
                <p className="text-slate-500 text-sm mt-1">Check back later.</p>
              </li>
            ) : (
              assignments.map(a => {
                const evalData = a.paper.evaluations[0];
                const isEvaluated = evalData?.status === "SUBMITTED";
                return (
                  <li key={a.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{a.paper.paperId}</span>
                        {isEvaluated ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Evaluated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Pending
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-slate-900 line-clamp-1">{a.paper.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500">
                        {a.paper.track && <span className="flex items-center gap-1"><TrendingUp size={12} /> {a.paper.track}</span>}
                        {a.paper.session && <span>&bull; Session: {a.paper.session}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      {isEvaluated && (
                        <div className="hidden sm:block text-right">
                          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Score</div>
                          <div className="text-sm font-semibold text-slate-900">{evalData.totalScore}/50</div>
                        </div>
                      )}
                      <Link 
                        href={`/chair/evaluate/${a.paperId}`} 
                        className={`text-sm px-4 py-2 font-medium rounded-lg transition-colors flex items-center justify-center min-w-[100px]
                          ${isEvaluated 
                            ? "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50" 
                            : "bg-blue-600 text-white hover:bg-blue-700"}`}
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
