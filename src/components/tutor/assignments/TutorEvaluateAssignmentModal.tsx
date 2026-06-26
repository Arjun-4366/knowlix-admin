"use client";

import React, { useState, useEffect } from "react";
import { Award, X, Lock, ExternalLink, Paperclip, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEvaluateTutorAssignment } from "@/querys/tutor/assignmentQuery";
import { ITutorAssignment, IEvaluateAssignmentPayload, IAssignmentStudent } from "@/types/tutor/assignments";
import { toast } from "react-hot-toast";

interface TutorEvaluateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: ITutorAssignment | null;
  studentMap: Map<string, string>;
}

function getFileType(url: string): "image" | "pdf" | "other" {
  const lower = url.toLowerCase();
  if (/\.(png|jpe?g|gif|webp|svg)(\?|$)/.test(lower)) return "image";
  if (/\.pdf(\?|$)/.test(lower)) return "pdf";
  return "other";
}

export default function TutorEvaluateAssignmentModal({
  isOpen,
  onClose,
  assignment,
  studentMap,
}: TutorEvaluateAssignmentModalProps) {
  const { mutate: evaluateAssignment, isPending: isEvaluating } = useEvaluateTutorAssignment();

  const [evalStudentId, setEvalStudentId] = useState("");
  const [evalMarks, setEvalMarks] = useState("");
  const [evalRemarks, setEvalRemarks] = useState("");
  const [evalCompleted, setEvalCompleted] = useState(true);

  // Students who have actually submitted
  const submittedStudents: IAssignmentStudent[] = assignment?.students
    ? assignment.students.filter((s) => s.submission !== null)
    : assignment?.studentIds.map((id) => ({
        studentId: id,
        studentName: studentMap.get(id) ?? id,
        submission: null,
        evaluation: null,
      })) ?? [];

  const selectedStudent = submittedStudents.find((s) => s.studentId === evalStudentId) ?? null;
  const submission = selectedStudent?.submission ?? null;

  useEffect(() => {
    if (assignment && submittedStudents.length > 0) {
      setEvalStudentId(submittedStudents[0].studentId);
      setEvalMarks("");
      setEvalRemarks("");
      setEvalCompleted(true);
    }
  }, [assignment, isOpen]);

  if (!isOpen || !assignment) return null;

  const handleEvaluateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalStudentId) {
      toast.error("Please select a student.");
      return;
    }

    const marks = parseFloat(evalMarks);
    if (isNaN(marks) || marks < 0 || marks > assignment.maxMarks) {
      toast.error(`Please enter valid marks between 0 and ${assignment.maxMarks}.`);
      return;
    }

    const payload: IEvaluateAssignmentPayload = {
      studentId: evalStudentId,
      marksObtained: marks,
      remarks: evalRemarks.trim(),
      completed: evalCompleted,
    };

    evaluateAssignment(
      { id: assignment.id, data: payload },
      {
        onSuccess: () => {
          toast.success("Assignment evaluated successfully!");
          onClose();
        },
        onError: () => {
          toast.error("Failed to submit evaluation. Please try again.");
        },
      }
    );
  };

  const fileUrls = submission?.fileUrls ?? [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0d3b2e]/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--brand-green)]" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Evaluate Student
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg h-7 w-7 text-slate-450 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center border-none bg-transparent focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleEvaluateSubmit} className="space-y-4">
            {/* Assignment Details */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assignment</h4>
              <p className="text-sm font-bold text-slate-800 mt-0.5 leading-tight">{assignment.title}</p>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{assignment.subject}</span>
            </div>

            {/* Student Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Student {submittedStudents.length === 0 && <span className="text-red-400 normal-case font-semibold">(no submissions yet)</span>}
              </label>
              <select
                value={evalStudentId}
                onChange={(e) => setEvalStudentId(e.target.value)}
                className="h-10 w-full bg-white border border-slate-200 rounded-xl text-sm px-3 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30"
                required
                disabled={submittedStudents.length === 0}
              >
                {submittedStudents.length === 0 ? (
                  <option value="">No submissions available</option>
                ) : (
                  submittedStudents.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.studentName || studentMap.get(s.studentId) || s.studentId}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Submitted Files */}
            {submission && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" /> Submitted Files
                  <span className="ml-1 text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                    {fileUrls.length}
                  </span>
                </label>

                {/* Image grid preview */}
                {fileUrls.filter((u) => getFileType(u) === "image").length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {fileUrls
                      .filter((u) => getFileType(u) === "image")
                      .map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block">
                          <img
                            src={url}
                            alt={`Submission ${i + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-slate-200 hover:opacity-90 transition-opacity"
                          />
                        </a>
                      ))}
                  </div>
                )}

                {/* File rows for all files */}
                <div className="space-y-1.5">
                  {fileUrls.map((url, i) => {
                    const type = getFileType(url);
                    const fileName = url.split("/").pop()?.split("?")[0] || `File ${i + 1}`;
                    return (
                      <div key={i} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          {type === "image" ? (
                            <ImageIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-slate-600 truncate">{fileName}</span>
                        </div>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-bold text-[var(--brand-mid)] hover:text-[var(--brand-green)] flex-shrink-0 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open
                        </a>
                      </div>
                    );
                  })}
                </div>

                {submission.remarks && (
                  <p className="text-[10px] text-slate-500 italic px-1 line-clamp-2">
                    Student note: "{submission.remarks}"
                  </p>
                )}
                <p className="text-[10px] text-slate-400 font-semibold px-1">
                  Submitted {new Date(submission.submittedAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                  {submission.status === "late" && (
                    <span className="ml-2 text-amber-500 font-bold">· Late</span>
                  )}
                </p>
              </div>
            )}

            {/* Marks Obtained */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Marks Obtained</label>
                <Input
                  type="number"
                  min="0"
                  max={assignment.maxMarks}
                  step="any"
                  value={evalMarks}
                  onChange={(e) => setEvalMarks(e.target.value)}
                  placeholder="e.g. 45"
                  className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Marks</label>
                <div className="h-10 flex items-center justify-between px-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-sm font-bold text-slate-700">{assignment.maxMarks}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks / Feedback</label>
              <Textarea
                value={evalRemarks}
                onChange={(e) => setEvalRemarks(e.target.value)}
                placeholder="e.g. Very good work. Minor mistakes in calculations."
                className="min-h-[80px] max-h-32 bg-white border border-slate-200 rounded-xl text-sm"
              />
            </div>

            {/* Completed Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="evalCompletedModal"
                checked={evalCompleted}
                onChange={(e) => setEvalCompleted(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)]/30 cursor-pointer"
              />
              <label htmlFor="evalCompletedModal" className="text-xs font-bold text-slate-650 cursor-pointer select-none">
                Mark as Completed / Graded
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 border-slate-200 rounded-xl font-bold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isEvaluating || submittedStudents.length === 0}
                className="flex-1 h-10 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isEvaluating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Award className="w-4 h-4" />
                )}
                {isEvaluating ? "Saving..." : "Submit Evaluation"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
