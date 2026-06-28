"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface StudentPaymentModalProps {
  dueAmount: number;
  dueDate: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  paying: boolean;
}

export default function StudentPaymentModal({
  dueAmount,
  dueDate,
  onClose,
  onSubmit,
  paying,
}: StudentPaymentModalProps) {
  const [payMethod, setPayMethod] = useState("UPI");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">Pay Outstanding Academic Tuition Fees</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-1">
            <span className="block text-[9px] font-black text-slate-600 uppercase">Outstanding Balance</span>
            <span className="text-2xl font-black text-slate-800 font-heading">₹{dueAmount.toLocaleString("en-IN")}</span>
            <span className="block text-[9px] text-slate-600 font-semibold">Charges apply for the billing term ending {dueDate}.</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Select Mode of Payment</label>
            <div className="grid grid-cols-3 gap-2">
              {["UPI", "Credit Card", "Net Banking"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPayMethod(mode)}
                  className={`py-2 px-3 border rounded-xl text-xs font-bold text-center cursor-pointer ${
                    payMethod === mode
                      ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)]"
                      : "bg-slate-50/50 border-slate-200 text-slate-655 hover:bg-slate-55"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {payMethod === "UPI" && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-slate-600">UPI Address (VPA)</label>
              <input
                type="text"
                required
                placeholder="e.g. rahulsharma@okaxis"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-semibold text-slate-700"
              />
            </div>
          )}

          {payMethod === "Credit Card" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Card Holder Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-semibold text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Credit Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="4111 2222 3333 4444"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-semibold text-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="***"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-semibold text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {payMethod === "Net Banking" && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-slate-600">Select Bank</label>
              <select className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-semibold text-slate-700">
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
              </select>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={paying}
              className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={paying}
              className="px-4 py-2 text-xs font-bold text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {paying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Paying...
                </>
              ) : (
                "Authorize Payment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
