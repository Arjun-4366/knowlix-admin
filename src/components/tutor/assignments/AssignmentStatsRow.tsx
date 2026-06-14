"use client";

import { FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { ITutorAssignment } from "@/types/tutor/assignments";

export default function AssignmentStatsRow({
  assignments,
}: {
  assignments: ITutorAssignment[];
}) {
  const total = assignments.length;
  const evaluated = assignments.filter((a) => a.status === "evaluated").length;
  const submitted = assignments.filter((a) => a.status === "submitted").length;
  const assigned = assignments.filter((a) => a.status === "assigned").length;
  const expired = assignments.filter((a) => a.status === "expired").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Assignments"
        value={total}
        icon={<FileText className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="All"
        footerText="All assignments assigned to students"
      />
      <DashboardStatCard
        label="Assigned"
        value={assigned}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText={`${submitted} Submitted`}
        footerText="Pending submission from students"
      />
      <DashboardStatCard
        label="Evaluated"
        value={evaluated}
        icon={<CheckCircle2 className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Graded"
        footerText="Assignments reviewed and graded"
      />
      <DashboardStatCard
        label="Expired"
        value={expired}
        icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
        badgeText="Past Due"
        footerText="Past due date with no submission"
      />
    </div>
  );
}
