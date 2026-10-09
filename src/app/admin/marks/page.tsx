import { prisma } from "@/lib/db";
import { FileText, Trophy, Star, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MarksPage() {
  const evaluations = await prisma.evaluation.findMany({
    include: {
      paper: true,
      chair: true,
    },
    orderBy: {
      totalScore: "desc",
    },
  });

  // Group by track
  const trackGroups = evaluations.reduce((acc: any, evalData: any) => {
    const track = evalData.paper.track || "Uncategorized";
    if (!acc[track]) {
      acc[track] = [];
    }
    acc[track].push(evalData);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-900 via-blue-800 to-indigo-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Trophy size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
              <Trophy size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Track-wise Marks & Scores</h1>
          </div>
          <p className="text-blue-100 max-w-2xl text-sm font-medium leading-relaxed mt-3">
            Review detailed criteria-wise marks and total scores for all evaluated papers, categorized by track.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(trackGroups).map(([trackName, evals]: [string, any]) => (
          <div key={trackName} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-indigo-500" size={20} />
                {trackName}
                <span className="ml-auto text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                  {evals.length} Papers Evaluated
                </span>
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap">Paper ID</th>
                    <th className="px-6 py-4">Title & Authors</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center" title="Relevance, Significance & Novelty (10)">Q1 (10)</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center" title="Technical Quality & Methodology (10)">Q2 (10)</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center" title="Results & Research Contribution (10)">Q3 (10)</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center" title="Presentation Quality & Clarity (10)">Q4 (10)</th>
                    <th className="px-6 py-4 whitespace-nowrap text-center" title="Q&A / Subject Knowledge (10)">Q5 (10)</th>
                    <th className="px-6 py-4 text-center font-bold">Total (50)</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {evals.map((e: any) => (
                    <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                        {e.paper.paperId}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-semibold text-slate-800 truncate" title={e.paper.title}>
                          {e.paper.title}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-1">
                          {e.paper.authors}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-indigo-500 mt-1">
                          Eval by: {e.chair.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-slate-700">{e.relevanceNoveltyScore}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-700">{e.technicalMethodologyScore}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-700">{e.resultsContributionScore}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-700">{e.presentationClarityScore}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-700">{e.qaKnowledgeScore}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg">
                          {e.totalScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {e.recommended ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                            <CheckCircle size={14} /> Rec'd
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-semibold bg-slate-100 px-2 py-1 rounded-full">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {Object.keys(trackGroups).length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Evaluations Yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Once session chairs submit their paper evaluations, the marks and scores will appear here categorized by track.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
