"use client";

import { useState } from "react";
import {
  Video, BookOpen, FileText, CalendarCheck,
  Clock, Users, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useGetAdminTutorSessions,
  useGetAdminTutorAssignments,
  useGetAdminTutorExams,
  useGetAdminTutorAttendance,
} from "@/querys/admin/tutorQuery";

interface Props {
  tutorId: string;
}

const PAGE_LIMIT = 10;

// ── helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const sessionStatusClass: Record<string, string> = {
  scheduled:     "bg-blue-50 text-blue-700 border-blue-200",
  conducted:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed:     "bg-slate-100 text-slate-600 border-slate-200",
  not_conducted: "bg-rose-50 text-rose-600 border-rose-200",
};
const assignStatusClass: Record<string, string> = {
  evaluated: "bg-emerald-50 text-emerald-700 border-emerald-200",
  submitted:  "bg-blue-50 text-blue-700 border-blue-200",
  pending:    "bg-amber-50 text-amber-700 border-amber-200",
  expired:    "bg-slate-100 text-slate-500 border-slate-200",
};
const examStatusClass: Record<string, string> = {
  conducted:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  scheduled:   "bg-blue-50 text-blue-700 border-blue-200",
  not_conducted:"bg-rose-50 text-rose-600 border-rose-200",
};
const attendStatusClass: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:  "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-rose-50 text-rose-600 border-rose-200",
};

function EmptyRow({ cols, label }: { cols: number; label: string }) {
  return (
    <tr>
      <td colSpan={cols} className="py-14 text-center text-sm text-slate-500">{label}</td>
    </tr>
  );
}

function SkeletonRows({ cols, rows = 4 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-5 py-3.5">
              <Skeleton className="h-4 w-full rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function Pagination({ page, totalPages, onPrev, onNext }: { page: number; totalPages: number; onPrev: () => void; onNext: () => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100">
      <Button variant="outline" size="icon-sm" onClick={onPrev} disabled={page <= 1} className="h-7 w-7 rounded-lg disabled:opacity-40">
        <ChevronLeft className="w-3.5 h-3.5" />
      </Button>
      <span className="text-xs font-semibold text-slate-600">{page} / {totalPages}</span>
      <Button variant="outline" size="icon-sm" onClick={onNext} disabled={page >= totalPages} className="h-7 w-7 rounded-lg disabled:opacity-40">
        <ChevronRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

// ── Sessions ──────────────────────────────────────────────────────────────────

function SessionsTab({ tutorId }: { tutorId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminTutorSessions(tutorId, { page, limit: PAGE_LIMIT });
  const records = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const summary = data?.summary;

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Total Sessions", value: summary.totalSessions ?? 0, color: "text-slate-700" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center">
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/60">
              <tr>
                {["Session", "Date & Time", "Duration", "Type", "Students", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? <SkeletonRows cols={6} /> : records.length === 0 ? (
                <EmptyRow cols={6} label="No sessions found." />
              ) : records.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{s.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{s.subject}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-semibold text-slate-700">{fmtDate(s.scheduledAt)}</p>
                    <p className="text-[10px] text-slate-500">{fmtTime(s.scheduledAt)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <Clock className="w-3.5 h-3.5" /> {s.durationMinutes} min
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold text-slate-600 capitalize">{s.type}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Users className="w-3.5 h-3.5" /> {s.studentIds?.length ?? 0}
                    </div>
                    {s.students?.map((st: any) => (
                      <p key={st.studentId} className="text-[10px] text-slate-500 truncate max-w-[120px]">{st.studentName}</p>
                    ))}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", sessionStatusClass[s.status] ?? "bg-slate-50 text-slate-600")}>
                      {s.status?.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
      </div>
    </div>
  );
}

// ── Assignments ───────────────────────────────────────────────────────────────

function AssignmentsTab({ tutorId }: { tutorId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminTutorAssignments(tutorId, { page, limit: PAGE_LIMIT });
  const records = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const summary = data?.summary;

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: summary.totalAssignments ?? 0, color: "text-slate-700" },
            { label: "Submitted", value: summary.submitted ?? 0, color: "text-blue-600" },
            { label: "Evaluated", value: summary.evaluated ?? 0, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center">
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/60">
              <tr>
                {["Assignment", "Subject", "Due Date", "Max Marks", "Submissions", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? <SkeletonRows cols={6} /> : records.length === 0 ? (
                <EmptyRow cols={6} label="No assignments found." />
              ) : records.map((a: any) => {
                const submitted = a.students?.filter((s: any) => s.submission !== null).length ?? 0;
                const evaluated = a.students?.filter((s: any) => s.evaluation !== null).length ?? 0;
                return (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{a.title}</p>
                      {a.description && <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{a.description}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-600">{a.subject}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{fmtDate(a.dueDate)}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-slate-700">{a.maxMarks}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-slate-700">{submitted} / {a.studentIds?.length ?? 0} submitted</p>
                      {evaluated > 0 && <p className="text-[10px] text-emerald-600 font-semibold">{evaluated} evaluated</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", assignStatusClass[a.status] ?? "bg-slate-50 text-slate-600")}>
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
      </div>
    </div>
  );
}

// ── Exams ─────────────────────────────────────────────────────────────────────

function ExamsTab({ tutorId }: { tutorId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminTutorExams(tutorId, { page, limit: PAGE_LIMIT });
  const records = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const summary = data?.summary;

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Exams", value: summary.totalExams ?? 0, color: "text-slate-700" },
            { label: "Evaluated", value: summary.evaluated ?? 0, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center">
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/60">
              <tr>
                {["Exam", "Subject", "Date", "Max Marks", "Results", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? <SkeletonRows cols={6} /> : records.length === 0 ? (
                <EmptyRow cols={6} label="No exams found." />
              ) : records.map((e: any) => {
                const withResults = e.students?.filter((s: any) => s.result !== null).length ?? 0;
                return (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">{e.title}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-slate-600">{e.subject}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{fmtDate(e.examDate)}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-slate-700">{e.maxMarks}</td>
                    <td className="px-5 py-3.5">
                      {e.students?.length > 0 ? (
                        <div className="space-y-0.5">
                          {e.students.map((st: any) => (
                            <div key={st.studentId} className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold text-slate-600 truncate max-w-[100px]">{st.studentName}</span>
                              {st.result ? (
                                <span className="text-[10px] font-black text-emerald-600">{st.result.marksObtained}/{e.maxMarks}</span>
                              ) : (
                                <span className="text-[10px] text-slate-400">—</span>
                              )}
                            </div>
                          ))}
                          <p className="text-[10px] text-slate-400">{withResults} of {e.students.length} graded</p>
                        </div>
                      ) : <span className="text-[10px] text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", examStatusClass[e.status] ?? "bg-slate-50 text-slate-600")}>
                        {e.status?.replace("_", " ")}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
      </div>
    </div>
  );
}

// ── Attendance ────────────────────────────────────────────────────────────────

function AttendanceTab({ tutorId }: { tutorId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminTutorAttendance(tutorId, { page, limit: PAGE_LIMIT });
  const records = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const summary = data?.summary;

  return (
    <div className="space-y-4">
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Approved", value: summary.approvedDays ?? 0, color: "text-emerald-600" },
            { label: "Pending", value: summary.pendingDays ?? 0, color: "text-amber-600" },
            { label: "Rejected", value: summary.rejectedDays ?? 0, color: "text-rose-600" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center">
              <p className={cn("text-2xl font-black", s.color)}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/60">
              <tr>
                {["Date", "Type", "Notes", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? <SkeletonRows cols={4} /> : records.length === 0 ? (
                <EmptyRow cols={4} label="No attendance records found." />
              ) : records.map((a: any) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{fmtDate(a.date ?? a.createdAt)}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-600 capitalize">{a.type ?? "—"}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-600 max-w-[220px] truncate">{a.notes ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant="outline" className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full capitalize", attendStatusClass[a.status] ?? "bg-slate-50 text-slate-600")}>
                      {a.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPrev={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)} />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function TutorActivityTabs({ tutorId }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <p className="text-sm font-bold text-slate-800">Activity Overview</p>
        <p className="text-xs text-slate-500 mt-0.5">Sessions, assignments, exams, and attendance for this tutor.</p>
      </div>
      <div className="p-6">
        <Tabs defaultValue="sessions">
          <TabsList className="mb-5">
            <TabsTrigger value="sessions" className="text-xs font-semibold px-4 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Sessions
            </TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs font-semibold px-4 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Assignments
            </TabsTrigger>
            <TabsTrigger value="exams" className="text-xs font-semibold px-4 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Exams
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs font-semibold px-4 flex items-center gap-1.5">
              <CalendarCheck className="w-3.5 h-3.5" /> Attendance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sessions"><SessionsTab tutorId={tutorId} /></TabsContent>
          <TabsContent value="assignments"><AssignmentsTab tutorId={tutorId} /></TabsContent>
          <TabsContent value="exams"><ExamsTab tutorId={tutorId} /></TabsContent>
          <TabsContent value="attendance"><AttendanceTab tutorId={tutorId} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
