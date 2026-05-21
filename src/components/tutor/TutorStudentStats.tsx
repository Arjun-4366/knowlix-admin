"use client";

import { Users, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Student } from "@/components/students/StudentStats";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface TutorStudentStatsProps {
  students: Student[];
}

export default function TutorStudentStats({ students }: TutorStudentStatsProps) {
  // Calculate high-level metrics for stats cards (based on assigned students)
  const myAssignedList = students.filter((s) => s.subjectTutor === "Dr. Ramesh Prasad");
  const totalAssigned = myAssignedList.length;
  const approvedCount = myAssignedList.filter((s) => s.admissionStatus === "Approved").length;
  const pendingCount = myAssignedList.filter(
    (s) => s.admissionStatus === "Pending Approval" || s.admissionStatus === "Pending" || s.admissionStatus === "In Review"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Assigned"
        value={totalAssigned}
        icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Assigned"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Enrolled under your tutelage"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Admissions Approved"
        value={approvedCount}
        icon={<CheckCircle2 className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Active"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Ready for regular classes"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Admissions Pending"
        value={pendingCount}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="In Progress"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Under review by admin"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Sessions Scheduled"
        value={totalAssigned * 2}
        icon={<Calendar className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="This Week"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Calculated recurring slots"
        footerClassName="text-slate-400"
      />
    </div>
  );
}
