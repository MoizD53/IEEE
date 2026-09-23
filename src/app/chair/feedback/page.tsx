import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ConferenceFeedbackForm from "@/components/chair/ConferenceFeedbackForm";
import { MessageSquareHeart, CheckCircle2 } from "lucide-react";

export default async function ChairConferenceFeedbackPage() {
  const session = await auth();
  if (!session || session.user.role !== "SESSION_CHAIR") {
    redirect("/login");
  }

  // Retrieve past conference feedbacks submitted by this chair
  const pastFeedbacks = await prisma.conferenceFeedback.findMany({
    where: { chairId: session.user.id },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-3">
            <MessageSquareHeart size={13} className="text-emerald-600" />
            Session Chair Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Feedback by Session Chair for Conference
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Please evaluate the organizational planning, presentation timekeeping, technical infrastructure, and coordination for your session on the standard 50-mark scale.
          </p>
        </div>
      </div>

      {/* Main Feedback Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
        <ConferenceFeedbackForm chairName={session.user.name || undefined} />
      </div>

      {/* Past Submissions (if any) */}
      {pastFeedbacks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Your Previously Submitted Feedback</h2>
          <div className="space-y-3">
            {pastFeedbacks.map((f) => (
              <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{f.sessionTrack || "General Track"}</span>
                    {f.sessionName && <span className="text-xs text-slate-500 ml-2">({f.sessionName})</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Total Rating: {f.totalScore} / 50
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(f.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>Planning: <span className="font-bold text-slate-900">{f.planningScore}/10</span></div>
                  <div>Time Mgmt: <span className="font-bold text-slate-900">{f.timeManagementScore}/10</span></div>
                  <div>AV / Tech: <span className="font-bold text-slate-900">{f.infrastructureScore}/10</span></div>
                  <div>Participants: <span className="font-bold text-slate-900">{f.participantManagementScore}/10</span></div>
                  <div>Overall: <span className="font-bold text-slate-900">{f.organizationScore}/10</span></div>
                </div>

                {f.highlights && (
                  <p className="text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                    <strong>Highlights: </strong>{f.highlights}
                  </p>
                )}
                {f.suggestions && (
                  <p className="text-xs text-slate-600 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                    <strong>Suggestions: </strong>{f.suggestions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
