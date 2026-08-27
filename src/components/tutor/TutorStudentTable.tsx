"use client";

import { Search, Eye, Loader2 } from "lucide-react";
import { IStudent } from "@/types/admin/student";
import { IProgram } from "@/types/admin/program";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TutorStudentTableProps {
  students: IStudent[];
  onViewStudent: (id: string) => void;
  programs: IProgram[];
  search: string;
  onSearchChange: (value: string) => void;
  programId: string;
  onProgramChange: (value: string) => void;
  isLoading?: boolean;
}

export default function TutorStudentTable({
  students,
  onViewStudent,
  programs,
  search,
  onSearchChange,
  programId,
  onProgramChange,
  isLoading = false,
}: TutorStudentTableProps) {
  return (
    <div className="space-y-4">
      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 z-10" />
          <Input
            type="text"
            placeholder="Search by name, email, phone or admission no..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 h-10 bg-white border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={programId || "__all__"} onValueChange={(v) => onProgramChange(v === "__all__" ? "" : v)}>
            <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-xl w-[200px]">
              <SelectValue placeholder="All Programs" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-150 rounded-xl shadow-lg">
              <SelectItem value="__all__">All Programs</SelectItem>
              {programs.map((p) => (
                <SelectItem key={p.id} value={p.id!}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Student Roster Table ── */}
      <div className="relative bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
            <Loader2 className="w-6 h-6 text-[var(--brand-green)] animate-spin" />
          </div>
        )}
        <div className="overflow-x-auto">
        <Table className="table-fixed w-full min-w-[600px]">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[22%]">
                Admission ID / No
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[28%]">
                Student Name
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[25%]">
                Program
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[15%]">
                Package
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[12%]">
                Class
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-[10%]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Admission ID */}
                  <TableCell className="px-6 py-4 text-xs font-semibold text-slate-600 truncate">
                    {student.admissionNumber || "N/A"}
                  </TableCell>

                  {/* Student Name + Avatar */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs flex-shrink-0 border border-[var(--brand-light)]/20 shadow-sm">
                        {student.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 leading-none truncate">
                        {student.studentName}
                      </p>
                    </div>
                  </TableCell>

                  {/* Program */}
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 leading-none truncate">
                      {student.programName || "—"}
                    </p>
                  </TableCell>

                  {/* Package */}
                  <TableCell className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-600 capitalize truncate block">
                      {student.package?.replace("_", " ") || "—"}
                    </span>
                  </TableCell>

                  {/* Class */}
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-650 truncate block">
                      {student.class ? `${student.class}` : "—"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewStudent(student.id)}
                        title="View Details"
                        className="h-8 w-8 rounded-lg text-slate-600 hover:text-[var(--brand-green)] hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-600 text-sm"
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}
