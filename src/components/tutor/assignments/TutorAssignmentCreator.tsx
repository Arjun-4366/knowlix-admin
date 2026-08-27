"use client";

import { Suspense, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import {
  useGetTutorAssignments,
  useCreateTutorAssignment,
} from "@/querys/tutor/assignmentQuery";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { ITutorAssignment, ICreateAssignmentPayload } from "@/types/tutor/assignments";
import { toast } from "react-hot-toast";
import AssignmentsList from "./AssignmentsList";
import AssignmentStatsRow from "./AssignmentStatsRow";
import CreateAssignmentForm from "./CreateAssignmentForm";
import TutorEvaluateAssignmentModal from "./TutorEvaluateAssignmentModal";
import TutorAssignmentDetailModal from "./TutorAssignmentDetailModal";

interface TutorAssignmentCreatorProps {
  hideHeader?: boolean;
  hideStats?: boolean;
}

function TutorAssignmentCreatorContent({
  hideHeader = false,
  hideStats = false,
}: TutorAssignmentCreatorProps) {
  const { data: assignmentsResponse, isLoading: loadingAssignments } =
    useGetTutorAssignments();
  const { data: studentsResponse, isLoading: loadingStudents } =
    useGetTutorStudents();
  const { mutate: createAssignment, isPending: isCreating } =
    useCreateTutorAssignment();

  const [showForm, setShowForm] = useState(false);
  const [evaluatingAssignment, setEvaluatingAssignment] =
    useState<ITutorAssignment | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [viewingAssignment, setViewingAssignment] =
    useState<ITutorAssignment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const isLoading = loadingAssignments || loadingStudents;
  const assignments = assignmentsResponse?.data || [];
  const students = studentsResponse?.data || [];

  const studentMap = new Map(students.map((s) => [s.id, s.studentName]));

  const active = assignments.filter(
    (a) => a.status === "assigned" || a.status === "submitted",
  );
  const evaluated = assignments.filter((a) => a.status === "evaluated");
  const expired = assignments.filter((a) => a.status === "expired");

  const handleCreate = (payload: ICreateAssignmentPayload) => {
    createAssignment(payload, {
      onSuccess: () => {
        toast.success("Assignment created successfully!");
        setShowForm(false);
      },
      onError: () => {
        toast.error("Failed to create assignment. Please try again.");
      },
    });
  };

  const handleStartEvaluation = (asg: ITutorAssignment) => {
    setEvaluatingAssignment(asg);
    setIsEvalModalOpen(true);
  };

  const handleViewAssignment = (asg: ITutorAssignment) => {
    setViewingAssignment(asg);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const toggleButton = (
    <Button
      onClick={() => setShowForm((v) => !v)}
      className={`font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
        showForm
          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
          : "bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white shadow-sm"
      }`}>
      {showForm ? (
        <>
          <X className="w-3.5 h-3.5" /> Cancel
        </>
      ) : (
        <>
          <Plus className="w-3.5 h-3.5" /> Create Assignment
        </>
      )}
    </Button>
  );

  return (
    <div className="space-y-6 w-full pb-10">
      {!hideHeader ? (
        <div className="flex items-start justify-between gap-4">
          <DashboardHeader
            title="Assignments"
            description="Publish assignments for your students and track their status."
          />
          {toggleButton}
        </div>
      ) : (
        <div className="flex justify-end">{toggleButton}</div>
      )}

      {showForm && (
        <CreateAssignmentForm
          students={students}
          isCreating={isCreating}
          onSubmit={handleCreate}
        />
      )}

      {!hideStats && <AssignmentStatsRow assignments={assignments} />}

      <Tabs defaultValue="all">
        <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-6">
          <TabsTrigger
            value="all"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer">
            All ({assignments.length})
          </TabsTrigger>
        
          <TabsTrigger
            value="evaluated"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer">
            Evaluated ({evaluated.length})
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer">
            Expired ({expired.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0 outline-none">
          <AssignmentsList
            assignments={assignments}
            studentMap={studentMap}
            onEvaluate={handleStartEvaluation}
            onView={handleViewAssignment}
          />
        </TabsContent>

        <TabsContent value="evaluated" className="mt-0 outline-none">
          <AssignmentsList
            assignments={evaluated}
            studentMap={studentMap}
            onEvaluate={handleStartEvaluation}
            onView={handleViewAssignment}
          />
        </TabsContent>
        <TabsContent value="expired" className="mt-0 outline-none">
          <AssignmentsList
            assignments={expired}
            studentMap={studentMap}
            onEvaluate={handleStartEvaluation}
            onView={handleViewAssignment}
          />
        </TabsContent>
      </Tabs>

      <TutorEvaluateAssignmentModal
        isOpen={isEvalModalOpen}
        onClose={() => {
          setIsEvalModalOpen(false);
          setEvaluatingAssignment(null);
        }}
        assignment={evaluatingAssignment}
        studentMap={studentMap}
      />

      <TutorAssignmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingAssignment(null);
        }}
        assignment={viewingAssignment}
      />
    </div>
  );
}

export default function TutorAssignmentCreator({
  hideHeader = false,
  hideStats = false,
}: TutorAssignmentCreatorProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
      <TutorAssignmentCreatorContent
        hideHeader={hideHeader}
        hideStats={hideStats}
      />
    </Suspense>
  );
}
