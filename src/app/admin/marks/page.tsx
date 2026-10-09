import { prisma } from "@/lib/db";
import { Trophy } from "lucide-react";
import MarksSearchClient from "@/components/admin/MarksSearchClient";

export const dynamic = "force-dynamic";

export default async function MarksPage() {
  const evaluations = await prisma.evaluation.findMany({
    include: {
      paper: true,
      chair: true,
    },
    orderBy: {
      totalScore: "desc",
    },
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-900 via-blue-800 to-indigo-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Trophy size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
              <Trophy size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Track-wise Marks & Scores</h1>
          </div>
          <p className="text-blue-100 max-w-2xl text-sm font-medium leading-relaxed mt-3">
            Review detailed criteria-wise marks and total scores for all evaluated papers, categorized by track.
          </p>
        </div>
      </div>

      <MarksSearchClient evaluations={evaluations} />
    </div>
  );
}
