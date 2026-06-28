"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { Plus, Search, Trash2, Pencil, Briefcase, Mail, Phone, Users, ShieldAlert, Award, ChevronLeft, ChevronRight } from "lucide-react";
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
  useGetCoordinators,
  useCreateCoordinator,
  useUpdateCoordinator,
  useDeleteCoordinator,
} from "@/querys/admin/coordinatorQuery";
import { ICreateCoordinatorPayload, ICoordinator } from "@/types/admin/coordinator";
import { Skeleton } from "@/components/ui/skeleton";
import AddCoordinatorForm from "@/components/coordinators/AddCoordinatorForm";

const LIMIT = 20;

function CoordinatorsContent() {
  const { confirm } = useConfirmation();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [coordinatorToEdit, setCoordinatorToEdit] = useState<ICoordinator | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, departmentFilter]);

  const { data: coordinatorsResponse, isLoading } = useGetCoordinators({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    department: departmentFilter !== "all" ? departmentFilter : undefined,
  });

  const { mutateAsync: createCoordinator, isPending: isCreating } = useCreateCoordinator();
  const { mutateAsync: updateCoordinator, isPending: isUpdating } = useUpdateCoordinator();
  const { mutateAsync: deleteCoordinator } = useDeleteCoordinator();

  const coordinatorsList = useMemo(() => coordinatorsResponse?.data ?? [], [coordinatorsResponse]);
  const summary = coordinatorsResponse?.summary;
  const totalPages = coordinatorsResponse?.totalPages ?? 1;

  const uniqueDepartments = useMemo(() => {
    const depts = new Set<string>();
    coordinatorsList.forEach((c) => { if (c.department) depts.add(c.department); });
    return Array.from(depts);
  }, [coordinatorsList]);

  const handleEditCoordinator = (coordinatorId: string) => {
    const coordinator = coordinatorsList.find((c) => c.id === coordinatorId);
    if (coordinator) {
      setCoordinatorToEdit(coordinator);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteCoordinator = (coordinatorId: string) => {
    const coordinatorName = coordinatorsList.find((c) => c.id === coordinatorId)?.name || "this coordinator";
    confirm({
      title: "Delete Coordinator",
      message: `Are you sure you want to delete "${coordinatorName}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteCoordinator(coordinatorId);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleFormSubmit = async (payload: ICreateCoordinatorPayload & { status?: string }) => {
    try {
      if (coordinatorToEdit) {
        await updateCoordinator({ id: coordinatorToEdit.id, data: payload });
        setCoordinatorToEdit(null);
      } else {
        await createCoordinator(payload);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setCoordinatorToEdit(null);
  };

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
        title="Coordinators Management"
        description="Oversee admissions coordinators, manage designations, and monitor department metrics."
        actions={
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full h-10 px-4 py-2.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm shadow-md shadow-green-600/10 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Coordinator
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
                <p className="text-2xl font-bold text-slate-800">{summary?.total ?? 0}</p>
                <p className="text-xs font-semibold text-slate-600">Total Coordinators</p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{summary?.active ?? 0}</p>
                <p className="text-xs font-semibold text-slate-600">Active Coordinators</p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{summary?.inactive ?? 0}</p>
                <p className="text-xs font-semibold text-slate-600">Inactive Coordinators</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 z-10" />
          <Input
            type="text"
            placeholder="Search coordinators by name, email, designation..."
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
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
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
        <>
          <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden w-full">
            <Table className="w-full table-fixed">
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[5%]">
                    Sl.
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[22%]">
                    Coordinator
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[20%]">
                    Contact
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[20%]">
                    Role Details
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[13%]">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-[20%]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {coordinatorsList.length > 0 ? (
                  coordinatorsList.map((coordinator, index) => (
                    <TableRow key={coordinator.id} className="hover:bg-slate-50/60 transition-colors">
                      <TableCell className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {(page - 1) * LIMIT + index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-light-green)] text-sm font-bold text-[var(--brand-green)] flex-shrink-0">
                            {coordinator.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-slate-800 truncate">{coordinator.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="space-y-1 text-slate-700">
                          <div className="flex items-center gap-1.5 text-xs truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-600" />
                            <span className="truncate">{coordinator.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Phone className="w-3.5 h-3.5 text-slate-600" />
                            <span>{coordinator.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                            {coordinator.department}
                          </span>
                          <p className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-slate-600" />
                            {coordinator.designation}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                            getStatusBadgeClass(coordinator.status)
                          )}
                        >
                          {coordinator.status.charAt(0).toUpperCase() + coordinator.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEditCoordinator(coordinator.id)}
                            title="Edit Coordinator"
                            className="rounded-lg text-slate-600 hover:text-[var(--brand-green)] hover:bg-slate-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDeleteCoordinator(coordinator.id)}
                            title="Delete Coordinator"
                            className="rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-12 text-center text-slate-600 text-sm">
                      No coordinators found matching current criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-xl border border-slate-150 shadow-sm">
              <span className="text-sm text-slate-600 font-medium">
                Showing page {page} of {totalPages} (Total {coordinatorsResponse?.total ?? 0})
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className={`h-7 w-7 p-0 text-xs ${p === page ? "bg-[var(--brand-green)] text-white border-transparent hover:bg-[var(--brand-mid)]" : ""}`}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <AddCoordinatorForm
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
            isSubmitting={isCreating || isUpdating}
            coordinatorToEdit={coordinatorToEdit || undefined}
          />
        </div>
      )}
    </div>
  );
}

export default function CoordinatorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CoordinatorsContent />
    </Suspense>
  );
}
