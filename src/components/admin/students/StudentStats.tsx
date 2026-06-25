import { Users, CheckCircle2, Clock, GraduationCap } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { IStudentSummary } from "@/types/admin/student";

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
  rawAdmissionStatus: string;
  programName: string;
  totalFee: number;
  paidAmount: number;
}

interface StudentStatsProps {
  summary: IStudentSummary;
}

export default function StudentStats({ summary }: StudentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Students"
        value={summary.total}
        icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Enrolled"
        footerText="All registered students"
      />

      <DashboardStatCard
        label="Admission Taken"
        value={summary.admissionTaken}
        icon={<CheckCircle2 className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Active"
        footerText="Currently enrolled"
      />

      <DashboardStatCard
        label="Course Completed"
        value={summary.courseCompleted}
        icon={<GraduationCap className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Completed"
        footerText="Finished their course"
      />

      <DashboardStatCard
        label="Pending Admission"
        value={summary.pending}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Pending"
        footerText="Awaiting confirmation"
      />
    </div>
  );
}
