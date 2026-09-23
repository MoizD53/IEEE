"use client";

import { useState, useTransition } from "react";
import { reopenEvaluation } from "@/lib/actions/evaluation";
import { 
  Star, 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  User, 
  MessageSquare,
  Loader2,
  Calendar
} from "lucide-react";
import Link from "next/link";

interface FeedbackItem {
  id: string;
  paperId: string;
  technicalScore: number;
  originalityScore: number;
  relevanceScore: number;
  presentationScore: number;
  totalScore: number;
  averageScore: number;
  recommended: boolean;
  feedbackRating: number | null;
  feedbackText: string | null;
  status: string;
  submittedAt: Date | string | null;
  paper: {
    id: string;
    paperId: string;
    title: string;
    track: string | null;
    session: string | null;
  };
  chair: {
    id: string;
    name: string;
    username: string;
    institution: string | null;
  };
}

export default function FeedbackList({ items }: { items: FeedbackItem[] }) {
  const [search, setSearch] = useState("");
  const [starFilter, setStarFilter] = useState<string>("ALL");
  const [recFilter, setRecFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();
  const [reopeningId, setReopeningId] = useState<string | null>(null);

  const handleReopen = (id: string, paperId: string, chairName: string) => {
    if (
      !confirm(
        `Are you sure you want to reopen this evaluation for ${chairName} on paper ${paperId}? The chair will be able to edit and resubmit their scores and comments.`
      )
    ) {
      return;
    }

    setReopeningId(id);
    startTransition(async () => {
      try {
        await reopenEvaluation(id);
      } catch (err) {
        console.error(err);
        alert("Failed to reopen evaluation.");
      } finally {
        setReopeningId(null);
      }
    });
  };

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      item.paper?.title.toLowerCase().includes(q) ||
      item.paper?.paperId.toLowerCase().includes(q) ||
      item.chair?.name.toLowerCase().includes(q) ||
      item.chair?.username.toLowerCase().includes(q) ||
      (item.feedbackText && item.feedbackText.toLowerCase().includes(q));

    const matchesStar =
      starFilter === "ALL" ||
      (starFilter === "0" && (!item.feedbackRating || item.feedbackRating === 0)) ||
      item.feedbackRating === parseInt(starFilter);

    const matchesRec =
      recFilter === "ALL" ||
      (recFilter === "YES" && item.recommended) ||
      (recFilter === "NO" && !item.recommended);

    return matchesSearch && matchesStar && matchesRec;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by comment, paper title, ID, or chair..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">5 Stars ★★★★★</option>
              <option value="4">4 Stars ★★★★</option>
              <option value="3">3 Stars ★★★</option>
              <option value="2">2 Stars ★★</option>
              <option value="1">1 Star ★</option>
            </select>
          </div>

          <select
            value={recFilter}
            onChange={(e) => setRecFilter(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All Recommendations</option>
            <option value="YES">Recommended Only</option>
            <option value="NO">Not Recommended</option>
          </select>
        </div>
      </div>

      {/* Feedback Feed */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Feedback Matches Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or filters to see submitted reviews.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const stars = item.feedbackRating || 0;
            const isReopening = reopeningId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:shadow-md transition-all flex flex-col justify-between gap-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                        {item.paper?.paperId}
                      </span>
                      <span className="text-xs text-slate-500">
                        {item.paper?.track || "General Track"} &bull; {item.paper?.session || "Session"}
                      </span>
                    </div>

                    <Link
                      href={`/admin/papers/${item.paperId}`}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                    >
                      {item.paper?.title}
                    </Link>
                  </div>

                  {/* Recommendation Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    {item.recommended ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        Recommended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle size={14} className="text-rose-600" />
                        Not Recommended
                      </span>
                    )}

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-slate-900 text-white">
                      {item.totalScore} / 20
                    </span>
                  </div>
                </div>

                {/* Feedback Comment Box */}
                <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/70">
                  <div className="flex items-center justify-between gap-4 mb-2.5">
                    {/* Stars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          className={
                            s <= stars
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                      <span className="ml-1.5 text-xs font-bold text-slate-700">
                        {stars > 0 ? `${stars} / 5 Stars` : "Unrated"}
                      </span>
                    </div>

                    {/* Breakdown Chips */}
                    <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                      <span>Tech: {item.technicalScore}/5</span>
                      <span>&bull;</span>
                      <span>Orig: {item.originalityScore}/5</span>
                      <span>&bull;</span>
                      <span>Rel: {item.relevanceScore}/5</span>
                      <span>&bull;</span>
                      <span>Pres: {item.presentationScore}/5</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-800 italic leading-relaxed">
                    {item.feedbackText ? (
                      `"${item.feedbackText}"`
                    ) : (
                      <span className="text-slate-400 not-italic">
                        No written comments submitted for this evaluation.
                      </span>
                    )}
                  </p>
                </div>

                {/* Footer Row: Chair info, Timestamp & Reopen action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                      {item.chair?.name?.charAt(0) || "C"}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">{item.chair?.name}</span>
                      <span className="text-slate-400 ml-1">
                        (@{item.chair?.username}
                        {item.chair?.institution ? ` &bull; ${item.chair.institution}` : ""})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    {item.submittedAt && (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={13} />
                        {new Date(item.submittedAt).toLocaleString()}
                      </span>
                    )}

                    {item.status === "SUBMITTED" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleReopen(item.id, item.paper?.paperId, item.chair?.name)
                        }
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isReopening ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <RotateCcw size={13} />
                        )}
                        <span>Reopen Evaluation</span>
                      </button>
                    )}

                    {item.status === "DRAFT" && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        Reopened (In Draft)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
