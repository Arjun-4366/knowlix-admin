"use client";

interface FeesSummary {
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
}

interface StudentBillingWidgetProps {
  summary: FeesSummary;
}

export default function StudentBillingWidget({ summary }: StudentBillingWidgetProps) {
  const { totalFee, paidAmount, dueAmount } = summary;
  const paidPercent = totalFee > 0 ? Math.round((paidAmount / totalFee) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/20">
        <h2 className="text-sm font-bold text-slate-800">Billing & Fees</h2>
        <p className="text-xs text-slate-455 mt-0.5">Fee payment summary for this term</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
            <span>Amount Paid</span>
            <span>{paidPercent}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--brand-green)] rounded-full transition-all duration-500"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
        </div>

        {/* Summary rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Fee</span>
            <span className="text-xs font-black text-slate-800">₹{totalFee.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 px-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Paid</span>
            <span className="text-xs font-black text-emerald-700">₹{paidAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex items-center justify-between py-2.5 px-3 bg-red-50 rounded-xl border border-red-100">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Due</span>
            <span className="text-xs font-black text-red-600">₹{dueAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
