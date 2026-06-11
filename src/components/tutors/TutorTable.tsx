"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, Eye, Trash2, Pencil, Users } from "lucide-react";
import { ITutor } from "@/types/admin/tutor";

interface TutorTableProps {
  tutors: ITutor[];
  onApproveTutor?: (id: string) => void;
  onDeleteTutor?: (id: string) => void;
  onEditTutor?: (id: string) => void;
}

export default function TutorTable({
  tutors,
  onApproveTutor,
  onDeleteTutor,
  onEditTutor,
}: TutorTableProps) {
  const router = useRouter();

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s === "approved" || s === "active") {
      return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
    }
    if (s === "rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden w-full">
      <Table className="w-full">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
              Tutor ID
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[22%]">
              Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
              Subject Expertise
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
              Experience
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
              Availability
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[8%] text-center">
              Students
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
              GROWTH Points
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {tutors.length > 0 ? (
            tutors.map((tutor) => {
              const hasPerformance = tutor.status === "approved";

              return (
                <TableRow
                  key={tutor.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <TableCell className="px-6 py-4 text-sm font-semibold text-slate-550 truncate max-w-[120px]" title={tutor.id}>
                    {tutor.id.substring(tutor.id.length - 8)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{tutor.name}</p>
                      <p className="text-xs text-slate-450">{tutor.email}</p>
                      {tutor.phone && <p className="text-[10px] text-slate-400 mt-0.5">{tutor.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-700 font-semibold max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {tutor.subjectEntries && tutor.subjectEntries.length > 0
                        ? tutor.subjectEntries.map((e, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px] bg-slate-50 border-slate-200">
                              {e.name} {e.syllabi.length > 0 ? `(${e.syllabi.join(", ")})` : ""}
                            </Badge>
                          ))
                        : tutor.subjects && tutor.subjects.length > 0
                        ? tutor.subjects.join(", ")
                        : "General"}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-650">
                    {tutor.experience}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-655">
                    {Array.isArray(tutor.availability) ? tutor.availability.join(", ") : tutor.availability}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-700">
                        {tutor.assignedStudentIds?.length || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {hasPerformance ? (
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[var(--brand-green)] fill-[var(--brand-green)]" />
                        <span className="text-sm font-bold text-slate-750">{tutor.performanceScore?.toFixed(1) || "0.0"}</span>
                        <span className="text-[10px] text-slate-400">
                          ({tutor.growthPoints || 0} pts)
                        </span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(tutor.status)}`}
                      >
                        {tutor.status === "pending" ? "Awaiting HR" : tutor.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      {tutor.status === "pending" && onApproveTutor && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          type="button"
                          onClick={() => onApproveTutor(tutor.id)}
                          title="Admit Tutor (HR Approval)"
                          className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-[var(--brand-light-green)]"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        type="button"
                        onClick={() => router.push(`/admin/tutor/${tutor.id}`)}
                        title="View Tutor Details"
                        className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {onEditTutor && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          type="button"
                          onClick={() => onEditTutor(tutor.id)}
                          title="Edit Tutor"
                          className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      {onDeleteTutor && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          type="button"
                          onClick={() => onDeleteTutor(tutor.id)}
                          title="Delete Tutor"
                          className="rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="px-6 py-12 text-center text-slate-400 text-sm"
              >
                No tutors matching the current filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
