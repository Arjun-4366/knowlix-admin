"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import EmployeeStats from "./EmployeeStats";
import EmployeeTable from "./EmployeeTable";
import AddTutorForm from "@/components/tutors/AddTutorForm";
import { useGetTutorsHR, useCreateTutorByHR, useUpdateTutorByHR } from "@/querys/admin/hrQuery";
import { ICreateTutorPayload, ITutor } from "@/types/admin/tutor";

const PAGE_LIMIT = 10;

export default function EmployeeManager() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [syllabus, setSyllabus] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState<ITutor | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [status, syllabus, availability]);

  const queryParams = {
    search: debouncedSearch || undefined,
    status: status !== "all" ? status : undefined,
    syllabus: syllabus !== "all" ? syllabus : undefined,
    availability: availability !== "all" ? availability : undefined,
    page,
    limit: PAGE_LIMIT,
  };

  const { data, isLoading } = useGetTutorsHR(queryParams);
  const { mutateAsync: createTutor, isPending: isCreating } = useCreateTutorByHR();
  const { mutateAsync: updateTutor, isPending: isUpdating } = useUpdateTutorByHR();

  const tutors = data?.data ?? [];
  const total = data?.total ?? 0;

  // Derive stat counts from the main query — no extra API calls on mount.
  // Each count is meaningful only when the matching filter is active.
  const filteredTotal = data?.total ?? 0;
  const statTotal      = status === "all"      ? filteredTotal : 0;
  const statActive     = status === "approved" ? filteredTotal : 0;
  const statProbation  = status === "pending"  ? filteredTotal : 0;
  const statDeparted   = (status === "inactive" || status === "resigned") ? filteredTotal : 0;

  const handleFormSubmit = async (payload: ICreateTutorPayload) => {
    try {
      await createTutor(payload);
      setIsAddModalOpen(false);
    } catch {
      // error toast handled inside the mutation
    }
  };

  const handleEditSubmit = async (payload: ICreateTutorPayload) => {
    if (!editingTutor) return;
    try {
      const { password: _p, ...rest } = payload;
      await updateTutor({ id: editingTutor.id, data: rest });
      setEditingTutor(null);
    } catch {
      // error toast handled inside the mutation
    }
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Employee Directory"
        description="Tutor database with search, filters, and pagination — all server-side."
        actions={
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-4 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm shadow-md shadow-green-600/10 transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Employee
          </Button>
        }
      />

      <EmployeeStats
        totalCount={statTotal}
        activeCount={statActive}
        probationCount={statProbation}
        departedCount={statDeparted}
        activeFilter={status}
      />

      {isLoading ? (
        <div className="flex h-96 items-center justify-center bg-white rounded-2xl border border-slate-150 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" />
        </div>
      ) : (
        <EmployeeTable
          tutors={tutors}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          syllabus={syllabus}
          onSyllabusChange={setSyllabus}
          availability={availability}
          onAvailabilityChange={setAvailability}
          page={page}
          limit={PAGE_LIMIT}
          total={total}
          onPageChange={setPage}
          onSelectTutor={(t) => router.push(`/hr/employees/${t.id}`)}
          onEditTutor={(t) => setEditingTutor(t)}
        />
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <AddTutorForm
            hrMode
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleFormSubmit}
            isSubmitting={isCreating}
          />
        </div>
      )}

      {editingTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <AddTutorForm
            hrMode
            tutorToEdit={editingTutor}
            onClose={() => setEditingTutor(null)}
            onSubmit={handleEditSubmit}
            isSubmitting={isUpdating}
          />
        </div>
      )}
    </div>
  );
}
