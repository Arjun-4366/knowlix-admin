"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import TutorStudentStats from "@/components/tutor/TutorStudentStats";
import TutorStudentTable from "@/components/tutor/TutorStudentTable";

function TutorStudentsContent() {
  const router = useRouter();
  const { data: response, isLoading } = useGetTutorStudents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const students = response?.data || [];

  const handleViewDetails = (id: string) => {
    router.push(`/tutor/students/${id}`);
  };

  return (
    <div className="space-y-8 w-full pb-10">
      <DashboardHeader
        title="Student Roster"
        description="Manage your assigned students, monitor program status, and track package selections."
      />

      <TutorStudentStats students={students} />

      <TutorStudentTable students={students} onViewStudent={handleViewDetails} />
    </div>
  );
}

export default function TutorStudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorStudentsContent />
    </Suspense>
  );
}
