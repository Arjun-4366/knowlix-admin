"use client";

interface Invoice {
  id: string;
  month: string;
  amount: number;
  status: string;
  paidOn: string;
}

interface StudentBillingWidgetProps {
  invoices: Invoice[];
}

export default function StudentBillingWidget({ invoices }: StudentBillingWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/20">
        <h2 className="text-sm font-bold text-slate-800">Billing & Receipts</h2>
        <p className="text-xs text-slate-455 mt-0.5">History of paid invoice receipts</p>
      </div>
      <div className="divide-y divide-slate-100">
        {invoices.map((inv) => (
          <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
            <div>
              <p className="text-xs font-bold text-slate-800">{inv.month}</p>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">Invoice: {inv.id} • Paid: {inv.paidOn}</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-800">₹{inv.amount.toLocaleString("en-IN")}</p>
              <span className="inline-flex items-center text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full mt-1 leading-none">
                ✓ Settled
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
