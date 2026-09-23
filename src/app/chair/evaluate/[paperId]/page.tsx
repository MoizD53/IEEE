import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EvaluationForm from "@/components/chair/EvaluationForm";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, XCircle, Award } from "lucide-react";

export default async function EvaluatePaperPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const paper = await prisma.paper.findUnique({
    where: { id: paperId },
    include: {
      assignments: {
        where: { chairId: session.user.id, status: "ACTIVE" }
      },
      evaluations: {
        where: { chairId: session.user.id }
      }
    }
  });

  if (!paper || paper.assignments.length === 0) {
    notFound(); // Not assigned to this chair
  }

  const existingEval = paper.evaluations[0];
  const isSubmitted = existingEval?.status === "SUBMITTED";

  const allAssignments = await prisma.paperAssignment.findMany({
    where: { chairId: session.user.id, status: "ACTIVE" },
    orderBy: { assignedAt: "desc" },
    include: { paper: { select: { id: true, paperId: true } } }
  });
  
  const currentIndex = allAssignments.findIndex(a => a.paperId === paper.id);
  const nextAssignment = currentIndex !== -1 && currentIndex + 1 < allAssignments.length ? allAssignments[currentIndex + 1] : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <Link href="/chair/dashboard" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Evaluate Paper Presentation</h1>
        <p className="text-xs text-slate-500 mt-1">Review presentation quality and submit scoring on the 50-mark scale.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-4 space-y-5">
            <div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                {paper.paperId}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">{paper.title}</h2>
              <div className="text-xs text-slate-500 mt-1">Authors: {paper.authors}</div>
            </div>
            

            
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            {isSubmitted ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm">Evaluation Submitted & Locked</h3>
                    <p className="text-xs text-emerald-700 mt-0.5">Submitted on {new Date(existingEval.submittedAt!).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">5-Parameter Score Breakdown</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-medium text-slate-700">1. Relevance, Significance & Novelty</span>
                      <span className="font-bold text-blue-700">{existingEval.relevanceNoveltyScore} / 10</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-medium text-slate-700">2. Technical Quality & Methodology</span>
                      <span className="font-bold text-blue-700">{existingEval.technicalMethodologyScore} / 10</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-medium text-slate-700">3. Results & Research Contribution</span>
                      <span className="font-bold text-blue-700">{existingEval.resultsContributionScore} / 10</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-medium text-slate-700">4. Presentation Quality & Clarity</span>
                      <span className="font-bold text-blue-700">{existingEval.presentationClarityScore} / 10</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-medium text-slate-700">5. Q&A / Subject Knowledge</span>
                      <span className="font-bold text-blue-700">{existingEval.qaKnowledgeScore} / 10</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl flex justify-between items-center">
                    <div>
                      <div className="text-xs text-blue-200 font-bold uppercase tracking-wider">Total Evaluated Score</div>
                      <div className="text-xs text-blue-300">Average: {(existingEval.totalScore / 5).toFixed(1)} / 10</div>
                    </div>
                    <div className="text-2xl font-black">
                      {existingEval.totalScore} / 50
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Award size={16} className="text-amber-500" /> Best Paper Recommendation:
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${existingEval.recommended ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
                      {existingEval.recommended ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {existingEval.recommended ? "YES — Recommended" : "NO — Not Recommended"}
                    </span>
                  </div>

                  {existingEval.feedbackText && (
                    <div className="pt-2">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Chair Remarks</h4>
                      {existingEval.feedbackRating ? (
                        <div className="text-amber-400 text-base mb-1">{"★".repeat(existingEval.feedbackRating)}</div>
                      ) : null}
                      <p className="text-xs bg-slate-50 p-3 rounded-xl italic text-slate-700 border border-slate-200">
                        "{existingEval.feedbackText}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <EvaluationForm paperId={paper.id} />
            )}
          </div>

          <div className="mt-6 flex justify-end">
            {nextAssignment ? (
              <Link 
                href={`/chair/evaluate/${nextAssignment.paper.id}`}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white font-bold text-sm rounded-xl shadow hover:bg-slate-800 transition-colors text-center"
              >
                Next Assigned Paper &rarr;
              </Link>
            ) : (
              <button 
                disabled 
                className="w-full sm:w-auto px-6 py-3 bg-slate-200 text-slate-500 font-bold text-sm rounded-xl text-center cursor-not-allowed border border-slate-300"
              >
                All Done (No More Papers)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
