import { useState } from "react";
import { Search, Eye, Trash2, Pencil } from "lucide-react";
import { Student } from "./StudentStats";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StudentTableProps {
  students: Student[];
  onDeleteStudent: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (id: string) => void;
}

export default function StudentTable({
  students,
  onDeleteStudent,
  onUpdateStatus,
  onViewStudent,
  onEditStudent,
}: StudentTableProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Admission Taken":
      case "Course Completed":
        return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
      case "Pending":
        return "bg-slate-50 text-slate-650 border-slate-200/60";
      case "Inactive":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Directory Table */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <Table className="table-fixed">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[5%]">
                Sl.
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[13%]">
                Admission No
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[24%]">
                Student
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[12%]">
                Grade
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[20%]">
                Course / Program
              </TableHead>
             
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[18%]">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[12%]">
                Pending Fee
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-[10%]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {students.length > 0 ? (
              students.map((student, index) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => onViewStudent(student)}
                >
                  <TableCell className="px-6 py-4 text-sm font-semibold text-slate-600">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-semibold text-slate-600 truncate">
                    {student.admissionNumber || "Pending"}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs flex-shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-800 leading-none truncate">
                          {student.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {student.grade}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {student.courseName ? `${student.courseName} / ` : ""}
                      {student.programName || student.courseType}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <Select
                        key={`status-${student.id}-${student.rawAdmissionStatus}`}
                        value={student.rawAdmissionStatus}
                        onValueChange={(val) => onUpdateStatus(student.id, val)}
                      >
                        <SelectTrigger
                          className={cn(
                            "px-3 py-1.5 text-xs font-semibold rounded-full border outline-none cursor-pointer transition-all h-8 w-full border-input justify-between",
                            getStatusBadgeClass(student.admissionStatus)
                          )}
                        >
                          <SelectValue placeholder={student.admissionStatus} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="admission_taken">Admission Taken</SelectItem>
                          <SelectItem value="course_completed">Course Completed</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700">
                      ₹{Math.max(0, (student.totalFee || 0) - (student.paidAmount || 0))}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => { e.stopPropagation(); onViewStudent(student); }}
                        title="View Details"
                        className="rounded-lg text-slate-600 hover:text-[var(--brand-green)] hover:bg-slate-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEditStudent(student.id)}
                        title="Edit Student"
                        className="rounded-lg text-slate-600 hover:text-[var(--brand-green)] hover:bg-slate-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDeleteStudent(student.id)}
                        title="Delete Student"
                        className="rounded-lg text-slate-600 hover:text-red-650 hover:bg-red-50/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-6 py-12 text-center text-slate-600 text-sm"
                >
                  No students matching the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
