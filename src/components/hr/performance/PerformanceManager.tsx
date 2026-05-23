"use client";

import { useState, useSyncExternalStore } from "react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import {
  getEmployeesServerSnapshot,
  loadEmployees,
  subscribeToEmployees,
} from "../employees/employeeData";
import AppraisalFeedbackPanel from "./AppraisalFeedbackPanel";
import EmployeePerformanceTracker from "./EmployeePerformanceTracker";
import GoalsKpiPanel from "./GoalsKpiPanel";
import PerformanceOverview from "./PerformanceOverview";
import {
  coreValues,
  DEFAULT_PERFORMANCE_CYCLE_ID,
  initialFeedbackEntries,
  initialGoalKpis,
  initialPerformanceScorecards,
  performanceCycles,
} from "./performanceData";
import { GoalKpi, ReviewStatus } from "./types";

const nextReviewStatusMap: Record<Exclude<ReviewStatus, "Closed">, ReviewStatus> = {
  "Self Review": "Manager Review",
  "Manager Review": "Calibration Ready",
  "Calibration Ready": "Closed",
};

export default function PerformanceManager() {
  const employees = useSyncExternalStore(
    subscribeToEmployees,
    loadEmployees,
    getEmployeesServerSnapshot
  );
  const [selectedCycleId, setSelectedCycleId] = useState(
    DEFAULT_PERFORMANCE_CYCLE_ID
  );
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [scorecards, setScorecards] = useState(initialPerformanceScorecards);
  const [goals, setGoals] = useState(initialGoalKpis);

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
        visibleEmployeeIds.has(scorecard.employeeId)
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

  const visibleFeedback = initialFeedbackEntries.filter(
    (entry) =>
      entry.cycleId === selectedCycleId && visibleEmployeeIds.has(entry.employeeId)
  );

  const visibleGoals = goals
    .filter(
      (goal) =>
        goal.cycleId === selectedCycleId && visibleEmployeeIds.has(goal.employeeId)
    )
    .map((goal) => {
      const employee = employees.find((item) => item.id === goal.employeeId);

      return {
        ...goal,
        employeeName: employee?.name || "Unknown Employee",
        designation: employee?.designation || "Profile missing",
        department: employee?.department || "Unmapped",
      };
    });

  const resolvedSelectedEmployeeId = visibleScorecards.some(
    (scorecard) => scorecard.employeeId === selectedEmployeeId
  )
    ? selectedEmployeeId
    : visibleScorecards[0]?.employeeId ?? null;

  const selectedScorecard =
    visibleScorecards.find(
      (scorecard) => scorecard.employeeId === resolvedSelectedEmployeeId
    ) ?? null;
  const selectedFeedback = visibleFeedback.filter(
    (entry) => entry.employeeId === resolvedSelectedEmployeeId
  );
  const selectedGoals = visibleGoals.filter(
    (goal) => goal.employeeId === resolvedSelectedEmployeeId
  );

  const averageScore =
    visibleScorecards.length > 0
      ? visibleScorecards.reduce(
          (total, scorecard) => total + scorecard.overallScore,
          0
        ) / visibleScorecards.length
      : 0;
  const highPerformerCount = visibleScorecards.filter(
    (scorecard) => scorecard.overallScore >= 4.3
  ).length;
  const appraisalsInMotion = visibleScorecards.filter(
    (scorecard) => scorecard.appraisalStatus !== "Closed"
  ).length;
  const calibrationReadyCount = visibleScorecards.filter(
    (scorecard) => scorecard.appraisalStatus === "Calibration Ready"
  ).length;
  const constructiveFeedbackCount = visibleFeedback.filter(
    (entry) => entry.tone === "Constructive"
  ).length;
  const goalsOnTrackCount = visibleGoals.filter(
    (goal) => goal.status === "On Track" || goal.status === "Achieved"
  ).length;
  const achievedGoalCount = visibleGoals.filter(
    (goal) => goal.status === "Achieved"
  ).length;
  const needsSupportCount = visibleGoals.filter(
    (goal) => goal.status === "Needs Support"
  ).length;
  const averageGoalProgress =
    visibleGoals.length > 0
      ? visibleGoals.reduce((total, goal) => total + goal.progress, 0) /
        visibleGoals.length
      : 0;
  const watchlistCount = visibleScorecards.filter(
    (scorecard) => scorecard.trend === "At Risk"
  ).length;

  const handleAdvanceAppraisal = () => {
    if (!selectedScorecard || selectedScorecard.appraisalStatus === "Closed") {
      return;
    }

    const nextStatus = nextReviewStatusMap[selectedScorecard.appraisalStatus];

    setScorecards((currentScorecards) =>
      currentScorecards.map((scorecard) =>
        scorecard.cycleId === selectedCycleId &&
        scorecard.employeeId === selectedScorecard.employeeId
          ? { ...scorecard, appraisalStatus: nextStatus }
          : scorecard
      )
    );

    toast.success(
      `${selectedScorecard.employeeName}'s appraisal moved to ${nextStatus}.`
    );
  };

  const handleResolveSupportGoals = () => {
    if (!resolvedSelectedEmployeeId) {
      return;
    }

    const supportGoals = selectedGoals.filter(
      (goal) => goal.status === "Needs Support"
    );

    if (supportGoals.length === 0) {
      return;
    }

    setGoals((currentGoals: GoalKpi[]) =>
      currentGoals.map((goal) =>
        goal.cycleId === selectedCycleId &&
        goal.employeeId === resolvedSelectedEmployeeId &&
        goal.status === "Needs Support"
          ? {
              ...goal,
              status: "On Track",
              progress: Math.min(goal.progress + 12, 100),
              note: "Manager unblocker applied and goal moved back onto track.",
            }
          : goal
      )
    );

    toast.success("Support goals moved back to on-track with manager unblockers.");
  };

  if (activeEmployees.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader
          title="Performance Management"
          description="Core-value reviews, appraisals, and goal tracking will appear after active employees are available."
        />

        <Card className="rounded-2xl border-slate-150 p-8 text-center bg-white shadow-sm space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            No active employees are available for performance management yet.
          </p>
          <p className="text-xs text-slate-500">
            Add or reactivate employees in the directory before opening
            performance cycles.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader
        title="Performance Management"
        description={`Core-value performance board for ${selectedCycle.label}: employee tracking, appraisals, feedback, and goal/KPI execution.`}
      />

      <PerformanceOverview
        cycleStatus={selectedCycle.status}
        averageScore={averageScore}
        highPerformerCount={highPerformerCount}
        appraisalsInMotion={appraisalsInMotion}
        calibrationReadyCount={calibrationReadyCount}
        constructiveFeedbackCount={constructiveFeedbackCount}
        goalsOnTrackCount={goalsOnTrackCount}
        totalGoals={visibleGoals.length}
        achievedGoalCount={achievedGoalCount}
        needsSupportCount={needsSupportCount}
        averageGoalProgress={averageGoalProgress}
        watchlistCount={watchlistCount}
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
      />

      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_1.05fr] gap-6">
        <AppraisalFeedbackPanel
          cycle={selectedCycle}
          scorecard={selectedScorecard}
          feedbackEntries={selectedFeedback}
          onAdvanceAppraisal={handleAdvanceAppraisal}
        />
        <GoalsKpiPanel
          cycleLabel={selectedCycle.label}
          employeeName={selectedScorecard?.employeeName ?? null}
          goals={selectedGoals}
          onResolveSupportGoals={handleResolveSupportGoals}
        />
      </div>
    </div>
  );
}
