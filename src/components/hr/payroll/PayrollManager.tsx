"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Trash2, Wallet, X } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  useGetSalaryReport,
  useGetTutorsHR,
  useCreateHRSalary,
  useUpdateHRSalary,
  useDeleteHRSalary,
} from "@/querys/admin/hrQuery";
import {
  ISalaryRecord,
  ICreateHRSalaryPayload,
  IUpdateHRSalaryPayload,
} from "@/types/admin/hr";
import { useConfirmation } from "@/context/ConfirmationContext";
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
  return "bg-rose-50 text-rose-600 border-rose-200";
};

// ── Create Modal ──────────────────────────────────────────────────────────────

function SalaryCreateModal({
  onClose,
  onSubmit,
  saving,
}: {
  onClose: () => void;
  onSubmit: (data: ICreateHRSalaryPayload) => void;
  saving: boolean;
}) {
  const { data: tutorsRes } = useGetTutorsHR();
  const tutors = (tutorsRes?.data ?? []) as { id: string; name: string }[];

  const currentYear = new Date().getFullYear();
  const [tutorId, setTutorId] = useState("");
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear);
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tutorId) { toast.error("Select a tutor"); return; }
    if (!totalAmount || Number(totalAmount) <= 0) { toast.error("Enter total amount"); return; }
    onSubmit({
      tutorId,
      month,
      year,
      totalAmount: Number(totalAmount),
      paidAmount: Number(paidAmount) || 0,
      remarks: remarks || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-light-green)] flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[var(--brand-green)]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Add Salary Record</h3>
              <p className="text-[10px] text-slate-600 font-semibold mt-0.5">Fill in the salary details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-600">Tutor</Label>
            <Select value={tutorId} onValueChange={setTutorId}>
              <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select tutor" />
              </SelectTrigger>
              <SelectContent>
                {tutors.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Year</Label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-9 text-sm font-semibold bg-slate-50 border-slate-200"
                min={2020} max={2100}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Total Amount (₹)</Label>
              <Input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="40000"
                className="h-9 text-sm font-semibold bg-slate-50 border-slate-200"
                min={0}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Paid Amount (₹)</Label>
              <Input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="0"
                className="h-9 text-sm font-semibold bg-slate-50 border-slate-200"
                min={0}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-600">Remarks</Label>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. First payment done"
              className="h-9 text-sm bg-slate-50 border-slate-200"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-9 text-xs font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 h-9 text-xs font-semibold bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Add Record"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Update Modal ──────────────────────────────────────────────────────────────

function SalaryUpdateModal({
  record,
  onClose,
  onSubmit,
  saving,
}: {
  record: ISalaryRecord;
  onClose: () => void;
  onSubmit: (data: IUpdateHRSalaryPayload) => void;
  saving: boolean;
}) {
  const [month, setMonth] = useState(record.month);
  const [year, setYear] = useState(record.year);
  const [paidAmount, setPaidAmount] = useState(String(record.paidAmount));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ month, year, paidAmount: Number(paidAmount) });
  };

  const tutorName = record.tutor?.name ?? `ID …${record.id.slice(-6)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-light-green)] flex items-center justify-center">
              <Pencil className="w-4 h-4 text-[var(--brand-green)]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Update Salary</h3>
              <p className="text-[10px] text-slate-600 font-semibold mt-0.5">{tutorName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Year</Label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-9 text-sm font-semibold bg-slate-50 border-slate-200"
                min={2020} max={2100}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-600">Paid Amount (₹)</Label>
            <Input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="h-9 text-sm font-semibold bg-slate-50 border-slate-200"
              min={0}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-9 text-xs font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 h-9 text-xs font-semibold bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PayrollManager() {
  const { confirm } = useConfirmation();

  const [page, setPage]       = useState(1);
  const [tutorId, setTutorId] = useState("");
  const [month, setMonth]     = useState("");
  const [year, setYear]       = useState("");
  const [status, setStatus]   = useState("");
  const [showCreate, setShowCreate]     = useState(false);
  const [editRecord, setEditRecord]     = useState<ISalaryRecord | null>(null);

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
  const createMutation                 = useCreateHRSalary();
  const updateMutation                 = useUpdateHRSalary();
  const deleteMutation                 = useDeleteHRSalary();

  const reportData = salaryRes?.data;
  const records: ISalaryRecord[] = reportData?.records ?? [];
  const total      = reportData?.total ?? 0;
  const totalPages = reportData?.totalPages ?? 1;
  const tutors     = (tutorsRes?.data ?? []).map((t) => ({ id: t.id, name: t.name }));

  const hasFilters = tutorId || month || year || status;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => String(currentYear - i));

  const handleCreate = (data: ICreateHRSalaryPayload) => {
    createMutation.mutate(data, { onSuccess: () => setShowCreate(false) });
  };

  const handleUpdate = (data: IUpdateHRSalaryPayload) => {
    if (!editRecord) return;
    updateMutation.mutate({ id: editRecord.id, data }, { onSuccess: () => setEditRecord(null) });
  };

  const handleDelete = (record: ISalaryRecord) => {
    const name = record.tutor?.name ?? "this record";
    confirm({
      title: "Delete Salary Record",
      message: `Remove ${record.month} ${record.year} salary for ${name}? This cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: () => deleteMutation.mutate(record.id),
    });
  };

  return (
    <>
      {showCreate && (
        <SalaryCreateModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          saving={createMutation.isPending}
        />
      )}
      {editRecord && (
        <SalaryUpdateModal
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSubmit={handleUpdate}
          saving={updateMutation.isPending}
        />
      )}

      <div className="space-y-6 pb-10 w-full">
        <DashboardHeader
          title="Payroll"
          description="Salary disbursement records for tutors. Filter by tutor, month, or year."
          actions={
            <Button
              onClick={() => setShowCreate(true)}
              className="h-9 px-4 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Record
            </Button>
          }
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
                className="text-[10px] font-semibold text-slate-600 hover:text-slate-600 flex items-center gap-1 transition-colors"
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
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Tutor</TableHead>
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Period</TableHead>
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Total</TableHead>
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Paid</TableHead>
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Pending</TableHead>
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Status</TableHead>
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Payment Date</TableHead>
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">Remarks</TableHead>
                  <TableHead className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {records.length > 0 ? (
                  records.map((r) => (
                    <TableRow key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      <TableCell className="px-5 py-4">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{r.tutor?.name ?? "Unknown Tutor"}</p>
                          {r.tutor?.email && <p className="text-[10px] text-slate-600 mt-0.5">{r.tutor.email}</p>}
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
                      <TableCell className="px-5 py-4 text-xs text-slate-600">
                        {r.paymentDate ? format(parseISO(r.paymentDate), "dd MMM yyyy") : "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-xs text-slate-600 max-w-[160px] truncate" title={r.remarks}>
                        {r.remarks || "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditRecord(r)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="py-16 text-center text-sm text-slate-600">
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
              <p className="text-[11px] text-slate-600 font-medium">
                Showing {records.length === 0 ? 0 : (page - 1) * PAGE_LIMIT + 1}–{Math.min(page * PAGE_LIMIT, total)} of {total} records
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  className="h-7 w-7 rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <span className="text-[11px] font-semibold text-slate-600 px-2">{page} / {totalPages}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="h-7 w-7 rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
