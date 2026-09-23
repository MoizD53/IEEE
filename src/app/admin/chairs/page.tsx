import AddChairForm from "@/components/admin/AddChairForm";
import ChairList from "@/components/admin/ChairList";
import { getChairs } from "@/lib/actions/chair";

export default async function ChairsPage() {
  const chairs = await getChairs();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Session Chairs</h1>
        <p className="mt-1 text-sm text-gray-500">Manage conference session chairs and their access.</p>
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
