"use client";

import { FileSpreadsheet, Award, BookOpen, AlertCircle } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

export interface ReportStudent {
  id: string;
  name: string;
  programName: string;
  admissionNo: string;
}

export interface SubjectMark {
  subject: string;
  faMax: number;
  faScored: number;
  saMax: number;
  saScored: number;
}

export interface GradeCardReport {
  id: string;
  studentId: string;
  studentName: string;
  programName: string;
  admissionNo: string;
  reportType: "monthly" | "five-month" | "annual";
  reportTypeName: string;
  period: string;
  academicYear: string;
  examTitle: string;
  subjects: SubjectMark[];
  issueDate: string;
  generatedAt: string;
}

export type ProgressReport = GradeCardReport;

interface TutorReportStatsProps {
  reports: GradeCardReport[];
  students: ReportStudent[];
}

export function calcGrade(scored: number, max: number): string {
  if (max === 0) return "-";
  const pct = (scored / max) * 100;
  if (pct >= 91) return "A1";
  if (pct >= 81) return "A2";
  if (pct >= 71) return "B1";
  if (pct >= 61) return "B2";
  if (pct >= 51) return "C1";
  if (pct >= 41) return "C2";
  if (pct >= 33) return "D";
  return "E";
}

export default function TutorReportStats({ reports, students }: TutorReportStatsProps) {
  const totalReports = reports.length;
  const studentsWithReports = new Set(reports.map((r) => r.studentId));
  const pendingReviewsCount = students.filter((s) => !studentsWithReports.has(s.id)).length;
  const totalSubjects = reports.reduce((acc, r) => acc + r.subjects.length, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Reports Generated"
        value={totalReports}
        icon={<FileSpreadsheet className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="All Time"
        footerText="Reports saved to API"
      />

      <DashboardStatCard
        label="Total Students"
        value={students.length}
        icon={<Award className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Enrolled"
        footerText="Active student list"
      />

      <DashboardStatCard
        label="Total Subjects Entered"
        value={totalSubjects}
        icon={<BookOpen className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Across Reports"
        footerText="Subjects across all reports"
      />

      <DashboardStatCard
        label="Pending Reviews"
        value={pendingReviewsCount}
        icon={<AlertCircle className="w-6 h-6 text-amber-600" />}
        badgeText="Needs Report"
        footerText="Students without reports"
      />
    </div>
  );
}
