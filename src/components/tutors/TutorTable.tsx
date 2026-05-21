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
import { Star, CheckCircle2, Eye } from "lucide-react";
import { Tutor } from "@/app/admin/tutor/page";
import { Student } from "@/components/students/StudentStats";

interface TutorTableProps {
  tutors: Tutor[];
  students: Student[];
  onApproveTutor: (id: string) => void;
}

export default function TutorTable({
  tutors,
  students,
  onApproveTutor,
}: TutorTableProps) {
  const router = useRouter();

  const calculateTutorAverage = (tutor: Tutor) => {
    const m = tutor.growthMetrics;
    const sum =
      m.growthOfStudents +
      m.responsibility +
      m.ownership +
      m.workEthics +
      m.teamwork +
      m.honesty;
    return (sum / 6).toFixed(2);
  };

  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
              Tutor ID
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[24%]">
              Name
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">
              Subject Expertise
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
              Experience
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
              Availability
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
              GROWTH Rating
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[8%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {tutors.length > 0 ? (
            tutors.map((tutor) => {
              const ratingAvg = calculateTutorAverage(tutor);
              const assignedStudentsCount = students.filter(
                (s) => s.subjectTutor === tutor.name
              ).length;

              return (
                <TableRow
                  key={tutor.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <TableCell className="px-6 py-4 text-sm font-semibold text-slate-500">
                    {tutor.id}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{tutor.name}</p>
                      <p className="text-xs text-slate-450">{tutor.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-700 font-semibold">
                    {tutor.subject}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-650">
                    {tutor.experience}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-slate-650">
                    {tutor.availability}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {tutor.status === "Approved" ? (
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[var(--brand-green)] fill-[var(--brand-green)]" />
                        <span className="text-sm font-bold text-slate-750">{ratingAvg}</span>
                        <span className="text-[10px] text-slate-400">
                          ({assignedStudentsCount} active)
                        </span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 border border-slate-200"
                      >
                        Awaiting HR
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      {tutor.status === "Pending HR Approval" && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
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
                        onClick={() => router.push(`/admin/tutor/${tutor.id}`)}
                        title="View Tutor Details"
                        className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
