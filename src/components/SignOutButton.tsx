"use client";

import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function SignOutButton({ className, children }: { className?: string, children?: React.ReactNode }) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
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
