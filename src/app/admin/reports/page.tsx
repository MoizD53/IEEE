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
  Layers,
  MessageSquareHeart
} from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();

  const [
    papersCount,
    evalsCount,
    recommendedCount,
    chairsCount,
    confCount
  ] = await Promise.all([
    prisma.paper.count(),
    prisma.evaluation.count({ where: { status: "SUBMITTED" } }),
    prisma.evaluation.count({ where: { status: "SUBMITTED", recommended: true } }),
    prisma.user.count({ where: { role: "SESSION_CHAIR" } }),
    prisma.conferenceFeedback.count({ where: { status: "SUBMITTED" } }),
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
      title: "50-Mark Presentation Scoring Ledger",
      category: "Review Analytics",
      description: "Full audit of 5 parameters (Novelty, Methodology, Results, Clarity, Q&A), total marks out of 50, Best Paper recommendations, and written remarks.",
      count: evalsCount,
      countLabel: "Evaluations",
      href: "/api/export/evaluations",
      filename: "ieee_evaluations_summary_50marks.csv",
      icon: CheckCircle2,
      accentColor: "border-emerald-500",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
      fields: ["Chair Name", "5 Parameter Scores", "Total /50", "Avg /10", "Best Paper Rec", "Feedback"],
    },
    {
      id: "conference-feedback",
      title: "Conference Organization Feedback",
      category: "Operations & Logistics",
      description: "Ratings from Session Chairs on session planning, time management, AV/tech infrastructure, presenter management, and overall support.",
      count: confCount,
      countLabel: "Feedback Forms",
      href: "/api/export/conference-feedback",
      filename: "conference_organization_feedback.csv",
      icon: MessageSquareHeart,
      accentColor: "border-teal-500",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      btnColor: "bg-teal-600 hover:bg-teal-700 text-white",
      fields: ["Chair Name", "5 Org Scores (10 each)", "Total /50", "Highlights", "Suggestions"],
    },
    {
      id: "recommended",
      title: "Recommended Papers Dossier",
      category: "Committee Selection",
      description: "Curated dataset of submissions that received explicit recommendations from Session Chairs for IEEE Best Paper awards.",
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 mb-3">
              <Database size={13} className="text-blue-600" />
              Official Export Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reports & Data Exports
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 max-w-2xl leading-relaxed">
              Export verified data extracts for conference reporting, committee review, best paper selection, and logistics auditing.
            </p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCards.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 hover:shadow-md transition-all flex flex-col justify-between border-t-4 ${report.accentColor}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${report.badgeColor}`}>
                    {report.category}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold">
                    <Icon size={20} />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{report.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Available Records:</span>
                  <span className="font-black text-slate-900 text-sm">
                    {report.count} {report.countLabel}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.fields.map((field) => (
                    <span
                      key={field}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <a
                  href={report.href}
                  download={report.filename}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${report.btnColor}`}
                >
                  <Download size={14} />
                  Download CSV Extract
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
