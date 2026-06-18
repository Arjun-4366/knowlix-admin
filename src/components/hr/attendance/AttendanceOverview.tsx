import { CalendarDays, Clock, UserRoundCheck } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface AttendanceOverviewProps {
  pendingCount: number;
  approvedCount: number;
  totalCount: number;
  upcomingHolidayCount: number;
  nextHolidayLabel: string;
}

export default function AttendanceOverview({
  pendingCount,
  approvedCount,
  totalCount,
  upcomingHolidayCount,
  nextHolidayLabel,
}: AttendanceOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <DashboardStatCard
        label="Pending Approval"
        value={pendingCount}
        icon={<Clock className="w-5 h-5" />}
        badgeText="needs review"
        footerText={`${totalCount} total attendance records`}
      />

      <DashboardStatCard
        label="Approved / Present"
        value={approvedCount}
        icon={<UserRoundCheck className="w-5 h-5" />}
        badgeText={`of ${totalCount}`}
        footerText={`${totalCount - approvedCount - pendingCount} other statuses`}
      />

      <DashboardStatCard
        label="Upcoming Holidays"
        value={upcomingHolidayCount}
        icon={<CalendarDays className="w-5 h-5" />}
        badgeText="90-day view"
        footerText={`Next: ${nextHolidayLabel}`}
      />
    </div>
  );
}
