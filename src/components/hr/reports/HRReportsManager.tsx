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
  Clock,
  Loader2,
  RefreshCcw,
  UserCheck,
  UserX,
} from "lucide-react";
import { format } from "date-fns";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useGetHRTutorAttendance,
  useGetTurnoverAnalytics,
} from "@/querys/admin/hrQuery";
import {
  IHRAttendanceRecord,
  ITurnoverMonthEntry,
} from "@/types/admin/hr";

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
          accent,
        )}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-850">{value}</p>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
      <p className="text-xs text-slate-600 mt-0.5">{description}</p>
    </div>
  );
}

// ── Status badge helper ───────────────────────────────────────────────────────

const STATUS_CLASS: Record<string, string> = {
  approved:        "bg-emerald-50 text-emerald-700 border-emerald-200",
  present:         "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending_approval:"bg-amber-50 text-amber-700 border-amber-200",
  rejected:        "bg-red-50 text-red-700 border-red-200",
  absent:          "bg-red-50 text-red-700 border-red-200",
  late:            "bg-orange-50 text-orange-700 border-orange-200",
  half_day:        "bg-violet-50 text-violet-700 border-violet-200",
  on_leave:        "bg-slate-50 text-slate-600 border-slate-200",
};

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Attendance Report Panel ───────────────────────────────────────────────────

function AttendanceReportPanel({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const { data: attendanceRes, isLoading } = useGetHRTutorAttendance({
    from: dateFrom || undefined,
    to: dateTo || undefined,
    limit: 100,
  });

  const records: IHRAttendanceRecord[] = (attendanceRes?.data ?? []) as IHRAttendanceRecord[];
  const total = attendanceRes?.total ?? 0;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-start justify-between">
        <SectionHeader
          title="Attendance Report"
          description="Tutor attendance records for the selected date range."
        />
        {total > 0 && (
          <p className="text-[11px] text-slate-600 font-medium mt-0.5">{total} records</p>
        )}
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
          </div>
        ) : records.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-600">
            No attendance records found for the selected range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader>
                <TableRow className="border-b border-slate-100">
                  {["Tutor", "Date", "Status", "Work Hours", "Remarks"].map((h) => (
                    <TableHead
                      key={h}
                      className="text-left py-2 px-3 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r, i) => (
                  <TableRow
                    key={r.id}
                    className={cn("border-b border-slate-50", i % 2 !== 0 && "bg-slate-50/50")}>
                    <TableCell className="py-2.5 px-3">
                      <p className="font-semibold text-slate-800">
                        {r.tutor?.name || (
                          <span className="font-mono text-slate-500 text-[10px]">…{r.tutorId.slice(-8)}</span>
                        )}
                      </p>
                      {r.tutor?.email && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{r.tutor.email}</p>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-slate-600">
                      {r.date ? format(new Date(r.date), "dd MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="py-2.5 px-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold capitalize",
                          STATUS_CLASS[r.status] ?? "bg-slate-50 text-slate-600 border-slate-200",
                        )}>
                        {statusLabel(r.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-slate-600">
                      {r.workHours != null ? `${r.workHours}h` : "—"}
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-slate-600 max-w-[180px] truncate" title={r.remarks}>
                      {r.remarks || "—"}
                    </TableCell>
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

// ── Turnover Analytics Panel ──────────────────────────────────────────────────

function TurnoverPanel() {
  const { data: turnoverRes, isLoading } = useGetTurnoverAnalytics();
  const data = turnoverRes?.data;
  const maxJoining = data
    ? Math.max(...data.monthly.map((m: ITurnoverMonthEntry) => m.joinings), 1)
    : 1;

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
            <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
          </div>
        ) : !data ? (
          <div className="py-10 text-center text-sm text-slate-600">No turnover data available.</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
              {[
                { label: "Active", value: data.active, color: "text-emerald-700 bg-emerald-50" },
                { label: "Inactive", value: data.inactive, color: "text-slate-600 bg-slate-100" },
                { label: "Pending", value: data.pending, color: "text-amber-700 bg-amber-50" },
                { label: "Resigned", value: data.resigned, color: "text-red-700 bg-red-50" },
                { label: "Turnover Rate", value: `${data.turnoverRate.toFixed(1)}%`, color: "text-sky-700 bg-sky-50" },
              ].map((s) => (
                <div key={s.label} className={cn("rounded-xl p-3 text-center", s.color)}>
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[11px] font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
                Monthly Joinings &amp; Exits (Current Year)
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
                    <span className="text-[9px] text-slate-600 font-medium">{m.month.slice(5)}</span>
                  </div>
                ))}
              </div>
            </div>

            {data.tutors?.active?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Active Tutors ({data.tutors.active.length})
                </p>
                <div className="space-y-2">
                  {data.tutors.active.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 bg-slate-50/40">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{t.name}</p>
                        <p className="text-[10px] text-slate-600 truncate">{t.email}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tutors?.inactive?.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  Inactive Tutors ({data.tutors.inactive.length})
                </p>
                <div className="space-y-2">
                  {data.tutors.inactive.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-2.5 bg-slate-50/40">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <UserX className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{t.name}</p>
                        <p className="text-[10px] text-slate-600 truncate">{t.email}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200">
                        Inactive
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function HRReportsManager() {
  const today = format(new Date(), "yyyy-MM-dd");
  const monthStart = format(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    "yyyy-MM-dd",
  );

  const [dateFrom, setDateFrom] = useState(monthStart);
  const [dateTo, setDateTo] = useState(today);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="HR Analytics & Reports"
        description="Centralized view of attendance summaries and workforce turnover metrics."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          label="Attendance Report"
          value="By Date Range"
          sub="Records with date filter"
          icon={BarChart3}
          accent="bg-slate-100 text-slate-600"
        />
        <KpiCard
          label="Turnover Analytics"
          value="Headcount"
          sub="Monthly joining/exit trends"
          icon={Users}
          accent="bg-violet-100 text-violet-600"
        />
      </div>

      {/* Date range filter */}
      <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-semibold text-slate-600">Attendance Date Range:</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-600">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-600">To</label>
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
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
            <RefreshCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </Card>

      <div key={refreshKey} className="space-y-6">
        <AttendanceReportPanel dateFrom={dateFrom} dateTo={dateTo} />
        <TurnoverPanel />
      </div>
    </div>
  );
}
