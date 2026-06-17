"use client";

import {
  User, Mail, Phone, MapPin, BookOpen, GraduationCap,
  Users, Calendar, CreditCard, ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useGetStudentProfile } from "@/querys/student/studentQuery";

const STATUS_STYLES: Record<string, string> = {
  admission_taken: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  inactive: "bg-slate-100 text-slate-500 border-slate-200",
};

const STATUS_LABELS: Record<string, string> = {
  admission_taken: "Admitted",
  pending: "Pending",
  inactive: "Inactive",
};

const PACKAGE_LABELS: Record<string, string> = {
  "1_month": "1 Month",
  "2_months": "2 Months",
  "3_months": "3 Months",
  "6_months": "6 Months",
  "12_months": "12 Months",
};


function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export default function StudentProfile() {
  const { data: profile, isLoading } = useGetStudentProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white border border-slate-150 rounded-2xl shadow-sm">
        <User className="w-10 h-10 text-slate-200 mb-3" />
        <p className="text-sm font-semibold text-slate-400">Profile not available</p>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[profile.admissionStatus] || STATUS_STYLES.pending;
  const statusLabel = STATUS_LABELS[profile.admissionStatus] || profile.admissionStatus;
  const dueAmount = (profile.totalFee || 0) - (profile.paidAmount || 0);
  const paidPercent = profile.totalFee ? Math.round(((profile.paidAmount || 0) / profile.totalFee) * 100) : 0;
  const initials = profile.studentName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="My Profile"
        description="View your personal details, academic information, and enrolled program."
      />

      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-[var(--brand-dark)] to-[var(--brand-mid)] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-white/5">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[var(--brand-green)]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-[var(--brand-green)] flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-lg">
            {initials}
          </div>

          {/* Name & ID */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black font-heading">{profile.studentName}</h1>
              <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${statusStyle}`}>
                {statusLabel}
              </Badge>
            </div>
            <p className="text-white/60 text-sm font-semibold">{profile.admissionNumber}</p>
            <p className="text-white/50 text-xs mt-1">{profile.email}</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs flex-shrink-0">
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">Program</p>
              <p className="text-white font-bold text-sm mt-0.5 truncate max-w-[100px]">{profile.programName || "—"}</p>
            </div>
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">Class</p>
              <p className="text-white font-bold text-sm mt-0.5">Grade {profile.class}</p>
            </div>
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">Syllabus</p>
              <p className="text-white font-bold text-sm mt-0.5">{profile.syllabus || "—"}</p>
            </div>
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">Package</p>
              <p className="text-white font-bold text-sm mt-0.5">{PACKAGE_LABELS[profile.package || ""] || profile.package || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Personal + Academic */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <InfoRow label="Email Address" value={profile.email} />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <InfoRow label="Phone Number" value={profile.phone} />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <InfoRow label="Parent / Guardian" value={profile.parentName} />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <InfoRow label="Location" value={profile.place} />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <InfoRow
                    label="Enrolled On"
                    value={new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                  </div>
                  <InfoRow label="Admission Status" value={statusLabel} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Details */}
          <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoRow label="Program" value={profile.programName} />
                <InfoRow label="Course" value={profile.courseName} />
                <InfoRow label="Class / Grade" value={`Grade ${profile.class}`} />
                <InfoRow label="Syllabus" value={profile.syllabus} />
                <InfoRow label="Package" value={PACKAGE_LABELS[profile.package || ""] || profile.package} />
                <InfoRow label="Admission Number" value={profile.admissionNumber} />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right: Staff + Fees */}
        <div className="space-y-6">
          {/* Assigned Staff */}
          <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
            <CardHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                Assigned Staff
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {profile.mentorName && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0">
                    {profile.mentorName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mentor</p>
                    <p className="text-sm font-bold text-slate-800">{profile.mentorName}</p>
                  </div>
                </div>
              )}
              {profile.coordinatorName && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-sm font-bold flex-shrink-0">
                    {profile.coordinatorName[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Coordinator</p>
                    <p className="text-sm font-bold text-slate-800">{profile.coordinatorName}</p>
                  </div>
                </div>
              )}
              {!profile.mentorName && !profile.coordinatorName && (
                <p className="text-xs text-slate-400 text-center py-4">No staff assigned yet</p>
              )}
            </CardContent>
          </Card>

          {/* Fee Overview */}
          {profile.totalFee != null && (
            <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                  Fee Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Payment Progress</span>
                    <span className="text-[10px] font-bold text-[var(--brand-green)]">{paidPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand-green)] rounded-full transition-all"
                      style={{ width: `${paidPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold py-2 border-b border-slate-50">
                    <span className="text-slate-500">Total Fee</span>
                    <span className="text-slate-800 font-bold">₹{profile.totalFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold py-2 border-b border-slate-50">
                    <span className="text-slate-500">Amount Paid</span>
                    <span className="text-emerald-600 font-bold">₹{(profile.paidAmount || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold py-2">
                    <span className="text-slate-500">Outstanding</span>
                    <span className={`font-bold ${dueAmount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                      ₹{dueAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {dueAmount > 0 && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs font-semibold text-amber-700">
                    ₹{dueAmount.toLocaleString("en-IN")} outstanding — please clear your dues.
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Course Card */}
          {profile.courseName && (
            <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-light-green)] border border-[var(--brand-green)]/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[var(--brand-green)]" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enrolled Course</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{profile.courseName}</p>
                  {profile.programName && (
                    <p className="text-xs text-slate-500 mt-0.5">{profile.programName}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
