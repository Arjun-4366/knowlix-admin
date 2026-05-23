import { GraduationCap, UserCheck, Clock, Star } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface TutorStatsProps {
  totalTutors: number;
  activeCount: number;
  pendingCount: number;
  companyAverage: string;
}

export default function TutorStats({
  totalTutors,
  activeCount,
  pendingCount,
  companyAverage,
}: TutorStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Registered"
        value={totalTutors}
        icon={<GraduationCap className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="All Time"
        footerText="Complete staff directory"
      />

      <DashboardStatCard
        label="Active Tutors"
        value={activeCount}
        icon={<UserCheck className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Approved"
        footerText="Assigned to active sessions"
      />

      <DashboardStatCard
        label="Pending HR Approval"
        value={pendingCount}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Recruitment"
        footerText="Needs HR screening"
      />

      <DashboardStatCard
        label="Average GROWTH Rating"
        value={`${companyAverage} / 5.0`}
        icon={<Star className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Performance"
        footerText="Overall tutor index"
      />
    </div>
  );
}

