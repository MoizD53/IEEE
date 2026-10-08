import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import AssignChairForm from "@/components/admin/AssignChairForm";
import AssignmentList from "@/components/admin/AssignmentList";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PaperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = await prisma.paper.findUnique({
    where: { id },
    include: {
      assignments: {
        include: { chair: true }
      },
      evaluations: {
        include: { chair: true }
      }
    }
  });

  if (!paper) notFound();

  const allChairs = await prisma.user.findMany({
    where: { role: "SESSION_CHAIR", status: "ACTIVE" },
    select: { id: true, name: true, username: true }
  });

  // Filter out already assigned chairs
  const activeAssignmentChairIds = paper.assignments
    .filter(a => a.status === "ACTIVE")
    .map(a => a.chairId);
    
  const availableChairs = allChairs.filter(c => !activeAssignmentChairIds.includes(c.id));

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 pb-10">
      <div>
        <Link href="/admin/papers" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Papers
        </Link>
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/90 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 mb-3">
              {paper.paperId}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug max-w-4xl">{paper.title}</h1>
            <p className="mt-3 text-sm font-medium text-slate-500 max-w-3xl">{paper.authors}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/90">
            <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">📋</span>
              Evaluations & Scores
            </h2>
            {paper.evaluations.length === 0 ? (
              <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                <p className="text-sm font-medium text-slate-500">No evaluations submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paper.evaluations.map(ev => (
                  <div key={ev.id} className="border border-slate-200/80 p-5 md:p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Evaluator</div>
                        <div className="font-bold text-slate-900 text-base">{ev.chair.name}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Score</div>
                          <div className="font-black text-blue-700 text-lg leading-none">{ev.totalScore}<span className="text-xs text-blue-400">/50</span></div>
                        </div>
                        <div className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${ev.recommended ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          {ev.recommended ? '★ Recommended' : 'Not Recommended'}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mb-4 text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                      <div><span className="block text-[9px] uppercase font-bold text-slate-400">Novelty</span> <span className="font-bold text-slate-900">{ev.relevanceNoveltyScore}/10</span></div>
                      <div><span className="block text-[9px] uppercase font-bold text-slate-400">Methodology</span> <span className="font-bold text-slate-900">{ev.technicalMethodologyScore}/10</span></div>
                      <div><span className="block text-[9px] uppercase font-bold text-slate-400">Results</span> <span className="font-bold text-slate-900">{ev.resultsContributionScore}/10</span></div>
                      <div><span className="block text-[9px] uppercase font-bold text-slate-400">Clarity</span> <span className="font-bold text-slate-900">{ev.presentationClarityScore}/10</span></div>
                      <div><span className="block text-[9px] uppercase font-bold text-slate-400">Q&A</span> <span className="font-bold text-slate-900">{ev.qaKnowledgeScore}/10</span></div>
                    </div>
                    {ev.feedbackText && (
                      <div className="text-sm bg-blue-50/50 p-4 rounded-xl text-slate-700 italic border border-blue-100 font-medium">
                        "{ev.feedbackText}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200/90 h-full flex flex-col">
            <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">👥</span>
              Assignments
            </h2>
            {activeAssignmentChairIds.length === 0 ? (
              <AssignChairForm paperId={paper.id} chairs={availableChairs} />
            ) : (
              <div className="mb-4 p-4 bg-emerald-50/80 text-emerald-800 text-sm font-medium rounded-xl border border-emerald-200 shadow-sm flex items-start gap-3">
                <span className="text-emerald-600 mt-0.5">✓</span>
                This paper is assigned. A paper can only have one session chair.
              </div>
            )}
            <div className="mt-auto pt-6">
              <AssignmentList paperId={paper.id} assignments={paper.assignments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
