"use client";

import { useState, useEffect } from "react";
import { CreditCard, Calendar, CheckCircle2, AlertCircle, FileText, Download, X, DollarSign, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

interface Invoice {
  id: string;
  month: string;
  amount: number;
  status: string;
  paidOn?: string;
}

const initialFees = {
  dueAmount: 15000,
  dueDate: "2026-06-01",
  paymentStatus: "Pending",
  invoices: [
    { id: "INV-2026-05", month: "May 2026", amount: 15000, status: "Paid", paidOn: "2026-05-02" },
    { id: "INV-2026-04", month: "April 2026", amount: 15000, status: "Paid", paidOn: "2026-04-03" },
    { id: "INV-2026-03", month: "March 2026", amount: 15000, status: "Paid", paidOn: "2026-03-01" },
  ],
};

export default function StudentBilling() {
  const [fees, setFees] = useState(initialFees);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paying, setPaying] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("knowlix_fees");
    if (stored) {
      try {
        setFees(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("knowlix_fees", JSON.stringify(initialFees));
      setFees(initialFees);
    }
  }, []);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiry || !cvv) {
      toast.error("Please fill in all credit card details.");
      return;
    }

    setPaying(true);

    setTimeout(() => {
      const updatedFees = {
        ...fees,
        dueAmount: 0,
        paymentStatus: "Paid",
        invoices: [
          {
            id: `INV-2026-06`,
            month: "June 2026 (Current)",
            amount: fees.dueAmount,
            status: "Paid",
            paidOn: new Date().toISOString().split("T")[0]
          },
          ...fees.invoices
        ]
      };

      setFees(updatedFees);
      localStorage.setItem("knowlix_fees", JSON.stringify(updatedFees));
      
      // Also update overall state if needed
      toast.success("Fees paid successfully!");
      setPaying(false);
      setShowPayModal(false);
      
      // Reset inputs
      setCardNumber("");
      setExpiry("");
      setCvv("");
    }, 1800);
  };

  const handleDownloadReceipt = (invoice: Invoice) => {
    toast.success(`Generating fee receipt: Receipt_${invoice.id}.pdf`);
    
    // Simulate simple PDF file download by creating a virtual link with a text receipt
    const content = `
=============================================
             KNOWLIX ACADEMY RECEIPT
=============================================
Receipt ID: REC-${invoice.id}
Invoice Reference: ${invoice.id}
Billing Cycle: ${invoice.month}
Student ID: STU-101
Student Name: Rahul Sharma
Grade Level: Grade 10
---------------------------------------------
Paid Amount: INR ${invoice.amount.toLocaleString()}
Payment Status: PAID
Date of Payment: ${invoice.paidOn || "2026-05-02"}
Method: Online Transaction (Card)
---------------------------------------------
Thank you for choosing Knowlix Academy.
If you have questions, contact support@knowlix.in
=============================================
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${invoice.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Billing & Fee Portal"
        description="Monitor outstanding invoices, pay tuition fees online, and download official payment receipts."
      />

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-[var(--brand-green)]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Outstanding Fees</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">INR {fees.dueAmount.toLocaleString()}</p>
          </div>
          {fees.dueAmount > 0 && (
            <span className="absolute top-4 right-4 bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-bold rounded-full py-0.5 px-2">
              Action Required
            </span>
          )}
        </Card>

        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-150 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Next Due Date</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">
              {fees.dueAmount > 0 ? (
                new Date(fees.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
              ) : (
                "No Pending Dues"
              )}
            </p>
          </div>
        </Card>

        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 border border-purple-150 rounded-2xl flex items-center justify-center flex-shrink-0 text-purple-650">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Billing Profile</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">Rahul Sharma (STU-101)</p>
          </div>
        </Card>
      </div>

      {/* Main Billing Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Log */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Payment & Invoice History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="table-fixed w-full">
                  <TableHeader className="bg-slate-50/20">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Invoice ID</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Billing Month</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Amount</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Status</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100">
                    {fees.invoices.map((inv) => (
                      <TableRow key={inv.id} className="hover:bg-slate-50/40 transition-colors text-xs font-semibold text-slate-650">
                        <TableCell className="px-6 py-4 text-slate-400 font-bold">{inv.id}</TableCell>
                        <TableCell className="px-6 py-4 text-slate-800 font-bold">{inv.month}</TableCell>
                        <TableCell className="px-6 py-4">INR {inv.amount.toLocaleString()}</TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-bold rounded-full py-0.5 px-2 shadow-none border">
                            Paid
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDownloadReceipt(inv)}
                            title="Download Receipt"
                            className="rounded-lg text-slate-450 hover:text-[var(--brand-green)] hover:bg-[var(--brand-light-green)] transition-all cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action / Quick Pay Card */}
        <div>
          {fees.dueAmount > 0 ? (
            <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Currently Outstanding</span>
                <p className="text-2xl font-black text-slate-800">INR {fees.dueAmount.toLocaleString()}</p>
                <span className="text-[10px] text-slate-400 font-semibold block">Due by {fees.dueDate}</span>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl flex gap-2 text-xs font-semibold text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Pending Fee Invoice</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Please pay before the due date to avoid billing interruptions.</p>
                </div>
              </div>

              <Button
                onClick={() => setShowPayModal(true)}
                className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <CreditCard className="w-4 h-4" /> Pay Fees Online
              </Button>
            </Card>
          ) : (
            <Card className="bg-white border-slate-150 shadow-sm p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-[var(--brand-green)] border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">All Fees Paid!</h3>
                <p className="text-xs text-slate-450 mt-1 max-w-[200px] mx-auto leading-relaxed">
                  Your billing account is fully up-to-date. Thank you for your payment.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Online Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-white border-slate-150 shadow-xl overflow-hidden max-w-sm w-full animate-slide-down">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Simulate Fee Payment
              </CardTitle>
              <Button variant="ghost" size="icon-sm" onClick={() => setShowPayModal(false)} className="rounded-lg">
                <X className="w-4 h-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Billing:</span>
                  <span className="text-sm font-black text-slate-800">INR {fees.dueAmount.toLocaleString()}</span>
                </div>

                <div className="space-y-3">
                  {/* Card Number */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Card Number</label>
                    <Input
                      type="text"
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="4111 2222 3333 4444"
                      className="h-9 text-xs rounded-lg border-slate-200"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Expiry */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Expiry (MM/YY)</label>
                      <Input
                        type="text"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="12/28"
                        className="h-9 text-xs rounded-lg border-slate-200"
                        required
                      />
                    </div>

                    {/* CVV */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CVV</label>
                      <Input
                        type="password"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                        placeholder="***"
                        className="h-9 text-xs rounded-lg border-slate-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={paying}
                  className="w-full mt-4 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  {paying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Pay INR {fees.dueAmount.toLocaleString()}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
