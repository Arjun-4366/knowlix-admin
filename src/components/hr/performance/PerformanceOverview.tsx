import {
  ChartNoAxesCombined,
  Goal,
  MessageSquareMore,
  ShieldCheck,
} from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { PerformanceCycleStatus } from "./types";
import { formatPercent, formatScore } from "./utils";

interface PerformanceOverviewProps {
  cycleStatus: PerformanceCycleStatus;
  averageScore: number;
  highPerformerCount: number;
  appraisalsInMotion: number;
  calibrationReadyCount: number;
  constructiveFeedbackCount: number;
  goalsOnTrackCount: number;
  totalGoals: number;
  achievedGoalCount: number;
  needsSupportCount: number;
  averageGoalProgress: number;
  watchlistCount: number;
}

export default function PerformanceOverview({
  cycleStatus,
  averageScore,
  highPerformerCount,
  appraisalsInMotion,
  calibrationReadyCount,
  constructiveFeedbackCount,
  goalsOnTrackCount,
  totalGoals,
  achievedGoalCount,
  needsSupportCount,
  averageGoalProgress,
  watchlistCount,
}: PerformanceOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardStatCard
        label="Core Value Index"
        value={formatScore(averageScore)}
        icon={<ShieldCheck className="w-5 h-5" />}
        badgeText={cycleStatus}
        footerText={`${highPerformerCount} employees are currently above a 4.3 overall rating`}
      />

      <DashboardStatCard
        label="Appraisals & Feedback"
        value={appraisalsInMotion}
        icon={<MessageSquareMore className="w-5 h-5" />}
        badgeText={`${calibrationReadyCount} ready`}
        footerText={`${constructiveFeedbackCount} constructive feedback items need follow-through`}
      />

      <DashboardStatCard
        label="Goal Delivery"
        value={`${goalsOnTrackCount}/${totalGoals}`}
        icon={<Goal className="w-5 h-5" />}
        badgeText={`${achievedGoalCount} achieved`}
        footerText={`${needsSupportCount} goals still need manager support or unblockers`}
      />

      <DashboardStatCard
        label="KPI Momentum"
        value={formatPercent(averageGoalProgress)}
        icon={<ChartNoAxesCombined className="w-5 h-5" />}
        badgeText={`${watchlistCount} watchlist`}
        footerText="Average KPI progress across the active employee and goal set"
      />
    </div>
  );
}
