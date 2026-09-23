import { prisma } from "@/lib/db";
import { ScoreDistributionChart, RecommendationPieChart } from "@/components/admin/AnalyticsCharts";
import { auth } from "@/lib/auth";

export default async function AnalyticsPage() {
  const evaluations = await prisma.evaluation.findMany({
    where: { status: "SUBMITTED" }
  });

  const total = evaluations.length;
  
  // 5 Evaluation Parameter Averages (out of 10)
  const avgNovelty = total ? (evaluations.reduce((a, b) => a + b.relevanceNoveltyScore, 0) / total).toFixed(1) : "0.0";
  const avgMethod = total ? (evaluations.reduce((a, b) => a + b.technicalMethodologyScore, 0) / total).toFixed(1) : "0.0";
  const avgContrib = total ? (evaluations.reduce((a, b) => a + b.resultsContributionScore, 0) / total).toFixed(1) : "0.0";
  const avgClarity = total ? (evaluations.reduce((a, b) => a + b.presentationClarityScore, 0) / total).toFixed(1) : "0.0";
  const avgQA = total ? (evaluations.reduce((a, b) => a + b.qaKnowledgeScore, 0) / total).toFixed(1) : "0.0";
  const avgTotal = total ? (evaluations.reduce((a, b) => a + b.totalScore, 0) / total).toFixed(1) : "0.0";

  // Best Paper Recommendation Data
  const recCount = evaluations.filter(e => e.recommended).length;
  const notRecCount = total - recCount;
  const recData = [
    { name: 'Best Paper Recommended', value: recCount },
    { name: 'Not Recommended', value: notRecCount },
  ];

  // Score Distribution on 50-mark scale (0-20, 21-30, 31-40, 41-50)
  let d0_20 = 0, d21_30 = 0, d31_40 = 0, d41_50 = 0;
  evaluations.forEach(e => {
    if (e.totalScore <= 20) d0_20++;
    else if (e.totalScore <= 30) d21_30++;
    else if (e.totalScore <= 40) d31_40++;
    else d41_50++;
  });

  const scoreData = [
    { name: '0-20 Marks', count: d0_20 },
    { name: '21-30 Marks', count: d21_30 },
    { name: '31-40 Marks', count: d31_40 },
    { name: '41-50 Marks', count: d41_50 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Presentation Scoring Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time statistics across all 5 parameters on the 50-mark scale ({total} evaluations).</p>
      </div>

      {/* 5 Parameters Averages + Total Score */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Novelty</div>
          <div className="text-xl font-black text-blue-600 mt-1">{avgNovelty} <span className="text-xs font-normal text-slate-400">/ 10</span></div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Methodology</div>
          <div className="text-xl font-black text-blue-600 mt-1">{avgMethod} <span className="text-xs font-normal text-slate-400">/ 10</span></div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Results</div>
          <div className="text-xl font-black text-blue-600 mt-1">{avgContrib} <span className="text-xs font-normal text-slate-400">/ 10</span></div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Clarity</div>
          <div className="text-xl font-black text-blue-600 mt-1">{avgClarity} <span className="text-xs font-normal text-slate-400">/ 10</span></div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Q&A Knowledge</div>
          <div className="text-xl font-black text-blue-600 mt-1">{avgQA} <span className="text-xs font-normal text-slate-400">/ 10</span></div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl shadow-sm border-2 border-blue-500 text-center col-span-2 md:col-span-1">
          <div className="text-xs text-blue-800 font-bold uppercase tracking-wider">Avg Total</div>
          <div className="text-2xl font-black text-blue-700 mt-0.5">{avgTotal} <span className="text-xs font-semibold text-blue-500">/ 50</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-6">Score Distribution (50-Mark Scale)</h2>
          <ScoreDistributionChart data={scoreData} />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-base font-bold text-slate-900 mb-6">Best Paper Recommendation Ratio</h2>
          <RecommendationPieChart data={recData} />
        </div>
      </div>
    </div>
  );
}
