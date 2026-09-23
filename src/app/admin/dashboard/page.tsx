import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, Users, CheckCircle, Clock, Star, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalPapers,
    totalChairs,
    totalEvaluations,
    completedEvaluations,
    recommendedPapers,
  ] = await Promise.all([
    prisma.paper.count(),
    prisma.user.count({ where: { role: "SESSION_CHAIR" } }),
    prisma.evaluation.count(),
    prisma.evaluation.count({ where: { status: "SUBMITTED" } }),
    prisma.evaluation.count({ where: { status: "SUBMITTED", recommended: true } }),
  ]);

  const pendingEvaluations = totalEvaluations - completedEvaluations;

  // Calculate average score
  const allSubmissions = await prisma.evaluation.findMany({
    where: { status: "SUBMITTED" },
    select: { totalScore: true }
  });
  
  const avgScore = allSubmissions.length > 0
    ? (allSubmissions.reduce((a, b) => a + b.totalScore, 0) / allSubmissions.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-blue-500 mb-2"><FileText size={24} /></div>
          <div className="text-2xl font-bold text-gray-900">{totalPapers}</div>
          <div className="text-xs text-gray-500 font-medium">Total Papers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-indigo-500 mb-2"><Users size={24} /></div>
          <div className="text-2xl font-bold text-gray-900">{totalChairs}</div>
          <div className="text-xs text-gray-500 font-medium">Session Chairs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-green-500 mb-2"><CheckCircle size={24} /></div>
          <div className="text-2xl font-bold text-gray-900">{completedEvaluations}</div>
          <div className="text-xs text-gray-500 font-medium">Evaluated Papers</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-yellow-500 mb-2"><Clock size={24} /></div>
          <div className="text-2xl font-bold text-gray-900">{pendingEvaluations}</div>
          <div className="text-xs text-gray-500 font-medium">Pending Evals</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-purple-500 mb-2"><Star size={24} /></div>
          <div className="text-2xl font-bold text-gray-900">{recommendedPapers}</div>
          <div className="text-xs text-gray-500 font-medium">Recommended</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-rose-500 mb-2"><TrendingUp size={24} /></div>
          <div className="text-2xl font-bold text-gray-900">{avgScore} <span className="text-sm font-normal text-gray-500">/ 20</span></div>
          <div className="text-xs text-gray-500 font-medium">Average Score</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/papers" className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors">
              <div className="font-medium text-blue-600">Manage Papers</div>
            </Link>
            <Link href="/admin/chairs" className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors">
              <div className="font-medium text-blue-600">Manage Chairs</div>
            </Link>
            <Link href="/admin/analytics" className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors">
              <div className="font-medium text-blue-600">View Analytics</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
