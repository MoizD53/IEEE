import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import FeedbackList from "@/components/admin/FeedbackList";
import { MessageSquareText, Star, ThumbsUp, CheckCircle, Award } from "lucide-react";

export default async function AdminFeedbackPage() {
  const session = await auth();

  const evaluations = await prisma.evaluation.findMany({
    where: {
      status: "SUBMITTED",
    },
    include: {
      paper: {
        select: {
          id: true,
          paperId: true,
          title: true,
          track: true,
          session: true,
        },
      },
      chair: {
        select: {
          id: true,
          name: true,
          username: true,
          institution: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  const totalFeedback = evaluations.length;
  const ratedCount = evaluations.filter((e) => e.feedbackRating && e.feedbackRating > 0).length;
  const avgStars = ratedCount > 0
    ? (evaluations.reduce((acc, e) => acc + (e.feedbackRating || 0), 0) / ratedCount).toFixed(1)
    : "0.0";
  const fiveStarsCount = evaluations.filter((e) => e.feedbackRating === 5).length;
  const recommendedCount = evaluations.filter((e) => e.recommended).length;
  const recPercentage = totalFeedback > 0 ? Math.round((recommendedCount / totalFeedback) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-amber-50/70 to-transparent pointer-events-none hidden md:block"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-3">
              <MessageSquareText size={13} className="text-amber-600" />
              Review Submissions
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Session Chair Feedback & Reviews
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">
              Read all written comments, qualitative assessments, and star ratings submitted by Session Chairs. Reopen evaluations to allow edits whenever necessary.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MessageSquareText size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Reviews
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalFeedback}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Star size={22} className="fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Avg Feedback
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {avgStars} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ThumbsUp size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Recommended
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {recPercentage}% <span className="text-xs font-normal text-slate-400">({recommendedCount})</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              5-Star Papers
            </span>
            <div className="text-2xl font-black text-purple-600 mt-0.5">{fiveStarsCount}</div>
          </div>
        </div>
      </div>

      {/* Main Feedback List */}
      <FeedbackList items={evaluations} />
    </div>
  );
}
