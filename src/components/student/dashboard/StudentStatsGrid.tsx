"use client";

import { CheckCircle, BookOpen, TrendingUp, CreditCard } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface StudentStatsGridProps {
  attendanceRate: number;
  presentCount: number;
  scheduledCount: number;
  assignmentsPercent: number;
  completedAssignments: number;
  pendingAssignments: number;
  totalAssignments: number;
  averageScore: number;
  dueAmount: number;
}

export default function StudentStatsGrid({
  attendanceRate,
  presentCount,
  scheduledCount,
  assignmentsPercent,
  completedAssignments,
  pendingAssignments,
  totalAssignments,
  averageScore,
  dueAmount,
}: StudentStatsGridProps) {
  const isPaid = dueAmount <= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Attendance Rate"
        value={`${attendanceRate}%`}
        icon={<CheckCircle className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Active"
        footerText={`${presentCount}/${scheduledCount} classes attended`}
      />

      <DashboardStatCard
        label="Assignments Completed"
        value={`${assignmentsPercent}%`}
        icon={<BookOpen className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText={pendingAssignments > 0 ? `${pendingAssignments} Pending` : "On Track"}
        footerText={`${completedAssignments}/${totalAssignments} tasks submitted`}
      />

      <DashboardStatCard
        label="Average Score"
        value={`${averageScore}%`}
        icon={<TrendingUp className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Overall"
        footerText="Across all evaluated exams"
      />

      <DashboardStatCard
        label="Fees Outstanding"
        value={isPaid ? "Paid" : `₹${dueAmount.toLocaleString("en-IN")}`}
        icon={<CreditCard className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText={isPaid ? "Cleared" : "Pending"}
        footerText={isPaid ? "No outstanding bills" : "Outstanding balance"}
      />
    </div>
  );
}

