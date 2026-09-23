import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { FileText } from "lucide-react";

export default async function ChairPapersPage() {
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
    },
    orderBy: { assignedAt: "desc" }
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assigned Papers</h1>
        <p className="mt-1 text-sm text-gray-500">View and evaluate the papers assigned to you.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {assignments.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No papers assigned</h3>
            <p className="mt-1 text-gray-500">No papers have been assigned to you yet.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paper Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 block md:table-row-group">
              {assignments.map(a => {
                const evalData = a.paper.evaluations[0];
                const isEvaluated = evalData?.status === "SUBMITTED";

                return (
                  <tr key={a.id} className="block md:table-row p-4 md:p-0 hover:bg-gray-50 border-b md:border-b-0">
                    <td className="md:px-6 md:py-4 block md:table-cell mb-2 md:mb-0">
                      <div className="font-medium text-gray-900">{a.paper.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {a.paper.paperId} &bull; Track: {a.paper.track || '-'}
                      </div>
                    </td>
                    <td className="md:px-6 md:py-4 block md:table-cell mb-2 md:mb-0 whitespace-nowrap">
                      <span className="md:hidden text-xs font-medium text-gray-500 uppercase mr-2">Status:</span>
                      {isEvaluated ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Evaluated</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      )}
                    </td>
                    <td className="md:px-6 md:py-4 block md:table-cell mb-4 md:mb-0 whitespace-nowrap">
                      <span className="md:hidden text-xs font-medium text-gray-500 uppercase mr-2">Score:</span>
                      {isEvaluated ? (
                        <span className="font-bold text-gray-900">{evalData.totalScore}/20</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="md:px-6 md:py-4 block md:table-cell text-right whitespace-nowrap">
                      <Link 
                        href={`/chair/evaluate/${a.paperId}`} 
                        className={`inline-flex justify-center w-full md:w-auto py-2 px-4 border shadow-sm text-sm font-medium rounded-md text-white transition-colors
                          ${isEvaluated ? 'border-gray-300 bg-gray-600 hover:bg-gray-700' : 'border-transparent bg-blue-600 hover:bg-blue-700'}`}
                      >
                        {isEvaluated ? "View Evaluation" : "Evaluate Paper"}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
