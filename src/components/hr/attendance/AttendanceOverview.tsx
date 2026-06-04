import {
  CalendarDays,
  UserRoundCheck,
} from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface AttendanceOverviewProps {
  checkedInCount: number;
  totalTracked: number;
  remoteCount: number;
  lateCount: number;
  upcomingHolidayCount: number;
  nextHolidayLabel: string;
}

export default function AttendanceOverview({
  checkedInCount,
  totalTracked,
  remoteCount,
  lateCount,
  upcomingHolidayCount,
  nextHolidayLabel,
}: AttendanceOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <DashboardStatCard
        label="Today's Attendance"
        value={`${checkedInCount}/${totalTracked}`}
        icon={<UserRoundCheck className="w-5 h-5" />}
        badgeText={`${remoteCount} remote`}
        footerText={`${lateCount} late arrivals need review`}
      />

      <DashboardStatCard
        label="Upcoming Holidays"
        value={upcomingHolidayCount}
        icon={<CalendarDays className="w-5 h-5" />}
        badgeText="90-day view"
        footerText={`Next closure: ${nextHolidayLabel}`}
      />
    </div>
  );
}
