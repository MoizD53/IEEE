import AddChairForm from "@/components/admin/AddChairForm";
import ChairList from "@/components/admin/ChairList";
import { getChairs } from "@/lib/actions/chair";

import { Users } from "lucide-react";

export default async function ChairsPage() {
  const chairs = await getChairs();

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Users size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Session Chairs</h1>
          </div>
          <p className="text-indigo-100 max-w-2xl text-sm font-medium leading-relaxed mt-3">
            Manage conference session chairs, control access, and monitor evaluation progress.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AddChairForm />
        </div>
        <div className="lg:col-span-2">
          <ChairList chairs={chairs} />
        </div>
      </div>
    </div>
  );
}
