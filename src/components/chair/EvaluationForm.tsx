"use client";

import { useState } from "react";
import { submitEvaluation } from "@/lib/actions/evaluation";
import { Loader2, AlertCircle, Award, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EvaluationForm({ paperId }: { paperId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Form State: 5 Parameters (0-10 each, Total 50)
  const [relevanceNovelty, setRelevanceNovelty] = useState(0);
  const [technicalMethodology, setTechnicalMethodology] = useState(0);
  const [resultsContribution, setResultsContribution] = useState(0);
  const [presentationClarity, setPresentationClarity] = useState(0);
  const [qaKnowledge, setQaKnowledge] = useState(0);

  // Recommendation & Comments
  const [recommended, setRecommended] = useState<boolean | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const totalScore = relevanceNovelty + technicalMethodology + resultsContribution + presentationClarity + qaKnowledge;
  const scorePercent = Math.round((totalScore / 50) * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recommended === null) {
      setError("Please select whether you recommend this paper for Best Paper Award or not.");
      return;
    }
    setError("");
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("paperId", paperId);
    formData.append("relevanceNoveltyScore", relevanceNovelty.toString());
    formData.append("technicalMethodologyScore", technicalMethodology.toString());
    formData.append("resultsContributionScore", resultsContribution.toString());
    formData.append("presentationClarityScore", presentationClarity.toString());
    formData.append("qaKnowledgeScore", qaKnowledge.toString());
    formData.append("recommended", recommended!.toString());
    formData.append("feedbackRating", feedbackRating.toString());
    formData.append("feedbackText", feedbackText);

    try {
      const res = await submitEvaluation(formData);
      if (res && !res.success) {
        setError(res.error || "Failed to submit evaluation");
        setLoading(false);
        setShowConfirm(false);
        return;
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit evaluation");
      setLoading(false);
      setShowConfirm(false);
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
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              {no}
            </span>
            {title}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 ml-7">{description}</p>
        </div>
        <div className="text-right sm:text-right ml-7 sm:ml-0">
          <span className="text-xs font-semibold text-slate-500">Score: </span>
          <span className="text-base font-black text-blue-700">{val}</span>
          <span className="text-xs text-slate-400"> / 10</span>
        </div>
      </div>

      <div className="flex flex-nowrap justify-between gap-1 sm:gap-1.5 pt-2 w-full">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isSelected = val === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => setVal(num)}
              className={`flex-1 h-9 sm:h-10 min-w-0 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-center
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 ring-offset-1' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-blue-50 hover:border-blue-400'}`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (showConfirm) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-amber-300 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <AlertCircle className="text-amber-500" /> Review & Confirm Presentation Evaluation
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>1. Relevance, Significance & Novelty: <span className="font-bold text-blue-700">{relevanceNovelty}/10</span></div>
            <div>2. Technical Quality & Methodology: <span className="font-bold text-blue-700">{technicalMethodology}/10</span></div>
            <div>3. Results & Research Contribution: <span className="font-bold text-blue-700">{resultsContribution}/10</span></div>
            <div>4. Presentation Quality & Clarity: <span className="font-bold text-blue-700">{presentationClarity}/10</span></div>
            <div className="sm:col-span-2">5. Q&A / Subject Knowledge: <span className="font-bold text-blue-700">{qaKnowledge}/10</span></div>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <span className="font-bold text-blue-950 text-base">Total Score Awarded:</span>
            <span className="text-2xl font-black text-blue-700">{totalScore} / 50 <span className="text-sm font-semibold text-blue-500">({scorePercent}%)</span></span>
          </div>
          
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">Best Paper Recommendation:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${recommended ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}`}>
              {recommended ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {recommended ? "YES — Recommended for Best Paper" : "NO — Not Recommended"}
            </span>
          </div>

          {feedbackText && (
            <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
              <span className="font-bold">Remarks: </span>"{feedbackText}"
            </div>
          )}
        </div>

        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-xs font-medium border border-rose-200">
          ⚠️ <strong>Submission Lock:</strong> Once submitted, your score cannot be edited unless reopened by the Conference Administrator.
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            type="button" 
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm"
          >
            Go Back & Edit
          </button>
          <button 
            type="button" 
            onClick={confirmSubmit}
            disabled={loading}
            className="flex-1 flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm & Submit Final Score"}
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
      
      {/* 5 Evaluation Parameters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-base font-bold text-slate-900">
            Presentation Evaluation Parameters (0–10 Marks Each)
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Total Scale: 50 Marks
          </span>
        </div>

        {renderRatingRow(
          1,
          "Relevance, Significance & Novelty",
          "Problem importance, scholarly significance, originality, and advancement over state-of-the-art.",
          relevanceNovelty,
          setRelevanceNovelty
        )}

        {renderRatingRow(
          2,
          "Technical Quality & Methodology",
          "Soundness of research formulation, methodology, algorithmic correctness, and validation rigor.",
          technicalMethodology,
          setTechnicalMethodology
        )}

        {renderRatingRow(
          3,
          "Results & Research Contribution",
          "Empirical proof, benchmark comparisons, clarity of tables/plots, and tangible research impact.",
          resultsContribution,
          setResultsContribution
        )}

        {renderRatingRow(
          4,
          "Presentation Quality & Clarity",
          "Slide aesthetics, flow of explanation, verbal clarity, composure, and timekeeping.",
          presentationClarity,
          setPresentationClarity
        )}

        {renderRatingRow(
          5,
          "Q&A / Subject Knowledge",
          "Handling of inquiries, theoretical mastery, confidence, and ability to defend findings.",
          qaKnowledge,
          setQaKnowledge
        )}
        
        {/* Dynamic Total Score Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-blue-200 font-bold">Total Evaluated Score</div>
            <div className="text-xs text-blue-300 mt-0.5">Sum of all 5 parameters</div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black">{totalScore}</span>
            <span className="text-base font-medium text-blue-200"> / 50</span>
          </div>
        </div>
      </div>

      {/* Best Paper Recommendation */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="text-amber-500" size={18} />
            Recommendation for Best Paper Award
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Indicate whether this presentation qualifies for the session Best Paper nomination.
          </p>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
          <p className="mb-4 font-semibold text-slate-800 text-sm">
            Recommendation for best paper or not?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => setRecommended(true)}
              className={`flex-1 sm:flex-initial sm:min-w-[180px] px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                recommended === true
                  ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400 ring-offset-2'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <CheckCircle2 size={18} />
              Yes (Recommend)
            </button>
            <button
              type="button"
              onClick={() => setRecommended(false)}
              className={`flex-1 sm:flex-initial sm:min-w-[180px] px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                recommended === false
                  ? 'bg-rose-600 text-white shadow-lg ring-2 ring-rose-400 ring-offset-2'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-rose-50 hover:border-rose-300'
              }`}
            >
              <XCircle size={18} />
              No (Do Not Recommend)
            </button>
          </div>
        </div>
      </div>

      {/* Written Remarks */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h3 className="text-base font-bold text-slate-900">
            Session Chair Remarks & Feedback
          </h3>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${star <= feedbackRating ? 'text-amber-400' : 'text-slate-300 hover:text-amber-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Constructive Comments / Observations for Authors:
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Highlight strengths, methodological suggestions, or comments regarding delivery and Q&A..."
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all text-sm"
        >
          Review & Submit Evaluation (Total: {totalScore}/50)
        </button>
      </div>
    </form>
  );
}
