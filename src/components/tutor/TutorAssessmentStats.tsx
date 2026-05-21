"use client";

import { FileText, FileCheck, CheckSquare, Percent } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: "Active" | "Completed";
  totalStudents: number;
  submittedCount: number;
  tutorName: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: "Pending" | "Conducted";
  tutorName: string;
}

export interface Evaluation {
  id: string;
  studentId: string;
  studentName: string;
  assessmentType: "Assignment" | "Exam";
  assessmentId: string;
  assessmentTitle: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  remarks: string;
  evaluatedAt: string;
  tutorName: string;
}

interface TutorAssessmentStatsProps {
  assignments: Assignment[];
  exams: Exam[];
  evaluations: Evaluation[];
}

export default function TutorAssessmentStats({
  assignments,
  exams,
  evaluations,
}: TutorAssessmentStatsProps) {
  // Metrics calculations
  const activeAssignments = assignments.filter((a) => a.status === "Active").length;
  const pendingExams = exams.filter((e) => e.status === "Pending").length;
  const totalEvaluations = evaluations.length;

  // Calculate average score percentage
  let avgScore = 0;
  if (totalEvaluations > 0) {
    const totalPercentage = evaluations.reduce((sum, e) => {
      const percentage = e.maxMarks > 0 ? (e.obtainedMarks / e.maxMarks) * 100 : 0;
      return sum + percentage;
    }, 0);
    avgScore = Math.round(totalPercentage / totalEvaluations);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Active Assignments"
        value={activeAssignments}
        icon={<FileText className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Assigned"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Currently open for submissions"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Scheduled Exams"
        value={pendingExams}
        icon={<CheckSquare className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Upcoming"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Tests scheduled to be conducted"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Evaluated Tasks"
        value={totalEvaluations}
        icon={<FileCheck className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Total"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Tasks marked and graded"
        footerClassName="text-slate-400"
      />

      <DashboardStatCard
        label="Average Score"
        value={`${avgScore}%`}
        icon={<Percent className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Performance"
        badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
        gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
        iconBgClass="bg-[var(--brand-light-green)]"
        footerText="Average grade across evaluations"
        footerClassName="text-slate-400"
      />
    </div>
  );
}
