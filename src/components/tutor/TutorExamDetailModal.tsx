"use client";

import { X, Calendar, BookOpen, Star, CheckCircle2, AlertCircle } from "lucide-react";
import { ITutorExam } from "@/types/tutor/exams";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  exam: ITutorExam | null;
  studentMap: Map<string, string>;
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
  conducted: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "A":  "bg-green-50 text-green-700 border-green-200",
  "B":  "bg-blue-50 text-blue-700 border-blue-200",
  "C":  "bg-amber-50 text-amber-700 border-amber-200",
  "D":  "bg-orange-50 text-orange-700 border-orange-200",
  "F":  "bg-red-50 text-red-700 border-red-200",
};

export default function TutorExamDetailModal({ isOpen, onClose, exam, studentMap }: Props) {
  if (!isOpen || !exam) return null;

  const evaluations = exam.evaluations ?? [];
  const evaluatedIds = new Set(evaluations.map((e) => e.studentId));
  const pendingStudents = exam.studentIds.filter((id) => !evaluatedIds.has(id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-sm font-black text-slate-800 leading-tight line-clamp-2">
                {exam.title}
              </h2>
              <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[exam.status] ?? STATUS_STYLES.pending}`}>
                {exam.status}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {exam.subject}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(exam.examDate).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" /> {exam.maxMarks} marks
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm">
              <p className="text-xl font-black text-slate-800">{exam.studentIds.length}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Assigned</p>
            </div>
            <div className="rounded-xl border border-[var(--brand-light)]/30 bg-[var(--brand-light-green)] p-3 text-center shadow-sm">
              <p className="text-xl font-black text-[var(--brand-mid)]">{evaluations.length}</p>
              <p className="text-[10px] font-bold text-[var(--brand-mid)] uppercase tracking-wider">Evaluated</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center shadow-sm">
              <p className="text-xl font-black text-amber-700">{pendingStudents.length}</p>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending</p>
            </div>
          </div>

          {/* Evaluated students */}
          {evaluations.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                Results
              </p>
              <div className="space-y-2.5">
                {evaluations.map((ev) => {
                  const pct = Math.round((ev.marksObtained / exam.maxMarks) * 100);
                  const gradeCls = GRADE_COLORS[ev.grade] ?? GRADE_COLORS["B"];
                  return (
                    <div key={ev.id} className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                      {/* Student header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/60 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[var(--brand-light-green)] border border-[var(--brand-green)]/20 flex items-center justify-center text-[10px] font-black text-[var(--brand-mid)] flex-shrink-0">
                            {ev.studentName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{ev.studentName}</span>
                        </div>
                        <span className={`flex items-center gap-1 text-[10px] font-bold`}>
                          <CheckCircle2 className="w-3 h-3 text-[var(--brand-green)]" />
                          <span className="text-[var(--brand-green)]">Evaluated</span>
                        </span>
                      </div>

                      {/* Score row */}
                      <div className="px-4 py-3 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-slate-800">{ev.marksObtained}</span>
                            <span className="text-sm text-slate-600 font-semibold">/ {exam.maxMarks}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${gradeCls}`}>
                              {ev.grade}
                            </span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-green)] text-white">
                              {pct}%
                            </span>
                          </div>
                        </div>

                        {/* Score bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--brand-green)] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        {ev.remarks && (
                          <p className="text-[11px] text-slate-600 leading-relaxed">{ev.remarks}</p>
                        )}
                        <p className="text-[10px] text-slate-500">
                          Entered on {fmt(ev.enteredAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending students */}
          {pendingStudents.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                Awaiting Results
              </p>
              <div className="space-y-2">
                {pendingStudents.map((id) => (
                  <div key={id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 flex-shrink-0">
                        {(studentMap.get(id) ?? "?")?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {studentMap.get(id) ?? id.substring(0, 12) + "…"}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                      <AlertCircle className="w-3 h-3" /> Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {evaluations.length === 0 && pendingStudents.length === 0 && (
            <p className="text-xs text-slate-600 text-center py-6">No student data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
