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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.courseName && s.courseName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || s.admissionStatus === statusFilter;
    const matchesCourse = courseFilter === "All" || s.courseType === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
      case "Pending Approval":
      case "Pending":
      case "In Review":
        return "bg-slate-50 text-slate-650 border-slate-200/60";
      case "Inactive":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Rejected":
        return "bg-slate-105 text-slate-500 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <Input
            type="text"
            placeholder="Search name or coordinator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-10 bg-white border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Courses</SelectItem>
                <SelectItem value="Online School">Online School</SelectItem>
                <SelectItem value="Online Tuition">Online Tuition</SelectItem>
                <SelectItem value="Hybrid Learning">Hybrid Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <Table className="table-fixed">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[14%]">
                Admission #
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[24%]">
                Student
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
                Grade
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">
                Course / Program
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                Coordinator
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[14%]">
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
                  <TableCell className="px-6 py-4 text-sm font-semibold text-slate-500 truncate">
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
                      {student.courseType === "Online School"
                        ? "OS"
                        : student.courseType === "Online Tuition"
                        ? "OT"
                        : student.courseType === "Hybrid Learning"
                        ? "HL"
                        : student.courseType}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-650 truncate block">
                      {student.coordinatorName}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Select
                        value={student.admissionStatus}
                        onValueChange={(val) => onUpdateStatus(student.id, val)}
                      >
                        <SelectTrigger
                          className={cn(
                            "px-2.5 py-1 text-xs font-semibold rounded-full border outline-none cursor-pointer transition-all h-7 w-full truncate border-input justify-between",
                            getStatusBadgeClass(student.admissionStatus)
                          )}
                        >
                          <SelectValue placeholder={student.admissionStatus} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Review">In Review</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onViewStudent(student)}
                        title="View Details"
                        className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEditStudent(student.id)}
                        title="Edit Student"
                        className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDeleteStudent(student.id)}
                        title="Delete Student"
                        className="rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50/50"
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
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-400 text-sm"
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
