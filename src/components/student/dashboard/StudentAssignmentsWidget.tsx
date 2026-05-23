"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: string;
  grade: string;
}

interface StudentAssignmentsWidgetProps {
  assignments: Assignment[];
  onSubmitFile: (id: string) => void;
}

export default function StudentAssignmentsWidget({
  assignments,
  onSubmitFile,
}: StudentAssignmentsWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Assignments & Homework</h2>
          <p className="text-xs text-slate-455 mt-0.5">Upload homework sheets and review tutor graded reports</p>
        </div>
        <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 shadow-none text-[10px]">
          Assessments
        </Badge>
      </div>
      <div className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/20">
            <TableRow>
              <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[40%]">Assignment</TableHead>
              <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[20%]">Due Date</TableHead>
              <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[20%]">Status</TableHead>
              <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {assignments.map((asm) => (
              <TableRow key={asm.id} className="hover:bg-slate-50/60 transition-colors">
                <TableCell className="px-6 py-4">
                  <p className="text-xs font-bold text-slate-800 truncate leading-none">{asm.title}</p>
                  <span className="text-[9px] text-slate-450 mt-1.5 block font-semibold">{asm.subject} • ID: {asm.id}</span>
                </TableCell>
                <TableCell className="px-6 py-4 text-xs text-center font-medium text-slate-650">{asm.dueDate}</TableCell>
                <TableCell className="px-6 py-4 text-center">
                  <Badge
                    className={`text-[9px] font-bold py-0.5 px-2 border ${
                      asm.status === "Graded"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : asm.status === "Submitted"
                        ? "bg-blue-50 text-blue-755 border-blue-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {asm.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  {asm.status === "Graded" ? (
                    <span className="text-xs font-black text-slate-800">{asm.grade}</span>
                  ) : asm.status === "Submitted" ? (
                    <span className="text-[10px] text-slate-400 italic">Reviewing</span>
                  ) : (
                    <button
                      onClick={() => onSubmitFile(asm.id)}
                      className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[9px] font-bold transition-colors cursor-pointer"
                    >
                      Submit File
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
