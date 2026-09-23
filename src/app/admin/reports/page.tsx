import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Star, 
  Users, 
  FileText, 
  Database, 
  ShieldCheck,
  Calendar,
  Layers
} from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();

  const [
    papersCount,
    evalsCount,
    recommendedCount,
    chairsCount,
  ] = await Promise.all([
    prisma.paper.count(),
    prisma.evaluation.count({ where: { status: "SUBMITTED" } }),
    prisma.evaluation.count({ where: { status: "SUBMITTED", recommended: true } }),
    prisma.user.count({ where: { role: "SESSION_CHAIR" } }),
  ]);

  const reportCards = [
    {
      id: "papers",
      title: "All Papers Master Register",
      category: "Paper Management",
      description: "Complete register of all conference submissions, track allocations, session assignments, and lifecycle status.",
      count: papersCount,
      countLabel: "Manuscripts",
      href: "/api/export/papers",
      filename: "papers.csv",
      icon: FileSpreadsheet,
      accentColor: "border-blue-500",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      btnColor: "bg-blue-600 hover:bg-blue-700 text-white",
      fields: ["Paper ID", "Title", "Authors", "Track", "Session", "Review Status"],
    },
    {
      id: "evaluations",
      title: "Evaluations & Scoring Ledger",
      category: "Review Analytics",
      description: "Full audit of 4-block scores (Technical, Novelty, Relevance, Clarity), total marks out of 20, star ratings, and written comments.",
      count: evalsCount,
      countLabel: "Evaluations",
      href: "/api/export/evaluations",
      filename: "evaluations_summary.csv",
      icon: CheckCircle2,
      accentColor: "border-emerald-500",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
      fields: ["Chair Name", "4 Block Marks", "Total /20", "Avg /5", "Star Rating", "Feedback"],
    },
    {
      id: "recommended",
      title: "Recommended Papers Dossier",
      category: "Committee Selection",
      description: "Curated dataset of submissions that received explicit recommendations from Session Chairs for IEEE publication consideration.",
      count: recommendedCount,
      countLabel: "Recommended",
      href: "/api/export/recommended",
      filename: "recommended_papers.csv",
      icon: Star,
      accentColor: "border-purple-500",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      btnColor: "bg-purple-600 hover:bg-purple-700 text-white",
      fields: ["Paper ID", "Score Ranking", "Recommending Chair", "Session Details", "Review Remarks"],
    },
    {
      id: "chairs",
      title: "Session Chair Performance Audit",
      category: "Operations",
      description: "Workload distribution, evaluation completion rates, pending papers count, and scoring tendencies per Session Chair.",
      count: chairsCount,
      countLabel: "Session Chairs",
      href: "/api/export/chairs",
      filename: "session_chair_performance.csv",
      icon: Users,
      accentColor: "border-amber-500",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
      fields: ["Chair Name", "Institution", "Assigned", "Completed", "Pending", "Average Given"],
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-blue-50/70 to-transparent pointer-events-none hidden md:block"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-100 mb-3">
              <Database size={13} className="text-blue-600" />
              Conference Data Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reports & Data Exports
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">
              Export authenticated datasets for offline deliberations, editorial review, and IEEE archival compliance. Data is streamed in UTF-8 CSV directly from the database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <ShieldCheck size={14} className="text-emerald-600" />
              Audit Logged
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <Calendar size={14} className="text-blue-600" />
              IEEE 2026 Sync
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/90 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Card Bar */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {card.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${card.badgeColor}`}>
                    {card.count} {card.countLabel}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mb-5 leading-relaxed">
                  {card.description}
                </p>

                {/* Included Data Fields Tags */}
                <div className="mb-6">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Included Columns:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {card.fields.map((f, i) => (
                      <span
                        key={i}
                        className="inline-block text-[11px] font-medium bg-slate-50 border border-slate-200/80 text-slate-700 px-2 py-0.5 rounded-lg"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-mono">
                  {card.filename}
                </span>

                <a
                  href={card.href}
                  download
                  className={`inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all ${card.btnColor}`}
                >
                  <Download size={15} />
                  <span>Download CSV</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Archival Notes Footer */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 flex items-start gap-3.5">
        <Layers size={18} className="text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">IEEE Archival Standard Notice:</span>{" "}
          All generated CSV files are formatted with RFC 4180 standard quotation escapes and UTF-8 encoding. Export activities are recorded in the internal Audit Log for conference accreditation compliance.
        </div>
      </div>
    </div>
  );
}
