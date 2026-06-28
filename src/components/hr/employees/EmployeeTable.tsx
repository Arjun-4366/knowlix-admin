"use client";

import { Search, Filter, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ITutor } from "@/types/admin/tutor";
import { useGetSyllabuses } from "@/querys/admin/curriculumQuery";

const STATUSES = ["approved", "pending", "inactive", "resigned"];
const AVAILABILITIES = ["Morning", "Afternoon", "Evening"];

interface EmployeeTableProps {
  tutors: ITutor[];
  search: string;
  onSearchChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  syllabus: string;
  onSyllabusChange: (v: string) => void;
  availability: string;
  onAvailabilityChange: (v: string) => void;
  page: number;
  limit: number;
  total: number;
  onPageChange: (p: number) => void;
  onSelectTutor: (tutor: ITutor) => void;
  onEditTutor: (tutor: ITutor) => void;
}

const statusBadgeClass = (status: string) => {
  if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "pending")  return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === "inactive") return "bg-slate-100 text-slate-600 border-slate-200";
  if (status === "resigned") return "bg-red-50 text-red-600 border-red-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
};

export default function EmployeeTable({
  tutors,
  search,
  onSearchChange,
  status,
  onStatusChange,
  syllabus,
  onSyllabusChange,
  availability,
  onAvailabilityChange,
  page,
  limit,
  total,
  onPageChange,
  onSelectTutor,
  onEditTutor,
}: EmployeeTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const { data: syllabusesRes } = useGetSyllabuses();
  const syllabusOptions = syllabusesRes?.data?.map((s) => s.name) ?? [];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <Input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs font-semibold">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-xs font-semibold capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={syllabus} onValueChange={onSyllabusChange}>
          <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              <SelectValue placeholder="Syllabus" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs font-semibold">All Syllabi</SelectItem>
            {syllabusOptions.map((s) => (
              <SelectItem key={s} value={s} className="text-xs font-semibold">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={availability} onValueChange={onAvailabilityChange}>
          <SelectTrigger className="h-10 w-[150px] bg-white border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-600" />
              <SelectValue placeholder="Availability" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs font-semibold">All Times</SelectItem>
            {AVAILABILITIES.map((a) => (
              <SelectItem key={a} value={a} className="text-xs font-semibold">{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-white border-slate-150 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left">
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-slate-50/50">
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Tutor</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Subjects</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Syllabus</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Availability</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Experience</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">Joined</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {tutors.length > 0 ? (
                tutors.map((tutor) => (
                  <TableRow
                    key={tutor.id}
                    onClick={() => onSelectTutor(tutor)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {tutor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-none">{tutor.name}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{tutor.email}</p>
                          <p className="text-[10px] text-slate-600">{tutor.phone}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(tutor.subjects ?? []).slice(0, 3).map((s) => (
                          <Badge key={s} variant="outline" className="text-[9px] font-semibold px-1.5 py-0 border-slate-200 text-slate-600">{s}</Badge>
                        ))}
                        {(tutor.subjects ?? []).length > 3 && (
                          <Badge variant="outline" className="text-[9px] font-semibold px-1.5 py-0 border-slate-200 text-slate-600">
                            +{tutor.subjects.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(tutor.syllabus ?? []).map((s) => (
                          <Badge key={s} variant="outline" className="text-[9px] font-semibold px-1.5 py-0 border-blue-200 text-blue-600 bg-blue-50">{s}</Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(tutor.availability) ? tutor.availability : [tutor.availability]).map((a) => (
                          <Badge key={a} variant="outline" className="text-[9px] font-semibold px-1.5 py-0 border-violet-200 text-violet-600 bg-violet-50">{a}</Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${statusBadgeClass(tutor.status)}`}>
                        {tutor.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4 text-xs text-slate-600 font-medium">
                      {tutor.experience || "—"}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-xs text-slate-600">
                      {tutor.createdAt ? new Date(tutor.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                    </TableCell>

                    <TableCell className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEditTutor(tutor)}
                        className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                        title="Edit Tutor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-16 text-center text-slate-600 text-xs font-medium">
                    No tutors found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/30">
          <p className="text-[11px] text-slate-600 font-medium">
            Showing {tutors.length === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} tutors
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="h-7 w-7 rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="text-[11px] font-semibold text-slate-600 px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="h-7 w-7 rounded-lg border-slate-200 text-slate-600 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
