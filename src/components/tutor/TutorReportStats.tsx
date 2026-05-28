"use client";

import { FileSpreadsheet, Award, Calendar, AlertCircle } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { Student } from "@/components/admin/students/StudentStats";

export interface ProgressReport {
  id: string;
  studentId: string;
  studentName: string;
  templateId: "monthly" | "term-end" | "weekly";
  templateName: string;
  period: string;
  attendanceRate: number;
  academicScores: { subject: string; score: number }[];
  behavioralRatings: {
    attentiveness: "Excellent" | "Good" | "Needs Improvement";
    participation: "Excellent" | "Good" | "Needs Improvement";
    homeworkPunctuality: "Excellent" | "Good" | "Needs Improvement";
  };
  tutorFeedback: string;
  overallGrade: string;
  generatedAt: string;
  tutorName: string;
}

interface TutorReportStatsProps {
  reports: ProgressReport[];
  students: Student[];
}

export default function TutorReportStats({ reports, students }: TutorReportStatsProps) {
  const totalReports = reports.length;

  // Calculate Average Attendance Rate across reports
  let avgAttendance = 0;
  if (totalReports > 0) {
    const sum = reports.reduce((acc, r) => acc + (r.attendanceRate || 0), 0);
    avgAttendance = Math.round((sum / totalReports) * 10) / 10;
  }

  // Calculate pending reviews: students who do not have a report generated
  const studentsWithReports = new Set(reports.map((r) => r.studentId));
  const pendingReviewsCount = students.filter((s) => !studentsWithReports.has(s.id)).length;

  // Top Performing Grade/Student or Subject
  // Let's determine the percentage of A+ and A grades
  const highGradesCount = reports.filter(
    (r) => r.overallGrade === "A+" || r.overallGrade === "A" || r.overallGrade === "O"
  ).length;
  const topClassPerformance =
    totalReports > 0
      ? `${Math.round((highGradesCount / totalReports) * 100)}% A/A+`
      : "N/A";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Reports Generated"
        value={totalReports}
        icon={<FileSpreadsheet className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="All Time"
        footerText="Reports successfully stored"
      />

      <DashboardStatCard
        label="Overall Quality Rate"
        value={topClassPerformance}
        icon={<Award className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Academic Quality"
        footerText="Percentage of A/A+ reports"
      />

      <DashboardStatCard
        label="Avg Report Attendance"
        value={`${avgAttendance}%`}
        icon={<Calendar className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Avg Presence"
        footerText="Average presence in active reports"
      />

      <DashboardStatCard
        label="Pending Student Reviews"
        value={pendingReviewsCount}
        icon={<AlertCircle className="w-6 h-6 text-amber-600" />}
        badgeText="Needs Report"
        footerText="Students without active reports"
      />
    </div>
  );
}

