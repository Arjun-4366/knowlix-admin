"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users, BookOpen, Clock, DollarSign, BarChart3,
  FileText, MessageSquare, Calendar, CheckCircle2,
  AlertCircle, ChevronRight, Star,
} from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGetTutorDashboard, useGetTutorSalary } from "@/querys/tutor/dashboardQuery";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const SESSION_STATUS_STYLES: Record<string, string> = {
  conducted:    "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
  completed:    "bg-slate-100 text-slate-600 border-slate-200",
  not_conducted:"bg-red-50 text-red-600 border-red-200",
  scheduled:    "bg-blue-50 text-blue-600 border-blue-200",
};

const SALARY_STATUS_STYLES: Record<string, string> = {
  paid:    "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
  partial: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-red-50 text-red-700 border-red-200",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TutorDashboard() {
  const router = useRouter();
  const [sessionPeriod, setSessionPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [kpiPeriod,     setKpiPeriod]     = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [showSalary,    setShowSalary]    = useState(false);

  const { data: sessionData, isLoading: isSessionLoading } = useGetTutorDashboard({ period: sessionPeriod });
  const { data: kpiData,     isLoading: isKpiLoading     } = useGetTutorDashboard({ period: kpiPeriod });
  const { data: salaryData } = useGetTutorSalary();

  if (isSessionLoading || isKpiLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalSlots    = kpiData?.slots?.total    || 0;
  const filledSlots   = kpiData?.slots?.filled   || 0;
  const availableSlots= kpiData?.slots?.available|| 0;

  const todaySchedule    = kpiData?.schedule?.today    || [];
  const tomorrowSchedule = kpiData?.schedule?.tomorrow || [];

  const salaryList   = salaryData || [];
  const latestSalary = salaryList[0] ?? null;

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

        {/* ── Earnings / Salary Toggle Card ── */}
        <div className="w-full bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-light)]" />

          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--brand-light-green)]">
              <DollarSign className="w-6 h-6 text-[var(--brand-green)]" />
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full border capitalize",
                showSalary
                  ? (SALARY_STATUS_STYLES[latestSalary?.status || "pending"] ?? SALARY_STATUS_STYLES.pending)
                  : "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
              )}>
                {showSalary ? (latestSalary?.status || "—") : (sessionData?.totalEarnings?.currency || "INR")}
              </span>
              <button
                onClick={() => setShowSalary((s) => !s)}
                title={showSalary ? "Switch to Earnings" : "Switch to Salary"}
                className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ChevronRight className={cn("w-4 h-4 text-slate-600 transition-transform duration-200", showSalary && "rotate-180")} />
              </button>
            </div>
          </div>

          {!showSalary ? (
            <div>
              <p className="text-3xl font-bold font-heading text-slate-800">
                {formatCurrency(sessionData?.totalEarnings?.received || 0, sessionData?.totalEarnings?.currency)}
              </p>
              <p className="text-sm font-semibold text-slate-650 mt-1">
                Earnings ({sessionPeriod.charAt(0).toUpperCase() + sessionPeriod.slice(1)})
              </p>
              <p className="text-xs mt-3 text-slate-600 font-semibold">
                Pending: {formatCurrency(sessionData?.totalEarnings?.pending || 0, sessionData?.totalEarnings?.currency)}
              </p>
            </div>
          ) : (
            <div>
              {latestSalary ? (
                <>
                  <p className="text-3xl font-bold font-heading text-slate-800">
                    {formatCurrency(latestSalary.totalAmount)}
                  </p>
                  <p className="text-sm font-semibold text-slate-650 mt-1">
                    {latestSalary.month} {latestSalary.year}
                  </p>
                  <p className="text-xs mt-3 text-[var(--brand-green)] font-semibold flex items-center gap-1">
                    {salaryList.length} month{salaryList.length !== 1 ? "s" : ""} · see breakdown below
                    <ChevronRight className="w-3 h-3 rotate-90" />
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold font-heading text-slate-600">—</p>
                  <p className="text-sm font-semibold text-slate-650 mt-1">Salary</p>
                  <p className="text-xs mt-3 text-slate-600 font-semibold">No salary records found</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Salary Breakdown Table (slides in when showSalary is on) ── */}
      {showSalary && salaryList.length > 0 && (
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Salary Breakdown
              </CardTitle>
              <span className="ml-auto text-xs font-semibold text-slate-600">{salaryList.length} record{salaryList.length !== 1 ? "s" : ""}</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[14%]">Sl no.</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[14%]">Month</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[8%]">Year</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[15%]">Total</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[15%]">Paid</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[15%]">Pending</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[12%]">Status</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[14%]">Payment Date</TableHead>
                  <TableHead className="px-6 py-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[20%]">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {salaryList.map((s, index) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="px-6 py-4 text-sm font-bold text-slate-800">{index + 1}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-bold text-slate-800">{s.month}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-semibold text-slate-600">{s.year}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-bold text-slate-800">{formatCurrency(s.totalAmount)}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-semibold text-[var(--brand-mid)]">{formatCurrency(s.paidAmount)}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-semibold text-red-600">{formatCurrency(s.pendingAmount)}</TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize",
                        SALARY_STATUS_STYLES[s.status] ?? "bg-slate-100 text-slate-600 border-slate-200"
                      )}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs font-semibold text-slate-600">
                      {s.paymentDate
                        ? new Date(s.paymentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-xs text-slate-600 truncate">
                      {s.remarks || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── Period Filter Tabs ── */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filter Period:</span>
        <Tabs value={sessionPeriod} onValueChange={(v) => setSessionPeriod(v as typeof sessionPeriod)}>
          <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
            {(["weekly", "monthly", "yearly"] as const).map((p) => (
              <TabsTrigger key={p} value={p}
                className="rounded-lg text-xs px-3 py-1.5 capitalize data-[state=active]:shadow-none data-[state=active]:text-white">
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          {["weekly", "monthly", "yearly"].map((p) => <TabsContent key={p} value={p} />)}
        </Tabs>
      </div>

      {/* ── KPI Performance ── */}
      <Card className="bg-white border-slate-150 shadow-sm">
        <CardHeader className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">KPI Performance</CardTitle>
            </div>
            <Tabs value={kpiPeriod} onValueChange={(v) => setKpiPeriod(v as typeof kpiPeriod)}>
              <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
                {(["weekly", "monthly", "yearly"] as const).map((p) => (
                  <TabsTrigger key={p} value={p}
                    className="rounded-lg text-xs px-3 py-1.5 capitalize data-[state=active]:shadow-none data-[state=active]:text-white">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {["weekly", "monthly", "yearly"].map((p) => <TabsContent key={p} value={p} />)}
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <Star className="w-4 h-4 fill-[var(--brand-green)] text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpiData?.kpiPerformance?.growthPoints || 0}</p>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5">Growth Points</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{Math.round(kpiData?.kpiPerformance?.attendanceRate || 0)}%</p>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5">Attendance Rate</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <FileText className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpiData?.exams?.conducted || 0}</p>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5">Exams Conducted</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <AlertCircle className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpiData?.exams?.pending || 0}</p>
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mt-0.5">Exams Pending</p>
            </div>

          </div>

      

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">GROWTH Points Breakdown</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {letters.map((letter) => (
                <div key={letter} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-center">
                  <span className="text-sm font-black text-[var(--brand-green)]">{letter}</span>
                  <p className="text-lg font-bold text-slate-700 mt-1">{kpiData?.kpiPerformance?.growthBreakdown?.[letter] || 0}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Schedule + Slot Availability ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-150 shadow-sm h-full">
            <CardHeader className="p-6 pb-0 border-b border-slate-100">
              <div className="flex items-center gap-2 pb-4">
                <MessageSquare className="w-5 h-5 text-[var(--brand-green)]" />
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">Class Schedule</CardTitle>
              </div>
              <Tabs defaultValue="today">
                <TabsList className="mb-0 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
                  <TabsTrigger value="today"    className="rounded-lg text-xs px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow" className="rounded-lg text-xs px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white">Tomorrow</TabsTrigger>
                </TabsList>

                {(["today", "tomorrow"] as const).map((day) => {
                  const schedule = day === "today" ? todaySchedule : tomorrowSchedule;
                  return (
                    <TabsContent key={day} value={day} className="mt-0 pt-4 pb-2">
                      <div className="space-y-2">
                        {schedule.length === 0 ? (
                          <p className="text-xs text-gray-500 py-4 text-center">
                            No sessions scheduled for {day}.
                          </p>
                        ) : (
                          schedule.map((s, i) => {
                            const time = new Date(s.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            const statusStyle = SESSION_STATUS_STYLES[s.status] ?? SESSION_STATUS_STYLES.scheduled;
                            return (
                              <div key={s.id || i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <div className="w-16 text-center flex-shrink-0">
                                  <p className={cn("text-xs font-bold", day === "today" ? "text-[var(--brand-green)]" : "text-slate-600")}>{time}</p>
                                  <p className="text-[10px] text-slate-600">{s.durationMinutes} min</p>
                                </div>
                                <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-slate-800 truncate">{s.title}</p>
                                  <p className="text-xs text-slate-600 font-semibold capitalize">{s.subject}</p>
                                </div>
                                <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 capitalize", statusStyle)}>
                                  {s.status.replace("_", " ")}
                                </Badge>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Slot Availability */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">Slot Availability</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[var(--brand-green)]/30 bg-[var(--brand-light-green)]/10 text-center">
                <p className="text-xl font-bold text-[var(--brand-green)]">{availableSlots}</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">Available</p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-center">
                <p className="text-xl font-bold text-slate-700">{filledSlots}</p>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">Filled</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-600">Fill Rate</span>
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
