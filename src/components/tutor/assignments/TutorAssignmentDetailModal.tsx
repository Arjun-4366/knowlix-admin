"use client";

import {
  X,
  Calendar,
  BookOpen,
  Users,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Star,
} from "lucide-react";
import { ITutorAssignment } from "@/types/tutor/assignments";
import { StatusBadge, formatDueDate } from "./assignmentHelpers";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assignment: ITutorAssignment | null;
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

export default function TutorAssignmentDetailModal({ isOpen, onClose, assignment }: Props) {
  if (!isOpen || !assignment) return null;

  const students = assignment.students ?? [];
  const submitted = students.filter((s) => s.submission !== null).length;
  const evaluated = students.filter((s) => s.evaluation !== null).length;
  const pending = students.length - submitted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-base font-black text-slate-800 leading-tight truncate">
                {assignment.title}
              </h2>
              <StatusBadge status={assignment.status} />
            </div>
            <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {assignment.subject}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Due {formatDueDate(assignment.dueDate)}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" /> {assignment.maxMarks} marks
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

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Description */}
          {assignment.description && (
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Description
              </p>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {assignment.description}
              </p>
            </div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 bg-white p-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <p className="text-xl font-black text-slate-800">{students.length}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Assigned</p>
            </div>
            <div className="rounded-xl border border-[var(--brand-light)]/30 bg-[var(--brand-light-green)] p-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--brand-green)]" />
              </div>
              <p className="text-xl font-black text-[var(--brand-mid)]">{submitted}</p>
              <p className="text-[10px] font-bold text-[var(--brand-mid)] uppercase tracking-wider">Submitted</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="text-xl font-black text-amber-700">{pending}</p>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending</p>
            </div>
          </div>

          {/* Student rows */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              Student Submissions
            </p>
            <div className="space-y-3">
              {students.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-6">No student data available.</p>
              ) : (
                students.map((s) => {
                  const hasSubmission = s.submission !== null;
                  const hasEval = s.evaluation !== null;

                  return (
                    <div
                      key={s.studentId}
                      className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm"
                    >
                      {/* Student header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/60 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[var(--brand-light-green)] border border-[var(--brand-green)]/20 flex items-center justify-center text-[10px] font-black text-[var(--brand-mid)] flex-shrink-0">
                            {s.studentName?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{s.studentName}</span>
                        </div>
                        {hasSubmission ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--brand-green)]">
                            <CheckCircle2 className="w-3 h-3" /> Submitted
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                            <AlertCircle className="w-3 h-3" /> Not submitted
                          </span>
                        )}
                      </div>

                      {/* Submission details */}
                      {hasSubmission && s.submission && (
                        <div className="px-4 py-3 space-y-2.5 border-b border-slate-100">
                          <div className="flex items-start gap-2">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 w-20 flex-shrink-0 pt-0.5">
                              Submitted
                            </p>
                            <p className="text-[11px] text-slate-700">{fmt(s.submission.submittedAt)}</p>
                          </div>
                          {s.submission.remarks && (
                            <div className="flex items-start gap-2">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 w-20 flex-shrink-0 pt-0.5">
                                Remarks
                              </p>
                              <p className="text-[11px] text-slate-700 leading-relaxed">{s.submission.remarks}</p>
                            </div>
                          )}
                          {s.submission.fileUrls?.length > 0 && (
                            <div className="flex items-start gap-2">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 w-20 flex-shrink-0 pt-0.5">
                                Files
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {s.submission.fileUrls.map((url, i) => {
                                  const name = (() => {
                                    try {
                                      return decodeURIComponent(url).split("/").pop() || `File ${i + 1}`;
                                    } catch {
                                      return `File ${i + 1}`;
                                    }
                                  })();
                                  return (
                                    <a
                                      key={url}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-700 hover:bg-[var(--brand-light-green)] hover:border-[var(--brand-green)]/30 hover:text-[var(--brand-mid)] transition-colors max-w-[180px]"
                                    >
                                      <FileText className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">{name}</span>
                                      <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Evaluation details */}
                      {hasEval && s.evaluation && (
                        <div className="px-4 py-3 bg-[var(--brand-light-green)]/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-mid)]">
                              Evaluation
                            </p>
                            <div className="flex items-center gap-1.5">
                              <span className="text-base font-black text-[var(--brand-mid)]">
                                {s.evaluation.marksObtained}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-600">
                                / {assignment.maxMarks}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-green)] text-white ml-1">
                                {Math.round((s.evaluation.marksObtained / assignment.maxMarks) * 100)}%
                              </span>
                            </div>
                          </div>
                          {s.evaluation.remarks && (
                            <p className="text-[11px] text-slate-700 leading-relaxed">{s.evaluation.remarks}</p>
                          )}
                          <p className="text-[10px] text-slate-600">
                            Evaluated on {fmt(s.evaluation.evaluatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
