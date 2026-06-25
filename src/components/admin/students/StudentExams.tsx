"use client";

import { useState } from "react";
import { BookOpen, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IStudentExam } from "@/types/admin/student";
import { useGetStudentExams } from "@/querys/admin/studentQuery";
import StudentPaginationBar from "./StudentPaginationBar";

const GRADE_COLOR: Record<string, string> = {
  "A+": "text-[var(--brand-mid)] bg-[var(--brand-light-green)]",
  A:   "text-[var(--brand-mid)] bg-[var(--brand-light-green)]",
  B:   "text-blue-700 bg-blue-50",
  C:   "text-amber-700 bg-amber-50",
  D:   "text-orange-700 bg-orange-50",
  F:   "text-red-600 bg-red-50",
};

function ExamCard({ exam }: { exam: IStudentExam }) {
  const result = exam.result;
  const gradeClass = result ? (GRADE_COLOR[result.grade] ?? "text-slate-700 bg-slate-100") : "";
  const percent = result ? Math.round((result.marksObtained / exam.maxMarks) * 100) : null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{exam.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{exam.subject}</p>
        </div>
        {result ? (
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${gradeClass}`}>
            {result.grade}
          </span>
        ) : (
          <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-500 border-slate-200">
            Pending
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(exam.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {exam.tutorName || "—"}
        </span>
      </div>

      {result ? (
        <div className="pt-2 border-t border-slate-50 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Score: <strong className="text-slate-700">{result.marksObtained} / {exam.maxMarks}</strong>
            </span>
            <span className="text-xs font-bold text-[var(--brand-mid)]">{percent}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand-green)] transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          {result.remarks && (
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{result.remarks}</p>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-50">Result not entered yet</p>
      )}
    </div>
  );
}

function ExamsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-100 p-4 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
          <Skeleton className="h-3 w-20" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

const LIMIT = 10;

export default function StudentExams({ studentId }: { studentId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetStudentExams(studentId, { page, limit: LIMIT });
  const summary = data?.summary;
  const exams = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? exams.length;

  return (
    <Card className="border-slate-150 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--brand-green)]" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Exams
            </CardTitle>
          </div>
          {summary && (
            <div className="flex gap-3 text-xs font-semibold">
              <span className="text-[var(--brand-mid)]">{summary.evaluated} Evaluated</span>
              <span className="text-amber-600">{summary.pending} Pending</span>
              <span className="text-slate-500">/ {summary.total} Total</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <ExamsSkeleton />
        ) : exams.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No exams found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((e) => <ExamCard key={e.id} exam={e} />)}
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
