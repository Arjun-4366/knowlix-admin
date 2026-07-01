"use client";

import {
  Mail, Phone, ShieldCheck, Building2, Calendar, User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetHRProfile } from "@/querys/admin/hrQuery";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

const statusClass: Record<string, string> = {
  active:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-slate-100 text-slate-500 border-slate-200",
  suspended:"bg-rose-50 text-rose-600 border-rose-200",
};

export default function HRProfileManager() {
  const { data: profile, isLoading } = useGetHRProfile();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-10 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-3">
        <User className="w-10 h-10 text-slate-300" />
        <p className="text-sm font-semibold text-slate-600">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  const roleLabel = profile.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const initial = profile.name.charAt(0).toUpperCase();

  const infoFields = [
    { icon: Mail,      label: "Email Address", value: profile.email },
    { icon: Phone,     label: "Phone Number",  value: profile.phone || "—" },
    { icon: Building2, label: "Department",    value: profile.department || "—" },
    { icon: ShieldCheck, label: "Role",        value: roleLabel },
    { icon: Calendar,  label: "Joined On",     value: fmtDate(profile.createdAt) },
    { icon: Calendar,  label: "Last Updated",  value: fmtDate(profile.updatedAt) },
  ];

  return (
    <div className="space-y-6 pb-10 max-w-3xl mx-auto">
      <DashboardHeader
        title="My Profile"
        description="Your HR account details and information."
      />

      {/* Banner */}
      <div
        className="relative bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
        style={{ background: "var(--brand-bg)" }}
      >
        {/* Decorative top bar */}
        <div className="h-2 w-full" style={{ background: "var(--brand-green)" }} />

        <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-black flex-shrink-0 shadow-sm"
            style={{ background: "var(--brand-green)" }}
          >
            {initial}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <Badge
                variant="outline"
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize border ${statusClass[profile.status] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
              >
                {profile.status}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--brand-green)" }} />
              {roleLabel}
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <p className="text-sm font-bold text-slate-800">Account Information</p>
          <p className="text-xs text-slate-500 mt-0.5">Your registered details on the HR system.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x-0">
          {infoFields.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-start gap-4 px-6 py-5 border-b border-slate-50 last:border-b-0"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--brand-light-green)" }}
              >
                <Icon className="w-4 h-4" style={{ color: "var(--brand-green)" }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
