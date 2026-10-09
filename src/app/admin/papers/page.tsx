import AddPaperForm from "@/components/admin/AddPaperForm";
import PaperList from "@/components/admin/PaperList";
import GlobalAssignForm from "@/components/admin/GlobalAssignForm";
import { getPapers } from "@/lib/actions/paper";
import { prisma } from "@/lib/db";

import { FileText, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PapersPage() {
  const papers = await getPapers();
  const chairs = await prisma.user.findMany({
    where: { role: "SESSION_CHAIR", status: "ACTIVE" },
    select: { id: true, name: true, username: true }
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <FileText size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Papers & Assignments</h1>
          </div>
          <p className="text-blue-100 max-w-2xl text-sm font-medium leading-relaxed mt-3">
            Register new conference papers and globally manage session chair assignments.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top section: Forms side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <AddPaperForm />
          <GlobalAssignForm papers={papers.filter(p => p.status === 'UNASSIGNED')} chairs={chairs} />
        </div>
        
        {/* Bottom section: Paper list */}
        <div>
          <PaperList papers={papers} />
        </div>
      </div>
    </div>
  );
}
