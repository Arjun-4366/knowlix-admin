"use client";

import { FileText, Calendar, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITutorAssignment } from "@/types/tutor/assignments";
import { StatusBadge, formatDueDate, isDueSoon, isOverdue } from "./assignmentHelpers";

interface AssignmentsListProps {
  assignments: ITutorAssignment[];
  studentMap: Map<string, string>;
  onEvaluate?: (assignment: ITutorAssignment) => void;
}

export default function AssignmentsList({
  assignments,
  studentMap,
  onEvaluate,
}: AssignmentsListProps) {
  if (assignments.length === 0) {
    return (
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-16 text-center">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">
            No assignments found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <Table className="table-fixed w-full">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[34%]">
              Assignment Details
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[16%]">
              Due Date
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">
              Students
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
              Max Marks
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {assignments.map((asg) => {
            const due = asg.dueDate;
            const dueSoon = isDueSoon(due);
            const overdue = isOverdue(due) && asg.status === "assigned";
            const studentNames = asg.studentIds
              .map((id) => studentMap.get(id) ?? id.substring(0, 8) + "...")
              .join(", ");

            return (
              <TableRow
                key={asg.id}
                className="hover:bg-slate-50/60 transition-colors">
                <TableCell className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800 leading-tight truncate">
                    {asg.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <BookOpen className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] text-slate-400 font-semibold truncate">
                      {asg.subject}
                    </span>
                  </div>
                  {asg.description && (
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                      {asg.description}
                    </p>
                  )}
                </TableCell>

                <TableCell className="px-6 py-4">
                  <div
                    className={`flex items-center gap-1 ${overdue ? "text-red-600" : dueSoon ? "text-amber-600" : "text-slate-650"}`}>
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-semibold">
                      {formatDueDate(due)}
                    </span>
                  </div>
                  {overdue && (
                    <span className="text-[10px] font-bold text-red-500 block mt-0.5">
                      Overdue
                    </span>
                  )}
                  {dueSoon && !overdue && (
                    <span className="text-[10px] font-bold text-amber-500 block mt-0.5">
                      Due soon
                    </span>
                  )}
                </TableCell>

                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Users className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-700">
                      {asg.studentIds.length} Student
                      {asg.studentIds.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold truncate">
                    {studentNames}
                  </p>
                </TableCell>

                <TableCell className="px-6 py-4">
                  <span className="text-sm font-black text-slate-800">
                    {asg.maxMarks}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    marks
                  </span>
                </TableCell>

                <TableCell className="px-6 py-4">
                  <StatusBadge status={asg.status} />
                </TableCell>

                <TableCell className="px-6 py-4 text-right">
                  {onEvaluate && asg.status !== "evaluated" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEvaluate(asg)}
                      className="text-xs font-bold text-[var(--brand-mid)] hover:bg-[var(--brand-light-green)]/35 hover:text-[var(--brand-mid)] px-2.5 py-1.5 rounded-lg border border-[var(--brand-green)]/20 cursor-pointer transition-all">
                      Evaluate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
