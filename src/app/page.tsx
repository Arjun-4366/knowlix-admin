"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/querys/admin/authQuery";
import toast from "react-hot-toast";
import AuthGuard from "@/components/auth/AuthGuard";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

const roleMap: Record<string, string> = {
  "subject_tutor": "/tutor/dashboard",
  "tutor": "/tutor/dashboard",
  "student": "/student/dashboard",
  "admin": "/admin/dashboard",
  "superadmin": "/admin/dashboard",
};

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("data",data)
          localStorage.setItem("token", data.token);
          toast.success("Login successful!");
          const targetRole = data.role || data.user?.role;
          const destination = (targetRole && roleMap[targetRole]) || "/admin/dashboard";
          router.push(destination);
          

          // router.push("/admin/dashboard");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.error || error.message || "Login failed!",
          );
        },
      },
    );
  };

  return (
    <AuthGuard>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "var(--brand-bg)" }}
      >
        {/* Background pattern */}
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

        <div className="relative w-full max-w-sm">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--brand-dark)" }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1
                className="text-xl font-bold"
                style={{ color: "var(--brand-dark)" }}
              >
                Knowlix Admin
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to manage your website
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@knowlix.in"
                    className="pl-9"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-9 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-70 mt-2"
                style={{
                  background: isPending ? "var(--brand-mid)" : "var(--brand-green)",
                }}
              >
                {isPending ? "Signing in…" : "Sign In"}
              </button>
            </form>

            {/* Footer */}
            <div className="px-8 pb-6 text-center">
              <p className="text-xs text-gray-400">
                Access restricted to authorised administrators only.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Knowlix Learning. All rights reserved.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
