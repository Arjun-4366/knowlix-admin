"use client";

import { Calendar1, Check, ChevronLeft, ChevronRight, Clock3, Loader2, Search, X, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AttendanceStatus, EnrichedAttendanceRecord } from "./types";

interface TutorOption {
  id: string;
  name: string;
}

interface DailyAttendanceTrackerProps {
  records: EnrichedAttendanceRecord[];
  isLoading?: boolean;
  // filters
  search: string;
  onSearchChange: (v: string) => void;
  tutorId: string;
  onTutorIdChange: (v: string) => void;
  tutors: TutorOption[];
  from: string;
  onFromChange: (v: string) => void;
  to: string;
  onToChange: (v: string) => void;
  // pagination
  page: number;
  limit: number;
  total: number;
  onPageChange: (p: number) => void;
  // actions
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const statusClassMap: Record<AttendanceStatus, string> = {
  Pending:    "bg-amber-50 text-amber-700 border-amber-200",
  Approved:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected:   "bg-rose-50 text-rose-600 border-rose-200",
  Present:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Late:       "bg-orange-50 text-orange-700 border-orange-200",
  Remote:     "bg-sky-50 text-sky-700 border-sky-200",
  "On Leave": "bg-violet-50 text-violet-700 border-violet-200",
  Absent:     "bg-rose-50 text-rose-600 border-rose-200",
};

function renderTime(value?: string) {
  return value || "--";
}

export default function DailyAttendanceTracker({
  records,
  isLoading = false,
  search,
  onSearchChange,
  tutorId,
  onTutorIdChange,
  tutors,
  from,
  onFromChange,
  to,
  onToChange,
  page,
  limit,
  total,
  onPageChange,
  onApprove,
  onReject,
}: DailyAttendanceTrackerProps) {
  const totalPages   = Math.max(1, Math.ceil(total / limit));
  const pendingCount  = records.filter((r) => r.status === "Pending").length;
  const approvedCount = records.filter((r) => r.status === "Approved" || r.status === "Present").length;

  const hasFilters = search || tutorId || from || to;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-850">Attendance Records</h2>
            <p className="text-xs text-slate-500 mt-1">
              Review and approve tutor attendance. Filter by name, email, or date range.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full bg-slate-50 text-slate-600 border-slate-200 text-[10px] px-2.5 py-1">
              {total} total
            </Badge>
            <Badge variant="outline" className="rounded-full bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-2.5 py-1">
              {pendingCount} pending
            </Badge>
            <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-2.5 py-1">
              {approvedCount} approved
            </Badge>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 pl-8 pr-3 bg-slate-50 border-slate-200 rounded-xl text-xs"
            />
            {search && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tutor filter */}
          <Select
            value={tutorId || "all"}
            onValueChange={(v) => onTutorIdChange(v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 w-[180px] bg-slate-50 border-slate-200 rounded-xl text-xs font-medium">
              <SelectValue placeholder="All tutors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All tutors</SelectItem>
              {tutors.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* From date */}
          <div className="relative">
            <Calendar1 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="date"
              value={from}
              onChange={(e) => onFromChange(e.target.value)}
              className="h-9 pl-8 w-[155px] bg-slate-50 border-slate-200 rounded-xl text-xs font-medium"
              title="From date"
            />
          </div>

          <span className="text-[10px] font-semibold text-slate-400">to</span>

          {/* To date */}
          <div className="relative">
            <Calendar1 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="date"
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              className="h-9 pl-8 w-[155px] bg-slate-50 border-slate-200 rounded-xl text-xs font-medium"
              title="To date"
            />
          </div>

          {/* Clear all filters */}
          {hasFilters && (
            <button
              onClick={() => { onSearchChange(""); onTutorIdChange(""); onFromChange(""); onToChange(""); }}
              className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="p-2 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-xl">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--brand-green)]" />
          </div>
        )}
        <Table>
          <TableHeader className="bg-slate-50/70">
            <TableRow className="border-slate-100 hover:bg-slate-50/70">
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Tutor</TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Date</TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Check In</TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Check Out</TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Hours</TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id} className="border-slate-100 hover:bg-slate-50/60">
                  <TableCell className="px-4 py-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">{record.employeeName}</p>
                      {record.employeeEmail && (
                        <p className="text-[10px] text-slate-400">{record.employeeEmail}</p>
                      )}
                      {record.notes && (
                        <p className="text-[10px] text-slate-500 italic">{record.notes}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-slate-600">
                    {record.date || "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                    {renderTime(record.checkIn)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                    {renderTime(record.checkOut)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                      {record.hoursWorked > 0 ? `${record.hoursWorked.toFixed(1)}h` : "--"}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full border text-[10px] font-bold px-2 py-1 capitalize",
                        statusClassMap[record.status]
                      )}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    {record.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="icon-sm"
                          onClick={() => onApprove(record.id)}
                          className="h-7 w-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-none cursor-pointer"
                          title="Approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => onReject(record.id)}
                          className="h-7 w-7 rounded-lg border-rose-200 text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Reject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-100 hover:bg-white">
                <TableCell colSpan={7} className="px-4 py-16 text-center text-sm text-slate-400">
                  {hasFilters ? "No records match your filters." : "No attendance records found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/30">
          <p className="text-[11px] text-slate-500 font-medium">
            Showing {records.length === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} records
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="text-[11px] font-semibold text-slate-600 px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
