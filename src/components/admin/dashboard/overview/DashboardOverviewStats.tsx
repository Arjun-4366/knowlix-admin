import { Clock, GraduationCap, Users } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { IDashboardPayload } from "@/types/admin/dashboard";

interface DashboardOverviewStatsProps {
  dashboardData?: IDashboardPayload;
  onViewChange: (view: "tutors" | "students" | "sessions") => void;
}

const formatSessionDate = (date?: string) => {
  if (!date) {
    return "Today";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const buildSessionFooter = (dashboardData?: IDashboardPayload) => {
  const todaySessions = dashboardData?.todaySessions;

  if (!todaySessions) {
    return "View today details";
  }

  const parts = [
    `${todaySessions.conducted} conducted`,
    `${todaySessions.postponed} postponed`,
  ];

  if (todaySessions.notConducted > 0) {
    parts.push(`${todaySessions.notConducted} not conducted`);
  }

  return parts.join(", ");
};

export default function DashboardOverviewStats({
  dashboardData,
  onViewChange,
}: DashboardOverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <DashboardStatCard
        label="Total Tutors"
        value={dashboardData?.totalTutors ?? 0}
        icon={<GraduationCap className="h-6 w-6" />}
        badgeText={dashboardData?.pendingTutors ? `${dashboardData.pendingTutors} Pending` : "All Clear"}
        footerText={
          dashboardData?.pendingTutors
            ? `${dashboardData.pendingTutors} tutors awaiting approval`
            : `${dashboardData?.totalTutors ?? 0} tutors available`
        }
        footerLink
        onClick={() => onViewChange("tutors")}
      />

      <DashboardStatCard
        label="Total Students"
        value={dashboardData?.totalStudents ?? 0}
        icon={<Users className="h-6 w-6" />}
        badgeText={dashboardData?.activeStudents ? `${dashboardData.activeStudents} Active` : "Enrolled"}
        footerText={`${dashboardData?.totalStudents ?? 0} enrolled students`}
        footerLink
        onClick={() => onViewChange("students")}
      />

     
      <DashboardStatCard
        label="Active Sessions"
        value={dashboardData?.todaySessions?.total ?? 0}
        icon={<Clock className="h-6 w-6" />}
        badgeText={formatSessionDate(dashboardData?.todaySessions?.date)}
        footerText={buildSessionFooter(dashboardData)}
        footerLink
        onClick={() => onViewChange("sessions")}
      />
    </div>
  );
}
