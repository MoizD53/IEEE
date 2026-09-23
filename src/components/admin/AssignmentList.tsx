"use client";

import { useTransition } from "react";
import { removeAssignment } from "@/lib/actions/assignment";
import { Loader2, Trash2 } from "lucide-react";

type Assignment = {
  id: string;
  chairId: string;
  chair: {
    name: string;
    username: string;
  };
  assignedAt: Date;
  status: string;
};

export default function AssignmentList({ paperId, assignments }: { paperId: string, assignments: Assignment[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = (chairId: string) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;
    startTransition(async () => {
      await removeAssignment(paperId, chairId);
    });
  };

  const activeAssignments = assignments.filter(a => a.status === "ACTIVE");

  if (activeAssignments.length === 0) {
    return <p className="text-sm text-gray-500 italic mt-4">No active assignments for this paper.</p>;
  }

  return (
    <ul className="mt-4 space-y-3 relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
        </div>
      )}
      {activeAssignments.map((a) => (
        <li key={a.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
          <div>
            <div className="font-medium text-sm text-gray-900">{a.chair.name} ({a.chair.username})</div>
            <div className="text-xs text-gray-500">Assigned on {new Date(a.assignedAt).toLocaleDateString()}</div>
          </div>
          <button 
            onClick={() => handleRemove(a.chairId)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
            title="Remove Assignment"
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}
