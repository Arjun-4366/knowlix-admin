"use client";

import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { IStudent } from "@/types/admin/student";
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
  switch (type?.toLowerCase()) {
    case "online_school":
    case "online school":
      return "Online School";
    case "online_tuition":
    case "online tuition":
      return "Online Tuition";
    case "foundation_course":
    case "hybrid learning":
      return "Foundation Course";
    default:
      return "Other Courses";
  }
};

interface TutorStudentTableProps {
  students: IStudent[];
  onViewStudent: (id: string) => void;
}

export default function TutorStudentTable({
  students,
  onViewStudent,
}: TutorStudentTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Apply search query and filters
  const filteredStudents = students.filter((s) => {
    const mappedType = mapCourseType(s.courseType);
    const matchesSearch =
      s.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mappedType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = courseFilter === "All" || mappedType === courseFilter;
    
    const dbStatus = s.admissionStatus?.toLowerCase();
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Approved" && (dbStatus === "approved" || dbStatus === "active")) ||
      (statusFilter === "In Review" && dbStatus === "in_review") ||
      (statusFilter === "Pending Approval" && (dbStatus === "pending" || dbStatus === "pending_approval")) ||
      (statusFilter === "Rejected" && dbStatus === "rejected");

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "active":
        return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
      case "pending":
      case "in review":
      case "in_review":
      case "pending_approval":
        return "bg-slate-50 text-slate-650 border-slate-200/60";
      case "rejected":
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
          {/* Course Type Filter */}
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-xl w-[160px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-150 rounded-xl shadow-lg">
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
            <SelectContent className="bg-white border border-slate-150 rounded-xl shadow-lg">
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
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[22%]">
                Admission ID / No
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">
                Student Name
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[22%]">
                Course Type
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                Package Details
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
                Class / Grade
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
                  {/* Admission ID */}
                  <TableCell className="px-6 py-4 text-xs font-semibold text-slate-500 truncate">
                    {student.id}
                  </TableCell>

                  {/* Student Name + Initials Avatar */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs flex-shrink-0 border border-[var(--brand-light)]/20 shadow-sm">
                        {student.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-slate-800 leading-none truncate">
                          {student.studentName}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Course Type */}
                  <TableCell className="px-6 py-4">
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate-700 leading-none truncate">
                        {mapCourseType(student.courseType)}
                      </p>
                    </div>
                  </TableCell>

                  {/* Package Details */}
                  <TableCell className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500 capitalize truncate block">
                      {student.package?.replace("_", " ")}
                    </span>
                  </TableCell>

                  {/* Class */}
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-650 truncate block">
                      Class {student.class}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm capitalize",
                        getStatusBadgeClass(student.admissionStatus)
                      )}
                    >
                      {student.admissionStatus}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewStudent(student.id)}
                        title="View Details"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50 transition-all cursor-pointer"
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
