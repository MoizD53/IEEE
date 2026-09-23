"use client";

import { useTransition } from "react";
import { Loader2, FileText, CheckCircle, Clock } from "lucide-react";

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
  if (papers.length === 0) {
    return <div className="text-gray-500 p-6 text-center bg-white rounded-lg border border-gray-200">No papers found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paper Info</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Track / Session</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {papers.map((paper) => (
            <tr key={paper.id}>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900 text-sm truncate max-w-xs" title={paper.title}>{paper.title}</div>
                <div className="text-xs text-gray-500">{paper.paperId} &bull; {paper.authors}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{paper.track || "-"}</div>
                <div className="text-xs">{paper.session || "-"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${paper.status === 'UNASSIGNED' ? 'bg-gray-100 text-gray-800' : ''}
                  ${paper.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' : ''}
                  ${paper.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${paper.status === 'EVALUATED' ? 'bg-green-100 text-green-800' : ''}
                  ${paper.status === 'RECOMMENDED' ? 'bg-purple-100 text-purple-800' : ''}
                  ${paper.status === 'FINALIZED' ? 'bg-slate-100 text-slate-800' : ''}
                `}>
                  {paper.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href={`/admin/papers/${paper.id}`} className="text-blue-600 hover:text-blue-900">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
