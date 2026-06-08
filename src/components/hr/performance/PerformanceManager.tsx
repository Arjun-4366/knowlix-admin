"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import EmployeePerformanceTracker from "./EmployeePerformanceTracker";
import PerformanceOverview from "./PerformanceOverview";
import CreateEvaluationModal from "./CreateEvaluationModal";
import UpdateEvaluationModal from "./UpdateEvaluationModal";
import {
  coreValues,
  DEFAULT_PERFORMANCE_CYCLE_ID,
  performanceCycles,
} from "./performanceData";
import { PerformanceScorecard, ReviewStatus } from "./types";
import { Employee } from "../employees/types";
import {
  useGetTutorsHR,
  useGetTutorEvaluations,
  useCreateTutorEvaluation,
  useUpdateTutorEvaluation,
} from "@/querys/admin/hrQuery";
import { IHRPerformanceEvaluation, ICreateHRPerformancePayload } from "@/types/admin/hr";

const mapTutorToEmployee = (tutor: any): Employee => {
  const tutorId = tutor.id || tutor._id || "";
  let mappedStatus: Employee["status"] = "Active";
  if (tutor.status === "pending") {
    mappedStatus = "On Probation";
  } else if (tutor.status === "rejected") {
    mappedStatus = "Terminated";
  }

  let mappedDept: Employee["department"] = "Tutor";
  let mappedRole = "Tutor";
  if (tutor.role === "mentor_sales_bro") {
    mappedDept = "Sales";
    mappedRole = "Mentor/Sales Rep";
  } else if (tutor.role === "academic_coordinator") {
    mappedDept = "Academics";
    mappedRole = "Academic Coordinator";
  }

  return {
    id: tutorId,
    name: tutor.name || "Unnamed Tutor",
    email: tutor.email || "",
    phone: tutor.phone || "",
    address: tutor.availability || "Online / Remote",
    dob: "1990-01-01",
    emergencyContact: {
      name: "Emergency Contact",
      relationship: "Family",
      phone: tutor.phone || "",
    },
    designation: mappedRole,
    department: mappedDept,
    dateOfJoining: tutor.createdAt ? tutor.createdAt.slice(0, 10) : new Date().toISOString().split("T")[0],
    status: mappedStatus,
    manager: "HR Manager",
    salaryDetails: {
      base: 40000,
      allowance: 10000,
      pf: 4800,
      ctc: 600000,
    },
    documents: [],
    joiningRecords: {
      probationEnd: "",
      joiningNotes: `Experience: ${tutor.experience || "Not specified"}. Availability: ${tutor.availability || "Not specified"}.`,
    },
  };
};

function toScorecard(ev: IHRPerformanceEvaluation): PerformanceScorecard {
  const cycleId = ev.period === "2025-12" ? "PERF-H2-2025" : DEFAULT_PERFORMANCE_CYCLE_ID;
  return {
    id: ev.id,
    cycleId,
    employeeId: ev.tutorId,
    reviewer: ev.evaluatorId || "HR Manager",
    overallScore: ev.averageScore,
    nextReviewDate: ev.updatedAt?.slice(0, 10) ?? "",
    appraisalStatus: "Manager Review" as ReviewStatus,
    trend: ev.averageScore >= 8 ? "Improving" : "Stable",
    recommendedAction: ev.goals || "On track for objectives",
    strengths: ["Domain knowledge", "Communication"],
    watchouts: ["Schedule adherence"],
    managerSummary: ev.feedback || "Good progress in curriculum delivery.",
    selfSummary: "Completing modules on time.",
    valueRatings: Object.entries(ev.scores || {}).map(([valueId, score]) => ({
      valueId,
      score,
      note: "Standard evaluation rating",
    })),
  };
}

export default function PerformanceManager() {
  const [selectedCycleId, setSelectedCycleId] = useState(DEFAULT_PERFORMANCE_CYCLE_ID);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updateModalEvaluationId, setUpdateModalEvaluationId] = useState<string | null>(null);

  const { data: tutorsRes, isLoading: tutorsLoading } = useGetTutorsHR();
  const { data: evaluationsRes, isLoading: evaluationsLoading } = useGetTutorEvaluations();
  const createEvaluationMutation = useCreateTutorEvaluation();
  const updateEvaluationMutation = useUpdateTutorEvaluation();

  const handleCreateEvaluation = async (data: ICreateHRPerformancePayload) => {
    try {
      await createEvaluationMutation.mutateAsync(data);
      setShowCreateModal(false);
    } catch (err) {
      // toast notification is already managed by the mutation onError hook
    }
  };

  const handleUpdateEvaluation = async (id: string, data: Partial<ICreateHRPerformancePayload>) => {
    try {
      await updateEvaluationMutation.mutateAsync({ id, data });
      setUpdateModalEvaluationId(null);
    } catch (err) {
      // toast handled
    }
  };

  const employees = tutorsRes?.data ? (tutorsRes.data as any[]).map(mapTutorToEmployee) : [];
  const rawEvaluations = evaluationsRes?.data ? (evaluationsRes.data as IHRPerformanceEvaluation[]) : [];
  const scorecards = evaluationsRes?.data ? (evaluationsRes.data as IHRPerformanceEvaluation[]).map(toScorecard) : [];

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status === "Active" || employee.status === "On Probation"
  );
  const filteredEmployees = activeEmployees.filter((employee) =>
    selectedDepartment === "all"
      ? true
      : employee.department === selectedDepartment
  );
  const departments = Array.from(
    new Set(activeEmployees.map((employee) => employee.department))
  );
  const visibleEmployeeIds = new Set(filteredEmployees.map((employee) => employee.id));
  const selectedCycle =
    performanceCycles.find((cycle) => cycle.id === selectedCycleId) ??
    performanceCycles[0];

  const visibleScorecards = scorecards
    .filter(
      (scorecard) =>
        scorecard.cycleId === selectedCycleId &&
        (selectedDepartment === "all" || 
         (employees.find(e => e.id === scorecard.employeeId)?.department || "Unmapped") === selectedDepartment)
    )
    .map((scorecard) => {
      const employee = employees.find((item) => item.id === scorecard.employeeId);
      return {
        ...scorecard,
        employeeName: employee?.name || "Unknown Employee",
        designation: employee?.designation || "Profile missing",
        department: employee?.department || "Unmapped",
      };
    })
    .sort((left, right) => right.overallScore - left.overallScore);

  const resolvedSelectedEmployeeId = visibleScorecards.some(
    (scorecard) => scorecard.employeeId === selectedEmployeeId
  )
    ? selectedEmployeeId
    : visibleScorecards[0]?.employeeId ?? null;

  const averageScore =
    visibleScorecards.length > 0
      ? visibleScorecards.reduce(
          (total, scorecard) => total + scorecard.overallScore,
          0
        ) / visibleScorecards.length
      : 0;
  const highPerformerCount = visibleScorecards.filter(
    (scorecard) => scorecard.overallScore >= 8.0
  ).length;

  if (tutorsLoading || evaluationsLoading) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader
          title="Performance Management"
          description="Core-value reviews and appraisals."
        />
        <div className="flex h-96 items-center justify-center bg-white rounded-2xl border border-slate-150 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader
        title="Performance Management"
        description={`Core-value performance board for ${selectedCycle.label}: employee tracking, appraisals, and feedback.`}
        actions={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" /> Create Evaluation
          </Button>
        }
      />

      <PerformanceOverview
        cycleStatus={selectedCycle.status}
        averageScore={averageScore}
        highPerformerCount={highPerformerCount}
        totalEvaluations={visibleScorecards.length}
      />

      <EmployeePerformanceTracker
        cycles={performanceCycles}
        selectedCycleId={selectedCycleId}
        onCycleChange={setSelectedCycleId}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        departments={departments}
        scorecards={visibleScorecards}
        coreValues={coreValues}
        selectedEmployeeId={resolvedSelectedEmployeeId}
        onEmployeeSelect={setSelectedEmployeeId}
        onEditEvaluation={(evalId) => setUpdateModalEvaluationId(evalId)}
      />

      <CreateEvaluationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateEvaluation}
        tutors={activeEmployees}
        saving={createEvaluationMutation.isPending}
      />

      <UpdateEvaluationModal
        isOpen={!!updateModalEvaluationId}
        onClose={() => setUpdateModalEvaluationId(null)}
        onSubmit={handleUpdateEvaluation}
        evaluation={rawEvaluations.find((e) => e.id === updateModalEvaluationId) || null}
        tutors={activeEmployees}
        saving={updateEvaluationMutation.isPending}
      />
    </div>
  );
}
