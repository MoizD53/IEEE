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
  Calendar,
  Building2,
  Award,
  Layers,
  MessageSquareHeart
} from "lucide-react";
import Link from "next/link";

export interface FeedbackItem {
  id: string;
  paperId: string;
  relevanceNoveltyScore: number;
  technicalMethodologyScore: number;
  resultsContributionScore: number;
  presentationClarityScore: number;
  qaKnowledgeScore: number;
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

export interface ConfFeedbackItem {
  id: string;
  chairId: string;
  sessionTrack: string | null;
  sessionName: string | null;
  planningScore: number;
  timeManagementScore: number;
  infrastructureScore: number;
  participantManagementScore: number;
  organizationScore: number;
  totalScore: number;
  averageScore: number;
  highlights: string | null;
  suggestions: string | null;
  submittedAt: Date | string;
  chair: {
    id: string;
    name: string;
    username: string;
    institution: string | null;
  };
}

export default function FeedbackList({ 
  items,
  confItems = []
}: { 
  items: FeedbackItem[];
  confItems?: ConfFeedbackItem[];
}) {
  const [activeTab, setActiveTab] = useState<"papers" | "conference">("papers");
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

  const filteredPapers = items.filter((item) => {
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

  const filteredConf = confItems.filter((item) => {
    const q = search.toLowerCase();
    return (
      !q ||
      item.chair?.name.toLowerCase().includes(q) ||
      item.chair?.username.toLowerCase().includes(q) ||
      (item.sessionTrack && item.sessionTrack.toLowerCase().includes(q)) ||
      (item.sessionName && item.sessionName.toLowerCase().includes(q)) ||
      (item.highlights && item.highlights.toLowerCase().includes(q)) ||
      (item.suggestions && item.suggestions.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab("papers")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "papers"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers size={18} />
          Paper Presentation Evaluations ({items.length})
        </button>
        <button
          onClick={() => setActiveTab("conference")}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === "conference"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <MessageSquareHeart size={18} />
          Session Chair Conference Feedback ({confItems.length})
        </button>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "papers" ? "Search by comment, paper title, ID, or chair..." : "Search by chair, track, suggestions..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {activeTab === "papers" && (
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
              <option value="YES">Best Paper Recommended Only</option>
              <option value="NO">Not Recommended</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Paper Presentations */}
      {activeTab === "papers" && (
        <>
          {filteredPapers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Paper Evaluations Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPapers.map((item) => {
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

                      {/* Recommendation Badge & Total Score */}
                      <div className="shrink-0 flex items-center gap-2">
                        {item.recommended ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            Best Paper Recommended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle size={14} className="text-rose-600" />
                            Not Recommended
                          </span>
                        )}

                        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-black bg-blue-900 text-white">
                          {item.totalScore} / 50
                        </span>
                      </div>
                    </div>

                    {/* Feedback Comment Box & 5 Parameters Breakdown */}
                    <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/70 space-y-3">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
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

                        {/* 5 Parameters breakdown chips */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
                          <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">Novelty: {item.relevanceNoveltyScore}/10</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">Method: {item.technicalMethodologyScore}/10</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">Results: {item.resultsContributionScore}/10</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">Clarity: {item.presentationClarityScore}/10</span>
                          <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">Q&A: {item.qaKnowledgeScore}/10</span>
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

                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={13} />
                          {item.submittedAt
                            ? new Date(item.submittedAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </span>

                        <button
                          onClick={() => handleReopen(item.id, item.paper?.paperId, item.chair?.name)}
                          disabled={isPending || isReopening}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 transition-colors disabled:opacity-50"
                        >
                          {isReopening ? (
                            <Loader2 size={13} className="animate-spin text-amber-600" />
                          ) : (
                            <RotateCcw size={13} className="text-slate-500 group-hover:text-amber-600" />
                          )}
                          Reopen Evaluation
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Conference Organization Feedback */}
      {activeTab === "conference" && (
        <>
          {filteredConf.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <MessageSquareHeart className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Conference Feedback Submissions Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Session chair conference evaluations will appear here once submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredConf.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">{item.sessionTrack || "General Track"}</span>
                        {item.sessionName && (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            {item.sessionName}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Session Chair: <span className="font-semibold text-slate-700">{item.chair?.name}</span> ({item.chair?.institution || "N/A"})
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-black bg-emerald-700 text-white shadow-sm">
                        Rating: {item.totalScore} / 50
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Planning</span>
                      <span className="font-black text-slate-900 text-sm">{item.planningScore} / 10</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Time Mgmt</span>
                      <span className="font-black text-slate-900 text-sm">{item.timeManagementScore} / 10</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">AV / Tech</span>
                      <span className="font-black text-slate-900 text-sm">{item.infrastructureScore} / 10</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Presenters</span>
                      <span className="font-black text-slate-900 text-sm">{item.participantManagementScore} / 10</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Overall</span>
                      <span className="font-black text-slate-900 text-sm">{item.organizationScore} / 10</span>
                    </div>
                  </div>

                  {item.highlights && (
                    <div className="text-xs bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-slate-700">
                      <strong className="text-emerald-800">Key Highlights: </strong>
                      {item.highlights}
                    </div>
                  )}

                  {item.suggestions && (
                    <div className="text-xs bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-slate-700">
                      <strong className="text-blue-800">Suggestions for Future Editions: </strong>
                      {item.suggestions}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 pt-1 flex justify-between items-center">
                    <span>Submitted by {item.chair?.name} (@{item.chair?.username})</span>
                    <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
