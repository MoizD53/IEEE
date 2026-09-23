import AddPaperForm from "@/components/admin/AddPaperForm";
import PaperList from "@/components/admin/PaperList";
import { getPapers } from "@/lib/actions/paper";

export default async function PapersPage() {
  const papers = await getPapers();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Papers</h1>
        <p className="mt-1 text-sm text-gray-500">Manage conference papers and their assignments.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <AddPaperForm />
        </div>
        <div className="xl:col-span-2">
          <PaperList papers={papers} />
        </div>
      </div>
    </div>
  );
}
