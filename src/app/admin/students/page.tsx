"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import AddStudentForm from "@/components/admin/students/AddStudentForm";
import { mapApiStudentToStudent, toAdmissionStatusPayload } from "@/components/admin/students/studentMapper";
import StudentStats from "@/components/admin/students/StudentStats";
import StudentTable from "@/components/admin/students/StudentTable";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import Loader from "@/components/shared/Loader";
import { useGetPrograms } from "@/querys/admin/programQuery";
import { Button } from "@/components/ui/button";
import { useConfirmation } from "@/context/ConfirmationContext";
import {
  useCreateStudent,
  useDeleteStudent,
  useGetStudents,
  useUpdateStudent,
} from "@/querys/admin/studentQuery";
import { ICreateStudentPayload, IStudent } from "@/types/admin/student";
import { Skeleton } from "@/components/ui/skeleton";
import StudentTableSkeleton from "@/components/admin/students/StudentTableSkeleton";

function StudentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirm } = useConfirmation();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterAdmissionStatus, setFilterAdmissionStatus] = useState<string>("all");
  const [filterProgramId, setFilterProgramId] = useState<string>("all");
  const [filterFeePending, setFilterFeePending] = useState<string>("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const queryParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (filterAdmissionStatus !== "all") params.admissionStatus = filterAdmissionStatus;
    if (filterProgramId !== "all") params.programId = filterProgramId;
    if (filterFeePending !== "all") params.feePending = filterFeePending === "true";
    return params;
  }, [debouncedSearch, filterAdmissionStatus, filterProgramId, filterFeePending]);

  const { data: studentsResponse, isLoading } = useGetStudents(queryParams);
  const { data: programsResponse } = useGetPrograms();
  const programsList = programsResponse?.programs ?? [];
  const { mutateAsync: createStudent, isPending: isCreating } = useCreateStudent();
  const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const { mutateAsync: deleteStudent } = useDeleteStudent();
  const shouldOpenAddModal = searchParams?.get("add") === "true";
  const [isModalOpen, setIsModalOpen] = useState(shouldOpenAddModal);
  const [studentToEdit, setStudentToEdit] = useState<IStudent | null>(null);

  const students = useMemo(
    () => (studentsResponse?.data ?? []).map(mapApiStudentToStudent),
    [studentsResponse?.data],
  );


  console.log("students",studentsResponse)

  useEffect(() => {
    if (shouldOpenAddModal) {
      router.replace("/admin/students");
    }
  }, [shouldOpenAddModal, router]);

  const handleFormSubmit = async (payload: ICreateStudentPayload) => {
    try {
      if (studentToEdit) {
        await updateStudent({ id: studentToEdit.id, data: payload });
        setStudentToEdit(null);
      } else {
        await createStudent(payload);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentToEdit(null);
  };

  const handleEditStudent = (id: string) => {
    const rawStudent = studentsResponse?.data?.find((s) => s.id === id);
    if (rawStudent) {
      setStudentToEdit(rawStudent);
      setIsModalOpen(true);
    }
  };

  const handleDeleteStudent = (id: string) => {
    const studentName = students.find((student) => student.id === id)?.name || "this student";

    confirm({
      title: "Delete Student",
      message: `Are you sure you want to delete ${studentName}? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteStudent(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateStudent({
        id,
        data: { admissionStatus: toAdmissionStatusPayload(newStatus) },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const actions = (
    <Button
      onClick={() => setIsModalOpen(true)}
      className="h-10 w-full bg-[var(--brand-green)] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-green-600/10 transition-all hover:bg-[var(--brand-mid)] hover:shadow-lg"
    >
      <Plus className="mr-1.5 h-4 w-4" />
      Add Student
    </Button>
  );

  return (
    <div className="relative w-full space-y-8 pb-10">
      <DashboardHeader
        title="Students Directory"
        description={`View admissions status, packages, coordinators, and document checklists. Total: ${studentsResponse?.total ?? (isLoading ? 0 : students.length)}`}
        actions={actions}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : (
        <StudentStats students={students} />
      )}

      {/* Filter UI */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search students by name, email..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 h-10 w-full"
          />
        </div>
        <div className="flex gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <Select value={filterAdmissionStatus} onValueChange={setFilterAdmissionStatus}>
            <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
              <SelectValue placeholder="Admission Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="admission_taken">Admission Taken</SelectItem>
              <SelectItem value="course_completed">Course Completed</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterProgramId} onValueChange={setFilterProgramId}>
            <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
              <SelectValue placeholder="Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              {programsList.map(prog => (
                <SelectItem key={prog.id || prog.title} value={prog.id || ""}>{prog.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterFeePending} onValueChange={setFilterFeePending}>
            <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
              <SelectValue placeholder="Fee Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fee Status</SelectItem>
              <SelectItem value="true">Fee Pending</SelectItem>
              <SelectItem value="false">Fee Clear</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <StudentTableSkeleton />
      ) : (
        <StudentTable
          students={students}
          onDeleteStudent={handleDeleteStudent}
          onUpdateStatus={handleUpdateStatus}
          onViewStudent={(student) => router.push(`/admin/students/${student.id}`)}
          onEditStudent={handleEditStudent}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <AddStudentForm
            onSubmit={handleFormSubmit}
            onClose={handleCloseModal}
            isSubmitting={isCreating || isUpdating}
            studentToEdit={studentToEdit || undefined}
          />
        </div>
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-green)] border-t-transparent" />
        </div>
      }
    >
      <StudentsContent />
    </Suspense>
  );
}
