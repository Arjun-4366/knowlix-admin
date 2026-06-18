import { Banknote, Clock, Wallet } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { formatCompactCurrency } from "./utils";

interface PayrollOverviewProps {
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  totalRecords: number;
}

export default function PayrollOverview({
  totalAmount,
  totalPaid,
  totalPending,
  totalRecords,
}: PayrollOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DashboardStatCard
        label="Total Payroll"
        value={formatCompactCurrency(totalAmount)}
        icon={<Wallet className="w-5 h-5" />}
        badgeText={`${totalRecords} records`}
        footerText="Combined salary across all tutor records"
      />

      <DashboardStatCard
        label="Total Paid"
        value={formatCompactCurrency(totalPaid)}
        icon={<Banknote className="w-5 h-5" />}
        badgeText={totalAmount > 0 ? `${Math.round((totalPaid / totalAmount) * 100)}% settled` : "—"}
        footerText="Amount successfully disbursed to tutors"
      />

      <DashboardStatCard
        label="Total Pending"
        value={formatCompactCurrency(totalPending)}
        icon={<Clock className="w-5 h-5" />}
        badgeText="outstanding"
        footerText="Remaining salary yet to be disbursed"
      />
    </div>
  );
}
