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
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Complete staff directory"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Active Tutors"
        value={activeCount}
        icon={<UserCheck className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Approved"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Assigned to active sessions"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Pending HR Approval"
        value={pendingCount}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Recruitment"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Needs HR screening"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Average GROWTH Rating"
        value={`${companyAverage} / 5.0`}
        icon={<Star className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Performance"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Overall tutor index"
        footerClassName="text-slate-400"
      />
    </div>
  );
}
