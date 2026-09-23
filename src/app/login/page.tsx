import LoginForm from "@/components/LoginForm";
import ConferenceNavbar from "@/components/ConferenceNavbar";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans relative">
      {/* Top Floating Navbar - Absolutely positioned to span across the whole layout */}
      <div className="absolute top-0 left-0 w-full z-20 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-[1320px]">
          <ConferenceNavbar variant="floating" />
        </div>
      </div>

      {/* Left Side: Authentication Panel */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col items-center justify-center min-h-screen relative bg-slate-50">
        <main className="w-full flex-1 flex items-center justify-center px-4 sm:px-8 z-10 pt-[100px] md:pt-0">
          <LoginForm />
        </main>

        {/* Compact Footer */}
        <footer className="w-full py-4 px-4 text-center z-10 shrink-0">
          <p className="text-xs text-slate-500 font-medium">
            &copy; 2026 &ldquo;CICON&rdquo; IEEE Conference Session Portal &bull; Karnavati University &bull; All Rights Reserved.
          </p>
        </footer>
      </div>

      {/* Right Side: Campus Image */}
      {/* Hidden on mobile, takes 55% width on large screens */}
      <div className="hidden md:block md:w-1/2 lg:w-[55%] relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/login-bg-right.jpg')" }}
        />
        {/* Subtle overlay if needed to match branding */}
        <div className="absolute inset-0 bg-[#0F172A]/5 mix-blend-multiply" />
      </div>
    </div>
  );
}
