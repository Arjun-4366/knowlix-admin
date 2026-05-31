"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Trophy, Star, Eye } from "lucide-react";
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
import { ICreateTutorPayload, ITutor, ILeaderboardItem } from "@/types/admin/tutor";
import { Skeleton } from "@/components/ui/skeleton";

function TutorsContent() {
  const { confirm } = useConfirmation();
  const { data: tutorsResponse, isLoading } = useGetTutors();
  const { data: leaderboardResponse, isLoading: isLeaderboardLoading } = useGetLeaderboard();
  const { mutateAsync: createTutor, isPending: isCreating } = useCreateTutor();
  const { mutateAsync: updateTutor, isPending: isUpdating } = useUpdateTutor();
  const { mutateAsync: deleteTutor } = useDeleteTutor();
  const { mutateAsync: approveTutor } = useApproveTutor();

  const [activeTab, setActiveTab] = useState<"active" | "recruitment" | "leaderboard">("active");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("All");

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

  // Overall stats calculations
  const totalTutors = tutorsList.length;
  const activeCount = tutorsList.filter(t => t.status === "approved").length;
  const pendingCount = tutorsList.filter(t => t.status === "pending").length;

  const companyAverage = useMemo(() => {
    const approvedTutors = tutorsList.filter(t => t.status === "approved");
    if (approvedTutors.length === 0) return "0.0";
    const sum = approvedTutors.reduce((acc, t) => acc + (t.performanceScore || 0), 0);
    return (sum / approvedTutors.length).toFixed(1);
  }, [tutorsList]);

  // Filter & Search Logic
  const filteredTutors = useMemo(() => {
    return tutorsList.filter((tutor) => {
      const matchesTab = activeTab === "active" ? tutor.status === "approved" : tutor.status === "pending";

      const matchesSearch =
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tutor.subjects && tutor.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesSubject =
        subjectFilter === "All" ||
        (tutor.subjects && tutor.subjects.some(s => s.toLowerCase().includes(subjectFilter.toLowerCase())));

      let matchesExp = true;
      if (expFilter === "<5") {
        const yrs = parseInt(tutor.experience) || 0;
        matchesExp = yrs < 5;
      } else if (expFilter === "5-10") {
        const yrs = parseInt(tutor.experience) || 0;
        matchesExp = yrs >= 5 && yrs <= 10;
      } else if (expFilter === ">10") {
        const yrs = parseInt(tutor.experience) || 0;
        matchesExp = yrs > 10;
      }

      return matchesTab && matchesSearch && matchesSubject && matchesExp;
    });
  }, [tutorsList, activeTab, searchQuery, subjectFilter, expFilter]);

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
          totalTutors={totalTutors}
          activeCount={activeCount}
          pendingCount={pendingCount}
          companyAverage={companyAverage}
        />
      )}

      {/* Tabs & Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as "active" | "recruitment" | "leaderboard");
        }}
      >
        <TabsList className="mb-4 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger
            value="active"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Active Tutors ({isLoading ? 0 : activeCount})
          </TabsTrigger>
          <TabsTrigger
            value="recruitment"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Recruitment Pool ({isLoading ? 0 : pendingCount})
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {/* Filter Bar */}
        {activeTab !== "leaderboard" && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
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
                <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                  <SelectValue placeholder="All Subject Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Subject Expertise</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Maths">Maths</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                </SelectContent>
              </Select>

              <Select value={expFilter} onValueChange={setExpFilter}>
                <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                  <SelectValue placeholder="All Experiences" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Experiences</SelectItem>
                  <SelectItem value="<5">Less than 5 years</SelectItem>
                  <SelectItem value="5-10">5 to 10 years</SelectItem>
                  <SelectItem value=">10">More than 10 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Directory Table */}
        {isLoading ? (
          <TutorTableSkeleton />
        ) : (
          <>
            <TabsContent value="active" forceMount className="data-[state=inactive]:hidden mt-0">
              <TutorTable
                tutors={filteredTutors}
                onApproveTutor={handleApproveTutor}
                onEditTutor={handleEditTutor}
                onDeleteTutor={handleDeleteTutor}
              />
            </TabsContent>
            <TabsContent value="recruitment" forceMount className="data-[state=inactive]:hidden mt-0">
              <TutorTable
                tutors={filteredTutors}
                onApproveTutor={handleApproveTutor}
                onEditTutor={handleEditTutor}
                onDeleteTutor={handleDeleteTutor}
              />
            </TabsContent>
            <TabsContent value="leaderboard" forceMount className="data-[state=inactive]:hidden mt-0">
              <LeaderboardTable
                leaderboard={leaderboardResponse?.data ?? []}
                isLoading={isLeaderboardLoading}
              />
            </TabsContent>
          </>
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
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%] text-center">
              Rank
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[45%]">
              Tutor Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%] text-center">
              Growth Points
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[15%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((item) => (
              <TableRow key={item.tutorId} className="hover:bg-slate-50/60 transition-colors">
                <TableCell className="px-6 py-4 text-center">
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold",
                      item.rank === 1 && "border-amber-200 bg-amber-50 text-amber-800",
                      item.rank === 2 && "border-slate-200 bg-slate-100 text-slate-800",
                      item.rank === 3 && "border-orange-200 bg-orange-50 text-orange-800",
                      item.rank > 3 && "text-slate-400 border-slate-100 bg-slate-50"
                    )}
                  >
                    {item.rank === 1 ? <Trophy className="w-3.5 h-3.5 text-amber-600 inline-block align-middle" /> : item.rank}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-light-green)] text-sm font-bold text-[var(--brand-green)]">
                      {item.tutorName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.tutorName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {item.tutorId}</p>
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
                    className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50"
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
                className="px-6 py-12 text-center text-slate-400 text-sm"
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
