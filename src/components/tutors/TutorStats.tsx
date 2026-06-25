import { GraduationCap, UserCheck, Clock, UserX } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { ITutorSummary } from "@/types/admin/tutor";

interface TutorStatsProps {
  summary: ITutorSummary;
}

export default function TutorStats({ summary }: TutorStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Registered"
        value={summary.total}
        icon={<GraduationCap className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="All Time"
        footerText="Complete staff directory"
      />

      <DashboardStatCard
        label="Active Tutors"
        value={summary.approved}
        icon={<UserCheck className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Approved"
        footerText="Assigned to active sessions"
      />

      <DashboardStatCard
        label="Pending Approval"
        value={summary.pending}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Recruitment"
        footerText="Needs HR screening"
      />

      <DashboardStatCard
        label="Inactive / Resigned"
        value={summary.inactive + summary.resigned}
        icon={<UserX className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Inactive"
        footerText={`${summary.inactive} inactive · ${summary.resigned} resigned`}
      />
    </div>
  );
}
