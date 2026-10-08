import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, CheckCircle2, CircleDashed, Filter, Search, ChevronRight, TrendingUp } from "lucide-react";

export default async function ChairPapersPage() {
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
    },
    orderBy: { assignedAt: "desc" }
  });

  const evaluatedCount = assignments.filter(a => a.paper.evaluations.some(e => e.status === "SUBMITTED")).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight relative z-10">Assigned Papers</h1>
          <p className="text-slate-500 mt-2 font-medium max-w-xl relative z-10">
            Review and evaluate the papers allocated to your session. Your expertise shapes the quality of CICON.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 self-start md:self-end">
          <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm">
            All ({assignments.length})
          </div>
          <div className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm cursor-pointer transition-colors">
            Evaluated ({evaluatedCount})
          </div>
          <div className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl font-bold text-sm cursor-pointer transition-colors">
            Pending ({assignments.length - evaluatedCount})
          </div>
        </div>
      </div>

      {/* Optional: Add a simple non-functional search bar for visual premium feel */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search papers by title or ID..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            disabled
          />
        </div>
        <button className="p-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:bg-slate-50 text-slate-600 transition-all disabled:opacity-50" disabled>
          <Filter size={18} />
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
        {assignments.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No papers assigned</h3>
            <p className="mt-2 text-slate-500 max-w-sm">You haven't been assigned any papers yet. We will notify you when new assignments are ready for review.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignments.map(a => {
              const evalData = a.paper.evaluations[0];
              const isEvaluated = evalData?.status === "SUBMITTED";

              return (
                <div key={a.id} className="p-5 md:p-6 hover:bg-slate-50/50 transition-all duration-300 group relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-colors" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0 flex gap-4">
                      <div className="mt-1 hidden sm:block">
                        {isEvaluated ? (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 size={20} className="stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <CircleDashed size={20} className="stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors pr-4">{a.paper.title}</h2>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                            {a.paper.paperId}
                          </span>
                          
                          {a.paper.track && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                              <TrendingUp size={14} className="text-indigo-400" />
                              {a.paper.track}
                            </span>
                          )}
                          
                          {a.paper.session && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 border-l border-slate-200 pl-4">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                              {a.paper.session}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 justify-between md:justify-end ml-0 sm:ml-14 md:ml-0 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
                      <div className="flex flex-col items-start md:items-end gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                        {isEvaluated ? (
                          <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-600">{evalData.totalScore}/50</span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Evaluated</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">Pending</span>
                        )}
                      </div>

                      <Link 
                        href={`/chair/evaluate/${a.paperId}`} 
                        className={`shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300
                          ${isEvaluated 
                            ? 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-sm' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 border-2 border-transparent'}`}
                      >
                        {isEvaluated ? "Review" : "Evaluate"}
                        <ChevronRight size={16} className={`transition-transform ${!isEvaluated && "group-hover:translate-x-1"}`} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
