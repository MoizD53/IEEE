"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type Paper = {
  id: string;
  paperId: string;
  title: string;
  authors: string;
  track: string | null;
  session: string | null;
  status: string;
};

export default function PaperList({ papers }: { papers: Paper[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPapers = papers.filter((paper) =>
    paper.paperId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (papers.length === 0) {
    return <div className="text-slate-500 p-8 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm font-medium">No papers found.</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 relative flex flex-col overflow-hidden">
      {/* Search Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Paper ID..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all shadow-sm"
          />
        </div>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Paper Details</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assignment Status</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100/80">
            {filteredPapers.length > 0 ? (
              filteredPapers.map((paper) => (
                <tr key={paper.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 font-mono text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                        {paper.paperId}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm line-clamp-2 max-w-lg leading-snug group-hover:text-blue-700 transition-colors" title={paper.title}>
                          {paper.title}
                        </div>
                        <div className="text-[12px] font-medium text-slate-500 mt-1">{paper.authors}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-[10px] uppercase tracking-wider font-bold rounded-full border
                      ${paper.status === 'UNASSIGNED' ? 'bg-slate-50 text-slate-600 border-slate-200' : ''}
                      ${paper.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      ${paper.status === 'IN_REVIEW' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                      ${paper.status === 'EVALUATED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                      ${paper.status === 'RECOMMENDED' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                      ${paper.status === 'FINALIZED' ? 'bg-slate-100 text-slate-800 border-slate-300' : ''}
                    `}>
                      {paper.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <a href={`/admin/papers/${paper.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm">
                      Manage
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                  No papers matching ID "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
