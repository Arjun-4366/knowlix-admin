"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Star, Eye, RotateCcw } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useConfirmation } from "@/context/ConfirmationContext";

// Modular Component Imports
import TutorStats from "@/components/tutors/TutorStats";
import TutorTable from "@/components/tutors/TutorTable";
import AddTutorForm from "@/components/tutors/AddTutorForm";
import TutorTableSkeleton from "@/components/tutors/TutorTableSkeleton";

import {
  useGetTutors,
  useCreateTutor,
  useUpdateTutor,
  useDeleteTutor,
  useApproveTutor,
  useGetLeaderboard,
} from "@/querys/admin/tutorQuery";
import { useGetSubjects } from "@/querys/admin/curriculumQuery";
import { ICreateTutorPayload, ITutor, ILeaderboardItem } from "@/types/admin/tutor";
import { Skeleton } from "@/components/ui/skeleton";

function TutorsContent() {
  const { confirm } = useConfirmation();
  
  // We need to access debounced search, subject, and experience. But hook calls cannot be inside useMemo, so we define them at the top.
  // We'll fix the hook ordering in the next chunk.
  const { data: leaderboardResponse, isLoading: isLeaderboardLoading } = useGetLeaderboard();
  const { data: subjectsRes } = useGetSubjects();
  const subjectOptions = subjectsRes?.data?.map((s) => s.name) ?? [];
  const { mutateAsync: createTutor, isPending: isCreating } = useCreateTutor();
  const { mutateAsync: updateTutor, isPending: isUpdating } = useUpdateTutor();
  const { mutateAsync: deleteTutor } = useDeleteTutor();
  const { mutateAsync: approveTutor } = useApproveTutor();

  const [activeTab, setActiveTab] = useState<"approved" | "pending" | "inactive" | "resigned" | "leaderboard">("approved");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [subjectFilter, expFilter, activeTab]);

  const { data: tutorsResponse, isLoading } = useGetTutors({
    limit,
    page,
    search: debouncedSearch || undefined,
    subject: subjectFilter !== "all" ? subjectFilter : undefined,
    experience: expFilter !== "all" ? expFilter : undefined,
    status: activeTab !== "leaderboard" ? activeTab : undefined,
  });

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tutorToEdit, setTutorToEdit] = useState<ITutor | null>(null);

  const tutorsList = useMemo(() => {
    return tutorsResponse?.data ?? [];
  }, [tutorsResponse]);

  // HR Action: Approve and Admit Tutor
  const handleApproveTutor = async (tutorId: string) => {
    const tutorName = tutorsList.find(t => t.id === tutorId)?.name || "Tutor";
    confirm({
      title: "Approve Tutor",
      message: `Are you sure you want to approve & admit "${tutorName}" as an active tutor?`,
      confirmText: "Approve",
      onConfirm: async () => {
        try {
          await approveTutor({ id: tutorId, status: "approved" });
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleEditTutor = (tutorId: string) => {
    const tutor = tutorsList.find(t => t.id === tutorId);
    if (tutor) {
      setTutorToEdit(tutor);
      setIsAddModalOpen(true);
    }
  };

  const handleDeleteTutor = (tutorId: string) => {
    const tutorName = tutorsList.find(t => t.id === tutorId)?.name || "this tutor";
    confirm({
      title: "Delete Tutor",
      message: `Are you sure you want to delete "${tutorName}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteTutor(tutorId);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const handleFormSubmit = async (payload: ICreateTutorPayload) => {
    try {
      if (tutorToEdit) {
        await updateTutor({ id: tutorToEdit.id, data: payload });
        setTutorToEdit(null);
      } else {
        await createTutor(payload);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setTutorToEdit(null);
  };

  const summary = tutorsResponse?.summary;
  const totalPages = tutorsResponse?.totalPages ?? 1;
  const filteredTutors = tutorsList;

  return (
    <div className="space-y-8 w-full relative pb-10">
      {/* Header Banner */}
      <DashboardHeader
        title="Tutors Management"
        description="Recruit, approve, grant study permissions, and monitor G-R-O-W-T-H performance ratings."
        actions={
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full h-10 px-4 py-2.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm shadow-md shadow-green-600/10 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Tutor
          </Button>
        }
      />

      {/* Stats Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : (
        <TutorStats
          summary={summary ?? { approved: 0, inactive: 0, pending: 0, resigned: 0, total: tutorsList.length }}
        />
      )}

      {/* Tabs & Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as typeof activeTab);
        }}
      >
        <TabsList className="mb-4 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger
            value="approved"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Approved {summary ? `(${summary.approved})` : ""}
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Pending {summary ? `(${summary.pending})` : ""}
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Inactive {summary ? `(${summary.inactive})` : ""}
          </TabsTrigger>
          <TabsTrigger
            value="resigned"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Resigned {summary ? `(${summary.resigned})` : ""}
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Filter Bar — shown for all status tabs */}
        {activeTab !== "leaderboard" && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 z-10" />
              <Input
                type="text"
                placeholder="Search tutors by name, email, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 h-10 bg-white border border-slate-200 focus:border-green-500 rounded-xl"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full sm:w-48 h-11 py-5 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                  <SelectValue placeholder="All Subject Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subject Expertise</SelectItem>
                  {subjectOptions.map((subj) => (
                    <SelectItem key={subj} value={subj}>
                      {subj}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={expFilter} onValueChange={setExpFilter}>
                <SelectTrigger className="w-full sm:w-48 h-9 py-5 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                  <SelectValue placeholder="All Experiences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experiences</SelectItem>
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((year) => (
                    <SelectItem key={year} value={`${year} Year${year > 1 ? "s" : ""}`}>
                      {year} Year{year > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearchQuery(""); setSubjectFilter("all"); setExpFilter("all"); }}
                disabled={searchQuery === "" && subjectFilter === "all" && expFilter === "all"}
                className="h-9 px-3 bg-white border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl disabled:opacity-40"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Table content for status tabs */}
        {activeTab !== "leaderboard" && (
          isLoading ? (
            <TutorTableSkeleton />
          ) : (
            <>
              <TutorTable
                tutors={filteredTutors}
                onApproveTutor={handleApproveTutor}
                onEditTutor={handleEditTutor}
                onDeleteTutor={handleDeleteTutor}
              />
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-xl border border-slate-150 shadow-sm">
                  <span className="text-sm text-slate-600 font-medium">
                    Showing page {page} of {totalPages} (Total {tutorsResponse?.total || 0})
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )
        )}

        {/* Leaderboard tab */}
        {activeTab === "leaderboard" && (
          <LeaderboardTable
            leaderboard={leaderboardResponse?.data ?? []}
            isLoading={isLeaderboardLoading}
          />
        )}
      </Tabs>

      {/* Add/Edit Tutor Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <AddTutorForm
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
            isSubmitting={isCreating || isUpdating}
            tutorToEdit={tutorToEdit || undefined}
          />
        </div>
      )}
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorsContent />
    </Suspense>
  );
}

interface LeaderboardTableProps {
  leaderboard: ILeaderboardItem[];
  isLoading: boolean;
}

function LeaderboardTable({ leaderboard, isLoading }: LeaderboardTableProps) {
  const router = useRouter();

  if (isLoading) {
    return <TutorTableSkeleton />;
  }

  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden w-full">
      <Table className="w-full">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[8%]">
              Sl.
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[45%]">
              Tutor Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[25%] text-center">
              Growth Points
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-[15%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((item, index) => (
              <TableRow key={item.tutorId} className="hover:bg-slate-50/60 transition-colors">
                <TableCell className="px-6 py-4 text-sm font-semibold text-slate-600">
                  {index + 1}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-light-green)] text-sm font-bold text-[var(--brand-green)]">
                      {item.tutorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.tutorName}</p>
                      <p className="text-[10px] text-slate-600 font-mono">ID: {item.tutorId}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-[var(--brand-green)] fill-[var(--brand-green)]" />
                    <span className="text-sm font-bold text-slate-750">{item.totalPoints} points</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    onClick={() => router.push(`/admin/tutor/${item.tutorId}`)}
                    title="View Tutor Details"
                    className="rounded-lg text-slate-600 hover:text-[var(--brand-green)] hover:bg-slate-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="px-6 py-12 text-center text-slate-600 text-sm"
              >
                No rankings available yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
