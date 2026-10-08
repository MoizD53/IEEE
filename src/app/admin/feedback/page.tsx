import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import FeedbackList from "@/components/admin/FeedbackList";
import { MessageSquareText, Star, ThumbsUp, Award, MessageSquareHeart } from "lucide-react";

export default async function AdminFeedbackPage() {
  const session = await auth();

  const confFeedbacks = await prisma.conferenceFeedback.findMany({
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
  });

  const totalConfFeedback = confFeedbacks.length;
  const avgConfScore = totalConfFeedback > 0
    ? (confFeedbacks.reduce((acc, c) => acc + (c.totalScore || 0), 0) / totalConfFeedback).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-800 via-amber-700 to-orange-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <MessageSquareText size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
              <MessageSquareText size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Conference Feedback</h1>
          </div>
          <p className="text-amber-100 max-w-2xl text-sm font-medium leading-relaxed mt-3">
            Review session chairs' feedback and ratings on conference organization and logistics.
          </p>
        </div>
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MessageSquareText size={22} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Reviews
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalConfFeedback}</div>
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
      <FeedbackList confItems={confFeedbacks} />
    </div>
  );
}
