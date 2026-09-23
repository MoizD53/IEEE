import LoginForm from "@/components/LoginForm";
import ConferenceNavbar from "@/components/ConferenceNavbar";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen md:h-screen md:max-h-screen md:overflow-hidden flex flex-col justify-between relative bg-[#07111F] font-sans">
      {/* ========================================================= */}
      {/* MULTI-LAYERED INSTITUTIONAL BACKGROUND                     */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Layer 1: Campus Venue Image */}
        <Image
          src="/login-bg.png"
          alt="IEEE Conference Venue Campus"
          fill
          priority
          className="object-cover opacity-20 sm:opacity-25 md:opacity-28 scale-105 transition-transform duration-700"
        />

        {/* Layer 2: Deep Navy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/92 via-[#0B1730]/86 to-[#07111F]/95"></div>

        {/* Layer 3: Centered Subtle Radial Gradient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(21,94,239,0.09)_0%,transparent_65%)]"></div>

        {/* Layer 4: Vignette Edge Falloff */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,17,31,0.5)_100%)]"></div>
      </div>

      {/* ========================================================= */}
      {/* TOP FLOATING INSTITUTIONAL NAVBAR                         */}
      {/* ========================================================= */}
      <div className="w-full z-20 flex justify-center shrink-0 pt-1 sm:pt-2">
        <ConferenceNavbar variant="floating" />
      </div>

      {/* ========================================================= */}
      {/* CENTER AUTHENTICATION PANEL (FITS IN SINGLE SCREEN)       */}
      {/* ========================================================= */}
      <main className="z-10 w-full flex-1 flex items-center justify-center px-4 py-2 sm:py-3 min-h-0">
        <LoginForm />
      </main>

      {/* ========================================================= */}
      {/* COMPACT INSTITUTIONAL FOOTER                              */}
      {/* ========================================================= */}
      <footer className="z-10 w-full py-2.5 px-4 text-center border-t border-white/[0.08] bg-[#07111F]/60 backdrop-blur-xs shrink-0">
        <p className="text-[11.5px] sm:text-xs text-slate-300/75 tracking-normal">
          &copy; 2026 IEEE Conference Session Chair Management Portal &bull; All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
