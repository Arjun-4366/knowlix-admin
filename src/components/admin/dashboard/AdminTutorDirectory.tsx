"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import TutorTable from "@/components/tutors/TutorTable";
import TutorTableSkeleton from "@/components/tutors/TutorTableSkeleton";
import { useGetTutors } from "@/querys/admin/tutorQuery";

interface AdminTutorDirectoryProps {
  onBack: () => void;
}

export default function AdminTutorDirectory({ onBack }: AdminTutorDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tutorsResponse, isLoading } = useGetTutors();

  const tutorsList = useMemo(() => {
    return tutorsResponse?.data ?? [];
  }, [tutorsResponse]);

  const filteredTutors = useMemo(() => {
    return tutorsList.filter((tutor) => {
      const matchesSearch =
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tutor.subjects && tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesSearch;
    });
  }, [tutorsList, searchQuery]);

  const searchAction = (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search tutors, subjects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-55 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl w-full">
      <DashboardHeader
        title="Complete Tutor Directory"
        description="Manage active tutors, subjects, workloads, and contact emails."
        onBack={onBack}
        actions={searchAction}
      />

      {isLoading ? (
        <TutorTableSkeleton />
      ) : (
        <TutorTable tutors={filteredTutors} />
      )}
    </div>
  );
}
