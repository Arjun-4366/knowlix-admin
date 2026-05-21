"use client";

import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Student } from "@/components/students/StudentStats";
import { cn } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";

// Helper to map DB course types to the specified UI Course Types
const mapCourseType = (type: string) => {
  switch (type) {
    case "Online School":
      return "Online School";
    case "Online Tuition":
      return "Online Tuition";
    case "Hybrid Learning":
      return "Foundation Course";
    default:
      return "Other Courses";
  }
};

interface TutorStudentTableProps {
  students: Student[];
  onViewStudent: (id: string) => void;
}

export default function TutorStudentTable({
  students,
  onViewStudent,
}: TutorStudentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assignmentScope, setAssignmentScope] = useState<"assigned" | "all">("assigned");

  // Filter students based on scope (Assigned to current tutor "Dr. Ramesh Prasad" vs All)
  const scopedStudents = students.filter((s) => {
    if (assignmentScope === "assigned") {
      return s.subjectTutor === "Dr. Ramesh Prasad";
    }
    return true;
  });

  // Apply search query and filters
  const filteredStudents = scopedStudents.filter((s) => {
    const mappedType = mapCourseType(s.courseType);
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.courseName && s.courseName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = courseFilter === "All" || mappedType === courseFilter;
    const matchesStatus = statusFilter === "All" || s.admissionStatus === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
      case "Pending Approval":
      case "Pending":
      case "In Review":
        return "bg-slate-50 text-slate-650 border-slate-200/60";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <Input
            type="text"
            placeholder="Search student name, ID or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-10 bg-white border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Assignment Toggle Scope */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setAssignmentScope("assigned")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                assignmentScope === "assigned"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              My Students
            </button>
            <button
              onClick={() => setAssignmentScope("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                assignmentScope === "all"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              All Platform Students
            </button>
          </div>

          {/* Course Type Filter */}
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-xl w-[160px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Courses</SelectItem>
              <SelectItem value="Online School">Online School</SelectItem>
              <SelectItem value="Online Tuition">Online Tuition</SelectItem>
              <SelectItem value="Foundation Course">Foundation Course</SelectItem>
              <SelectItem value="Other Courses">Other Courses</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-xl w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Pending Approval">Pending Approval</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Student Roster Table ── */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">
                Admission No
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[22%]">
                Student Name
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">
                Course Type
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">
                Package Details
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
                Grade
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[16%]">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Admission Number */}
                  <TableCell className="px-6 py-4 text-sm font-semibold text-slate-500 truncate">
                    {student.id}
                  </TableCell>

                  {/* Student Name + Initials Avatar */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs flex-shrink-0 border border-[var(--brand-light)]/20 shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-800 leading-none truncate">
                          {student.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Course Type (Mapped & Displayed nicely) */}
                  <TableCell className="px-6 py-4">
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-700 leading-none truncate">
                        {mapCourseType(student.courseType)}
                      </p>
                      {student.courseName && (
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1 truncate">
                          {student.courseName}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Package Details */}
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-650 truncate block">
                      {student.packageSelection}
                    </span>
                  </TableCell>

                  {/* Grade */}
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-650 truncate block">
                      {student.grade}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm",
                        getStatusBadgeClass(student.admissionStatus)
                      )}
                    >
                      {student.admissionStatus}
                    </Badge>
                  </TableCell>

                  {/* Actions (View details icon button) */}
                  <TableCell className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onViewStudent(student.id)}
                        title="View Details"
                        className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50 transition-all"
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
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-450 text-sm"
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
