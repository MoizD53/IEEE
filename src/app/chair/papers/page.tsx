import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, CheckCircle2, CircleDashed, ChevronRight, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

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
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Assigned Papers</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Review and evaluate the papers allocated to your session.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 self-start md:self-end">
          <div className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-md font-medium text-sm">
            All ({assignments.length})
          </div>
          <div className="px-3 py-1.5 text-slate-500 hover:text-slate-700 font-medium text-sm cursor-pointer transition-colors">
            Evaluated ({evaluatedCount})
          </div>
          <div className="px-3 py-1.5 text-slate-500 hover:text-slate-700 font-medium text-sm cursor-pointer transition-colors">
            Pending ({assignments.length - evaluatedCount})
          </div>
        </div>
      </div>



      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {assignments.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <FileText className="h-10 w-10 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No papers assigned</h3>
            <p className="mt-1 text-sm text-slate-500">You haven't been assigned any papers yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {assignments.map(a => {
              const evalData = a.paper.evaluations[0];
              const isEvaluated = evalData?.status === "SUBMITTED";

              return (
                <div key={a.id} className="p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0 flex gap-4">
                      <div className="mt-1 hidden sm:block shrink-0">
                        {isEvaluated ? (
                          <div className="text-emerald-500 bg-emerald-50 rounded-full p-1">
                            <CheckCircle2 size={18} />
                          </div>
                        ) : (
                          <div className="text-amber-500 bg-amber-50 rounded-full p-1">
                            <CircleDashed size={18} />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h2 className="text-base font-medium text-slate-900">{a.paper.title}</h2>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-xs">
                          <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {a.paper.paperId}
                          </span>
                          
                          {a.paper.track && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <TrendingUp size={12} />
                              {a.paper.track}
                            </span>
                          )}
                          
                          {a.paper.session && (
                            <span className="text-slate-500">
                              &bull; {a.paper.session}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end ml-0 sm:ml-12 md:ml-0 pt-2 md:pt-0 shrink-0">
                      <div className="flex flex-col items-start md:items-end">
                        {isEvaluated ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">Score</span>
                            <span className="font-semibold text-slate-900">{evalData.totalScore}/50</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            Pending
                          </span>
                        )}
                      </div>

                      <Link 
                        href={`/chair/evaluate/${a.paperId}`} 
                        className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors min-w-[100px]
                          ${isEvaluated 
                            ? 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        {isEvaluated ? "Review" : "Evaluate"}
                        {!isEvaluated && <ChevronRight size={16} />}
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
