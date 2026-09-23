"use client";

import { useState } from "react";
import { submitEvaluation } from "@/lib/actions/evaluation";
import { Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EvaluationForm({ paperId }: { paperId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Form State
  const [technical, setTechnical] = useState(0);
  const [originality, setOriginality] = useState(0);
  const [relevance, setRelevance] = useState(0);
  const [presentation, setPresentation] = useState(0);
  const [recommended, setRecommended] = useState<boolean | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const totalScore = technical + originality + relevance + presentation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recommended === null) {
      setError("Please select a recommendation.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("paperId", paperId);
    formData.append("technicalScore", technical.toString());
    formData.append("originalityScore", originality.toString());
    formData.append("relevanceScore", relevance.toString());
    formData.append("presentationScore", presentation.toString());
    formData.append("recommended", recommended!.toString());
    formData.append("feedbackRating", feedbackRating.toString());
    formData.append("feedbackText", feedbackText);

    try {
      await submitEvaluation(formData);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to submit evaluation");
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const renderRatingRow = (label: string, val: number, setVal: (v: number) => void) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="font-medium text-gray-900 mb-2 sm:mb-0">{label}</div>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setVal(num)}
            className={`w-10 h-10 rounded-full font-semibold transition-colors flex items-center justify-center
              ${val === num 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-blue-50'}`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

  if (showConfirm) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="text-yellow-500" /> Review & Confirm
        </h3>
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-md">
            <div>Technical Quality: <span className="font-bold">{technical}/5</span></div>
            <div>Originality: <span className="font-bold">{originality}/5</span></div>
            <div>Relevance: <span className="font-bold">{relevance}/5</span></div>
            <div>Presentation: <span className="font-bold">{presentation}/5</span></div>
          </div>
          
          <div className="text-lg">
            Total Score: <span className="font-bold">{totalScore}/20</span>
          </div>
          
          <div className="text-lg">
            Recommendation: <span className={`font-bold ${recommended ? 'text-green-600' : 'text-red-600'}`}>{recommended ? "YES" : "NO"}</span>
          </div>
        </div>

        <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm mb-6 font-medium">
          Are you sure? You will not be able to modify this evaluation after submission unless the administrator reopens it.
        </div>

        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={confirmSubmit}
            disabled={loading}
            className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm & Submit"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="text-red-500 bg-red-50 p-3 rounded-md text-sm">{error}</div>}
      
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">1. Evaluation Criteria (0-5)</h3>
        {renderRatingRow("Block 1 — Technical Quality", technical, setTechnical)}
        {renderRatingRow("Block 2 — Originality / Novelty", originality, setOriginality)}
        {renderRatingRow("Block 3 — Relevance / Significance", relevance, setRelevance)}
        {renderRatingRow("Block 4 — Presentation / Clarity", presentation, setPresentation)}
        
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center text-blue-900">
          <div className="font-semibold text-lg">Total Score</div>
          <div className="text-2xl font-bold">{totalScore} / 20</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">2. Recommendation</h3>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
          <p className="mb-4 font-medium">Do you want to recommend this paper?</p>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setRecommended(true)}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${recommended === true ? 'bg-green-600 text-white shadow-md ring-2 ring-green-400 ring-offset-2' : 'bg-white border border-gray-300 text-gray-700 hover:bg-green-50'}`}
            >
              Yes, Recommend
            </button>
            <button
              type="button"
              onClick={() => setRecommended(false)}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${recommended === false ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 ring-offset-2' : 'bg-white border border-gray-300 text-gray-700 hover:bg-red-50'}`}
            >
              No, Do Not Recommend
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">3. Feedback</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className={`text-2xl focus:outline-none ${star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Written Feedback</label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your comments or feedback about this paper..."
              className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Review Submission
        </button>
      </div>
    </form>
  );
}
