"use client";

import { useState } from "react";
import { Check, CheckCheck, ChevronLeft, ChevronRight, Clock3, Loader2, Search, X, XCircle } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  // bulk
  onBulkApprove?: (from: string, to: string, remarks: string) => void;
  isBulkSubmitting?: boolean;
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
  onBulkApprove,
  isBulkSubmitting = false,
}: DailyAttendanceTrackerProps) {
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFrom, setBulkFrom] = useState("");
  const [bulkTo, setBulkTo] = useState("");
  const [bulkRemarks, setBulkRemarks] = useState("");

  const totalPages   = Math.max(1, Math.ceil(total / limit));
  const pendingCount  = records.filter((r) => r.status === "Pending").length;
  const approvedCount = records.filter((r) => r.status === "Approved" || r.status === "Present").length;

  const hasFilters = search || tutorId || from || to;
  const selectedTutor = tutors.find((t) => t.id === tutorId);

  const openBulkModal = () => {
    setBulkFrom(from);
    setBulkTo(to);
    setBulkRemarks("");
    setShowBulkModal(true);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBulkApprove?.(bulkFrom, bulkTo, bulkRemarks.trim());
  };

  return (
    <>
      <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-850">Attendance Records</h2>
              <p className="text-xs text-slate-600 mt-1">
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
              {tutorId && onBulkApprove && (
                <Button
                  onClick={openBulkModal}
                  className="h-7 px-3 text-[10px] font-bold bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  Bulk Approve
                </Button>
              )}
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-600"
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
            <DatePicker
              value={from}
              onChange={onFromChange}
              placeholder="From date"
              className="w-[155px]"
            />

            <span className="text-[10px] font-semibold text-slate-600">to</span>

            {/* To date */}
            <DatePicker
              value={to}
              onChange={onToChange}
              placeholder="To date"
              className="w-[155px]"
            />

            {/* Clear all filters */}
            {hasFilters && (
              <button
                onClick={() => { onSearchChange(""); onTutorIdChange(""); onFromChange(""); onToChange(""); }}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-slate-600 transition-colors"
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
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">Tutor</TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">Date</TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">Hours</TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">Status</TableHead>
                {pendingCount > 0 && (
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 text-right">Actions</TableHead>
                )}
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
                          <p className="text-[10px] text-slate-600">{record.employeeEmail}</p>
                        )}
                        {record.notes && (
                          <p className="text-[10px] text-slate-600 italic">{record.notes}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-slate-600">
                      {record.date || "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Clock3 className="w-3.5 h-3.5 text-slate-600" />
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
                    {pendingCount > 0 && (
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
                        ) : null}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-slate-100 hover:bg-white">
                  <TableCell colSpan={pendingCount > 0 ? 5 : 4} className="px-4 py-16 text-center text-sm text-slate-600">
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
            <p className="text-[11px] text-slate-600 font-medium">
              Showing {records.length === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} records
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="h-7 w-7 rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
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
                className="h-7 w-7 rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Bulk Approve Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-150 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-[var(--brand-green)]" />
                <h3 className="text-sm font-bold text-slate-800">Bulk Approve Attendance</h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                disabled={isBulkSubmitting}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="p-6 space-y-4">
              {/* Tutor info */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Tutor</p>
                <p className="text-sm font-bold text-slate-800">{selectedTutor?.name ?? tutorId}</p>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">From</Label>
                  <DatePicker value={bulkFrom} onChange={setBulkFrom} placeholder="Start date" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">To</Label>
                  <DatePicker value={bulkTo} onChange={setBulkTo} placeholder="End date" />
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Remarks</Label>
                <Textarea
                  value={bulkRemarks}
                  onChange={(e) => setBulkRemarks(e.target.value)}
                  placeholder="e.g. Weekly attendance approved"
                  className="min-h-[72px] max-h-28 bg-white border-slate-200 rounded-xl text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBulkModal(false)}
                  disabled={isBulkSubmitting}
                  className="flex-1 h-10 border-slate-200 rounded-xl font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isBulkSubmitting}
                  className="flex-1 h-10 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isBulkSubmitting
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <CheckCheck className="w-4 h-4" />}
                  {isBulkSubmitting ? "Approving..." : "Approve All"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
