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
  UserCheck,
  UserX,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useGetAttendanceReport,
  useGetTurnoverAnalytics,
  useGetHRSalaryList,
  useCreateHRSalary,
  useUpdateHRSalary,
  useDeleteHRSalary,
  useGetTutorsHR,
} from "@/querys/admin/hrQuery";
import {
  IAttendanceSummaryEntry,
  ITurnoverMonthEntry,
  IHRSalaryRecord,
  ICreateHRSalaryPayload,
  IUpdateHRSalaryPayload,
} from "@/types/admin/hr";
import { useConfirmation } from "@/context/ConfirmationContext";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  partial: "bg-amber-50 text-amber-700 border-amber-200",
  unpaid: "bg-red-50 text-red-700 border-red-200",
};

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

// ── Salary Create Modal ───────────────────────────────────────────────────────

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
        {/* Header */}
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
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tutor */}
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

          {/* Month + Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
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
                min={2020}
                max={2100}
              />
            </div>
          </div>

          {/* Total + Paid */}
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

          {/* Remarks */}
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

// ── Salary Update Modal ───────────────────────────────────────────────────────

function SalaryUpdateModal({
  record,
  onClose,
  onSubmit,
  saving,
}: {
  record: IHRSalaryRecord;
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

  const tutorName = record.tutorId?.name ?? `ID …${record.id.slice(-6)}`;

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
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-600 transition-colors">
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
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
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
                min={2020}
                max={2100}
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

// ── Salary Management Panel ───────────────────────────────────────────────────

function SalaryManagementPanel() {
  const { data: salaryRes, isLoading } = useGetHRSalaryList();
  const createMutation = useCreateHRSalary();
  const updateMutation = useUpdateHRSalary();
  const deleteMutation = useDeleteHRSalary();
  const { confirm } = useConfirmation();

  const [showCreate, setShowCreate] = useState(false);
  const [editRecord, setEditRecord] = useState<IHRSalaryRecord | null>(null);

  const records: IHRSalaryRecord[] = salaryRes?.data ?? [];

  const totalAmount = records.reduce((s, r) => s + r.totalAmount, 0);
  const totalPaid = records.reduce((s, r) => s + r.paidAmount, 0);
  const totalPending = records.reduce((s, r) => s + r.pendingAmount, 0);

  const handleCreate = (data: ICreateHRSalaryPayload) => {
    createMutation.mutate(data, { onSuccess: () => setShowCreate(false) });
  };

  const handleUpdate = (data: IUpdateHRSalaryPayload) => {
    if (!editRecord) return;
    updateMutation.mutate({ id: editRecord.id, data }, { onSuccess: () => setEditRecord(null) });
  };

  const handleDelete = (record: IHRSalaryRecord) => {
    const tutorName = record.tutorId?.name ?? "this record";
    confirm({
      title: "Delete Salary Record",
      message: `Remove ${record.month} ${record.year} salary for ${tutorName}? This cannot be undone.`,
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

      <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between mb-3">
            <SectionHeader
              title="Salary Management"
              description="Create, update, and manage salary records for tutors."
            />
            <Button
              onClick={() => setShowCreate(true)}
              className="h-8 px-3 text-xs font-semibold bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white flex items-center gap-1.5 flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
              Add Record
            </Button>
          </div>

          {records.length > 0 && (
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <p className="text-base font-bold text-slate-800">{formatCurrency(totalAmount)}</p>
                <p className="text-[10px] text-slate-600">Total</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center">
                <p className="text-base font-bold text-emerald-700">{formatCurrency(totalPaid)}</p>
                <p className="text-[10px] text-slate-600">Paid</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-center">
                <p className="text-base font-bold text-rose-600">{formatCurrency(totalPending)}</p>
                <p className="text-[10px] text-slate-600">Pending</p>
              </div>
              <p className="ml-auto text-[11px] text-slate-600">
                {records.length} record{records.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
            </div>
          ) : records.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-600">
              No salary records yet. Click &ldquo;Add Record&rdquo; to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full text-xs">
                <TableHeader>
                  <TableRow className="border-b border-slate-100">
                    {["Tutor", "Period", "Total", "Paid", "Pending", "Status", ""].map((h) => (
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
                      <TableCell className="py-2.5 px-3 font-semibold text-slate-800">
                        {r.tutorId?.name ?? (
                          <span className="font-mono text-slate-600 text-[10px]">
                            …{r.id.slice(-8)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-2.5 px-3 text-slate-600">
                        {r.month} {r.year}
                      </TableCell>
                      <TableCell className="py-2.5 px-3 font-semibold text-slate-800">
                        {formatCurrency(r.totalAmount)}
                      </TableCell>
                      <TableCell className="py-2.5 px-3 text-emerald-700 font-semibold">
                        {formatCurrency(r.paidAmount)}
                      </TableCell>
                      <TableCell className="py-2.5 px-3 text-rose-600 font-semibold">
                        {formatCurrency(r.pendingAmount)}
                      </TableCell>
                      <TableCell className="py-2.5 px-3">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-semibold capitalize",
                            STATUS_COLOR[r.status] ?? "bg-slate-50 text-slate-600 border-slate-200",
                          )}>
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditRecord(r)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-600 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

// ── Attendance Report Panel ───────────────────────────────────────────────────

function AttendanceReportPanel({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const { data: reportRes, isLoading } = useGetAttendanceReport({ from: dateFrom, to: dateTo });
  const data = reportRes?.data;
  const summary: IAttendanceSummaryEntry[] = data?.summary ?? [];

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-start justify-between">
        <SectionHeader
          title="Attendance Report"
          description="Per-tutor attendance summary for the selected date range."
        />
        {data && (
          <p className="text-[11px] text-slate-600 font-medium mt-0.5">{data.total} records</p>
        )}
      </div>
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
          </div>
        ) : summary.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-600">
            No attendance records found for the selected range.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader>
                <TableRow className="border-b border-slate-100">
                  {["Tutor", "Present", "Absent", "Late", "Total Records"].map((h) => (
                    <TableHead
                      key={h}
                      className="text-left py-2 px-3 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.map((row, i) => (
                  <TableRow
                    key={row.tutorId}
                    className={cn("border-b border-slate-50", i % 2 !== 0 && "bg-slate-50/50")}>
                    <TableCell className="py-2.5 px-3 font-semibold text-slate-800">
                      {row.tutorName || (
                        <span className="font-mono text-slate-600 text-[10px]">{row.tutorId.slice(-8)}</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-emerald-700 font-semibold">{row.present}</TableCell>
                    <TableCell className="py-2.5 px-3 text-red-600 font-semibold">{row.absent}</TableCell>
                    <TableCell className="py-2.5 px-3 text-amber-600 font-semibold">{row.late}</TableCell>
                    <TableCell className="py-2.5 px-3 text-slate-600">{row.totalRecords}</TableCell>
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
        description="Centralized view of attendance summaries, salary records, and workforce turnover metrics."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Attendance Report"
          value="By Tutor"
          sub="Summary + date filter"
          icon={BarChart3}
          accent="bg-slate-100 text-slate-600"
        />
        <KpiCard
          label="Salary Management"
          value="Payroll"
          sub="Create, update & track payments"
          icon={Wallet}
          accent="bg-emerald-100 text-emerald-600"
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
        <SalaryManagementPanel />
        <TurnoverPanel />
      </div>
    </div>
  );
}
