"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type ChairStat = {
  name: string;
  date: string;
  total: number;
  completed: number;
  percentage: number;
  evaluatedPapers: string[];
  absentPapers: string[];
  pendingPapers: string[];
};

export default function ChairProgressClient({ initialChairs }: { initialChairs: ChairStat[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChairs = initialChairs.filter(chair => 
    chair.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search Session Chair by name..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        {filteredChairs.length > 0 ? (
          filteredChairs.map((chair, index) => (
            <div key={index} className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
              <div className="flex justify-between items-start mb-2 gap-4">
                <h4 className="font-bold text-sm text-slate-800 leading-tight flex-1">
                  {chair.name}
                  {chair.date && <span className="text-xs font-medium text-slate-500 ml-2 bg-slate-200 px-2 py-0.5 rounded-full">{chair.date}</span>}
                </h4>
                <span className="text-sm font-black text-indigo-600 shrink-0">{chair.completed} / {chair.total}</span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-2.5 transition-all duration-1000 ease-out" 
                  style={{ width: `${chair.total > 0 ? (chair.evaluatedPapers.length / chair.total) * 100 : 0}%` }}
                  title="Evaluated"
                ></div>
                <div 
                  className="bg-rose-500 h-2.5 transition-all duration-1000 ease-out" 
                  style={{ width: `${chair.total > 0 ? (chair.absentPapers.length / chair.total) * 100 : 0}%` }}
                  title="Absent"
                ></div>
                <div 
                  className="bg-amber-400 h-2.5 transition-all duration-1000 ease-out" 
                  style={{ width: `${chair.total > 0 ? (chair.pendingPapers.length / chair.total) * 100 : 0}%` }}
                  title="Pending"
                ></div>
              </div>
              <div className="flex justify-between items-start">
                <details className="text-[11px] text-slate-500 cursor-pointer group">
                  <summary className="hover:text-indigo-600 transition-colors font-medium outline-none">
                    View Paper IDs
                  </summary>
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1.5 cursor-text">
                    <div>
                      <span className="font-semibold text-emerald-600 uppercase tracking-wider text-[10px]">Evaluated:</span>{" "}
                      {chair.evaluatedPapers.length > 0 ? chair.evaluatedPapers.join(", ") : "None"}
                    </div>
                    <div>
                      <span className="font-semibold text-rose-600 uppercase tracking-wider text-[10px]">Absent:</span>{" "}
                      {chair.absentPapers.length > 0 ? chair.absentPapers.join(", ") : "None"}
                    </div>
                    <div>
                      <span className="font-semibold text-amber-600 uppercase tracking-wider text-[10px]">Pending:</span>{" "}
                      {chair.pendingPapers.length > 0 ? chair.pendingPapers.join(", ") : "None"}
                    </div>
                  </div>
                </details>
                
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {chair.percentage}% Completed
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-500 text-sm">
            No session chairs found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
