"use client";

import { useState } from "react";
import { 
  Search, 
  MessageSquareHeart
} from "lucide-react";

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
  confItems = []
}: { 
  confItems?: ConfFeedbackItem[];
}) {
  const [search, setSearch] = useState("");

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
      {/* Controls Bar: Search & Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/90 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by chair, track, suggestions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Conference Organization Feedback List */}
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
    </div>
  );
}
