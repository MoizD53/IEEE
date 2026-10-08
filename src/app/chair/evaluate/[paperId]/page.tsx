import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EvaluationForm from "@/components/chair/EvaluationForm";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Award, FileText, Sparkles, AlertCircle } from "lucide-react";
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-40 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none -z-10" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Link href="/chair/papers" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-indigo-600 mb-4 transition-colors uppercase tracking-widest bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
            <ArrowLeft size={14} className="mr-1.5" /> Back to Papers
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Evaluate Paper Presentation
            {isSubmitted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                <CheckCircle2 size={14} /> Completed
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-2 font-medium max-w-2xl">
            Review presentation quality and submit scoring on the 50-mark scale based on CICON standard criteria.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[1fr_1.5fr] gap-6 lg:gap-10 items-start">
        <div className="space-y-6 lg:sticky lg:top-8">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500" />
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 mb-6 border border-indigo-100">
              <FileText size={12} /> Paper Details
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Paper Title</div>
                <h2 className="text-xl font-black text-slate-900 leading-snug">{paper.title}</h2>
              </div>
              
              <div className="h-px bg-slate-100" />
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Paper ID</div>
                  <span className="inline-flex px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-sm font-bold font-mono">
                    {paper.paperId}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Authors</div>
                  <span className="text-sm font-bold text-slate-700">{paper.authors}</span>
                </div>
              </div>
              
              {(paper.track || paper.session) && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="grid grid-cols-2 gap-6">
                    {paper.track && (
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Track</div>
                        <span className="text-sm font-bold text-slate-700">{paper.track}</span>
                      </div>
                    )}
                    {paper.session && (
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Session</div>
                        <span className="text-sm font-bold text-slate-700">{paper.session}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2rem] shadow-lg border border-indigo-500/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-widest mb-4">
                <AlertCircle size={16} /> Evaluation Criteria
              </div>
              <ul className="space-y-4 text-sm font-medium text-slate-300">
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-400">1.</span>
                  <div><strong className="text-white block mb-0.5">Relevance & Novelty (10)</strong>Originality and significance of the work to the field.</div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-400">2.</span>
                  <div><strong className="text-white block mb-0.5">Technical Quality (10)</strong>Soundness of methodology and correctness.</div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-400">3.</span>
                  <div><strong className="text-white block mb-0.5">Results (10)</strong>Significance of findings and contribution.</div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-400">4.</span>
                  <div><strong className="text-white block mb-0.5">Presentation (10)</strong>Clarity, slide quality, and timing.</div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-400">5.</span>
                  <div><strong className="text-white block mb-0.5">Q&A Handling (10)</strong>Subject knowledge and response quality.</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden">
            {isSubmitted ? (
              <div className="p-8 sm:p-10 space-y-8">
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-start gap-4">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-black text-emerald-900 text-lg">Evaluation Locked</h3>
                    <p className="text-sm font-medium text-emerald-700/80 mt-1">This paper has been evaluated successfully on {new Date(existingEval.submittedAt!).toLocaleString()}. It cannot be modified.</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-900">Score Breakdown</h4>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  
                  <div className="grid gap-3">
                    {[
                      { title: "1. Relevance, Significance & Novelty", score: existingEval.relevanceNoveltyScore },
                      { title: "2. Technical Quality & Methodology", score: existingEval.technicalMethodologyScore },
                      { title: "3. Results & Research Contribution", score: existingEval.resultsContributionScore },
                      { title: "4. Presentation Quality & Clarity", score: existingEval.presentationClarityScore },
                      { title: "5. Q&A / Subject Knowledge", score: existingEval.qaKnowledgeScore },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/80 hover:border-slate-200 transition-colors group">
                        <span className="font-semibold text-slate-700 text-sm group-hover:text-slate-900 transition-colors">{item.title}</span>
                        <div className="flex items-center gap-1">
                          <span className="font-black text-lg text-indigo-600">{item.score}</span>
                          <span className="text-xs font-bold text-slate-400">/ 10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden mt-6 border border-indigo-500/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[40px] pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-indigo-400" />
                        <div className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Total Evaluated Score</div>
                      </div>
                      <div className="text-sm font-medium text-slate-300 mt-2">Average: <span className="font-bold text-white">{(existingEval.totalScore / 5).toFixed(1)}</span> / 10</div>
                    </div>
                    <div className="text-4xl font-black relative z-10 flex items-end gap-1">
                      {existingEval.totalScore}
                      <span className="text-xl text-indigo-300/60 font-bold mb-1">/ 50</span>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between mt-6">
                    <span className="text-sm font-black text-slate-700 flex items-center gap-2">
                      <Award size={20} className="text-amber-500" /> Best Paper Recommendation
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold shadow-sm
                      ${existingEval.recommended 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60' 
                        : 'bg-white text-slate-600 border border-slate-200'}`}>
                      {existingEval.recommended ? <CheckCircle2 size={16} /> : <XCircle size={16} className="text-slate-400" />}
                      {existingEval.recommended ? "Highly Recommended" : "Not Recommended"}
                    </span>
                  </div>

                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 mb-6 border border-amber-200/60">
                  <Sparkles size={12} /> Pending Review
                </div>
                <EvaluationForm paperId={paper.id} />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <JumpToPaperDropdown papers={unevaluatedPapers} />
          </div>
        </div>
      </div>
    </div>
  );
}
