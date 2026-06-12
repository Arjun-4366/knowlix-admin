"use client";

import { useState, useMemo, useEffect } from "react";
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: tutorsResponse, isLoading } = useGetTutors({
    limit,
    page,
    search: debouncedSearch || undefined,
  });

  const filteredTutors = tutorsResponse?.data ?? [];

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
        <>
          <TutorTable tutors={filteredTutors} />
          <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-xl border border-slate-150 shadow-sm">
            <span className="text-sm text-slate-500 font-medium">
              Showing page {page} (Total {tutorsResponse?.total || 0})
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={(tutorsResponse?.data?.length || 0) < limit}
                className="px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
