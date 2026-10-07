"use client";

import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { checkFeedbackStatus } from "@/lib/actions/conference-feedback";

export default function SignOutButton({ className, children }: { className?: string, children?: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    // Compulsory feedback check temporarily removed as requested
    /*
    try {
      const res = await checkFeedbackStatus();
      if (res.success && !res.hasGivenFeedback) {
        alert("Conference Feedback is compulsory. Please submit your feedback before signing out.");
        router.push("/chair/feedback");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    */
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={className || "flex items-center w-full text-left cursor-pointer"}
    >
      {children ? children : (
        <>
          {loading ? <Loader2 size={18} className="animate-spin shrink-0" /> : <LogOut size={18} className="shrink-0" />}
          <span>{loading ? "Signing out..." : "Sign Out"}</span>
        </>
      )}
    </button>
  );
}
