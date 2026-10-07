import AddChairForm from "@/components/admin/AddChairForm";
import ChairList from "@/components/admin/ChairList";
import { getChairs } from "@/lib/actions/chair";

export default async function ChairsPage() {
  const chairs = await getChairs();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Session Chairs</h1>
          <p className="mt-1 text-sm text-gray-500">Manage conference session chairs and their access.</p>
        </div>
        <a 
          href="/admin/chairs/passes"
          className="bg-[#002855] text-white px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-[#001f44]"
        >
          Print ID Passes
        </a>
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
