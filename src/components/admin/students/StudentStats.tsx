import { Users, FileText, CheckCircle2, Clock } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

export interface Student {
  id: string;
  admissionNumber?: string;
  name: string;
  parentName: string;
  grade: string;
  location: string;
  courseType: string;
  courseName: string;
  subjectTutor: string;
  mentorSalesBro: string;
  packageSelection: string;
  customPackageDuration?: string;
  documentsSubmitted: string[];
  coordinatorName: string;
  admissionStatus: string;
}

interface StudentStatsProps {
  students: Student[];
}

export default function StudentStats({ students }: StudentStatsProps) {
  const total = students.length;
  const docsComplete = students.filter(
    (s) => s.documentsSubmitted && s.documentsSubmitted.length === 4
  ).length;
  const approved = students.filter(
    (s) => s.admissionStatus === "Approved"
  ).length;
  const pending = students.filter(
    (s) => s.admissionStatus === "Pending Approval" || s.admissionStatus === "Pending" || s.admissionStatus === "In Review"
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Students"
        value={total}
        icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Enrolled"
        footerText="Active student list"
      />

      <DashboardStatCard
        label="Documents Complete"
        value={docsComplete}
        icon={<FileText className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="All Submitted"
        footerText={`${total - docsComplete} pending upload`}
      />

      <DashboardStatCard
        label="Admissions Approved"
        value={approved}
        icon={<CheckCircle2 className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Approved"
        footerText="Ready for sessions"
      />

      <DashboardStatCard
        label="Admissions Pending"
        value={pending}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="In Review"
        footerText="Needs coordinator action"
      />
    </div>
  );
}

