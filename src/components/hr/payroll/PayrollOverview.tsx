import { Calculator, FileText, Receipt, Wallet } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { formatCompactCurrency } from "./utils";

interface PayrollOverviewProps {
  grossPayTotal: number;
  netPayTotal: number;
  generatedCount: number;
  totalPayslips: number;
  bonusTotal: number;
  deductionTotal: number;
  tdsYtdTotal: number;
  projectedTaxTotal: number;
  declarationReviewCount: number;
}

export default function PayrollOverview({
  grossPayTotal,
  netPayTotal,
  generatedCount,
  totalPayslips,
  bonusTotal,
  deductionTotal,
  tdsYtdTotal,
  projectedTaxTotal,
  declarationReviewCount,
}: PayrollOverviewProps) {
  const pendingCount = Math.max(totalPayslips - generatedCount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardStatCard
        label="Current Cycle Gross"
        value={formatCompactCurrency(grossPayTotal)}
        icon={<Wallet className="w-5 h-5" />}
        badgeText={formatCompactCurrency(netPayTotal)}
        footerText="Expected net payout after taxes and statutory deductions"
      />

      <DashboardStatCard
        label="Payslip Generation"
        value={`${generatedCount}/${totalPayslips}`}
        icon={<FileText className="w-5 h-5" />}
        badgeText={`${pendingCount} pending`}
        footerText="Ready and draft records still need release processing"
      />

      <DashboardStatCard
        label="Bonuses & Deductions"
        value={formatCompactCurrency(bonusTotal)}
        icon={<Receipt className="w-5 h-5" />}
        badgeText={`-${formatCompactCurrency(deductionTotal)}`}
        footerText="Approved and applied cycle adjustments currently mapped"
      />

      <DashboardStatCard
        label="Tax & Records"
        value={formatCompactCurrency(tdsYtdTotal)}
        icon={<Calculator className="w-5 h-5" />}
        badgeText={`${declarationReviewCount} review`}
        footerText={`Projected annual tax ${formatCompactCurrency(projectedTaxTotal)}`}
      />
    </div>
  );
}
