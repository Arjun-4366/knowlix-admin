"use client";

import { FileText, FileCheck, CheckSquare, Percent } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { ITutorAssignment } from "@/types/tutor/assignments";
import { ITutorExam } from "@/types/tutor/exams";

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
  assignments: ITutorAssignment[];
  exams: ITutorExam[];
  evaluations: Evaluation[];
}

export default function TutorAssessmentStats({
  assignments,
  exams,
  evaluations,
}: TutorAssessmentStatsProps) {
  // Metrics calculations
  const activeAssignments = assignments.filter((a) => a.status === "assigned" || a.status === "submitted").length;
  const pendingExams = exams.filter((e) => e.status === "pending").length;
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
        footerText="Currently open for submissions"
      />

      <DashboardStatCard
        label="Scheduled Exams"
        value={pendingExams}
        icon={<CheckSquare className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Upcoming"
        footerText="Tests scheduled to be conducted"
      />

      <DashboardStatCard
        label="Evaluated Tasks"
        value={totalEvaluations}
        icon={<FileCheck className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Total"
        footerText="Tasks marked and graded"
      />

      <DashboardStatCard
        label="Average Score"
        value={`${avgScore}%`}
        icon={<Percent className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Performance"
        footerText="Average grade across evaluations"
      />
    </div>
  );
}

