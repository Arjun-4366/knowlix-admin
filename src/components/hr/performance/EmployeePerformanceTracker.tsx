"use client";

import { ChevronRight, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  CoreValue,
  EnrichedPerformanceScorecard,
  PerformanceCycle,
  PerformanceTrend,
  ReviewStatus,
} from "./types";
import {
  formatDateLabel,
  formatScore,
  getInitials,
} from "./utils";

interface EmployeePerformanceTrackerProps {
  cycles: PerformanceCycle[];
  selectedCycleId: string;
  onCycleChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
  scorecards: EnrichedPerformanceScorecard[];
  coreValues: CoreValue[];
  selectedEmployeeId: string | null;
  onEmployeeSelect: (employeeId: string) => void;
  onEditEvaluation?: (evalId: string) => void;
}

const reviewStatusClassMap: Record<ReviewStatus, string> = {
  "Self Review": "bg-slate-100 text-slate-700 border-slate-200",
  "Manager Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Calibration Ready": "bg-sky-50 text-sky-700 border-sky-200",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const trendClassMap: Record<PerformanceTrend, string> = {
  Improving: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Stable: "bg-slate-100 text-slate-700 border-slate-200",
  "At Risk": "bg-rose-50 text-rose-700 border-rose-200",
};

export default function EmployeePerformanceTracker({
  cycles,
  selectedCycleId,
  onCycleChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  scorecards,
  coreValues,
  selectedEmployeeId,
  onEmployeeSelect,
  onEditEvaluation,
}: EmployeePerformanceTrackerProps) {
  const selectedScorecard =
    scorecards.find((scorecard) => scorecard.employeeId === selectedEmployeeId) ??
    scorecards[0] ??
    null;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-850">
            Employee Performance Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track employees against core values, review stages, and review timing
            across the current performance cycle.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCycleId} onValueChange={onCycleChange}>
            <SelectTrigger className="h-10 w-[180px] rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700">
              <SelectValue placeholder="Performance Cycle" />
            </SelectTrigger>
            <SelectContent>
              {cycles.map((cycle) => (
                <SelectItem
                  key={cycle.id}
                  value={cycle.id}
                  className="text-xs font-semibold"
                >
                  {cycle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="h-10 w-[180px] rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="Department Filter" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs font-semibold">
                All Departments
              </SelectItem>
              {departments.map((department) => (
                <SelectItem
                  key={department}
                  value={department}
                  className="text-xs font-semibold"
                >
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 2xl:grid-cols-[1.15fr_0.95fr] gap-5">
        <div className="rounded-2xl border border-slate-150 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Review Queue
            </h3>
          </div>

          <Table>
            <TableHeader className="bg-white">
              <TableRow className="border-slate-100 hover:bg-white">
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Employee
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Overall
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Trend
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Review
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Next Check-in
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scorecards.length > 0 ? (
                scorecards.map((scorecard) => (
                  <TableRow
                    key={scorecard.id}
                    onClick={() => onEmployeeSelect(scorecard.employeeId)}
                    className={cn(
                      "border-slate-100 cursor-pointer hover:bg-slate-50/70",
                      scorecard.employeeId === selectedScorecard?.employeeId &&
                        "bg-slate-50/80"
                    )}
                  >
                    <TableCell className="px-4 py-3 align-top whitespace-normal">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[var(--brand-light-green)] text-[var(--brand-mid)] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {getInitials(scorecard.employeeName)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {scorecard.employeeName}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {scorecard.designation} / {scorecard.department}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs font-bold text-slate-800">
                      {formatScore(scorecard.overallScore)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          trendClassMap[scorecard.trend]
                        )}
                      >
                        {scorecard.trend}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          reviewStatusClassMap[scorecard.appraisalStatus]
                        )}
                      >
                        {scorecard.appraisalStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-slate-600 font-semibold">
                      {formatDateLabel(scorecard.nextReviewDate)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-slate-100 hover:bg-white">
                  <TableCell
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-slate-500 whitespace-normal"
                  >
                    No performance records match the selected cycle and
                    department.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-2xl border border-slate-150 bg-slate-50/40 p-5 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-850">
                Core Value Breakdown
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Selected employee’s value-level performance and coaching context.
              </p>
            </div>
            {selectedScorecard && (
              <div className="flex items-center gap-2">
                {onEditEvaluation && (
                  <button 
                    onClick={() => onEditEvaluation(selectedScorecard.id)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
                  >
                    Edit
                  </button>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
              </div>
            )}
          </div>

          {selectedScorecard ? (
            <>
              <div className="rounded-2xl border border-slate-150 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-[var(--brand-light-green)] text-[var(--brand-mid)] flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {getInitials(selectedScorecard.employeeName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800">
                      {selectedScorecard.employeeName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedScorecard.designation} /{" "}
                      {selectedScorecard.department}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold rounded-full px-2 py-0.5",
                          reviewStatusClassMap[selectedScorecard.appraisalStatus]
                        )}
                      >
                        {selectedScorecard.appraisalStatus}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-bold rounded-full px-2 py-0.5",
                          trendClassMap[selectedScorecard.trend]
                        )}
                      >
                        {selectedScorecard.trend}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-xl border border-slate-150 bg-slate-50/50 px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                      Overall Score
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {formatScore(selectedScorecard.overallScore)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-150 bg-slate-50/50 px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                      Next Review
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      {formatDateLabel(selectedScorecard.nextReviewDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {coreValues.map((value) => {
                  const rating = selectedScorecard.valueRatings.find(
                    (entry) => entry.valueId === value.id
                  );
                  const score = rating?.score ?? 0;

                  return (
                    <div
                      key={value.id}
                      className="rounded-2xl border border-slate-150 bg-white p-4 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {value.title}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {value.description}
                          </p>
                        </div>
                        <p className="text-xs font-bold text-slate-800 whitespace-nowrap">
                          {formatScore(score)}
                        </p>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-light)]"
                          style={{ width: `${Math.max(0, Math.min(score * 10, 100))}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">
                        {rating?.note || "No review note added for this core value yet."}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-150 bg-white p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                    Strengths To Reinforce
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedScorecard.strengths.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-emerald-150 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-150 bg-white p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                    Coaching Watchouts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedScorecard.watchouts.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-sm text-slate-500">
              Select an employee performance record to inspect the core-value
              breakdown.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
