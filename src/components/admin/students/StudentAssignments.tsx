"use client";

import { useState } from "react";
import { ClipboardList, Calendar, User, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IStudentAssignment } from "@/types/admin/student";
import { useGetStudentAssignmentsAdmin } from "@/querys/admin/studentQuery";
import StudentPaginationBar from "./StudentPaginationBar";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  evaluated: { label: "Evaluated", className: "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20" },
  submitted:  { label: "Submitted", className: "bg-blue-50 text-blue-700 border-blue-200" },
  pending:    { label: "Pending",   className: "bg-amber-50 text-amber-700 border-amber-200" },
};

function AssignmentCard({ assignment }: { assignment: IStudentAssignment }) {
  const status = STATUS_CONFIG[assignment.status] ?? { label: assignment.status, className: "bg-slate-100 text-slate-600 border-slate-200" };
  const evaluation = assignment.evaluation;
  const submission = assignment.submission;
  const percent = evaluation ? Math.round((evaluation.marksObtained / assignment.maxMarks) * 100) : null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{assignment.title}</p>
          <p className="text-xs text-slate-600 mt-0.5">{assignment.subject}</p>
        </div>
        <Badge variant="outline" className={`text-[10px] font-semibold shrink-0 ${status.className}`}>
          {status.label}
        </Badge>
      </div>

      {assignment.description && (
        <p className="text-[11px] text-slate-600 line-clamp-2">{assignment.description}</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Due: {new Date(assignment.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {assignment.tutorName || "—"}
        </span>
      </div>

      {submission && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${submission.status === "late" ? "bg-orange-50 text-orange-600" : "bg-[var(--brand-light-green)] text-[var(--brand-mid)]"}`}>
            {submission.status === "late" ? "Late Submission" : "Submitted"}
          </span>
          {submission.fileUrl && (
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-green)] hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              View File
            </a>
          )}
        </div>
      )}

      {evaluation ? (
        <div className="pt-2 border-t border-slate-50 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">
              Score: <strong className="text-slate-700">{evaluation.marksObtained} / {assignment.maxMarks}</strong>
            </span>
            <span className="text-xs font-bold text-[var(--brand-mid)]">{percent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand-green)] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          {evaluation.remarks && (
            <p className="text-[11px] text-slate-600 line-clamp-2">{evaluation.remarks}</p>
          )}
        </div>
      ) : !submission ? (
        <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-50">No submission yet</p>
      ) : null}
    </div>
  );
}

function AssignmentsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-100 p-4 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

const LIMIT = 10;

export default function StudentAssignments({ studentId }: { studentId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetStudentAssignmentsAdmin(studentId, { page, limit: LIMIT });
  const summary = data?.summary;
  const assignments = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? assignments.length;

  return (
    <Card className="border-slate-150 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-[var(--brand-green)]" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Assignments
            </CardTitle>
          </div>
          {summary && (
            <div className="flex gap-3 text-xs font-semibold">
              <span className="text-[var(--brand-mid)]">{summary.evaluated} Evaluated</span>
              <span className="text-blue-600">{summary.submitted} Submitted</span>
              <span className="text-amber-600">{summary.pending} Pending</span>
              <span className="text-slate-600">/ {summary.total} Total</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <AssignmentsSkeleton />
        ) : assignments.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-8">No assignments found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((a) => <AssignmentCard key={a.id} assignment={a} />)}
            </div>
            <StudentPaginationBar
              page={page}
              totalPages={totalPages}
              total={total}
              limit={LIMIT}
              onPageChange={setPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
