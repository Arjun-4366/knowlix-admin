"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetSalaryReport, useGetTutorsHR } from "@/querys/admin/hrQuery";
import { ISalaryRecord } from "@/types/admin/hr";
import { formatCurrency } from "./utils";

const PayrollOverview = dynamic(() => import("./PayrollOverview"), { ssr: false });

const PAGE_LIMIT = 20;

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const statusClass = (status: string) => {
  if (status === "paid")    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "partial") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-600 border-rose-200"; // unpaid / other
};

export default function PayrollManager() {
  const [page, setPage]       = useState(1);
  const [tutorId, setTutorId] = useState("");
  const [month, setMonth]     = useState("");
  const [year, setYear]       = useState("");
  const [status, setStatus]   = useState("");

  useEffect(() => { setPage(1); }, [tutorId, month, year, status]);

  const queryParams = {
    page,
    limit:   PAGE_LIMIT,
    tutorId: tutorId || undefined,
    month:   month || undefined,
    year:    year ? Number(year) : undefined,
    status:  (status || undefined) as "paid" | "partial" | "pending" | undefined,
  };

  const { data: salaryRes, isLoading } = useGetSalaryReport(queryParams);
  const { data: tutorsRes }            = useGetTutorsHR({ limit: 200 });

  const reportData = salaryRes?.data;
  const records: ISalaryRecord[] = reportData?.records ?? [];
  const total      = reportData?.total ?? 0;
  const totalPages = reportData?.totalPages ?? 1;
  const tutors     = (tutorsRes?.data ?? []).map((t) => ({ id: t.id, name: t.name }));

  const hasFilters = tutorId || month || year || status;
 
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => String(currentYear - i));

  return (
    <div className="space-y-6 pb-10 w-full">
      <DashboardHeader
        title="Payroll"
        description="Salary disbursement records for tutors. Filter by tutor, month, or year."
      />

      <PayrollOverview
        totalAmount={reportData?.totalAmount ?? 0}
        totalPaid={reportData?.totalPaid ?? 0}
        totalPending={reportData?.totalPending ?? 0}
        totalRecords={total}
      />

      <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center gap-2">
          {/* Tutor */}
          <Select value={tutorId || "all"} onValueChange={(v) => setTutorId(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 w-[175px] bg-slate-50 border-slate-200 rounded-xl text-xs">
              <SelectValue placeholder="All tutors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All tutors</SelectItem>
              {tutors.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month */}
          <Select value={month || "all"} onValueChange={(v) => setMonth(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 w-[135px] bg-slate-50 border-slate-200 rounded-xl text-xs">
              <SelectValue placeholder="All months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All months</SelectItem>
              {MONTHS.map((m) => (
                <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year */}
          <Select value={year || "all"} onValueChange={(v) => setYear(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 w-[105px] bg-slate-50 border-slate-200 rounded-xl text-xs">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All years</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
            <SelectTrigger className="h-9 w-[120px] bg-slate-50 border-slate-200 rounded-xl text-xs">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All status</SelectItem>
              <SelectItem value="paid" className="text-xs">Paid</SelectItem>
              <SelectItem value="partial" className="text-xs">Partial</SelectItem>
              <SelectItem value="pending" className="text-xs">Pending</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <button
              onClick={() => { setTutorId(""); setMonth(""); setYear(""); setStatus(""); }}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--brand-green)]" />
            </div>
          )}
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow className="border-slate-100 hover:bg-slate-50/70">
                <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Tutor</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Period</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Paid</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Pending</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Payment Date</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {records.length > 0 ? (
                records.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="px-5 py-4">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{r.tutor?.name ?? "Unknown Tutor"}</p>
                        {r.tutor?.email && <p className="text-[10px] text-slate-400 mt-0.5">{r.tutor.email}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-xs font-semibold text-slate-700">
                      {r.month} {r.year}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-xs font-bold text-slate-800">
                      {formatCurrency(r.totalAmount)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-xs font-semibold text-emerald-700">
                      {formatCurrency(r.paidAmount)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-xs font-semibold text-rose-600">
                      {formatCurrency(r.pendingAmount)}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", statusClass(r.status))}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-xs text-slate-500">
                      {r.paymentDate ? format(parseISO(r.paymentDate), "dd MMM yyyy") : "—"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-xs text-slate-500 max-w-[160px] truncate" title={r.remarks}>
                      {r.remarks || "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center text-sm text-slate-400">
                    {hasFilters ? "No records match your filters." : "No salary records found."}
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
              Showing {records.length === 0 ? 0 : (page - 1) * PAGE_LIMIT + 1}–{Math.min(page * PAGE_LIMIT, total)} of {total} records
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
                className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-[11px] font-semibold text-slate-600 px-2">{page} / {totalPages}</span>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 disabled:opacity-40"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
