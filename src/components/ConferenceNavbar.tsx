"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";

interface ConferenceNavbarProps {
  variant?: "floating" | "portal";
  roleTitle?: string;
  userName?: string;
}

export default function ConferenceNavbar({
  variant = "portal",
  roleTitle = "Administrator",
  userName = "System Admin",
}: ConferenceNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Avatar initial from username or fallback 'S'
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "S";

  // =========================================================================
  // FLOATING VARIANT (LOGIN PAGE)
  // Height: ~76-80px, Radius: 20px, Subtle translucent white, Soft shadow
  // =========================================================================
  if (variant === "floating") {
    return (
      <header className="w-full max-w-[1320px] mx-auto px-4 pt-4 md:pt-6 z-30 animate-in fade-in duration-300">
        <nav className="min-h-[76px] bg-white/95 backdrop-blur-md rounded-[20px] px-5 sm:px-7 md:px-8 py-3.5 shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-white/80 flex items-center justify-between gap-4 transition-all">
          {/* Institutional Logos Area: [UID/UIT] | [IEEE Gujarat] | [KU] | [NAAC] */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
            {/* 1. UID / UIT */}
            <div className="flex items-center shrink-0">
              <Image
                src="/logo-uid.png"
                alt="UID / UIT - Ignite Your Ambition"
                width={85}
                height={43}
                priority
                unoptimized
                className="h-[30px] sm:h-[34px] w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </div>

            {/* Divider 1 */}
            <div className="h-8 w-px bg-slate-200 opacity-60 shrink-0"></div>

            {/* 2. IEEE Gujarat Section (Dominant & Breathable) */}
            <div className="flex items-center shrink-0 px-0.5 sm:px-1">
              <Image
                src="/logo-ieee-gujarat.png"
                alt="IEEE Gujarat Section"
                width={158}
                height={43}
                priority
                unoptimized
                className="h-[30px] sm:h-[34px] w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </div>

            {/* Divider 2 */}
            <div className="h-8 w-px bg-slate-200 opacity-60 shrink-0 hidden sm:block"></div>

            {/* 3. Karnavati University */}
            <div className="flex items-center shrink-0 hidden sm:flex">
              <Image
                src="/logo-karnavati.png"
                alt="Karnavati University"
                width={50}
                height={46}
                priority
                unoptimized
                className="h-[32px] sm:h-[36px] w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </div>

            {/* Divider 3 */}
            <div className="h-8 w-px bg-slate-200 opacity-60 shrink-0 hidden md:block"></div>

            {/* 4. NAAC A+ */}
            <div className="flex items-center shrink-0 hidden md:flex">
              <Image
                src="/logo-naac.png"
                alt="NAAC Grade A+ Accredited University"
                width={75}
                height={46}
                priority
                unoptimized
                className="h-[30px] sm:h-[34px] w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </div>
          </div>

          {/* Right-Side Badges: [ IEEE Conference 2026 ] [ ● Live Portal ] */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="hidden lg:inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-semibold bg-slate-50 border border-slate-200/90 text-[#0F172A] tracking-tight shadow-2xs select-none">
              IEEE Conference 2026
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Portal
            </span>
          </div>
        </nav>
      </header>
    );
  }

  // =========================================================================
  // PORTAL VARIANT (ADMIN & CHAIR DASHBOARDS)
  // =========================================================================
  return (
    <header className="w-full px-4 md:px-6 pt-3.5 md:pt-4 pb-2 z-20">
      <nav className="h-[74px] bg-white/95 backdrop-blur-md rounded-[20px] px-6 border border-slate-200/70 shadow-[0_4px_20px_rgba(15,23,42,0.06)] flex items-center justify-between transition-all">
        {/* Left Brand Area */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 min-w-0">
          <div className="flex items-center shrink-0">
            <Image
              src="/logo-uid.png"
              alt="UID / UIT"
              width={85}
              height={43}
              priority
              unoptimized
              className="h-[32px] sm:h-[34px] md:h-[36px] w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </div>

          <div className="h-8 w-px bg-slate-200 opacity-60 shrink-0"></div>

          <div className="flex items-center shrink-0 px-0.5 sm:px-1">
            <Image
              src="/logo-ieee-gujarat.png"
              alt="IEEE Gujarat Section"
              width={158}
              height={43}
              priority
              unoptimized
              className="h-[32px] sm:h-[34px] md:h-[36px] w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </div>

          <div className="h-8 w-px bg-slate-200 opacity-60 shrink-0 hidden sm:block"></div>

          <div className="flex items-center shrink-0 hidden sm:flex">
            <Image
              src="/logo-karnavati.png"
              alt="Karnavati University"
              width={50}
              height={46}
              priority
              unoptimized
              className="h-[34px] sm:h-[36px] md:h-[38px] w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </div>

          <div className="h-8 w-px bg-slate-200 opacity-60 shrink-0 hidden md:block"></div>

          <div className="flex items-center shrink-0 hidden md:flex">
            <Image
              src="/logo-naac.png"
              alt="NAAC Grade A+ Accredited University"
              width={75}
              height={46}
              priority
              unoptimized
              className="h-[32px] sm:h-[34px] md:h-[36px] w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </div>
        </div>

        {/* Right User Area */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0" ref={dropdownRef}>
          {roleTitle && (
            <span className="hidden md:inline-flex items-center px-3.5 py-1 rounded-full text-[13px] font-semibold bg-slate-50 border border-slate-200/80 text-slate-700 tracking-tight shadow-2xs select-none">
              {roleTitle}
            </span>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl hover:bg-slate-50/80 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              aria-expanded={dropdownOpen}
            >
              <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-tr from-[#155EEF] to-[#2563EB] text-white flex items-center justify-center font-bold text-base shadow-[0_2px_8px_rgba(21,94,239,0.25)] hover:shadow-[0_4px_12px_rgba(21,94,239,0.35)] transition-all shrink-0">
                {userInitial}
              </div>

              <div className="hidden lg:flex items-center gap-1.5">
                <span className="text-[15px] font-semibold text-[#0F172A] tracking-tight whitespace-nowrap">
                  {userName}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-slate-800 truncate mt-0.5">
                    {userName}
                  </p>
                  <p className="text-[11px] font-medium text-blue-600 mt-0.5">
                    {roleTitle} &bull; IEEE Conference
                  </p>
                </div>

                <div className="py-1">
                  <div className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-600">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>IEEE Gujarat Section 2026</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <Link
                    href="/api/auth/signout"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50/80 transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
