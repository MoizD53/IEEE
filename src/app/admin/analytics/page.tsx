import { prisma } from "@/lib/db";
import { ScoreDistributionChart, RecommendationPieChart } from "@/components/admin/AnalyticsCharts";
import { auth } from "@/lib/auth";

export default async function AnalyticsPage() {
  const evaluations = await prisma.evaluation.findMany({
    where: { status: "SUBMITTED" }
  });

  const total = evaluations.length;
  
  // Averages
  const avgTech = total ? (evaluations.reduce((a, b) => a + b.technicalScore, 0) / total).toFixed(1) : "0";
  const avgOrig = total ? (evaluations.reduce((a, b) => a + b.originalityScore, 0) / total).toFixed(1) : "0";
  const avgRel = total ? (evaluations.reduce((a, b) => a + b.relevanceScore, 0) / total).toFixed(1) : "0";
  const avgPres = total ? (evaluations.reduce((a, b) => a + b.presentationScore, 0) / total).toFixed(1) : "0";
  const avgTotal = total ? (evaluations.reduce((a, b) => a + b.totalScore, 0) / total).toFixed(1) : "0";

  // Recommendation Data
  const recCount = evaluations.filter(e => e.recommended).length;
  const notRecCount = total - recCount;
  const recData = [
    { name: 'Recommended', value: recCount },
    { name: 'Not Recommended', value: notRecCount },
  ];

  // Score Distribution (0-5, 6-10, 11-15, 16-20)
  let d0_5 = 0, d6_10 = 0, d11_15 = 0, d16_20 = 0;
  evaluations.forEach(e => {
    if (e.totalScore <= 5) d0_5++;
    else if (e.totalScore <= 10) d6_10++;
    else if (e.totalScore <= 15) d11_15++;
    else d16_20++;
  });

  const scoreData = [
    { name: '0-5', count: d0_5 },
    { name: '6-10', count: d6_10 },
    { name: '11-15', count: d11_15 },
    { name: '16-20', count: d16_20 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Real-time statistics based on {total} submitted evaluations.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500 font-medium">Avg Technical</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{avgTech}/5</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500 font-medium">Avg Originality</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{avgOrig}/5</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500 font-medium">Avg Relevance</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{avgRel}/5</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-sm text-gray-500 font-medium">Avg Presentation</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{avgPres}/5</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-blue-500 bg-blue-50 text-center border-2">
          <div className="text-sm text-blue-800 font-bold">Avg Total Score</div>
          <div className="text-3xl font-black text-blue-700 mt-1">{avgTotal}/20</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-6">Score Distribution</h2>
          <ScoreDistributionChart data={scoreData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-6">Recommendation Ratio</h2>
          <RecommendationPieChart data={recData} />
        </div>
      </div>
    </div>
  );
}
