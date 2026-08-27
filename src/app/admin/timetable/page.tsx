"use client";

import { Suspense, useMemo, useState } from "react";
import { Plus, RotateCcw } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import TimetableForm from "@/components/admin/timetable/TimetableForm";
import TimetableList from "@/components/admin/timetable/TimetableList";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import StudentPaginationBar from "@/components/admin/students/StudentPaginationBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirmation } from "@/context/ConfirmationContext";
import { useGetTutors } from "@/querys/admin/tutorQuery";
import {
  useCreateTimetable,
  useDeleteTimetable,
  useGetTimetable,
  useUpdateTimetable,
} from "@/querys/admin/timetableQuery";
import {
  ICreateTimetablePayload,
  ITimetableEntry,
  IUpdateTimetablePayload,
} from "@/types/admin/timetable";

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => String(currentYear + i));
}

function TimetableContent() {
  const { confirm } = useConfirmation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<ITimetableEntry | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [filterTutor, setFilterTutor] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  const yearOptions = useMemo(() => getYearOptions(), []);

  const { data: tutorsResponse } = useGetTutors({ limit: 1000 });
  const tutorOptions = tutorsResponse?.data ?? [];

  const resetFilters = () => {
    setFilterTutor("all");
    setFilterMonth("all");
    setFilterYear("all");
    setPage(1);
  };

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const queryParams = useMemo(() => {
    const params: { page: number; limit: number; tutorId?: string; month?: number; year?: number } = {
      page,
      limit,
    };
    if (filterTutor !== "all") params.tutorId = filterTutor;
    if (filterMonth !== "all") params.month = Number(filterMonth);
    if (filterYear !== "all") params.year = Number(filterYear);
    return params;
  }, [page, limit, filterTutor, filterMonth, filterYear]);

  const { data: timetableResponse, isLoading } = useGetTimetable(queryParams);
  const { mutateAsync: createTimetable, isPending: isCreating } = useCreateTimetable();
  const { mutateAsync: updateTimetable, isPending: isUpdating } = useUpdateTimetable();
  const { mutateAsync: deleteTimetable } = useDeleteTimetable();

  const entries = timetableResponse?.data ?? [];

  const handleFormSubmit = async (payload: ICreateTimetablePayload | IUpdateTimetablePayload) => {
    try {
      if (entryToEdit) {
        await updateTimetable({ id: entryToEdit.id, data: payload });
      } else {
        await createTimetable(payload as ICreateTimetablePayload);
      }
      setIsModalOpen(false);
      setEntryToEdit(null);
    } catch {
      // toast handled in query
    }
  };

  const handleEdit = (entry: ITimetableEntry) => {
    setEntryToEdit(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Timetable Slot",
      message: "Are you sure you want to delete this timetable slot? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteTimetable(id);
        } catch {
          // toast handled in query
        }
      },
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEntryToEdit(null);
  };

  const actions = (
    <Button
      onClick={() => setIsModalOpen(true)}
      className="h-10 bg-[var(--brand-green)] px-4 text-sm font-bold text-white shadow-md shadow-green-600/10 transition-all hover:bg-[var(--brand-mid)] hover:shadow-lg">
      <Plus className="mr-1.5 h-4 w-4" />
      Add Slot
    </Button>
  );

  return (
    <div className="relative w-full space-y-8 pb-10">
      <DashboardHeader
        title="Timetable"
        description={`Manage tutor-student class schedules. Total: ${isLoading ? "..." : timetableResponse?.total ?? entries.length}`}
        actions={actions}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filterTutor} onValueChange={handleFilterChange(setFilterTutor)}>
          <SelectTrigger className="h-10 w-[180px] bg-white">
            <SelectValue placeholder="Tutor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tutors</SelectItem>
            {tutorOptions.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterMonth} onValueChange={handleFilterChange(setFilterMonth)}>
          <SelectTrigger className="h-10 w-[150px] bg-white">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterYear} onValueChange={handleFilterChange(setFilterYear)}>
          <SelectTrigger className="h-10 w-[120px] bg-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          disabled={filterTutor === "all" && filterMonth === "all" && filterYear === "all"}
          className="h-10 cursor-pointer rounded-xl border-slate-200 bg-white px-3 text-slate-600 hover:text-slate-800 disabled:opacity-40"
          title="Reset filters">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {isLoading ? (
        <Loader text="Loading timetable..." />
      ) : (
        <>
          <TimetableList entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
          <StudentPaginationBar
            page={page}
            totalPages={timetableResponse?.totalPages ?? 1}
            total={timetableResponse?.total ?? entries.length}
            limit={timetableResponse?.limit ?? limit}
            onPageChange={setPage}
          />
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <TimetableForm
            key={entryToEdit?.id ?? "new"}
            entryToEdit={entryToEdit ?? undefined}
            isSubmitting={isCreating || isUpdating}
            onSubmit={handleFormSubmit}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}

export default function TimetablePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-green)] border-t-transparent" />
        </div>
      }>
      <TimetableContent />
    </Suspense>
  );
}
