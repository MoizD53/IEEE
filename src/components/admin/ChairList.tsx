"use client";

import { toggleChairStatus } from "@/lib/actions/chair";
import { useTransition } from "react";
import { Loader2, UserX, UserCheck } from "lucide-react";

type Chair = {
  id: string;
  name: string;
  username: string;
  email: string | null;
  institution: string | null;
  status: string;
};

export default function ChairList({ chairs }: { chairs: Chair[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, currentStatus: string) => {
    startTransition(async () => {
      await toggleChairStatus(id, currentStatus);
    });
  };

  if (chairs.length === 0) {
    return <div className="text-slate-500 p-8 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm font-medium">No session chairs found.</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden relative group">
      {isPending && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 transition-all">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600 drop-shadow-md" />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Chair Profile</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Username</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Institution</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100/80">
            {chairs.map((chair) => (
              <tr key={chair.id} className="hover:bg-indigo-50/30 transition-colors group/row">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-inner">
                      {chair.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{chair.name}</div>
                      <div className="text-[12px] font-medium text-slate-500">{chair.email || "No email provided"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-semibold font-mono bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    {chair.username}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                  {chair.institution || <span className="text-slate-400 italic">Not Specified</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-[11px] uppercase tracking-wider font-bold rounded-full border ${chair.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {chair.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleToggle(chair.id, chair.status)}
                    className={`p-2 rounded-xl transition-all ${chair.status === 'ACTIVE' ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                    title={chair.status === 'ACTIVE' ? 'Disable Chair' : 'Enable Chair'}
                  >
                    {chair.status === 'ACTIVE' ? <UserX size={18} /> : <UserCheck size={18} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
