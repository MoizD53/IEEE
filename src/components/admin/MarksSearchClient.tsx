"use client";

import { useState } from "react";
import { FileText, Star, CheckCircle, Search } from "lucide-react";

export default function MarksSearchClient({ evaluations }: { evaluations: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvals = evaluations.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.paper.title.toLowerCase().includes(q) ||
      e.paper.authors.toLowerCase().includes(q) ||
      e.paper.paperId.toLowerCase().includes(q) ||
      e.paper.track.toLowerCase().includes(q) ||
      e.chair.name.toLowerCase().includes(q)
    );
  });

  // Group by track
  const trackGroups = filteredEvals.reduce((acc: any, evalData: any) => {
    const track = evalData.paper.track || "Uncategorized";
    if (!acc[track]) {
      acc[track] = [];
    }
    acc[track].push(evalData);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
          placeholder="Search by paper ID, title, author, or track..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">No Evaluations Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or wait for session chairs to submit their paper evaluations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
