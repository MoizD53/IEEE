import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import FeedbackList from "@/components/admin/FeedbackList";
import { MessageSquareText, Star, ThumbsUp, Award, MessageSquareHeart } from "lucide-react";

export default async function AdminFeedbackPage() {
  const session = await auth();

  const [evaluations, confFeedbacks] = await Promise.all([
    prisma.evaluation.findMany({
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
    }),
    prisma.conferenceFeedback.findMany({
      where: {
        status: "SUBMITTED",
      },
      include: {
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
    }),
  ]);

  const totalFeedback = evaluations.length;
  const recommendedCount = evaluations.filter((e) => e.recommended).length;
  const recPercentage = totalFeedback > 0 ? Math.round((recommendedCount / totalFeedback) * 100) : 0;
  
  const avgPaperScore = totalFeedback > 0
    ? (evaluations.reduce((acc, e) => acc + (e.totalScore || 0), 0) / totalFeedback).toFixed(1)
    : "0.0";

  const totalConfFeedback = confFeedbacks.length;
  const avgConfScore = totalConfFeedback > 0
    ? (confFeedbacks.reduce((acc, c) => acc + (c.totalScore || 0), 0) / totalConfFeedback).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-amber-50/70 to-transparent pointer-events-none hidden md:block"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-3">
              <MessageSquareText size={13} className="text-amber-600" />
              Conference Audit Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Session Chair Evaluations & Conference Feedback
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">
              Review 50-mark paper presentation scores, best paper recommendations, and session chairs' feedback on conference organization.
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
              Paper Reviews
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalFeedback}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Award size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Avg Paper Score
            </span>
            <div className="text-2xl font-black text-indigo-700 mt-0.5">
              {avgPaperScore} <span className="text-xs font-normal text-slate-400">/ 50</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ThumbsUp size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Best Paper Recs
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {recommendedCount} <span className="text-xs font-normal text-slate-400">({recPercentage}%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <MessageSquareHeart size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Avg Conf Rating
            </span>
            <div className="text-2xl font-black text-teal-700 mt-0.5">
              {avgConfScore} <span className="text-xs font-normal text-slate-400">/ 50</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Feedback List */}
      <FeedbackList items={evaluations} confItems={confFeedbacks} />
    </div>
  );
}
