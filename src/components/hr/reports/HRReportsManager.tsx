"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState } from "react";
import {
  BarChart3,
  Users,
  Wallet,
  Clock,
  Loader2,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useGetAttendanceReport,
  useGetSalaryReport,
  useGetPerformanceReport,
  useGetTurnoverAnalytics,
} from "@/querys/admin/hrQuery";
import {
  IAttendanceSummaryEntry,
  ISalaryRecord,
  IPerformanceReportEntry,
  ITurnoverMonthEntry,
} from "@/types/admin/hr";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function pct(v: number) {
  return `${v.toFixed(1)}%`;
}

// ── Small UI pieces ───────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm p-5 flex items-start gap-4">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          accent
        )}
      >
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-850">{value}</p>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
  );
}

// ── Attendance Report Panel ───────────────────────────────────────────────────

function AttendanceReportPanel({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const { data: reportRes, isLoading } = useGetAttendanceReport({ from: dateFrom, to: dateTo });
  const data = reportRes?.data;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <SectionHeader
          title="Attendance Report"
          description="Per-employee attendance summary for the selected date range."
        />
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : !data || !data.summary || data.summary.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            No attendance records found for the selected range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader>
                <TableRow className="border-b border-slate-100">
                  {["Employee ID", "Present", "Absent", "Late", "On Leave", "Total Days", "Work Hours"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-left py-2 px-3 font-semibold text-slate-500 uppercase tracking-wider text-[10px]"
                      >
                        {h}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.summary.map((row: IAttendanceSummaryEntry, i: number) => (
                  <TableRow key={row.employeeId} className={cn("border-b border-slate-50", i % 2 === 0 ? "" : "bg-slate-50/50")}>
                    <TableCell className="py-2.5 px-3 font-mono text-slate-700 font-semibold">{row.employeeId.slice(-8)}</TableCell>
                    <TableCell className="py-2.5 px-3 text-emerald-700 font-semibold">{row.present}</TableCell>
                    <TableCell className="py-2.5 px-3 text-red-600 font-semibold">{row.absent}</TableCell>
                    <TableCell className="py-2.5 px-3 text-amber-600 font-semibold">{row.late}</TableCell>
                    <TableCell className="py-2.5 px-3 text-slate-600">{row.onLeave}</TableCell>
                    <TableCell className="py-2.5 px-3 text-slate-600">{row.totalDays}</TableCell>
                    <TableCell className="py-2.5 px-3 text-slate-600">{row.totalWorkHours.toFixed(1)}h</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Salary Report Panel ───────────────────────────────────────────────────────

function SalaryReportPanel() {
  const { data: salaryRes, isLoading } = useGetSalaryReport();
  const data = salaryRes?.data;
  const records: ISalaryRecord[] = data?.records ?? [];

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-start justify-between">
        <SectionHeader
          title="Salary Report"
          description="Monthly salary breakdown across tutors."
        />
        {data && (
          <div className="text-right">
            <p className="text-lg font-bold text-slate-800">
              {formatCurrency(data.totalAmount)}
            </p>
            <p className="text-[11px] text-slate-500">Total payroll · {data.total} records</p>
          </div>
        )}
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : records.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">No salary data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader>
                <TableRow className="border-b border-slate-100">
                  {["Tutor", "Period", "Total", "Paid", "Pending", "Status"].map((h) => (
                    <TableHead key={h} className="text-left py-2 px-3 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r: ISalaryRecord, i: number) => (
                  <TableRow key={r.id} className={cn("border-b border-slate-50", i % 2 === 0 ? "" : "bg-slate-50/50")}>
                    <TableCell className="py-2.5 px-3 font-semibold text-slate-800">{r.tutor?.name ?? "—"}</TableCell>
                    <TableCell className="py-2.5 px-3 text-slate-600">{r.month} {r.year}</TableCell>
                    <TableCell className="py-2.5 px-3 font-semibold text-slate-800">{formatCurrency(r.totalAmount)}</TableCell>
                    <TableCell className="py-2.5 px-3 text-emerald-700 font-semibold">{formatCurrency(r.paidAmount)}</TableCell>
                    <TableCell className="py-2.5 px-3 text-rose-600 font-semibold">{formatCurrency(r.pendingAmount)}</TableCell>
                    <TableCell className="py-2.5 px-3 capitalize text-slate-600">{r.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Performance Report Panel ──────────────────────────────────────────────────

function PerformanceReportPanel() {
  const { data: performanceRes, isLoading } = useGetPerformanceReport();
  const data = performanceRes?.data;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <SectionHeader
          title="Performance Report"
          description="Average score and evaluation count per employee across all review cycles."
        />
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">No performance evaluations recorded yet.</div>
        ) : (
          <div className="space-y-3">
            {data.map((entry: IPerformanceReportEntry) => (
              <div key={entry.employeeId} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3 bg-slate-50/40">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: entry.averageScore >= 4 ? "var(--brand-green)" : entry.averageScore >= 3 ? "#f59e0b" : "#ef4444" }}>
                  {entry.averageScore.toFixed(1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 font-mono">{entry.employeeId.slice(-12)}</p>
                  <p className="text-[11px] text-slate-500">{entry.evaluations} evaluation{entry.evaluations !== 1 ? "s" : ""}</p>
                </div>
                {/* Score bar */}
                <div className="w-32">
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(entry.averageScore / 5) * 100}%`,
                        background: entry.averageScore >= 4 ? "var(--brand-green)" : entry.averageScore >= 3 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Turnover Analytics Panel ──────────────────────────────────────────────────

function TurnoverPanel() {
  const { data: turnoverRes, isLoading } = useGetTurnoverAnalytics();
  const data = turnoverRes?.data;
  const maxJoining = data ? Math.max(...data.monthly.map((m: ITurnoverMonthEntry) => m.joinings), 1) : 1;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <SectionHeader
          title="Turnover Analytics"
          description="Headcount status and monthly joining/exit trends for the current year."
        />
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : !data ? (
          <div className="py-10 text-center text-sm text-slate-400">No turnover data available.</div>
        ) : (
          <div className="space-y-6">
            {/* Summary stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {[
                { label: "Active", value: data.active, color: "text-emerald-700 bg-emerald-50" },
                { label: "Resigned", value: data.resigned, color: "text-amber-700 bg-amber-50" },
                { label: "Terminated", value: data.terminated, color: "text-red-700 bg-red-50" },
                { label: "Turnover Rate", value: pct(data.turnoverRate), color: "text-sky-700 bg-sky-50" },
              ].map((s) => (
                <div key={s.label} className={cn("rounded-xl p-3 text-center", s.color)}>
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[11px] font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Monthly chart bars */}
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Monthly Joinings (Current Year)
              </p>
              <div className="flex items-end gap-1.5 h-20">
                {data.monthly.map((m: ITurnoverMonthEntry) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${Math.max((m.joinings / maxJoining) * 64, m.joinings > 0 ? 6 : 2)}px`,
                        background: "var(--brand-green)",
                        opacity: m.joinings > 0 ? 1 : 0.2,
                      }}
                    />
                    <span className="text-[9px] text-slate-400 font-medium">
                      {m.month.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function HRReportsManager() {
  const today = format(new Date(), "yyyy-MM-dd");
  const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");

  const [dateFrom, setDateFrom] = useState(monthStart);
  const [dateTo, setDateTo] = useState(today);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="HR Analytics & Reports"
        description="Centralized view of attendance summaries, payroll data, performance scores, and workforce turnover metrics."
      />

      {/* Top KPI row — quick summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Reports Available"
          value={4}
          sub="Live from backend"
          icon={BarChart3}
          accent="bg-slate-100 text-slate-600"
        />
        <KpiCard
          label="Salary Report"
          value="Payroll"
          sub="Active employees"
          icon={Wallet}
          accent="bg-emerald-100 text-emerald-600"
        />
        <KpiCard
          label="Performance"
          value="Evaluations"
          sub="Tutor assessments"
          icon={TrendingUp}
          accent="bg-sky-100 text-sky-600"
        />
        <KpiCard
          label="Turnover"
          value="Analytics"
          sub="Headcount + trends"
          icon={Users}
          accent="bg-violet-100 text-violet-600"
        />
      </div>

      {/* Date range filter for attendance */}
      <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-600">Attendance Date Range:</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-500">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-500">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </Card>

      {/* Report panels */}
      <div key={refreshKey} className="space-y-6">
        <AttendanceReportPanel dateFrom={dateFrom} dateTo={dateTo} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SalaryReportPanel />
          <PerformanceReportPanel />
        </div>

        <TurnoverPanel />
      </div>
    </div>
  );
}
