import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import AssignChairForm from "@/components/admin/AssignChairForm";
import AssignmentList from "@/components/admin/AssignmentList";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PaperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = await prisma.paper.findUnique({
    where: { id },
    include: {
      assignments: {
        include: { chair: true }
      },
      evaluations: {
        include: { chair: true }
      }
    }
  });

  if (!paper) notFound();

  const allChairs = await prisma.user.findMany({
    where: { role: "SESSION_CHAIR", status: "ACTIVE" },
    select: { id: true, name: true, username: true }
  });

  // Filter out already assigned chairs
  const activeAssignmentChairIds = paper.assignments
    .filter(a => a.status === "ACTIVE")
    .map(a => a.chairId);
    
  const availableChairs = allChairs.filter(c => !activeAssignmentChairIds.includes(c.id));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <Link href="/admin/papers" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Papers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{paper.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{paper.paperId} &bull; {paper.authors}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Paper Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Abstract</h3>
                <p className="mt-1 text-sm text-gray-900">{paper.abstract || "No abstract provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Track</h3>
                  <p className="mt-1 text-sm text-gray-900">{paper.track || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Session</h3>
                  <p className="mt-1 text-sm text-gray-900">{paper.session || "-"}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Keywords</h3>
                  <p className="mt-1 text-sm text-gray-900">{paper.keywords || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Evaluations</h2>
            {paper.evaluations.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No evaluations submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {paper.evaluations.map(ev => (
                  <div key={ev.id} className="border p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold">{ev.chair.name}</div>
                      <div className={`text-xs font-bold px-2 py-1 rounded ${ev.recommended ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {ev.recommended ? 'Recommended' : 'Not Recommended'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs mb-3 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>Novelty: <span className="font-bold text-slate-900">{ev.relevanceNoveltyScore}/10</span></div>
                      <div>Methodology: <span className="font-bold text-slate-900">{ev.technicalMethodologyScore}/10</span></div>
                      <div>Results: <span className="font-bold text-slate-900">{ev.resultsContributionScore}/10</span></div>
                      <div>Clarity: <span className="font-bold text-slate-900">{ev.presentationClarityScore}/10</span></div>
                      <div>Q&A: <span className="font-bold text-slate-900">{ev.qaKnowledgeScore}/10</span></div>
                    </div>
                    <div className="font-bold text-sm mb-2 text-blue-700">Total Score: {ev.totalScore}/50</div>
                    {ev.feedbackText && (
                      <div className="text-sm bg-gray-50 p-2 rounded text-gray-700 italic border-l-2 border-gray-300">
                        "{ev.feedbackText}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Assignments</h2>
            {activeAssignmentChairIds.length === 0 ? (
              <AssignChairForm paperId={paper.id} chairs={availableChairs} />
            ) : (
              <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md border border-blue-200">
                This paper is already assigned. A paper can only have one session chair.
              </div>
            )}
            <AssignmentList paperId={paper.id} assignments={paper.assignments} />
          </div>
        </div>
      </div>
    </div>
  );
}
