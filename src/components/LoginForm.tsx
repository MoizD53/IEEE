"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, AlertCircle, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid username or password. Please verify your credentials.");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-white px-7 sm:px-9 py-8 sm:py-9 rounded-[26px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 relative z-10 transition-all animate-in fade-in duration-500">
      {/* ========================================================= */}
      {/* COMPACT CARD TOP BRANDING                                 */}
      {/* ========================================================= */}
      <div className="text-center flex flex-col items-center mb-5">
        {/* Compact Precision CICON Logo Mark (38px x 38px) */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] bg-gradient-to-br from-[#1E40AF] via-[#1D4ED8] to-[#1E3A8A] flex items-center justify-center shadow-[0_3px_12px_rgba(29,78,216,0.30)] ring-1 ring-inset ring-white/20 mb-2 relative overflow-hidden select-none">
          <svg
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
            viewBox="0 0 40 40"
            fill="none"
          >
            <line x1="0" y1="40" x2="40" y2="0" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="0.75" />
          </svg>
          <span className="relative z-10 text-white font-black text-[11px] sm:text-xs tracking-tight leading-none">
            CICON
          </span>
        </div>

        {/* Small Security Indicator Badge */}
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-[0.08em] bg-blue-50 text-blue-700 border border-blue-200/80 mb-2 select-none">
          <ShieldCheck size={12} className="text-blue-600 shrink-0" />
          Secure Access
        </div>

        {/* Primary Title */}
        <h2 className="text-2xl sm:text-[27px] font-extrabold tracking-[-0.03em] text-[#0F172A] leading-tight">
          &ldquo;CICON&rdquo; Session Portal
        </h2>

        {/* Subtitle */}
        <p className="mt-1 text-xs sm:text-[13px] text-[#64748B] leading-normal max-w-sm">
          Conference Session Chair Management System
        </p>
      </div>

      {/* Login Form */}
      <form className="space-y-3.5" onSubmit={handleSubmit}>
        {/* Inline Error State */}
        {error && (
          <div className="bg-red-50/90 text-red-700 p-2.5 rounded-xl text-xs font-medium border border-red-200/90 flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle size={15} className="text-red-600 shrink-0 mt-0.5" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Username Field */}
        <div>
          <label
            htmlFor="username"
            className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600 block mb-1"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-[46px] px-3.5 rounded-xl bg-[#F8FAFC] border border-[#D9E2EC] text-[#0F172A] placeholder:text-slate-400 text-sm font-medium shadow-2xs focus:border-[#2563EB] focus:ring-4 focus:ring-blue-600/10 focus:bg-white focus:outline-none transition-all duration-150"
            placeholder="e.g. admin or pooja"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-600 block mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[46px] px-3.5 pr-11 rounded-xl bg-[#F8FAFC] border border-[#D9E2EC] text-[#0F172A] placeholder:text-slate-400 text-sm font-medium shadow-2xs focus:border-[#2563EB] focus:ring-4 focus:ring-blue-600/10 focus:bg-white focus:outline-none transition-all duration-150"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Primary CTA Sign-In Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-[#155EEF] hover:bg-[#1251D4] active:bg-[#0F47BC] shadow-[0_4px_14px_rgba(21,94,239,0.28)] hover:shadow-[0_6px_18px_rgba(21,94,239,0.36)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-150 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in to Portal</span>
            )}
          </button>
        </div>
      </form>

      {/* Subtle Trust Indicator */}
      <div className="mt-5 pt-2 text-center flex items-center justify-center gap-1.5 text-[11.5px] text-slate-400 select-none border-t border-slate-100">
        <Lock size={12} className="text-slate-400" />
        <span>Authorized conference personnel only</span>
      </div>
    </div>
  );
}
