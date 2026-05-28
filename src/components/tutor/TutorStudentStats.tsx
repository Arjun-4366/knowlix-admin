"use client";

import { Users, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Student } from "@/components/admin/students/StudentStats";
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

