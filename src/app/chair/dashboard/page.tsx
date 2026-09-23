import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText, CheckCircle, Clock, Star } from "lucide-react";

export default async function ChairDashboardPage() {
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
    }
  });

  const totalAssigned = assignments.length;
  const completed = assignments.filter(a => a.paper.evaluations.some(e => e.status === "SUBMITTED")).length;
  const pending = totalAssigned - completed;
  const recommended = assignments.filter(a => a.paper.evaluations.some(e => e.status === "SUBMITTED" && e.recommended)).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><FileText size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Assigned</p>
            <p className="text-2xl font-bold text-gray-900">{totalAssigned}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full"><CheckCircle size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completed}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Clock size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{pending}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Star size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Recommended</p>
            <p className="text-2xl font-bold text-gray-900">{recommended}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Assigned Papers</h2>
          <Link href="/chair/papers" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {assignments.length === 0 ? (
              <li className="p-6 text-center text-gray-500">No papers assigned yet.</li>
            ) : (
              assignments.slice(0, 5).map(a => {
                const evalData = a.paper.evaluations[0];
                return (
                  <li key={a.id} className="p-4 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{a.paper.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{a.paper.paperId} &bull; Track: {a.paper.track || '-'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {evalData?.status === "SUBMITTED" ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Evaluated</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      )}
                      <Link 
                        href={`/chair/evaluate/${a.paperId}`} 
                        className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        {evalData?.status === "SUBMITTED" ? "View" : "Evaluate"}
                      </Link>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
