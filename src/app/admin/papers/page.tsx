import AddPaperForm from "@/components/admin/AddPaperForm";
import PaperList from "@/components/admin/PaperList";
import GlobalAssignForm from "@/components/admin/GlobalAssignForm";
import { getPapers } from "@/lib/actions/paper";
import { prisma } from "@/lib/db";

export default async function PapersPage() {
  const papers = await getPapers();
  const chairs = await prisma.user.findMany({
    where: { role: "SESSION_CHAIR", status: "ACTIVE" },
    select: { id: true, name: true, username: true }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Papers & Assignments</h1>
        <p className="mt-1 text-sm text-gray-500">Manage conference papers and their chair assignments.</p>
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
