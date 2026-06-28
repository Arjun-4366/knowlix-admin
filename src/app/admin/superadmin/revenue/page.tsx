"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, TrendingDown, DollarSign, Users, GraduationCap,
  CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import { useGetSuperadminRevenue } from "@/querys/admin/superadminQuery";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

function StatCard({
  label, value, sub, icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="relative w-full text-left bg-white rounded-2xl border border-slate-100 p-5 flex flex-col justify-between overflow-hidden shadow-sm">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-light)]" />
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--brand-light-green)] text-[var(--brand-green)] mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold font-heading text-slate-800">{value}</p>
        <p className="text-sm font-semibold text-slate-650 mt-1">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function SuperadminRevenuePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "superadmin") {
      router.replace("/admin/dashboard");
    } else {
      setReady(true);
    }
  }, [router]);

  const { data, isLoading } = useGetSuperadminRevenue();

  if (!ready) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fees = data?.fees;
  const salary = data?.salary;

  const feesCollectionRate = fees && fees.totalBilled > 0
    ? Math.round((fees.totalPaid / fees.totalBilled) * 100) : 0;
  const salaryDisbursedRate = salary && salary.totalAmount > 0
    ? Math.round((salary.totalPaid / salary.totalAmount) * 100) : 0;

  return (
    <div className="space-y-8 w-full relative pb-10">
      <DashboardHeader
        title="Revenue Overview"
        description="Real-time financial overview — fees collected vs. salaries disbursed."
      />

      {/* ── Fees Section ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: "var(--brand-green)" }} />
          <h2 className="text-base font-bold text-slate-800">Student Fees</h2>
          <span className="text-xs text-slate-500 font-medium">
            · {fees?.studentCount ?? 0} student{fees?.studentCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Billed" value={fmt(fees?.totalBilled ?? 0)} sub="Full fee amount invoiced" icon={DollarSign} />
          <StatCard label="Amount Collected" value={fmt(fees?.totalPaid ?? 0)} sub={`${feesCollectionRate}% collection rate`} icon={CheckCircle2} />
          <StatCard label="Outstanding" value={fmt(fees?.totalPending ?? 0)} sub="Pending from students" icon={AlertCircle} />
        </div>

        {/* Fees progress card */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Fees Collection Progress</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {fmt(fees?.totalPaid ?? 0)} collected of {fmt(fees?.totalBilled ?? 0)} total
              </p>
            </div>
            <span className={`text-xl font-bold font-heading ${feesCollectionRate >= 80 ? "text-emerald-600" : feesCollectionRate >= 50 ? "text-amber-600" : "text-rose-600"}`}>
              {feesCollectionRate}%
            </span>
          </div>
          <ProgressBar value={fees?.totalPaid ?? 0} max={fees?.totalBilled ?? 0} color="bg-[var(--brand-green)]" />
          <div className="grid grid-cols-3 gap-4 pt-1">
            {[
              { label: "Billed", val: fmt(fees?.totalBilled ?? 0), dot: "bg-slate-300" },
              { label: "Collected", val: fmt(fees?.totalPaid ?? 0), dot: "bg-[var(--brand-green)]" },
              { label: "Pending", val: fmt(fees?.totalPending ?? 0), dot: "bg-rose-400" },
            ].map(({ label, val, dot }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className="text-xs font-bold text-slate-800">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Salary Section ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-slate-500" />
          <h2 className="text-base font-bold text-slate-800">Tutor Salaries</h2>
          <span className="text-xs text-slate-500 font-medium">
            · {salary?.tutorCount ?? 0} tutor{salary?.tutorCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Payroll" value={fmt(salary?.totalAmount ?? 0)} sub="Total salary obligations" icon={Users} />
          <StatCard label="Disbursed" value={fmt(salary?.totalPaid ?? 0)} sub={`${salaryDisbursedRate}% paid out`} icon={CheckCircle2} />
          <StatCard label="Yet to Pay" value={fmt(salary?.totalPending ?? 0)} sub="Unpaid salary amount" icon={Clock} />
        </div>

        {/* Salary breakdown card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-700">Salary Disbursement Progress</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {fmt(salary?.totalPaid ?? 0)} paid of {fmt(salary?.totalAmount ?? 0)} total
                </p>
              </div>
              <span className={`text-xl font-bold font-heading ${salaryDisbursedRate >= 80 ? "text-emerald-600" : salaryDisbursedRate >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                {salaryDisbursedRate}%
              </span>
            </div>
            <ProgressBar value={salary?.totalPaid ?? 0} max={salary?.totalAmount ?? 0} color="bg-slate-700" />
            <div className="grid grid-cols-3 gap-4 pt-1">
              {[
                { label: "Total", val: fmt(salary?.totalAmount ?? 0), dot: "bg-slate-300" },
                { label: "Paid", val: fmt(salary?.totalPaid ?? 0), dot: "bg-slate-700" },
                { label: "Pending", val: fmt(salary?.totalPending ?? 0), dot: "bg-amber-400" },
              ].map(({ label, val, dot }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dot}`} />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-bold text-slate-800">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status breakdown */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6">
            <p className="text-sm font-semibold text-slate-700 mb-4">Salary Status Breakdown</p>
            <div className="space-y-3">
              {[
                {
                  label: "Fully Paid",
                  count: salary?.byStatus.paid ?? 0,
                  total: salary?.tutorCount ?? 0,
                  bar: "bg-[var(--brand-green)]",
                  badge: "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
                  icon: CheckCircle2,
                },
                {
                  label: "Partial Payment",
                  count: salary?.byStatus.partial ?? 0,
                  total: salary?.tutorCount ?? 0,
                  bar: "bg-amber-400",
                  badge: "bg-amber-50 text-amber-700 border-amber-100",
                  icon: Clock,
                },
                {
                  label: "Pending",
                  count: salary?.byStatus.pending ?? 0,
                  total: salary?.tutorCount ?? 0,
                  bar: "bg-rose-400",
                  badge: "bg-rose-50 text-rose-700 border-rose-100",
                  icon: AlertCircle,
                },
              ].map(({ label, count, total, bar, badge, icon: Icon }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-700">{label}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge}`}>
                      {count} tutor{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <ProgressBar value={count} max={total} color={bar} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Net Position ───────────────────────────────────────────────── */}
      <section>
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2"
            style={{ background: "var(--brand-light-green)" }}>
            <GraduationCap className="w-4 h-4" style={{ color: "var(--brand-mid)" }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--brand-mid)" }}>
              Net Financial Position
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {[
              {
                label: "Revenue Collected",
                value: fmt(fees?.totalPaid ?? 0),
                sub: "From student fees",
                positive: true,
              },
              {
                label: "Salaries Disbursed",
                value: fmt(salary?.totalPaid ?? 0),
                sub: "To tutors",
                positive: false,
              },
              {
                label: "Net Cash Position",
                value: fmt((fees?.totalPaid ?? 0) - (salary?.totalPaid ?? 0)),
                sub: "Revenue minus payroll",
                positive: (fees?.totalPaid ?? 0) >= (salary?.totalPaid ?? 0),
              },
            ].map(({ label, value, sub, positive }) => (
              <div key={label} className="px-6 py-5">
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <p className={`text-2xl font-bold font-heading mt-1 ${positive ? "text-slate-800" : "text-slate-800"}`}>{value}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
