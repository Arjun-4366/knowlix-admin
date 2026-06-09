"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, BookOpen, Clock, DollarSign, BarChart3,
  FileText, MessageSquare, Calendar, CheckCircle2,
  AlertCircle, ChevronRight, Star, TrendingUp,
} from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetTutorDashboard } from "@/querys/tutor/dashboardQuery";

// ─── Helpers ───────────────────────────────────────────────────────────────

const formatCurrency = (amount: number, currency: string = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function TutorDashboard() {
  const router = useRouter();
  const [sessionPeriod, setSessionPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [kpiPeriod, setKpiPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");

  const { data: sessionData, isLoading: isSessionLoading } = useGetTutorDashboard({ period: sessionPeriod });
  const { data: kpiData, isLoading: isKpiLoading } = useGetTutorDashboard({ period: kpiPeriod });

  if (isSessionLoading || isKpiLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStudentName = (studentId: string) => {
    if (!studentId) return "Student";
    return `Student (#${studentId.slice(-4).toUpperCase()})`;
  };

  const totalSlots = kpiData?.slots?.total || 0;
  const filledSlots = kpiData?.slots?.filled || 0;
  const availableSlots = kpiData?.slots?.available || 0;

  const todaySchedule = kpiData?.schedule?.today || [];
  const tomorrowSchedule = kpiData?.schedule?.tomorrow || [];

  const letters = ["G", "R", "O", "W", "T", "H"] as const;

  return (
    <div className="space-y-8 pb-10">

      {/* ── Top Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard
          label="Total Students"
          value={sessionData?.totalStudents || 0}
          icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="Assigned"
          footerText="View complete student list"
          footerLink
          onClick={() => router.push("/tutor/students")}
        />
        <DashboardStatCard
          label="Total Assignments"
          value={sessionData?.totalAssignments || 0}
          icon={<BookOpen className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="Active"
        footerText="Across all students"
        />
        <DashboardStatCard
          label={`Sessions (${sessionPeriod.charAt(0).toUpperCase() + sessionPeriod.slice(1)})`}
          value={sessionData?.sessions?.total || 0}
          icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="Class counts"
          footerText={`${sessionData?.sessions?.conducted || 0} completed · ${(sessionData?.sessions?.total || 0) - (sessionData?.sessions?.conducted || 0)} pending`}
        />
        <DashboardStatCard
          label={`Earnings (${sessionPeriod.charAt(0).toUpperCase() + sessionPeriod.slice(1)})`}
          value={formatCurrency(sessionData?.totalEarnings?.amount || 0, sessionData?.totalEarnings?.currency)}
          icon={<DollarSign className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText={sessionData?.totalEarnings?.currency || "INR"}
          footerText={`${sessionData?.sessions?.total || 0} sessions · ${
            sessionData?.sessions?.total 
              ? formatCurrency((sessionData?.totalEarnings?.amount || 0) / sessionData.sessions.total, sessionData?.totalEarnings?.currency)
              : formatCurrency(0, sessionData?.totalEarnings?.currency)
          } / session`}
        />
      </div>

      {/* ── Period Filter Tabs (shared for Sessions + Earnings) ── */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter Period:</span>
        <Tabs value={sessionPeriod} onValueChange={(v) => setSessionPeriod(v as typeof sessionPeriod)}>
          <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
            {(["weekly", "monthly", "yearly"] as const).map((p) => (
              <TabsTrigger
                key={p}
                value={p}
                className="rounded-lg text-xs px-3 py-1.5 capitalize data-[state=active]:shadow-none data-[state=active]:text-white"
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* No TabsContent needed — data is derived from state above */}
          {["weekly", "monthly", "yearly"].map((p) => (
            <TabsContent key={p} value={p} />
          ))}
        </Tabs>
      </div>

      {/* ── KPI Performance ── */}
      <Card className="bg-white border-slate-150 shadow-sm">
        <CardHeader className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                KPI Performance
              </CardTitle>
            </div>
            <Tabs value={kpiPeriod} onValueChange={(v) => setKpiPeriod(v as typeof kpiPeriod)}>
              <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
                {(["weekly", "monthly", "yearly"] as const).map((p) => (
                  <TabsTrigger
                    key={p}
                    value={p}
                    className="rounded-lg text-xs px-3 py-1.5 capitalize data-[state=active]:shadow-none data-[state=active]:text-white"
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {["weekly", "monthly", "yearly"].map((p) => (
                <TabsContent key={p} value={p} />
              ))}
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Growth Points */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-[var(--brand-green)] text-[var(--brand-green)]" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{kpiData?.kpiPerformance?.growthPoints || 0}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Growth Points</p>
            </div>

            {/* Attendance Rate */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{Math.round(kpiData?.kpiPerformance?.attendanceRate || 0)}%</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Attendance Rate</p>
            </div>

            {/* Exams Conducted */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <FileText className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpiData?.exams?.conducted || 0}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Exams Conducted</p>
            </div>

            {/* Exams Pending */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <AlertCircle className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpiData?.exams?.pending || 0}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Exams Pending</p>
            </div>

            {/* Slot Fill Rate */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <Calendar className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">
                {totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0}%
              </p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Slot Fill Rate</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="mt-6 space-y-3">
            {[
              { label: "Attendance Rate", value: Math.round(kpiData?.kpiPerformance?.attendanceRate || 0) },
              { label: "Slot Fill Rate", value: totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0 },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-600">{bar.label}</span>
                  <span className="text-xs font-bold text-[var(--brand-green)]">{bar.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--brand-green)] transition-all duration-700"
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* GROWTH Points Breakdown */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">GROWTH Points Breakdown</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {letters.map((letter) => {
                const val = kpiData?.kpiPerformance?.growthBreakdown?.[letter] || 0;
                return (
                  <div key={letter} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-center">
                    <span className="text-sm font-black text-[var(--brand-green)]">{letter}</span>
                    <p className="text-lg font-bold text-slate-700 mt-1">{val}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Schedule + Slot Availability ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Messages / Schedule */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-150 shadow-sm h-full">
            <CardHeader className="p-6 pb-0 border-b border-slate-100">
              <div className="flex items-center gap-2 pb-4">
                <MessageSquare className="w-5 h-5 text-[var(--brand-green)]" />
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                  Class Schedule
                </CardTitle>
              </div>
              <Tabs defaultValue="today">
                <TabsList className="mb-0 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
                  <TabsTrigger value="today" className="rounded-lg text-xs px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
                    Today
                  </TabsTrigger>
                  <TabsTrigger value="tomorrow" className="rounded-lg text-xs px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">
                    Tomorrow
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="today" className="mt-0 pt-4 pb-2">
                  <div className="space-y-2">
                    {todaySchedule.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">No sessions scheduled for today.</p>
                    ) : (
                      todaySchedule.map((s, i) => {
                        const time = new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <div key={s.id || i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <div className="w-16 text-center flex-shrink-0">
                              <p className="text-xs font-bold text-[var(--brand-green)]">{time}</p>
                              <p className="text-[10px] text-slate-400">{s.durationMinutes} min</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{getStudentName(s.studentId)}</p>
                              <p className="text-xs text-slate-450 font-semibold capitalize">{s.subject}</p>
                            </div>
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 capitalize",
                              s.status === "conducted"
                                ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                                : s.status === "postponed"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-blue-50 text-blue-600 border-blue-200"
                            )}>
                              {s.status.replace("_", " ")}
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="tomorrow" className="mt-0 pt-4 pb-2">
                  <div className="space-y-2">
                    {tomorrowSchedule.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">No sessions scheduled for tomorrow.</p>
                    ) : (
                      tomorrowSchedule.map((s, i) => {
                        const time = new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <div key={s.id || i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <div className="w-16 text-center flex-shrink-0">
                              <p className="text-xs font-bold text-slate-500">{time}</p>
                              <p className="text-[10px] text-slate-400">{s.durationMinutes} min</p>
                            </div>
                            <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">{getStudentName(s.studentId)}</p>
                              <p className="text-xs text-slate-450 font-semibold capitalize">{s.subject}</p>
                            </div>
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 capitalize",
                              s.status === "conducted"
                                ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                                : s.status === "postponed"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-blue-50 text-blue-600 border-blue-200"
                            )}>
                              {s.status.replace("_", " ")}
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Slot Availability */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Slot Availability
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[var(--brand-green)]/30 bg-[var(--brand-light-green)]/10 text-center">
                <p className="text-xl font-bold text-[var(--brand-green)]">{availableSlots}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Available</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-center">
                <p className="text-xl font-bold text-slate-700">{filledSlots}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Filled</p>
              </div>
            </div>

            {/* Overall fill rate */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Fill Rate</span>
                <span className="text-xs font-bold text-[var(--brand-green)]">
                  {totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0}%
                </span>
              </div>
              <div className="mt-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--brand-green)] transition-all duration-700"
                  style={{ width: `${totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
