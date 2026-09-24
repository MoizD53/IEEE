"use client";

import { useState } from "react";
import { assignPaper } from "@/lib/actions/assignment";
import { Loader2 } from "lucide-react";

type Chair = {
  id: string;
  name: string;
  username: string;
};

export default function AssignChairForm({ paperId, chairs }: { paperId: string, chairs: Chair[] }) {
  const [selectedChair, setSelectedChair] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedChair) return;
    setLoading(true);
    try {
      const res = await assignPaper(paperId, selectedChair);
      if (res && !res.success) {
        alert(res.error || "Failed to assign paper");
        return;
      }
      setSelectedChair("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to assign paper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <select 
        value={selectedChair} 
        onChange={(e) => setSelectedChair(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="">Select a Chair to Assign...</option>
        {chairs.map(c => (
          <option key={c.id} value={c.id}>{c.name} ({c.username})</option>
        ))}
      </select>
      <button 
        onClick={handleAssign}
        disabled={loading || !selectedChair}
        className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
      >
        {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
        Assign
      </button>
    </div>
  );
}
