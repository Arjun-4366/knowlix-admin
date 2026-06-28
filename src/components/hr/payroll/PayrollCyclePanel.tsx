import { CalendarDays, Clock3, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  EnrichedPayslipRecord,
  PayrollCycle,
  PayrollPolicy,
  PayslipStatus,
} from "./types";
import {
  formatCurrency,
  formatDateLabel,
  formatPayrollMonth,
  getInitials,
} from "./utils";

interface PayrollCyclePanelProps {
  cycles: PayrollCycle[];
  policies: PayrollPolicy[];
  selectedCycleId: string;
  onCycleChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
  payslips: EnrichedPayslipRecord[];
  selectedEmployeeId: string | null;
  onEmployeeSelect: (employeeId: string) => void;
  onGeneratePending: () => void;
  pendingCount: number;
}

const payslipStatusClassMap: Record<PayslipStatus, string> = {
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  Ready: "bg-amber-50 text-amber-700 border-amber-200",
  Generated: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Sent: "bg-sky-50 text-sky-700 border-sky-200",
};

const cycleStatusClassMap: Record<PayrollCycle["status"], string> = {
  "In Review": "bg-slate-100 text-slate-700 border-slate-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function PayrollCyclePanel({
  cycles,
  policies,
  selectedCycleId,
  onCycleChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  payslips,
  selectedEmployeeId,
  onEmployeeSelect,
  onGeneratePending,
  pendingCount,
}: PayrollCyclePanelProps) {
  const selectedCycle =
    cycles.find((cycle) => cycle.id === selectedCycleId) ?? cycles[0];
  const selectedPayslip =
    payslips.find((payslip) => payslip.employeeId === selectedEmployeeId) ??
    payslips[0] ??
    null;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-850">Payslip Generation</h2>
          <p className="text-xs text-slate-600 mt-1">
            Review the active cycle, validate pay components, and release salary
            slips.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCycleId} onValueChange={onCycleChange}>
            <SelectTrigger className="h-10 w-[180px] rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700">
              <SelectValue placeholder="Payroll Cycle" />
            </SelectTrigger>
            <SelectContent>
              {cycles.map((cycle) => (
                <SelectItem
                  key={cycle.id}
                  value={cycle.id}
                  className="text-xs font-semibold"
                >
                  {formatPayrollMonth(cycle.month)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="h-10 w-[180px] rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700">
              <SelectValue placeholder="Department Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs font-semibold">
                All Departments
              </SelectItem>
              {departments.map((department) => (
                <SelectItem
                  key={department}
                  value={department}
                  className="text-xs font-semibold"
                >
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            onClick={onGeneratePending}
            disabled={pendingCount === 0}
            className="h-10 rounded-xl bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-semibold"
          >
            Generate Pending
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Cycle Status
            </p>
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold",
                cycleStatusClassMap[selectedCycle.status]
              )}
            >
              {selectedCycle.status}
            </span>
            <p className="text-[11px] text-slate-600 leading-normal">
              {selectedCycle.note}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Payout Date
            </p>
            <p className="text-sm font-bold text-slate-800">
              {formatDateLabel(selectedCycle.payoutDate)}
            </p>
            <p className="text-[11px] text-slate-600 inline-flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5 text-slate-600" />
              Salary month {formatPayrollMonth(selectedCycle.month)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Attendance Lock
            </p>
            <p className="text-sm font-bold text-slate-800">
              {formatDateLabel(selectedCycle.lockDate)}
            </p>
            <p className="text-[11px] text-slate-600 inline-flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5 text-slate-600" />
              {policies[0]?.value || "Policy pending"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Bank Advice
            </p>
            <p className="text-sm font-bold text-slate-800">
              {selectedCycle.bankAdviceStatus}
            </p>
            <p className="text-[11px] text-slate-600 inline-flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              {policies[2]?.value || "File upload window not configured"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.15fr] gap-5">
          <div className="rounded-2xl border border-slate-150 bg-slate-50/35 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Cycle Payslips
              </h3>
            </div>

            <div className="p-4 space-y-3 max-h-[460px] overflow-y-auto">
              {payslips.length > 0 ? (
                payslips.map((payslip) => (
                  <button
                    key={payslip.employeeId}
                    type="button"
                    onClick={() => onEmployeeSelect(payslip.employeeId)}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition-all cursor-pointer",
                      selectedPayslip?.employeeId === payslip.employeeId
                        ? "border-[var(--brand-green)] bg-[var(--brand-light-green)]/35 shadow-sm"
                        : "border-slate-150 bg-white hover:border-slate-250 hover:shadow-sm"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[var(--brand-light-green)] text-[var(--brand-mid)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {getInitials(payslip.employeeName)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {payslip.employeeName}
                          </p>
                          <p className="text-[11px] text-slate-600 truncate">
                            {payslip.designation} / {payslip.department}
                          </p>
                        </div>
                      </div>
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold whitespace-nowrap",
                          payslipStatusClassMap[payslip.status]
                        )}
                      >
                        {payslip.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4 text-[11px]">
                      <div>
                        <p className="font-bold uppercase tracking-wider text-slate-600">
                          Payable Days
                        </p>
                        <p className="text-slate-700 font-semibold mt-1">
                          {payslip.payableDays}/{payslip.workingDays}
                        </p>
                      </div>
                      <div>
                        <p className="font-bold uppercase tracking-wider text-slate-600">
                          Net Pay
                        </p>
                        <p className="text-slate-700 font-semibold mt-1">
                          {formatCurrency(payslip.netPay)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-16 text-center text-sm text-slate-600">
                  No active employees match the current payroll filters.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-150 bg-white p-5 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-850">Payslip Preview</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Preview of mapped earnings, recoveries, and statutory payroll
                  lines.
                </p>
              </div>
              {selectedPayslip && (
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold whitespace-nowrap",
                    payslipStatusClassMap[selectedPayslip.status]
                  )}
                >
                  {selectedPayslip.status}
                </span>
              )}
            </div>

            {selectedPayslip ? (
              <>
                <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-[var(--brand-light-green)] text-[var(--brand-mid)] flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {getInitials(selectedPayslip.employeeName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">
                        {selectedPayslip.employeeName}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {selectedPayslip.designation} / {selectedPayslip.department}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-600 mt-2">
                        {formatPayrollMonth(selectedCycle.month)} payslip
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-150 bg-slate-50/45 p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Earnings
                      </p>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-600">Basic salary</span>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(selectedPayslip.monthlyBase)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-600">Allowances</span>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(selectedPayslip.monthlyAllowance)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-600">Bonus</span>
                        <span className="font-semibold text-emerald-700">
                          {formatCurrency(selectedPayslip.bonus)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-600">Reimbursements</span>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(selectedPayslip.reimbursements)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-150 bg-slate-50/45 p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Deductions
                      </p>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-600">Provident fund</span>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(selectedPayslip.providentFund)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-600">Tax deducted at source</span>
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(selectedPayslip.taxDeducted)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-600">Other deductions</span>
                        <span className="font-semibold text-rose-700">
                          {formatCurrency(selectedPayslip.deductions)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-200">
                        <span className="font-semibold text-slate-700">Net pay</span>
                        <span className="text-base font-bold text-slate-900">
                          {formatCurrency(selectedPayslip.netPay)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-150 bg-slate-50/40 px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Gross Before Deductions
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {formatCurrency(
                        selectedPayslip.grossPay +
                          selectedPayslip.bonus +
                          selectedPayslip.reimbursements
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-150 bg-slate-50/40 px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Attendance Basis
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {selectedPayslip.payableDays}/{selectedPayslip.workingDays} days
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-150 bg-slate-50/40 px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Policy Reminder
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {policies[1]?.value || "Cutoff pending"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-150 bg-slate-50/40 p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Payroll Notes
                  </p>
                  <p className="text-xs text-slate-600 leading-normal">
                    {selectedPayslip.note || "No cycle-specific note added yet."}
                  </p>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {selectedCycle.note}
                  </p>
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-sm text-slate-600">
                Select a payslip record to preview the payroll breakdown.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
