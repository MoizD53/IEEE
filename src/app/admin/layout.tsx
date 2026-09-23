import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LogOut, 
  Users, 
  FileText, 
  Home, 
  BarChart, 
  Download, 
  Settings, 
  MessageSquareText 
} from "lucide-react";
import ConferenceNavbar from "@/components/ConferenceNavbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col md:flex-row">
      {/* Enterprise-Grade Admin Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#0F172A] via-[#0B132B] to-[#070D1A] text-slate-100 min-h-screen p-5 flex flex-col hidden md:flex shrink-0 border-r border-slate-800/80 shadow-2xl">
        {/* ========================================================= */}
        {/* PREMIUM ENTERPRISE CONFERENCE BRANDING BLOCK              */}
        {/* ========================================================= */}
        <div className="px-1 pt-1 pb-1">
          <Link href="/admin/dashboard" className="group flex items-center gap-3.5 select-none block">
            {/* Logo Mark Container with subtle ambient glow */}
            <div className="relative shrink-0">
              {/* Subtle Blue Ambient Glow */}
              <div className="absolute -inset-1 rounded-[18px] bg-blue-500/10 blur-xl pointer-events-none group-hover:bg-blue-500/25 transition-all duration-300"></div>

              {/* 48px x 48px Precision Mark */}
              <div className="relative w-12 h-12 rounded-[15px] bg-gradient-to-br from-[#1E40AF] via-[#1D4ED8] to-[#1E3A8A] flex items-center justify-center shadow-[0_4px_16px_rgba(29,78,216,0.35)] ring-1 ring-inset ring-white/20 group-hover:-translate-y-0.5 group-hover:brightness-105 group-hover:shadow-[0_6px_20px_rgba(29,78,216,0.45)] transition-all duration-200 overflow-hidden">
                {/* Subtle low-opacity geometric pattern behind letters */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="0" y1="48" x2="48" y2="0" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="12" y1="48" x2="48" y2="12" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="24" cy="24" r="18" stroke="white" strokeWidth="0.75" />
                </svg>

                {/* CICON Lettermark */}
                <span className="relative z-10 text-white font-black text-[12px] tracking-tight leading-none">
                  CICON
                </span>
              </div>
            </div>

            {/* Brand Typography & Hierarchy */}
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-blue-400/90 leading-none mb-1">
                IEEE Conference 2026
              </span>
              <h1 className="text-[18px] leading-tight font-bold tracking-tight text-white flex items-center gap-1.5">
                <span className="font-semibold text-slate-300">IEEE</span>
                <span className="font-extrabold text-white">CICON</span>
              </h1>
              <p className="text-[12px] font-medium text-slate-400 tracking-wide mt-0.5">
                Administrator Portal
              </p>
            </div>
          </Link>

          {/* Sidebar Brand Separator (20-24px spacing above/below, subtle opacity) */}
          <div className="my-5 border-b border-white/[0.07]"></div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1.5">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <Home size={18} className="text-blue-400" />
            Dashboard
          </Link>
          <Link
            href="/admin/papers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <FileText size={18} className="text-indigo-400" />
            Papers & Assignment
          </Link>
          <Link
            href="/admin/chairs"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <Users size={18} className="text-emerald-400" />
            Session Chairs
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <BarChart size={18} className="text-amber-400" />
            Analytics
          </Link>
          <Link
            href="/admin/feedback"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <MessageSquareText size={18} className="text-yellow-400" />
            Feedback & Reviews
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <Download size={18} className="text-rose-400" />
            Reports & Export
          </Link>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/[0.07] pt-4 mt-auto">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Professional Rounded Navbar */}
        <ConferenceNavbar
          variant="portal"
          roleTitle="Administrator"
          userName={session.user.name || "System Admin"}
        />

        <main className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
