"use client";

import { useEffect, useState } from "react";
import { CreditCard, Calendar, CheckCircle2, AlertCircle, DollarSign, Wallet, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useGetStudentFees, useGetStudentFeesStatus } from "@/querys/student/studentQuery";
import { generateInvoicePDF } from "./generateInvoicePDF";

interface StudentUser {
  name: string;
  admissionNumber: string;
  class: string;
  programName?: string;
  courseName?: string;
  parentName?: string;
  email?: string;
  phone?: string;
  place?: string;
  mentorName?: string;
}

export default function StudentBilling() {
  const [studentUser, setStudentUser] = useState<StudentUser>({
    name: "Student",
    admissionNumber: "STU-101",
    class: "Grade 10",
  });
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setStudentUser({
          name: user?.studentName || "Student",
          admissionNumber: user?.admissionNumber || "STU-101",
          class: user?.class || "Grade 10",
          programName: user?.programName || undefined,
          courseName: user?.courseName || undefined,
          parentName: user?.parentName || undefined,
          email: user?.email || undefined,
          phone: user?.phone || undefined,
          place: user?.place || undefined,
          mentorName: user?.mentorName || undefined,
        });
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

  const handleDownloadInvoice = async () => {
    if (!feesSummary) {
      toast.error("Fee data not loaded yet. Please wait.");
      return;
    }
    setInvoiceLoading(true);
    try {
      await generateInvoicePDF({
        student: studentUser,
        fees: { totalFee, paidAmount, dueAmount },
      });
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setInvoiceLoading(false);
    }
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
      {/* Header + Invoice Button */}
      <div className="flex items-start justify-between gap-4">
        <DashboardHeader
          title="Billing & Fee Portal"
          description="View your fee summary and download your official fee invoice."
        />
        <Button
          onClick={handleDownloadInvoice}
          disabled={invoiceLoading || !feesSummary}
          className="flex-shrink-0 flex items-center gap-2 text-white text-xs font-bold px-4 py-2.5 h-auto rounded-xl shadow-sm cursor-pointer disabled:opacity-60"
          style={{ background: "var(--brand-green)" }}
        >
          {invoiceLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5" />
              Download Invoice
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-[var(--brand-green)]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">Outstanding Fees</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">₹{dueAmount.toLocaleString("en-IN")}</p>
            {dueAmount > 0 && (
              <span className="text-[9px] font-bold text-amber-600 mt-0.5 block">Action Required</span>
            )}
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">Amount Paid</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">₹{paidAmount.toLocaleString("en-IN")}</p>
            <span className="text-[9px] text-slate-600 font-semibold mt-0.5 block">of ₹{totalFee.toLocaleString("en-IN")} total</span>
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-purple-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">Billing Profile</span>
            <p className="text-sm font-black text-slate-800 mt-0.5">{studentUser.name}</p>
            <span className="text-[9px] text-slate-600 font-semibold mt-0.5 block">{studentUser.admissionNumber} · {studentUser.class}</span>
          </div>
        </Card>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fee Status Card */}
        {dueAmount > 0 ? (
          <Card className="bg-white border-slate-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">Currently Outstanding</span>
              <p className="text-xl font-black text-slate-800 mt-0.5">₹{dueAmount.toLocaleString("en-IN")}</p>
              <span className="text-[9px] font-bold text-amber-600 mt-0.5 block">Please pay before the due date</span>
            </div>
          </Card>
        ) : (
          <Card className="bg-white border-slate-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-[var(--brand-green)]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">Fee Status</span>
              <p className="text-sm font-black text-slate-800 mt-0.5">All Fees Paid!</p>
              <span className="text-[9px] text-slate-600 font-semibold mt-0.5 block">Account fully up-to-date</span>
            </div>
          </Card>
        )}

        {/* Overdue Notice */}
        {overdueRecords.length > 0 && (
          <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-3">
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-2 text-xs font-semibold text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p>Overdue Payment Notice</p>
                <p className="text-[10px] text-rose-600 mt-0.5">
                  You have {overdueRecords.length} overdue fee installment(s). Please clear outstanding dues.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Upcoming Instalments */}
        {upcomingRecords.length > 0 && (
          <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Upcoming Instalments</h3>
            <div className="space-y-3">
              {upcomingRecords.map((up) => (
                <div key={up.id} className="flex justify-between items-center text-xs font-semibold border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <div>
                    <span className="text-slate-800 block">{up.month}</span>
                    <span className="text-[9px] text-slate-600">
                      Due: {new Date(up.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <span className="text-slate-800 font-bold">₹{up.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Current Month */}
        {currentMonth && (
          <Card className="bg-white border-slate-150 shadow-sm p-6 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[var(--brand-green)]" />
              Current Month
            </h3>
            <div className="flex justify-between items-center text-xs font-semibold">
              <div>
                <span className="text-slate-800 block">{currentMonth.month}</span>
                <span className="text-[9px] text-slate-600">
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
  );
}
