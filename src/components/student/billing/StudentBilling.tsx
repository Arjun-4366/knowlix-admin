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

interface FeesState {
  dueAmount: number;
  dueDate: string;
  paymentStatus: string;
  invoices: Invoice[];
}

const initialFees: FeesState = {
  dueAmount: 0,
  dueDate: "No Pending Dues",
  paymentStatus: "Paid",
  invoices: [],
};

import { useGetStudentFeesWithSummary, useGetStudentFeesStatus } from "@/querys/student/studentQuery";

export default function StudentBilling() {
  const [fees, setFees] = useState<FeesState>(initialFees);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paidFeeIds, setPaidFeeIds] = useState<string[]>([]);

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const { data: feesData, isLoading } = useGetStudentFeesWithSummary();
  const { data: statusData } = useGetStudentFeesStatus();

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = storedUser ? JSON.parse(storedUser) : null;
  const studentName = user?.studentName || "Rahul Sharma";
  const studentId = user?.admissionNumber || "STU-101";

  // Load paid fee IDs from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("knowlix_paid_fee_ids");
      if (stored) {
        try {
          setPaidFeeIds(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse paid fee IDs from localStorage", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (feesData) {
      const records = feesData.data || [];
      
      const mappedInvoices = records.map((inv) => {
        const isLocallyPaid = paidFeeIds.includes(inv.id);
        const status = isLocallyPaid ? "paid" : inv.status;
        const paidAt = isLocallyPaid ? (inv.paidAt || new Date().toISOString()) : inv.paidAt;

        return {
          id: inv.id,
          month: inv.month || "N/A",
          amount: inv.amount || 0,
          status: status || "pending",
          paidOn: paidAt ? new Date(paidAt).toISOString().split("T")[0] : undefined,
        };
      });

      const pendingFees = mappedInvoices.filter(
        (f) => f.status === "pending" || f.status === "overdue"
      );

      let nextDueDate = "No Pending Dues";
      if (pendingFees.length > 0) {
        const originalPendingRecords = records.filter((r) => {
          const isLocallyPaid = paidFeeIds.includes(r.id);
          const status = isLocallyPaid ? "paid" : r.status;
          return status === "pending" || status === "overdue";
        });
        if (originalPendingRecords.length > 0) {
          const sorted = [...originalPendingRecords].sort(
            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          );
          if (sorted[0]?.dueDate) {
            nextDueDate = new Date(sorted[0].dueDate).toISOString().split("T")[0];
          }
        }
      }

      // Calculate actual outstanding amount after subtracting simulated paid items
      const dueSum = mappedInvoices
        .filter((inv) => inv.status === "pending" || inv.status === "overdue")
        .reduce((sum, inv) => sum + inv.amount, 0);

      setFees({
        dueAmount: dueSum,
        dueDate: nextDueDate,
        paymentStatus: dueSum > 0 ? "Pending" : "Paid",
        invoices: mappedInvoices,
      });
    }
  }, [feesData, paidFeeIds]);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiry || !cvv) {
      toast.error("Please fill in all credit card details.");
      return;
    }

    setPaying(true);

    setTimeout(() => {
      // Find all unpaid invoices
      const currentPendingIds = fees.invoices
        .filter((inv) => inv.status === "pending" || inv.status === "overdue")
        .map((inv) => inv.id);

      const newPaidIds = Array.from(new Set([...paidFeeIds, ...currentPendingIds]));
      setPaidFeeIds(newPaidIds);
      localStorage.setItem("knowlix_paid_fee_ids", JSON.stringify(newPaidIds));
      
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
    
    const content = `
=============================================
             KNOWLIX ACADEMY RECEIPT
=============================================
Receipt ID: REC-${invoice.id}
Invoice Reference: ${invoice.id}
Billing Cycle: ${invoice.month}
Student ID: ${studentId}
Student Name: ${studentName}
Grade Level: ${user?.class || "Grade 10"}
---------------------------------------------
Paid Amount: INR ${invoice.amount.toLocaleString()}
Payment Status: PAID
Date of Payment: ${invoice.paidOn || new Date().toISOString().split("T")[0]}
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

  const overdueRecords = (statusData?.overdue || [])
    .filter((f): f is NonNullable<typeof f> => !!f && !paidFeeIds.includes(f.id));

  const upcomingRecords = (statusData?.upcoming || [])
    .filter((f): f is NonNullable<typeof f> => !!f && !paidFeeIds.includes(f.id));

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Billing & Fee Portal"
        description="Monitor outstanding invoices, pay tuition fees online, and download official payment receipts."
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh] w-full">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
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
              <div className="w-12 h-12 bg-blue-50 border border-blue-150 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-650">
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
                <p className="text-xl font-black text-slate-800 mt-0.5">{studentName} ({studentId})</p>
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
                        {fees.invoices.length > 0 ? (
                          fees.invoices.map((inv) => (
                            <TableRow key={inv.id} className="hover:bg-slate-50/40 transition-colors text-xs font-semibold text-slate-650">
                              <TableCell className="px-6 py-4 text-slate-400 font-bold">{inv.id}</TableCell>
                              <TableCell className="px-6 py-4 text-slate-800 font-bold">{inv.month}</TableCell>
                              <TableCell className="px-6 py-4">INR {inv.amount.toLocaleString()}</TableCell>
                              <TableCell className="px-6 py-4">
                                <Badge className={`${
                                  inv.status === "paid"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : inv.status === "overdue"
                                    ? "bg-rose-50 text-rose-700 border-rose-100 animate-pulse"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                } text-[9px] font-bold rounded-full py-0.5 px-2 shadow-none border capitalize`}>
                                  {inv.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-6 py-4 text-right">
                                {inv.status === "paid" ? (
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => handleDownloadReceipt(inv)}
                                    title="Download Receipt"
                                    className="rounded-lg text-slate-450 hover:text-[var(--brand-green)] hover:bg-[var(--brand-light-green)] transition-all cursor-pointer"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <span className="text-[10px] text-slate-450">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="px-6 py-12 text-center text-slate-450 text-xs font-medium">
                              No billing invoice history found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action / Quick Pay Card Sidebar */}
            <div className="space-y-6">
              {fees.dueAmount > 0 ? (
                <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Currently Outstanding</span>
                    <p className="text-2xl font-black text-slate-800 font-heading">INR {fees.dueAmount.toLocaleString()}</p>
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

              {/* Overdue alert notice */}
              {overdueRecords.length > 0 && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-2 text-xs font-semibold text-rose-800 animate-pulse">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>Overdue Payment Notice</p>
                    <p className="text-[10px] text-rose-600 mt-0.5">
                      You have {overdueRecords.length} overdue fee installment(s) remaining. Please clear outstanding dues.
                    </p>
                  </div>
                </div>
              )}

              {/* Upcoming Payment Schedule */}
              {upcomingRecords.length > 0 && (
                <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Upcoming Instalment Schedule
                  </h3>
                  <div className="space-y-3">
                    {upcomingRecords.map((up) => (
                      <div key={up.id} className="flex justify-between items-center text-xs font-semibold border-b border-slate-50 pb-2">
                        <div>
                          <span className="text-slate-850 block">{up.month}</span>
                          <span className="text-[9px] text-slate-400">Due: {new Date(up.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <span className="text-slate-800 font-bold">INR {up.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </>
      )}

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
