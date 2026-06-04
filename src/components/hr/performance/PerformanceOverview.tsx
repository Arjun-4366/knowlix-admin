import { ShieldCheck, UserRoundCheck } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { PerformanceCycleStatus } from "./types";
import { formatScore } from "./utils";

interface PerformanceOverviewProps {
  cycleStatus: PerformanceCycleStatus;
  averageScore: number;
  highPerformerCount: number;
  totalEvaluations: number;
}

export default function PerformanceOverview({
  cycleStatus,
  averageScore,
  highPerformerCount,
  totalEvaluations,
}: PerformanceOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <DashboardStatCard
        label="Core Value Index"
        value={formatScore(averageScore)}
        icon={<ShieldCheck className="w-5 h-5" />}
        badgeText={cycleStatus}
        footerText={`Average evaluation score across the current review cycle`}
      />

      <DashboardStatCard
        label="Evaluations & Performers"
        value={totalEvaluations}
        icon={<UserRoundCheck className="w-5 h-5" />}
        badgeText={`${highPerformerCount} high`}
        footerText="Tutors scoring 8.0 or above in their performance reviews"
      />
    </div>
  );
}
