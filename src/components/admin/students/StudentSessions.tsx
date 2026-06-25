"use client";

import { useState } from "react";
import { Video, Clock, User, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IStudentSession } from "@/types/admin/student";
import { useGetStudentSessions } from "@/querys/admin/studentQuery";
import StudentPaginationBar from "./StudentPaginationBar";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  conducted:     { label: "Conducted",     className: "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20" },
  completed:     { label: "Completed",     className: "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20" },
  not_conducted: { label: "Not Conducted", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

const ATTENDANCE_CONFIG: Record<string, { label: string; className: string }> = {
  present: { label: "Present", className: "bg-[var(--brand-light-green)] text-[var(--brand-mid)]" },
  absent:  { label: "Absent",  className: "bg-red-50 text-red-600" },
  late:    { label: "Late",    className: "bg-amber-50 text-amber-700" },
};

function SessionCard({ session }: { session: IStudentSession }) {
  const status = STATUS_CONFIG[session.status] ?? { label: session.status, className: "bg-slate-100 text-slate-600" };
  const att = session.attendance ? ATTENDANCE_CONFIG[session.attendance.status] : null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{session.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{session.subject}</p>
        </div>
        <Badge variant="outline" className={`text-[10px] font-semibold shrink-0 ${status.className}`}>
          {status.label}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(session.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {session.durationMinutes} min
        </span>
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {session.tutorName || "—"}
        </span>
        <span className="capitalize">{session.type}</span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-50">
        {att ? (
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${att.className}`}>
            {att.label}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400">No attendance recorded</span>
        )}
        {session.meetLink && (
          <a
            href={session.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-semibold text-[var(--brand-green)] hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Meet Link
          </a>
        )}
      </div>
    </div>
  );
}

function SessionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-100 p-4 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-24" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

const LIMIT = 10;

export default function StudentSessions({ studentId }: { studentId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetStudentSessions(studentId, { page, limit: LIMIT });
  const summary = data?.summary;
  const sessions = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? sessions.length;

  return (
    <Card className="border-slate-150 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-[var(--brand-green)]" />
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Sessions
            </CardTitle>
          </div>
          {summary && (
            <div className="flex gap-3 text-xs font-semibold">
              <span className="text-[var(--brand-mid)]">{summary.present} Present</span>
              <span className="text-amber-600">{summary.late} Late</span>
              <span className="text-red-500">{summary.absent} Absent</span>
              <span className="text-slate-500">/ {summary.total} Total</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <SessionsSkeleton />
        ) : sessions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No sessions found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map((s) => <SessionCard key={s.id} session={s} />)}
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
