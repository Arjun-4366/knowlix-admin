"use client";

import { useEffect, useState } from "react";
import { CreditCard, Calendar, CheckCircle2, AlertCircle, Download, DollarSign, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useGetStudentFees, useGetStudentFeesStatus } from "@/querys/student/studentQuery";

export default function StudentBilling() {
  const [studentName, setStudentName] = useState("Student");
  const [studentId, setStudentId] = useState("STU-101");
  const [studentClass, setStudentClass] = useState("Grade 10");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setStudentName(user?.studentName || "Student");
        setStudentId(user?.admissionNumber || "STU-101");
        setStudentClass(user?.class || "Grade 10");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const { data: feesSummary, isLoading: loadingSummary } = useGetStudentFees();
  const { data: statusData, isLoading: loadingStatus } = useGetStudentFeesStatus();

  const isLoading = loadingSummary || loadingStatus;

  const totalFee = feesSummary?.totalFee || 0;
  const paidAmount = feesSummary?.paidAmount || 0;
  const dueAmount = feesSummary?.dueAmount || 0;

  const overdueRecords = statusData?.overdue || [];
  const upcomingRecords = statusData?.upcoming || [];
  const currentMonth = statusData?.currentMonth;

  // Build invoice list from all available records
  const allRecords = [
    ...(currentMonth ? [currentMonth] : []),
    ...overdueRecords,
    ...upcomingRecords,
  ];

  const handleDownloadReceipt = (inv: typeof allRecords[number]) => {
    toast.success(`Generating receipt: Receipt_${inv.id}.txt`);
    const content = `
=============================================
             KNOWLIX ACADEMY RECEIPT
=============================================
Receipt ID: REC-${inv.id}
Billing Cycle: ${inv.month}
Student ID: ${studentId}
Student Name: ${studentName}
Grade Level: ${studentClass}
---------------------------------------------
Paid Amount: INR ${inv.amount.toLocaleString()}
Payment Status: PAID
Date of Payment: ${inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}
---------------------------------------------
Thank you for choosing Knowlix Academy.
Contact: support@knowlix.in
=============================================
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Receipt_${inv.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Billing & Fee Portal"
        description="Monitor outstanding invoices and download official payment receipts."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-[var(--brand-green)]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Outstanding Fees</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">₹{dueAmount.toLocaleString("en-IN")}</p>
          </div>
          {dueAmount > 0 && (
            <span className="absolute top-4 right-4 bg-amber-50 text-amber-700 border border-amber-100 text-[8px] font-bold rounded-full py-0.5 px-2">
              Action Required
            </span>
          )}
        </Card>

        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Amount Paid</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">₹{paidAmount.toLocaleString("en-IN")}</p>
            <span className="text-[10px] text-slate-400 font-semibold">of ₹{totalFee.toLocaleString("en-IN")} total</span>
          </div>
        </Card>

        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-purple-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block">Billing Profile</span>
            <p className="text-sm font-black text-slate-800 mt-0.5">{studentName}</p>
            <span className="text-[10px] text-slate-400 font-semibold">{studentId} · {studentClass}</span>
          </div>
        </Card>
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Table */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Payment & Invoice History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-slate-50/20">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Billing Month</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Amount</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Due Date</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Status</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {allRecords.length > 0 ? (
                    allRecords.map((inv) => (
                      <TableRow key={inv.id} className="hover:bg-slate-50/40 transition-colors">
                        <TableCell className="px-6 py-4 text-xs font-bold text-slate-800">{inv.month}</TableCell>
                        <TableCell className="px-6 py-4 text-xs font-semibold text-slate-700">₹{inv.amount.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="px-6 py-4 text-xs font-semibold text-slate-500">
                          {new Date(inv.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge className={`text-[9px] font-bold rounded-full py-0.5 px-2 shadow-none border capitalize ${
                            inv.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : inv.status === "overdue"
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}>
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
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="px-6 py-12 text-center text-slate-450 text-xs font-medium">
                        No billing records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {dueAmount > 0 ? (
            <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Currently Outstanding</span>
                <p className="text-2xl font-black text-slate-800 font-heading">₹{dueAmount.toLocaleString("en-IN")}</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl flex gap-2 text-xs font-semibold text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Pending Fee Invoice</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">Please pay before the due date to avoid billing interruptions.</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-white border-slate-150 shadow-sm p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-[var(--brand-green)] border border-emerald-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">All Fees Paid!</h3>
                <p className="text-xs text-slate-450 mt-1 max-w-[200px] mx-auto leading-relaxed">
                  Your billing account is fully up-to-date.
                </p>
              </div>
            </Card>
          )}

          {overdueRecords.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-2 text-xs font-semibold text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p>Overdue Payment Notice</p>
                <p className="text-[10px] text-rose-600 mt-0.5">
                  You have {overdueRecords.length} overdue fee installment(s). Please clear outstanding dues.
                </p>
              </div>
            </div>
          )}

          {upcomingRecords.length > 0 && (
            <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Upcoming Instalments</h3>
              <div className="space-y-3">
                {upcomingRecords.map((up) => (
                  <div key={up.id} className="flex justify-between items-center text-xs font-semibold border-b border-slate-50 pb-2">
                    <div>
                      <span className="text-slate-800 block">{up.month}</span>
                      <span className="text-[9px] text-slate-400">
                        Due: {new Date(up.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <span className="text-slate-800 font-bold">₹{up.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {currentMonth && (
            <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                Current Month
              </h3>
              <div className="flex justify-between items-center text-xs font-semibold">
                <div>
                  <span className="text-slate-800 block">{currentMonth.month}</span>
                  <span className="text-[9px] text-slate-400">
                    Due: {new Date(currentMonth.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-800 font-black block">₹{currentMonth.amount.toLocaleString("en-IN")}</span>
                  <Badge className={`text-[8px] font-bold rounded-full py-0 px-1.5 shadow-none border capitalize mt-1 ${
                    currentMonth.status === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : currentMonth.status === "overdue"
                      ? "bg-rose-50 text-rose-700 border-rose-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {currentMonth.status}
                  </Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
