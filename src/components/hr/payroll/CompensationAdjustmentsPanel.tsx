import { Clock3, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AdjustmentStatus,
  AdjustmentType,
  EnrichedPayrollAdjustment,
} from "./types";
import { formatCurrency } from "./utils";

interface CompensationAdjustmentsPanelProps {
  cycleLabel: string;
  adjustments: EnrichedPayrollAdjustment[];
  bonusTotal: number;
  deductionTotal: number;
  pendingCount: number;
  approvedCount: number;
  onApplyApproved: () => void;
}

const typeClassMap: Record<AdjustmentType, string> = {
  Bonus: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Deduction: "bg-rose-50 text-rose-700 border-rose-200",
};

const statusClassMap: Record<AdjustmentStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-sky-50 text-sky-700 border-sky-200",
  Applied: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function CompensationAdjustmentsPanel({
  cycleLabel,
  adjustments,
  bonusTotal,
  deductionTotal,
  pendingCount,
  approvedCount,
  onApplyApproved,
}: CompensationAdjustmentsPanelProps) {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-850">Bonuses & Deductions</h2>
          <p className="text-xs text-slate-600 mt-1">
            {cycleLabel} variable pay ledger, deduction approvals, and final
            payroll adjustments.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={approvedCount === 0}
          onClick={onApplyApproved}
          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          Apply Approved Items
        </Button>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Bonus Value
            </p>
            <p className="text-lg font-bold text-emerald-700 mt-2">
              {formatCurrency(bonusTotal)}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Applied plus approved variable additions
            </p>
          </div>
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Deduction Value
            </p>
            <p className="text-lg font-bold text-rose-700 mt-2">
              {formatCurrency(deductionTotal)}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 inline-flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Recoveries tied to payroll and attendance governance
            </p>
          </div>
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Pending Approvals
            </p>
            <p className="text-lg font-bold text-slate-800 mt-2">{pendingCount}</p>
            <p className="text-[11px] text-slate-600 mt-1 inline-flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5" />
              Items still open before the payroll lock date
            </p>
          </div>
        </div>

        <div className="space-y-3 max-h-[470px] overflow-y-auto">
          {adjustments.length > 0 ? (
            adjustments.map((adjustment) => (
              <div
                key={adjustment.id}
                className="rounded-2xl border border-slate-150 bg-slate-50/45 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      {adjustment.employeeName}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      {adjustment.designation} / {adjustment.department}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold",
                        typeClassMap[adjustment.type]
                      )}
                    >
                      {adjustment.type}
                    </span>
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold",
                        statusClassMap[adjustment.status]
                      )}
                    >
                      {adjustment.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      {adjustment.label}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Owner: {adjustment.owner}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-bold",
                      adjustment.type === "Bonus"
                        ? "text-emerald-700"
                        : "text-rose-700"
                    )}
                  >
                    {adjustment.type === "Bonus" ? "+" : "-"}
                    {formatCurrency(adjustment.amount)}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-normal">
                  {adjustment.note || "No additional note provided for this adjustment."}
                </p>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-sm text-slate-600">
              No bonuses or deductions are mapped for the current filter.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
