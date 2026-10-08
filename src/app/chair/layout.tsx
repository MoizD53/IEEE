import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, FileText, Home, MessageSquareHeart, Sparkles } from "lucide-react";
import ConferenceNavbar from "@/components/ConferenceNavbar";
import SignOutButton from "@/components/SignOutButton";

export default async function ChairLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== "SESSION_CHAIR") {
    redirect("/login");
  }

  const rawName = session.user.name || "Session Chair";
  const formattedName = rawName.toLowerCase().startsWith("dr.") || rawName.toLowerCase().startsWith("prof.") 
    ? rawName 
    : `Dr. ${rawName}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Premium Desktop Sidebar */}
      <aside className="md:w-[280px] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-slate-100 md:min-h-screen p-6 flex flex-col hidden md:flex shrink-0 border-r border-indigo-900/50 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient light */}
        <div className="absolute top-0 left-0 w-full h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        <div className="mb-10 px-2 flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center p-2 shadow-inner border border-white/20">
            <img src="/logo-karnavati.png" alt="KU" className="max-w-full max-h-full object-contain filter drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">CICON Portal</h1>
            <p className="text-xs text-indigo-300/80 font-semibold tracking-wide uppercase mt-0.5 flex items-center gap-1">
              <Sparkles size={10} /> Session Chair
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 relative z-10">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">Menu</div>
          <Link
            href="/chair/dashboard"
            className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Home size={18} />
            </div>
            Dashboard
          </Link>
          <Link
            href="/chair/papers"
            className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <FileText size={18} />
            </div>
            My Assigned Papers
          </Link>
          <Link
            href="/chair/feedback"
            className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:bg-white/10 text-slate-300 hover:text-white border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-amber-500/10"
          >
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <MessageSquareHeart size={18} />
            </div>
            Conference Feedback
          </Link>
        </nav>

        <div className="border-t border-white/10 pt-6 mt-auto relative z-10">
          <div className="px-4 py-3 mb-4 rounded-2xl bg-indigo-900/30 border border-indigo-500/20 backdrop-blur-sm">
            <p className="text-xs text-indigo-200/60 font-medium">Logged in as</p>
            <p className="text-sm font-bold text-white truncate mt-0.5">{formattedName}</p>
          </div>
          <SignOutButton className="group flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all w-full text-left border border-transparent hover:border-red-500/20">
            <span className="flex items-center gap-3">
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              Sign Out
            </span>
          </SignOutButton>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - Premium Glass */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl text-slate-400 flex justify-around p-4 z-50 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <Link href="/chair/dashboard" className="flex flex-col items-center gap-1.5 hover:text-indigo-400 transition-colors">
          <Home size={22} />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>
        <Link href="/chair/papers" className="flex flex-col items-center gap-1.5 hover:text-blue-400 transition-colors">
          <FileText size={22} />
          <span className="text-[10px] font-semibold">Papers</span>
        </Link>
        <Link href="/chair/feedback" className="flex flex-col items-center gap-1.5 hover:text-amber-400 transition-colors">
          <MessageSquareHeart size={22} />
          <span className="text-[10px] font-semibold">Feedback</span>
        </Link>
        <SignOutButton className="flex flex-col items-center gap-1.5 hover:text-red-400 transition-colors">
          <LogOut size={22} />
          <span className="text-[10px] font-semibold">Logout</span>
        </SignOutButton>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pb-20 md:pb-0 min-w-0 bg-slate-50/50 relative">
        {/* Subtle background pattern/gradient for main area */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] pointer-events-none mix-blend-multiply" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        {/* Professional Rounded Navbar */}
        <div className="relative z-10 px-4 pt-4 md:px-8 md:pt-8 pb-2">
          <ConferenceNavbar
            variant="portal"
            roleTitle="Session Chair"
            userName={formattedName}
          />
        </div>

        <main className="p-4 md:px-8 md:pb-8 flex-1 overflow-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
