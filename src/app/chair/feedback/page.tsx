import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ConferenceFeedbackForm from "@/components/chair/ConferenceFeedbackForm";
import { MessageSquareHeart, CheckCircle2, Quote, Sparkles } from "lucide-react";

export default async function ChairConferenceFeedbackPage() {
  const session = await auth();
  if (!session || session.user.role !== "SESSION_CHAIR") {
    redirect("/login");
  }

  const pastFeedbacks = await prisma.conferenceFeedback.findMany({
    where: { chairId: session.user.id },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
            Conference Feedback
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-xl">
            Help us improve future editions of CICON by providing your honest assessment of the organization, facilities, and coordination.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-5">
          <MessageSquareHeart size={120} className="text-slate-900 rotate-12" />
        </div>
        
        <div className="p-6 sm:p-8 relative z-10">
          <ConferenceFeedbackForm chairName={session.user.name || undefined} />
        </div>
      </div>

      {pastFeedbacks.length > 0 && (
        <div className="space-y-5 pt-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-900">Your Past Submissions</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          
          <div className="grid gap-4">
            {pastFeedbacks.map((f) => (
              <div key={f.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden transition-colors hover:border-slate-300">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-base">
                      {f.sessionTrack || "General Track"}
                    </h3>
                    {f.sessionName && <p className="text-sm text-slate-500 mt-0.5">{f.sessionName}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(f.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                      <span className="text-xs font-medium text-slate-500 uppercase">Score</span>
                      <span className="font-semibold text-slate-900">{f.totalScore}/50</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  {[
                    { label: "Planning", score: f.planningScore },
                    { label: "Time Mgmt", score: f.timeManagementScore },
                    { label: "AV / Tech", score: f.infrastructureScore },
                    { label: "Participants", score: f.participantManagementScore },
                    { label: "Overall", score: f.organizationScore },
                  ].map(stat => (
                    <div key={stat.label} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-0.5">{stat.label}</span>
                      <span className="text-base font-semibold text-slate-900">{stat.score}<span className="text-xs text-slate-400 font-normal">/10</span></span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {f.highlights && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <Quote size={14} className="text-slate-300 absolute top-3 right-3" />
                      <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Highlights</h4>
                      <p className="text-sm text-slate-600">{f.highlights}</p>
                    </div>
                  )}
                  {f.suggestions && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                      <Quote size={14} className="text-slate-300 absolute top-3 right-3" />
                      <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">Suggestions</h4>
                      <p className="text-sm text-slate-600">{f.suggestions}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
