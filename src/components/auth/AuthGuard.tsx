"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";

type AuthState = "checking" | "authenticated" | "unauthenticated";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role") || "admin";
      const roleMap: Record<string, string> = {
        "subject_tutor": "/tutor/dashboard",
        "tutor": "/tutor/dashboard",
        "student": "/student/dashboard",
        "admin": "/admin/dashboard",
        "hr": "/hr",
        "superadmin": "/admin/dashboard",
      };
      const destination = roleMap[role] || "/admin/dashboard";
      router.replace(destination);
      setAuthState("authenticated");
    } else {
      setAuthState("unauthenticated");
    }
  }, [router]);

  if (authState === "checking" || authState === "authenticated") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: "var(--brand-bg)" }}
      >
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
            style={{ background: "var(--brand-green)" }}
          />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
            style={{ background: "var(--brand-dark)" }}
          />
        </div>


        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          <span
            className="w-10 h-10 rounded-full border-4 border-transparent animate-spin"
            style={{
              borderTopColor: "var(--brand-green)",
              borderRightColor: "var(--brand-mid)",
            }}
          />
        </div>

        <p className="text-sm font-medium" style={{ color: "var(--brand-dark)" }}>
          Verifying session…
        </p>
      </div>
    );
  }

  // unauthenticated — render the login page
  return <>{children}</>;
}
