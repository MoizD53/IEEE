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
    return <div className="text-gray-500 p-6 text-center bg-white rounded-lg border border-gray-200">No session chairs found.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {chairs.map((chair) => (
            <tr key={chair.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{chair.name}</div>
                <div className="text-sm text-gray-500">{chair.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chair.username}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chair.institution || "-"}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${chair.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {chair.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  onClick={() => handleToggle(chair.id, chair.status)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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
  );
}
