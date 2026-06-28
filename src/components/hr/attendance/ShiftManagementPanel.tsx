"use client";

import { Clock3, Users2 } from "lucide-react";
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
  EnrichedShiftAssignment,
  ShiftMode,
  ShiftTemplate,
  WorkPolicy,
} from "./types";

interface ShiftManagementPanelProps {
  shifts: ShiftTemplate[];
  assignments: EnrichedShiftAssignment[];
  policies: WorkPolicy[];
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
}

const modeClassMap: Record<ShiftMode, string> = {
  Onsite: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Hybrid: "bg-sky-50 text-sky-700 border-sky-200",
  Remote: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function ShiftManagementPanel({
  shifts,
  assignments,
  policies,
  selectedDepartment,
  onDepartmentChange,
  departments,
}: ShiftManagementPanelProps) {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-850">Work Hours & Shift Management</h2>
          <p className="text-xs text-slate-600 mt-1">
            Map employee shift plans, weekly capacity, and attendance policy anchors.
          </p>
        </div>

        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger className="h-10 w-[190px] rounded-xl border-slate-200 bg-white text-xs font-semibold text-slate-700">
            <SelectValue placeholder="Department Filter" />
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

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          {shifts.map((shift) => {
            const assignedEmployees = assignments.filter(
              (assignment) => assignment.shiftId === shift.id
            );

            return (
              <div
                key={shift.id}
                className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{shift.name}</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      {shift.startTime} - {shift.endTime}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border text-[10px] font-bold px-2.5 py-1",
                      modeClassMap[shift.mode]
                    )}
                  >
                    {shift.mode}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-normal">{shift.description}</p>

                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="w-3.5 h-3.5 text-slate-600" />
                    {shift.weeklyHours}h/week
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users2 className="w-3.5 h-3.5 text-slate-600" />
                    {assignedEmployees.length} assigned
                  </span>
                </div>

                <p className="text-[10px] font-semibold text-slate-600">
                  Grace window: {shift.graceMinutes} minutes
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-5">
          <div className="rounded-2xl border border-slate-150 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Current Shift Assignments
              </h3>
            </div>
            <Table>
              <TableHeader className="bg-white">
                <TableRow className="border-slate-100 hover:bg-white">
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Employee
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Department
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Shift
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Weekly Hours
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <TableRow
                      key={assignment.id}
                      className="border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="px-4 py-3 align-top whitespace-normal">
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {assignment.employeeName}
                          </p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            {assignment.designation}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs font-semibold text-slate-600">
                        {assignment.department}
                      </TableCell>
                      <TableCell className="px-4 py-3 align-top whitespace-normal">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-700">
                            {assignment.shiftName}
                          </p>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border text-[10px] font-bold px-2 py-0.5",
                              modeClassMap[assignment.workMode]
                            )}
                          >
                            {assignment.workMode}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 align-top whitespace-normal">
                        <p className="text-xs font-semibold text-slate-700">
                          {assignment.weeklyHours}h
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1">
                          Week off: {assignment.weekOff}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-slate-100 hover:bg-white">
                    <TableCell
                      colSpan={4}
                      className="px-4 py-12 text-center text-sm text-slate-600 whitespace-normal"
                    >
                      No shift assignments match the selected department.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-2xl border border-slate-150 bg-slate-50/40 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Work Hours Policy
            </h3>
            <div className="space-y-3">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className="rounded-xl border border-slate-150 bg-white p-3 space-y-1.5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {policy.label}
                  </p>
                  <p className="text-sm font-bold text-slate-800">{policy.value}</p>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {policy.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
