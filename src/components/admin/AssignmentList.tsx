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
    return <div className="p-5 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl mt-4"><p className="text-sm text-slate-500 font-medium">No active session chair assignments for this paper.</p></div>;
  }

  return (
    <div className="mt-5 space-y-3 relative group">
      {isPending && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all rounded-xl">
          <Loader2 className="animate-spin h-6 w-6 text-indigo-600 drop-shadow-md" />
        </div>
      )}
      {activeAssignments.map((a) => (
        <div key={a.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all group/item">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold shadow-inner">
              {a.chair.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900">{a.chair.name} <span className="text-slate-400 font-normal">(@{a.chair.username})</span></div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Assigned {new Date(a.assignedAt).toLocaleDateString()}</div>
            </div>
          </div>
          <button 
            onClick={() => handleRemove(a.chairId)}
            className="text-slate-400 hover:text-rose-600 p-2.5 rounded-xl hover:bg-rose-50 transition-colors"
            title="Remove Assignment"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
