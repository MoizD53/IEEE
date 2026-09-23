"use client";

import { useState } from "react";
import { submitConferenceFeedback } from "@/lib/actions/conference-feedback";
import { Loader2, AlertCircle, CheckCircle2, MessageSquareHeart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ConferenceFeedbackForm({ chairName }: { chairName?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Form State: 5 Parameters (0-10 each, Total 50)
  const [sessionTrack, setSessionTrack] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [planning, setPlanning] = useState(0);
  const [timeManagement, setTimeManagement] = useState(0);
  const [infrastructure, setInfrastructure] = useState(0);
  const [participantManagement, setParticipantManagement] = useState(0);
  const [organization, setOrganization] = useState(0);
  const [highlights, setHighlights] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const totalScore = planning + timeManagement + infrastructure + participantManagement + organization;
  const scorePercent = Math.round((totalScore / 50) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalScore === 0) {
      setError("Please award marks for the conference evaluation parameters before submitting.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("sessionTrack", sessionTrack);
    formData.append("sessionName", sessionName);
    formData.append("planningScore", planning.toString());
    formData.append("timeManagementScore", timeManagement.toString());
    formData.append("infrastructureScore", infrastructure.toString());
    formData.append("participantManagementScore", participantManagement.toString());
    formData.append("organizationScore", organization.toString());
    formData.append("highlights", highlights);
    formData.append("suggestions", suggestions);

    try {
      await submitConferenceFeedback(formData);
      setSubmitted(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit conference feedback");
    } finally {
      setLoading(false);
    }
  };

  const renderRatingRow = (
    no: number,
    title: string,
    description: string,
    val: number,
    setVal: (v: number) => void
  ) => (
    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
              {no}
            </span>
            {title}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 ml-7">{description}</p>
        </div>
        <div className="text-right sm:text-right ml-7 sm:ml-0">
          <span className="text-xs font-semibold text-slate-500">Rating: </span>
          <span className="text-base font-black text-emerald-700">{val}</span>
          <span className="text-xs text-slate-400"> / 10</span>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 pt-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isSelected = val === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => setVal(num)}
              className={`h-9 rounded-lg font-bold text-xs transition-all flex items-center justify-center
                ${isSelected 
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400 ring-offset-1' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-emerald-50 hover:border-emerald-400'}`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Conference Feedback Submitted!</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Thank you for providing your valuable feedback on the conference organization and technical session operations.
        </p>
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 inline-block text-left">
          <div className="text-xs font-semibold text-emerald-800">Your Overall Conference Rating</div>
          <div className="text-2xl font-black text-emerald-700">{totalScore} / 50 ({scorePercent}%)</div>
        </div>
        <div className="pt-4">
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Submit Another Session Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="text-rose-700 bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Session Metadata Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Conference Track Chaired
          </label>
          <input
            type="text"
            value={sessionTrack}
            onChange={(e) => setSessionTrack(e.target.value)}
            placeholder="e.g. Track 1: AI, Data Science & Edge Computing"
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
            Technical Session Name / Hall No.
          </label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="e.g. Session 2A (Hall B - Audi 2)"
            className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>
      </div>

      {/* 5 Conference Feedback Parameters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-base font-bold text-slate-900">
            Session Chair Evaluation Parameters (0–10 Marks Each)
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Total Scale: 50 Marks
          </span>
        </div>

        {renderRatingRow(
          1,
          "Session Planning & Coordination",
          "Clarity of schedule, author communication, session briefing, and administrative readiness.",
          planning,
          setPlanning
        )}

        {renderRatingRow(
          2,
          "Presentation & Time Management",
          "Adherence to slot timings, warning bell reminders, schedule buffers, and smooth speaker handoffs.",
          timeManagement,
          setTimeManagement
        )}

        {renderRatingRow(
          3,
          "Technical/AV & Infrastructure Support",
          "Projector and display quality, audio/mic setup, hybrid streaming stability, and IT technician responsiveness.",
          infrastructure,
          setInfrastructure
        )}

        {renderRatingRow(
          4,
          "Participant & Presenter Management",
          "Presenter attendance verification, certificate distribution, audience engagement, and decorum.",
          participantManagement,
          setParticipantManagement
        )}

        {renderRatingRow(
          5,
          "Overall Conference Organization & Support",
          "Volunteer assistance, registration desk logistics, hospitality, and secretariat support.",
          organization,
          setOrganization
        )}

        {/* Dynamic Total Banner */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-200 font-bold">Total Conference Rating</div>
            <div className="text-xs text-emerald-300 mt-0.5">Sum of all 5 organizational parameters</div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black">{totalScore}</span>
            <span className="text-base font-medium text-emerald-200"> / 50</span>
          </div>
        </div>
      </div>

      {/* Qualitative Feedback */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareHeart size={18} className="text-rose-500" />
            Qualitative Observations & Suggestions
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              1. What aspects of the conference went exceptionally well?
            </label>
            <textarea
              rows={3}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="e.g. Student volunteer proactivity, presentation equipment, hybrid stream quality, catering..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              2. Suggestions or areas for improvement for future conference editions:
            </label>
            <textarea
              rows={3}
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="e.g. Add 5-minute buffer between parallel sessions, provide presenter laser pointers..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : `Submit Conference Feedback (Rating: ${totalScore}/50)`}
        </button>
      </div>
    </form>
  );
}
