"use client";

import { Users, CheckCircle2, Clock, Calendar } from "lucide-react";
import { IStudent } from "@/types/admin/student";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface TutorStudentStatsProps {
  students: IStudent[];
}

export default function TutorStudentStats({ students }: TutorStudentStatsProps) {
  const totalAssigned = students.length;
  
  const approvedCount = students.filter((s) => {
    const status = s.admissionStatus?.toLowerCase();
    return status === "approved" || status === "active";
  }).length;

  const pendingCount = students.filter((s) => {
    const status = s.admissionStatus?.toLowerCase();
    return status === "pending" || status === "in_review";
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Assigned"
        value={totalAssigned}
        icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Assigned"
        footerText="Enrolled under your tutelage"
      />

      <DashboardStatCard
        label="Admissions Approved"
        value={approvedCount}
        icon={<CheckCircle2 className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Active"
        footerText="Ready for regular classes"
      />

      <DashboardStatCard
        label="Admissions Pending"
        value={pendingCount}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="In Progress"
        footerText="Under review by admin"
      />

      <DashboardStatCard
        label="Sessions Scheduled"
        value={totalAssigned * 2}
        icon={<Calendar className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="This Week"
        footerText="Calculated recurring slots"
      />
    </div>
  );
}
