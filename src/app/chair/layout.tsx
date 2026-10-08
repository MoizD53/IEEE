import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, FileText, Home, MessageSquareHeart } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Sleek Professional Sidebar */}
      <aside className="md:w-[260px] bg-[#0F172A] text-slate-300 md:min-h-screen flex flex-col hidden md:flex shrink-0 border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
              <img src="/logo-karnavati.png" alt="KU" className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-tight">CICON Portal</h1>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Session Chair</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/chair/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <Home size={16} className="text-slate-400" />
              Dashboard
            </Link>
            <Link
              href="/chair/papers"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <FileText size={16} className="text-slate-400" />
              Assigned Papers
            </Link>
            <Link
              href="/chair/feedback"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
            >
              <MessageSquareHeart size={16} className="text-slate-400" />
              Feedback
            </Link>
          </nav>
        </div>

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-[11px] text-slate-500 font-medium">Logged in as</p>
            <p className="text-sm font-medium text-slate-200 truncate">{formattedName}</p>
          </div>
          <SignOutButton className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors w-full text-left">
            <LogOut size={16} />
            Sign Out
          </SignOutButton>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50 shadow-lg">
        <Link href="/chair/dashboard" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/chair/papers" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
          <FileText size={20} />
          <span className="text-[10px] font-medium">Papers</span>
        </Link>
        <Link href="/chair/feedback" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-blue-600">
          <MessageSquareHeart size={20} />
          <span className="text-[10px] font-medium">Feedback</span>
        </Link>
        <SignOutButton className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-red-600">
          <LogOut size={20} />
          <span className="text-[10px] font-medium">Logout</span>
        </SignOutButton>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pb-20 md:pb-0 min-w-0">
        <div className="px-4 md:px-8 py-4 border-b border-slate-200/60 bg-white/50 backdrop-blur-md sticky top-0 z-20">
          <ConferenceNavbar
            variant="portal"
            roleTitle="Session Chair"
            userName={formattedName}
          />
        </div>

        <main className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
