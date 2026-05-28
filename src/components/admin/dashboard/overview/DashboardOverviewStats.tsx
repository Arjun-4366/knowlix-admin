import { Clock, DollarSign, GraduationCap, Users } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { IDashboardPayload } from "@/types/admin/dashboard";

interface DashboardOverviewStatsProps {
  dashboardData?: IDashboardPayload;
  onViewChange: (view: "tutors" | "students" | "sessions") => void;
}

const formatMonthLabel = (month?: string) => {
  if (!month) {
    return "This Month";
  }

  const parsedDate = new Date(`${month}-01T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return month;
  }

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

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

const formatRevenue = (dashboardData?: IDashboardPayload) => {
  const monthlyRevenue = dashboardData?.monthlyRevenue;

  if (!monthlyRevenue) {
    return "INR 0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: monthlyRevenue.currency,
    maximumFractionDigits: 0,
  }).format(monthlyRevenue.amount);
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-4">
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
        label="Monthly Revenue"
        value={formatRevenue(dashboardData)}
        icon={<DollarSign className="h-6 w-6" />}
        badgeText={formatMonthLabel(dashboardData?.monthlyRevenue?.month)}
        footerText={
          dashboardData?.monthlyRevenue?.amount
            ? "Calculated dynamically"
            : "No revenue recorded this month"
        }
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
