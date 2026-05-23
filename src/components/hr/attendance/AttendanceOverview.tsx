import {
  CalendarDays,
  Clock3,
  FileCheck2,
  UserRoundCheck,
} from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface AttendanceOverviewProps {
  checkedInCount: number;
  totalTracked: number;
  remoteCount: number;
  lateCount: number;
  pendingLeaveCount: number;
  approvedLeaveCount: number;
  leaveStartingSoonCount: number;
  upcomingHolidayCount: number;
  nextHolidayLabel: string;
  activeShiftCount: number;
  staffedHours: number;
  onsiteAssignmentCount: number;
}

export default function AttendanceOverview({
  checkedInCount,
  totalTracked,
  remoteCount,
  lateCount,
  pendingLeaveCount,
  approvedLeaveCount,
  leaveStartingSoonCount,
  upcomingHolidayCount,
  nextHolidayLabel,
  activeShiftCount,
  staffedHours,
  onsiteAssignmentCount,
}: AttendanceOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardStatCard
        label="Today's Attendance"
        value={`${checkedInCount}/${totalTracked}`}
        icon={<UserRoundCheck className="w-5 h-5" />}
        badgeText={`${remoteCount} remote`}
        footerText={`${lateCount} late arrivals need review`}
      />

      <DashboardStatCard
        label="Pending Leave Queue"
        value={pendingLeaveCount}
        icon={<FileCheck2 className="w-5 h-5" />}
        badgeText={`${leaveStartingSoonCount} this week`}
        footerText={`${approvedLeaveCount} requests already approved`}
      />

      <DashboardStatCard
        label="Upcoming Holidays"
        value={upcomingHolidayCount}
        icon={<CalendarDays className="w-5 h-5" />}
        badgeText="90-day view"
        footerText={`Next closure: ${nextHolidayLabel}`}
      />

      <DashboardStatCard
        label="Active Shift Plans"
        value={activeShiftCount}
        icon={<Clock3 className="w-5 h-5" />}
        badgeText={`${onsiteAssignmentCount} onsite`}
        footerText={`${staffedHours} staffed hours mapped weekly`}
      />
    </div>
  );
}

