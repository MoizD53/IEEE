
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import Image from "next/image";

import sessions from "../../../../../scripts/cicon_sessions_data.json";

export default async function ChairPassesPage() {

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Non-printable header */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/admin/chairs" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2">
            <ArrowLeft size={16} /> Back to Chairs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Session Chair ID Passes</h1>
          <p className="mt-1 text-sm text-gray-500">Official printable credentials for all 22 session chairs.</p>
        </div>
        <button 
          className="flex items-center gap-2 bg-[#002855] hover:bg-[#001f44] text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          style={{ cursor: "pointer" }}
          id="print-btn"
        >
          <Printer size={18} />
          Print All Passes
        </button>
      </div>

      {/* Script to enable print button */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', () => {
            const btn = document.getElementById('print-btn');
            if(btn) btn.addEventListener('click', () => window.print());
          });
        `
      }} />

      {/* Printable Area - Grid of ID passes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:block print:w-full">
        {sessions.map((session: any, i: number) => (
          <div 
            key={session.sessionId} 
            className="print:break-inside-avoid print:mb-8 print:w-full max-w-[100%] mx-auto bg-white rounded-2xl overflow-hidden border-2 border-[#002855] shadow-xl relative"
          >
            {/* Lanyard punch hole indicator */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 border-2 border-dashed border-white/50 rounded-full z-20 print:border-[#002855]/30" />
            
            {/* Header / Brand */}
            <div className="bg-gradient-to-r from-[#002855] to-[#00629B] p-5 text-white relative">
              <div className="flex justify-between items-center mb-4">
                 <div className="w-[60px] h-[60px] bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                   <img src="/logo-uid.png" alt="UID" className="max-w-full max-h-full object-contain" />
                 </div>
                 <div className="text-center flex-1 px-4">
                   <h2 className="text-xl font-black tracking-wider uppercase mb-1">CICON 2026</h2>
                   <p className="text-[10px] font-medium opacity-90 uppercase tracking-widest">IEEE International Conference</p>
                 </div>
                 <div className="w-[100px] h-[40px] bg-white/10 rounded flex items-center justify-center p-1 shrink-0 backdrop-blur-sm border border-white/20">
                   <img src="/logo-ieee-gujarat.png" alt="IEEE" className="max-w-full max-h-full object-contain filter brightness-0 invert" />
                 </div>
              </div>
              <div className="text-center bg-white text-[#002855] font-black text-lg py-1.5 uppercase tracking-[0.2em] rounded border-b-4 border-yellow-400">
                Session Chair
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col md:flex-row gap-6">
               {/* Left: Photo placeholder & basic info */}
               <div className="flex flex-col items-center shrink-0 w-[140px]">
                 <div className="w-32 h-32 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center mb-3 text-slate-400 text-xs text-center p-2">
                   Photo / Avatar Placeholder
                 </div>
                 <div className="w-full text-center">
                   <div className="text-[10px] font-bold text-slate-500 uppercase">Pass ID</div>
                   <div className="font-mono text-sm font-bold text-[#002855]">{session.sessionId}</div>
                 </div>
                 <div className="mt-4 w-24 h-24 p-1 bg-white border border-slate-200 rounded">
                   {/* Fake QR code using basic CSS pattern */}
                   <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#000_0,#000_10%,#fff_0,#fff_50%)] bg-[length:10px_10px] opacity-80" />
                 </div>
               </div>

               {/* Right: Details */}
               <div className="flex-1 flex flex-col text-sm">
                 <div className="mb-4">
                   <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{session.name}</h3>
                   <p className="text-slate-600 font-medium text-xs mt-1">{session.institution}</p>
                 </div>

                 <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="col-span-2">
                     <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Session / Track</span>
                     <span className="font-bold text-[#00629B]">{session.sessionName}</span>
                   </div>
                   
                   <div>
                     <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Date & Time</span>
                     <span className="font-semibold text-slate-800">{session.date}<br/>{session.time}</span>
                   </div>
                   
                   <div>
                     <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Venue / Mode</span>
                     <span className="font-semibold text-slate-800">
                       {session.venue}
                       {session.mode === "Online" && <span className="text-green-600 block text-xs">🌐 Online (GMeet)</span>}
                     </span>
                   </div>
                 </div>

                 {/* Credentials Block */}
                 <div className="mt-auto bg-blue-50 border border-blue-200 rounded-lg p-3 relative overflow-hidden">
                   <div className="absolute right-[-15px] top-[-15px] text-blue-100 opacity-50">
                     <Printer size={80} />
                   </div>
                   <div className="relative z-10">
                     <span className="text-[10px] uppercase font-bold text-blue-800 block mb-1">Portal Login Credentials</span>
                     <div className="flex flex-col gap-1 text-sm font-mono">
                       <div><span className="text-blue-600/70 select-none">URL: </span><span className="font-semibold text-slate-800 tracking-tight">cicon.karnavatiuniversity.edu.in</span></div>
                       <div><span className="text-blue-600/70 select-none">User: </span><span className="font-bold text-[#002855]">{session.username}</span></div>
                       <div><span className="text-blue-600/70 select-none">Pass: </span><span className="font-bold text-red-600">{session.password}</span></div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
            
            {/* Footer */}
            <div className="bg-slate-100 p-2 text-center text-[10px] text-slate-500 font-medium uppercase tracking-widest border-t border-slate-200">
              Valid only for {session.date} • Non-Transferable
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4; margin: 10mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; }
        }
      `}} />
    </div>
  );
}
