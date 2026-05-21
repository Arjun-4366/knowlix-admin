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

// ─── Mock Data ──────────────────────────────────────────────────────────────

const myStudents = [
  { id: "STU-101", name: "Rahul Sharma", grade: "Grade 10", course: "Mathematics / OS", status: "Approved", nextSession: "Today 4:00 PM" },
  { id: "STU-103", name: "Kabir Malhotra", grade: "Grade 8", course: "English / OS", status: "Approved", nextSession: "Today 6:00 PM" },
  { id: "STU-106", name: "Meera Joshi", grade: "Grade 10", course: "Physics / OS", status: "Approved", nextSession: "Tomorrow 5:00 PM" },
  { id: "STU-102", name: "Sneha Reddy", grade: "Grade 12", course: "Science / OT", status: "In Review", nextSession: "Tomorrow 3:00 PM" },
];

const sessionData = {
  weekly:  { total: 14, completed: 11, pending: 3, hours: 21 },
  monthly: { total: 58, completed: 50, pending: 8, hours: 87 },
  yearly:  { total: 642, completed: 610, pending: 32, hours: 963 },
};

const earningsData = {
  weekly:  { total: "₹8,400", sessions: 14, perSession: "₹600" },
  monthly: { total: "₹34,800", sessions: 58, perSession: "₹600" },
  yearly:  { total: "₹3,85,200", sessions: 642, perSession: "₹600" },
};

const kpiData = {
  weekly: {
    avgRating: 4.8, studentProgress: 82, attendanceRate: 93,
    notesUploaded: 5, examsGiven: 2, examsPending: 1,
  },
  monthly: {
    avgRating: 4.7, studentProgress: 78, attendanceRate: 91,
    notesUploaded: 18, examsGiven: 9, examsPending: 2,
  },
  yearly: {
    avgRating: 4.6, studentProgress: 75, attendanceRate: 89,
    notesUploaded: 204, examsGiven: 108, examsPending: 4,
  },
};

const todaySchedule = [
  { time: "3:00 PM", student: "Rahul Sharma", subject: "Mathematics", duration: "60 min", status: "upcoming" },
  { time: "4:30 PM", student: "Meera Joshi", subject: "Physics", duration: "60 min", status: "upcoming" },
  { time: "6:00 PM", student: "Kabir Malhotra", subject: "English", duration: "45 min", status: "upcoming" },
];

const tomorrowSchedule = [
  { time: "3:00 PM", student: "Sneha Reddy", subject: "Science", duration: "60 min", status: "scheduled" },
  { time: "5:00 PM", student: "Meera Joshi", subject: "Physics", duration: "60 min", status: "scheduled" },
];

const slotAvailability = [
  { day: "Mon", slots: 4, filled: 3 },
  { day: "Tue", slots: 4, filled: 4 },
  { day: "Wed", slots: 3, filled: 2 },
  { day: "Thu", slots: 4, filled: 3 },
  { day: "Fri", slots: 4, filled: 4 },
  { day: "Sat", slots: 5, filled: 2 },
  { day: "Sun", slots: 2, filled: 0 },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function TutorDashboard() {
  const router = useRouter();
  const [sessionPeriod, setSessionPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");
  const [kpiPeriod, setKpiPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");

  const sessions = sessionData[sessionPeriod];
  const earnings = earningsData[sessionPeriod];
  const kpi = kpiData[kpiPeriod];

  const totalSlots = slotAvailability.reduce((a, d) => a + d.slots, 0);
  const filledSlots = slotAvailability.reduce((a, d) => a + d.filled, 0);
  const availableSlots = totalSlots - filledSlots;

  return (
    <div className="space-y-8 pb-10">

      {/* ── Top Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard
          label="Total Students"
          value={myStudents.length}
          icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="Assigned"
          badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
          gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
          iconBgClass="bg-[var(--brand-light-green)]"
          footerText="View complete student list"
          footerLink
          footerClassName="text-[var(--brand-green)] font-semibold"
          onClick={() => router.push("/tutor/students")}
        />
        <DashboardStatCard
          label="Total Assignments"
          value={myStudents.length * 3}
          icon={<BookOpen className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="Active"
          badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
          gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
          iconBgClass="bg-[var(--brand-light-green)]"
          footerText="Across all students"
          footerClassName="text-slate-400"
        />
        <DashboardStatCard
          label={`Sessions (${sessionPeriod.charAt(0).toUpperCase() + sessionPeriod.slice(1)})`}
          value={sessions.total}
          icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText={`${sessions.hours}h`}
          badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
          gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
          iconBgClass="bg-[var(--brand-light-green)]"
          footerText={`${sessions.completed} completed · ${sessions.pending} pending`}
          footerClassName="text-slate-400"
        />
        <DashboardStatCard
          label={`Earnings (${sessionPeriod.charAt(0).toUpperCase() + sessionPeriod.slice(1)})`}
          value={earnings.total}
          icon={<DollarSign className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText={earnings.perSession}
          badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
          gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
          iconBgClass="bg-[var(--brand-light-green)]"
          footerText={`${earnings.sessions} sessions · ${earnings.perSession} / session`}
          footerClassName="text-slate-400"
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
            {/* Avg Rating */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-[var(--brand-green)] text-[var(--brand-green)]" />
              </div>
              <p className="text-2xl font-bold text-slate-800">{kpi.avgRating}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Avg Rating</p>
            </div>

            {/* Student Progress */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <TrendingUp className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpi.studentProgress}%</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Student Progress</p>
            </div>

            {/* Attendance */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <CheckCircle2 className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpi.attendanceRate}%</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Attendance Rate</p>
            </div>

            {/* Exams Conducted */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <FileText className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpi.examsGiven}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Exams Conducted</p>
            </div>

            {/* Exams Pending */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 text-center">
              <AlertCircle className="w-4 h-4 text-[var(--brand-green)] mx-auto mb-1" />
              <p className="text-2xl font-bold text-slate-800">{kpi.examsPending}</p>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Exams Pending</p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="mt-6 space-y-3">
            {[
              { label: "Student Progress", value: kpi.studentProgress },
              { label: "Attendance Rate", value: kpi.attendanceRate },
              { label: "Notes Uploaded", value: Math.min(100, Math.round((kpi.notesUploaded / 25) * 100)) },
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
                    {todaySchedule.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <div className="w-14 text-center flex-shrink-0">
                          <p className="text-xs font-bold text-[var(--brand-green)]">{s.time}</p>
                          <p className="text-[10px] text-slate-400">{s.duration}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{s.student}</p>
                          <p className="text-xs text-slate-450 font-semibold">{s.subject}</p>
                        </div>
                        <Badge variant="outline" className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          Upcoming
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="tomorrow" className="mt-0 pt-4 pb-2">
                  <div className="space-y-2">
                    {tomorrowSchedule.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <div className="w-14 text-center flex-shrink-0">
                          <p className="text-xs font-bold text-slate-500">{s.time}</p>
                          <p className="text-[10px] text-slate-400">{s.duration}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{s.student}</p>
                          <p className="text-xs text-slate-450 font-semibold">{s.subject}</p>
                        </div>
                        <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          Scheduled
                        </Badge>
                      </div>
                    ))}
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

            {/* Per-day breakdown */}
            <div className="space-y-2">
              {slotAvailability.map((day) => {
                const fillPct = day.slots > 0 ? Math.round((day.filled / day.slots) * 100) : 0;
                return (
                  <div key={day.day} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-500 w-7">{day.day}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          fillPct === 100
                            ? "bg-slate-400"
                            : "bg-[var(--brand-green)]"
                        )}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 w-10 text-right">
                      {day.filled}/{day.slots}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Overall fill rate */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">Fill Rate</span>
                <span className="text-xs font-bold text-[var(--brand-green)]">
                  {Math.round((filledSlots / totalSlots) * 100)}%
                </span>
              </div>
              <div className="mt-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--brand-green)] transition-all duration-700"
                  style={{ width: `${Math.round((filledSlots / totalSlots) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── My Students Quick View ── */}
      <Card className="bg-white border-slate-150 shadow-sm">
        <CardHeader className="p-6 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                My Students
              </CardTitle>
            </div>
            <button
              onClick={() => router.push("/tutor/students")}
              className="flex items-center gap-1 text-xs font-bold text-[var(--brand-green)] hover:underline"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {myStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-sm flex-shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{student.name}</p>
                  <p className="text-xs text-slate-450 font-semibold">{student.course} · {student.grade}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-slate-400 font-semibold">Next Session</p>
                  <p className="text-xs font-bold text-slate-700">{student.nextSession}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                    student.status === "Approved"
                      ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  )}
                >
                  {student.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
