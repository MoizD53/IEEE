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
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight relative z-10 flex items-center gap-3">
            Conference Feedback
          </h1>
          <p className="text-slate-500 mt-2 font-medium max-w-xl relative z-10">
            Help us improve future editions of CICON by providing your honest assessment of the organization, facilities, and coordination.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-20 group-hover:opacity-10 transition-opacity">
          <MessageSquareHeart size={160} className="text-amber-500 rotate-12" />
        </div>
        
        <div className="p-6 sm:p-10 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 mb-6">
            <Sparkles size={12} /> Rate your experience
          </div>
          <ConferenceFeedbackForm chairName={session.user.name || undefined} />
        </div>
      </div>

      {pastFeedbacks.length > 0 && (
        <div className="space-y-5 pt-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-900">Your Past Submissions</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          
          <div className="grid gap-4">
            {pastFeedbacks.map((f) => (
              <div key={f.id} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-slate-300 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600 opacity-80" />
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                      {f.sessionTrack || "General Track"}
                    </h3>
                    {f.sessionName && <p className="text-sm font-semibold text-slate-500 mt-0.5">{f.sessionName}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(f.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60 shadow-inner">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Score</span>
                      <span className="font-black text-amber-700">{f.totalScore}/50</span>
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
                    <div key={stat.label} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</span>
                      <span className="text-lg font-black text-slate-800">{stat.score}<span className="text-xs text-slate-400 font-medium">/10</span></span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {f.highlights && (
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/60 relative">
                      <Quote size={16} className="text-emerald-200 absolute top-3 right-3" />
                      <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Highlights</h4>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{f.highlights}</p>
                    </div>
                  )}
                  {f.suggestions && (
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/60 relative">
                      <Quote size={16} className="text-blue-200 absolute top-3 right-3" />
                      <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Suggestions</h4>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{f.suggestions}</p>
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
