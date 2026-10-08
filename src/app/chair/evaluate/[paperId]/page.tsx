import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EvaluationForm from "@/components/chair/EvaluationForm";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Award, FileText, AlertCircle } from "lucide-react";
import JumpToPaperDropdown from "@/components/chair/JumpToPaperDropdown";

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
    notFound();
  }

  const existingEval = paper.evaluations[0];
  const isSubmitted = existingEval?.status === "SUBMITTED";

  const unevaluatedAssignments = await prisma.paperAssignment.findMany({
    where: { 
      chairId: session.user.id, 
      status: "ACTIVE",
      paper: {
        evaluations: {
          none: {
            chairId: session.user.id,
            status: "SUBMITTED"
          }
        }
      }
    },
    include: { paper: { select: { id: true, paperId: true, title: true } } }
  });
  
  const unevaluatedPapers = unevaluatedAssignments
    .map(a => a.paper)
    .filter(p => p.id !== paper.id)
    .sort((a, b) => {
      const numA = parseInt(a.paperId);
      const numB = parseInt(b.paperId);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.paperId.localeCompare(b.paperId);
    });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Link href="/chair/papers" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 mb-4 transition-colors">
            <ArrowLeft size={16} className="mr-1.5" /> Back to Papers
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
            Evaluate Paper Presentation
            {isSubmitted && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-full">
                <CheckCircle2 size={14} /> Completed
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-2xl">
            Review presentation quality and submit scoring based on CICON criteria.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 mb-5 border border-slate-200">
              <FileText size={14} /> Paper Details
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">Title</div>
                <h2 className="text-base font-semibold text-slate-900 leading-snug">{paper.title}</h2>
              </div>
              
              <div className="h-px bg-slate-100" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Paper ID</div>
                  <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono">
                    {paper.paperId}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500 mb-1">Authors</div>
                  <span className="text-sm font-medium text-slate-900">{paper.authors}</span>
                </div>
              </div>
              
              {(paper.track || paper.session) && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="grid grid-cols-2 gap-4">
                    {paper.track && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">Track</div>
                        <span className="text-sm font-medium text-slate-900">{paper.track}</span>
                      </div>
                    )}
                    {paper.session && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">Session</div>
                        <span className="text-sm font-medium text-slate-900">{paper.session}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-4">
              <AlertCircle size={16} /> Evaluation Criteria
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-2">
                <span className="font-semibold text-slate-900">1.</span>
                <div><strong className="text-slate-900 block mb-0.5">Relevance & Novelty (10)</strong>Originality and significance.</div>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-slate-900">2.</span>
                <div><strong className="text-slate-900 block mb-0.5">Technical Quality (10)</strong>Soundness of methodology.</div>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-slate-900">3.</span>
                <div><strong className="text-slate-900 block mb-0.5">Results (10)</strong>Significance of findings.</div>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-slate-900">4.</span>
                <div><strong className="text-slate-900 block mb-0.5">Presentation (10)</strong>Clarity and timing.</div>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-slate-900">5.</span>
                <div><strong className="text-slate-900 block mb-0.5">Q&A Handling (10)</strong>Subject knowledge.</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {isSubmitted ? (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-emerald-900">Evaluation Locked</h3>
                    <p className="text-sm text-emerald-700 mt-1">Evaluated on {new Date(existingEval.submittedAt!).toLocaleString()}. It cannot be modified.</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-900">Score Breakdown</h4>
                  
                  <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                    {[
                      { title: "1. Relevance, Significance & Novelty", score: existingEval.relevanceNoveltyScore },
                      { title: "2. Technical Quality & Methodology", score: existingEval.technicalMethodologyScore },
                      { title: "3. Results & Research Contribution", score: existingEval.resultsContributionScore },
                      { title: "4. Presentation Quality & Clarity", score: existingEval.presentationClarityScore },
                      { title: "5. Q&A / Subject Knowledge", score: existingEval.qaKnowledgeScore },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3">
                        <span className="text-slate-700 text-sm">{item.title}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-slate-900">{item.score}</span>
                          <span className="text-xs text-slate-400">/ 10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Total Score</div>
                      <div className="text-xs text-slate-500 mt-1">Average: {(existingEval.totalScore / 5).toFixed(1)} / 10</div>
                    </div>
                    <div className="text-3xl font-semibold text-slate-900">
                      {existingEval.totalScore} <span className="text-lg text-slate-400 font-normal">/ 50</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <Award size={18} className="text-slate-400" /> Best Paper Recommendation
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
                      ${existingEval.recommended 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                      {existingEval.recommended ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {existingEval.recommended ? "Highly Recommended" : "Not Recommended"}
                    </span>
                  </div>

                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900">Submit Evaluation</h3>
                  <p className="text-sm text-slate-500 mt-1">Please grade each category out of 10.</p>
                </div>
                <EvaluationForm paperId={paper.id} />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <JumpToPaperDropdown papers={unevaluatedPapers} />
          </div>
        </div>
      </div>
    </div>
  );
}
