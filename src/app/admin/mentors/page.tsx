"use client";

import { useState, useMemo, Suspense } from "react";
import { Plus, Search, Trash2, Pencil, Briefcase, Mail, Phone, Users, ShieldAlert, Award } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirmation } from "@/context/ConfirmationContext";
import {
  useGetMentors,
  useCreateMentor,
  useUpdateMentor,
  useDeleteMentor,
} from "@/querys/admin/mentorQuery";
import { ICreateMentorPayload, IMentor } from "@/types/admin/mentor";
import { Skeleton } from "@/components/ui/skeleton";
import AddMentorForm from "@/components/mentors/AddMentorForm";

function MentorsContent() {
  const { confirm } = useConfirmation();
  const { data: mentorsResponse, isLoading } = useGetMentors();
  const { mutateAsync: createMentor, isPending: isCreating } = useCreateMentor();
  const { mutateAsync: updateMentor, isPending: isUpdating } = useUpdateMentor();
  const { mutateAsync: deleteMentor } = useDeleteMentor();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mentorToEdit, setMentorToEdit] = useState<IMentor | null>(null);

  const mentorsList = useMemo(() => {
    return mentorsResponse?.data ?? [];
  }, [mentorsResponse]);

  const uniqueDepartments = useMemo(() => {
    const depts = new Set<string>();
    mentorsList.forEach((m) => {
      if (m.department) depts.add(m.department);
    });
    return Array.from(depts);
  }, [mentorsList]);

  const handleEditMentor = (mentorId: string) => {
    const mentor = mentorsList.find((m) => m.id === mentorId);
    if (mentor) {
      setMentorToEdit(mentor);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteMentor = (mentorId: string) => {
    const mentorName = mentorsList.find((m) => m.id === mentorId)?.name || "this mentor";
    confirm({
      title: "Delete Mentor",
      message: `Are you sure you want to delete "${mentorName}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteMentor(mentorId);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleFormSubmit = async (payload: ICreateMentorPayload & { status?: string }) => {
    try {
      if (mentorToEdit) {
        await updateMentor({ id: mentorToEdit.id, data: payload });
        setMentorToEdit(null);
      } else {
        await createMentor(payload);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setMentorToEdit(null);
  };

  // Stats Calculations
  const totalMentors = mentorsList.length;
  const activeCount = mentorsList.filter((m) => m.status === "active").length;
  const inactiveCount = mentorsList.filter((m) => m.status === "inactive").length;

  const filteredMentors = useMemo(() => {
    return mentorsList.filter((mentor) => {
      const matchesSearch =
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.phone.includes(searchQuery) ||
        mentor.designation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || mentor.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDepartment =
        departmentFilter === "All" || mentor.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [mentorsList, searchQuery, statusFilter, departmentFilter]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700 border-green-200";
      case "inactive":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 w-full relative pb-10">
      {/* Header Banner */}
      <DashboardHeader
        title="Mentors Management"
        description="Oversee mentor profiles, allocate student learning workflows, and configure departments."
        actions={
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full h-10 px-4 py-2.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm shadow-md shadow-green-600/10 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Mentor
          </Button>
        }
      />

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </>
        ) : (
          <>
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[var(--brand-green)]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{totalMentors}</p>
                <p className="text-xs font-semibold text-slate-400">Total Mentors</p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
                <p className="text-xs font-semibold text-slate-400">Active Mentors</p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{inactiveCount}</p>
                <p className="text-xs font-semibold text-slate-400">Inactive / Pending</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <Input
            type="text"
            placeholder="Search mentors by name, email, designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-10 bg-white border border-slate-200 focus:border-green-500 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Departments</SelectItem>
              {uniqueDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : (
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden w-full">
          <Table className="w-full table-fixed">
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">
                  Mentor
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">
                  Contact
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">
                  Role Details
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => (
                  <TableRow key={mentor.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-light-green)] text-sm font-bold text-[var(--brand-green)]">
                          {mentor.name.charAt(0)}
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-semibold text-slate-800 truncate">{mentor.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">ID: {mentor.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1 text-slate-650">
                        <div className="flex items-center gap-1.5 text-xs truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{mentor.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{mentor.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {mentor.department}
                        </span>
                        <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-450" />
                          {mentor.designation}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          getStatusBadgeClass(mentor.status)
                        )}
                      >
                        {mentor.status.charAt(0).toUpperCase() + mentor.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEditMentor(mentor.id)}
                          title="Edit Mentor"
                          className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteMentor(mentor.id)}
                          title="Delete Mentor"
                          className="rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50/50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No mentors found matching current criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <AddMentorForm
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
            isSubmitting={isCreating || isUpdating}
            mentorToEdit={mentorToEdit || undefined}
          />
        </div>
      )}
    </div>
  );
}

export default function MentorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MentorsContent />
    </Suspense>
  );
}
