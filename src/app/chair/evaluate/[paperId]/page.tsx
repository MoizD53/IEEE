import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EvaluationForm from "@/components/chair/EvaluationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    notFound(); // Not assigned to this chair
  }

  const existingEval = paper.evaluations[0];
  const isSubmitted = existingEval?.status === "SUBMITTED";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <Link href="/chair/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Evaluate Paper</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
            <h2 className="text-xl font-semibold mb-2">{paper.title}</h2>
            <div className="text-sm text-gray-500 mb-4">{paper.paperId} &bull; {paper.authors}</div>
            
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-700">Abstract</h3>
                <p className="mt-1 text-gray-600">{paper.abstract || "No abstract provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3 className="font-semibold text-gray-700">Track</h3>
                  <p className="text-gray-600">{paper.track || "-"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Session</h3>
                  <p className="text-gray-600">{paper.session || "-"}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors flex items-center justify-center gap-2">
                <FileText size={18} /> View PDF Document
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {isSubmitted ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md">
                  <h3 className="font-bold text-lg mb-1">Evaluation Submitted</h3>
                  <p className="text-sm">Submitted on {new Date(existingEval.submittedAt!).toLocaleString()}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-md">
                    <div>Technical: <span className="font-bold">{existingEval.technicalScore}/5</span></div>
                    <div>Originality: <span className="font-bold">{existingEval.originalityScore}/5</span></div>
                    <div>Relevance: <span className="font-bold">{existingEval.relevanceScore}/5</span></div>
                    <div>Presentation: <span className="font-bold">{existingEval.presentationScore}/5</span></div>
                  </div>
                  
                  <div className="text-lg">
                    Total Score: <span className="font-bold">{existingEval.totalScore}/20</span>
                  </div>
                  
                  <div className="text-lg">
                    Recommendation: <span className={`font-bold ${existingEval.recommended ? 'text-green-600' : 'text-red-600'}`}>{existingEval.recommended ? "YES" : "NO"}</span>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Feedback</h4>
                    <div className="text-yellow-500 mb-2">{"★".repeat(existingEval.feedbackRating || 0)}</div>
                    {existingEval.feedbackText && (
                      <p className="text-sm bg-gray-50 p-3 rounded-md italic border-l-2 border-gray-300">
                        "{existingEval.feedbackText}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <EvaluationForm paperId={paper.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { FileText } from "lucide-react";
