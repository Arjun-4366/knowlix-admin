"use client";

import { useState, useMemo, Suspense } from "react";
import { Plus, Search, Trash2, Pencil, Briefcase, Mail, Phone, Users } from "lucide-react";
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
  useGetHRs,
  useCreateHR,
  useUpdateHR,
  useDeleteHR,
} from "@/querys/admin/hrQuery";
import { ICreateHrPayload, IHr, IUpdateHrPayload } from "@/types/admin/hr";
import { Skeleton } from "@/components/ui/skeleton";
import AddHrForm from "@/components/hr/AddHrForm";

function HrContent() {
  const { confirm } = useConfirmation();
  const { data: hrResponse, isLoading } = useGetHRs();
  const { mutateAsync: createHR, isPending: isCreating } = useCreateHR();
  const { mutateAsync: updateHR, isPending: isUpdating } = useUpdateHR();
  const { mutateAsync: deleteHR } = useDeleteHR();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hrToEdit, setHrToEdit] = useState<IHr | null>(null);

  const hrList = useMemo(() => hrResponse?.data ?? [], [hrResponse]);

  const handleDeleteHr = (hrId: string) => {
    const hrName = hrList.find((h) => h.id === hrId)?.name || "this user";
    confirm({
      title: "Delete HR Member",
      message: `Are you sure you want to delete "${hrName}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteHR(hrId);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleCreateSubmit = async (payload: ICreateHrPayload | IUpdateHrPayload) => {
    try {
      await createHR(payload as ICreateHrPayload);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSubmit = async (payload: ICreateHrPayload | IUpdateHrPayload) => {
    if (!hrToEdit) return;
    try {
      await updateHR({ id: hrToEdit.id, data: payload as IUpdateHrPayload });
      setHrToEdit(null);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredHRs = useMemo(() => {
    return hrList.filter((hr) => {
      const matchesSearch =
        hr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hr.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hr.phone.includes(searchQuery) ||
        hr.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "All" || hr.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [hrList, searchQuery, roleFilter]);

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case "hr_manager":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "hr_executive":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const formatRole = (role: string) =>
    role.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="space-y-8 w-full relative pb-10">
      <DashboardHeader
        title="HR Management"
        description="Manage Human Resource staff, including managers and executives."
        actions={
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full h-10 px-4 py-2.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm shadow-md shadow-green-600/10 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add HR Member
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100/60 flex flex-col sm:flex-row gap-4 justify-between items-center z-10 relative">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <Input
            placeholder="Search by name, email, phone, or dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-slate-50 border-slate-200 h-10 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40 h-10 bg-slate-50 border-slate-200">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="hr_manager">HR Manager</SelectItem>
              <SelectItem value="hr_executive">HR Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b-slate-100">
                <TableHead className="font-semibold text-slate-600 h-12">Sl.No</TableHead>
                <TableHead className="font-semibold text-slate-600 h-12">HR Member</TableHead>
                <TableHead className="font-semibold text-slate-600">Contact</TableHead>
                <TableHead className="font-semibold text-slate-600">Department</TableHead>
                <TableHead className="font-semibold text-slate-600 text-center">Role</TableHead>
                <TableHead className="font-semibold text-slate-600 text-center">Status</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b-slate-50">
                    <TableCell><Skeleton className="h-10 w-[200px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-[120px]" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-[80px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredHRs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-[400px] text-center">
                    <div className="flex flex-col items-center justify-center text-slate-600 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                        <Users className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-sm">No HR members found.</p>
                      {(searchQuery || roleFilter !== "All") && (
                        <Button
                          variant="link"
                          onClick={() => { setSearchQuery(""); setRoleFilter("All"); }}
                          className="text-[var(--brand-green)] h-auto p-0"
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHRs.map((hr, index) => (
                  <TableRow
                    key={hr.id}
                    className="group border-b-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="py-4">
                      <span className="text-sm text-slate-650">{index + 1}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {hr.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{hr.name}</div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Added {new Date(hr.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-600" />
                          <a href={`mailto:${hr.email}`} className="hover:text-[var(--brand-green)] transition-colors truncate max-w-[150px]">
                            {hr.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-600" />
                          {hr.phone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Briefcase className="w-4 h-4 text-slate-600" />
                        {hr.department}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border", getRoleBadgeClass(hr.role))}>
                        {formatRole(hr.role)}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        hr.status === "active" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      )}>
                        {hr.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setHrToEdit(hr)}
                          className="h-8 w-8 cursor-pointer p-0 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Edit HR Member"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteHr(hr.id)}
                          className="h-8 w-8 cursor-pointer p-0 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete HR"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <AddHrForm
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleCreateSubmit}
            isSubmitting={isCreating}
          />
        </div>
      )}

      {/* Edit Modal */}
      {hrToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <AddHrForm
            key={hrToEdit.id}
            hrToEdit={hrToEdit}
            onClose={() => setHrToEdit(null)}
            onSubmit={handleEditSubmit}
            isSubmitting={isUpdating}
          />
        </div>
      )}
    </div>
  );
}

export default function HrPage() {
  return (
    <Suspense fallback={<div className="p-8 flex justify-center"><Skeleton className="w-full h-[600px] rounded-2xl" /></div>}>
      <HrContent />
    </Suspense>
  );
}
