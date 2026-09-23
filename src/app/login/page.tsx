import LoginForm from "@/components/LoginForm";
import ConferenceNavbar from "@/components/ConferenceNavbar";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";

export default function LoginPage() {
  return (
    <div className="min-h-screen md:h-screen md:max-h-screen md:overflow-hidden flex flex-col justify-between relative bg-slate-950 font-sans">
      {/* ========================================================= */}
      {/* CLEAR DYNAMIC CAMPUS BACKGROUND SLIDESHOW (2.5s INTERVAL) */}
      {/* ========================================================= */}
      <BackgroundSlideshow intervalMs={2500} />

      {/* ========================================================= */}
      {/* TOP FLOATING INSTITUTIONAL NAVBAR                         */}
      {/* ========================================================= */}
      <div className="w-full z-20 flex justify-center shrink-0 pt-2 sm:pt-4">
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
      <footer className="z-10 w-full py-2.5 px-4 text-center border-t border-white/10 bg-slate-950/60 backdrop-blur-md shrink-0">
        <p className="text-[11.5px] sm:text-xs text-white/80 tracking-normal drop-shadow-sm font-medium">
          &copy; 2026 &ldquo;CICON&rdquo; IEEE Conference Session Portal &bull; Karnavati University &bull; All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
