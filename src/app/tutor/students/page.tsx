"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { useGetPrograms } from "@/querys/admin/programQuery";
import { useDebounce } from "@/hooks/useDebounce";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import TutorStudentTable from "@/components/tutor/TutorStudentTable";

function TutorStudentsContent() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [programId, setProgramId] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data: response, isLoading, isFetching } = useGetTutorStudents({
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(programId ? { programId } : {}),
  });
  const { data: programsData } = useGetPrograms();

  // Full-page spinner only on initial mount (no data yet)
  if (isLoading && !response) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const students = response?.data || [];
  const programs = programsData?.programs || [];

  return (
    <div className="space-y-8 w-full pb-10">
      <DashboardHeader
        title="Student Roster"
        description="Manage your assigned students, monitor program status, and track package selections."
      />

      <TutorStudentTable
        students={students}
        onViewStudent={(id) => router.push(`/tutor/students/${id}`)}
        programs={programs}
        search={search}
        onSearchChange={setSearch}
        programId={programId}
        onProgramChange={setProgramId}
        isLoading={isFetching}
      />
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
