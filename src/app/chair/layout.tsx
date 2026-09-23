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

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="md:w-64 bg-slate-900 text-slate-100 md:min-h-screen p-5 flex flex-col hidden md:flex shrink-0 border-r border-slate-800">
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-base shadow-md">
            CH
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">CICON Portal</h1>
            <p className="text-[11px] text-slate-400 font-medium">Session Chair Desk</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          <Link
            href="/chair/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <Home size={18} className="text-emerald-400" />
            Dashboard
          </Link>
          <Link
            href="/chair/papers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <FileText size={18} className="text-blue-400" />
            My Assigned Papers
          </Link>
          <Link
            href="/chair/feedback"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800/80 transition-colors text-slate-300 hover:text-white"
          >
            <MessageSquareHeart size={18} className="text-amber-400" />
            Conference Feedback
          </Link>
        </nav>

        <div className="border-t border-slate-800 pt-4 mt-auto">
          <SignOutButton className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left" />
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md text-white flex justify-around p-3 z-50 border-t border-slate-800 shadow-xl">
        <Link href="/chair/dashboard" className="flex flex-col items-center hover:text-emerald-400">
          <Home size={20} />
          <span className="text-[10px] mt-1">Dashboard</span>
        </Link>
        <Link href="/chair/papers" className="flex flex-col items-center hover:text-emerald-400">
          <FileText size={20} />
          <span className="text-[10px] mt-1">Papers</span>
        </Link>
        <Link href="/chair/feedback" className="flex flex-col items-center hover:text-amber-400">
          <MessageSquareHeart size={20} />
          <span className="text-[10px] mt-1">Feedback</span>
        </Link>
        <SignOutButton className="flex flex-col items-center text-red-400">
          <LogOut size={20} />
          <span className="text-[10px] mt-1">Logout</span>
        </SignOutButton>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pb-16 md:pb-0 min-w-0">
        {/* Professional Rounded Navbar */}
        <ConferenceNavbar
          variant="portal"
          roleTitle="Session Chair"
          userName={`Dr. ${session.user.name || "Chair"}`}
        />

        <main className="p-4 md:p-8 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
