"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileText, Upload, CheckCircle2, AlertCircle, Clock, Check, X, BookOpen, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useQueries } from "@tanstack/react-query";
import {
  useGetStudentAssignments,
  useSubmitStudentAssignment,
} from "@/querys/student/studentQuery";
import { getStudentAssignmentStatus } from "@/services/student/student";
import { IAssignment } from "@/types/student/student";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: "Active" | "Completed";
  totalStudents: number;
  submittedCount: number;
  tutorName: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  status: "Submitted" | "Graded";
  grade?: string;
  feedback?: string;
}

export default function StudentAssignmentManager() {
  const [user, setUser] = useState<any>(null);
  const [submitAsg, setSubmitAsg] = useState<IAssignment | null>(null);
  const [viewSub, setViewSub] = useState<any | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [remarks, setRemarks] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) { console.error(e); }
    }
  }, []);

  const { data: assignmentsData, isLoading: isLoadingAsg } = useGetStudentAssignments();
  const assignments = assignmentsData || [];

  const statusQueries = useQueries({
    queries: assignments.map((asg) => ({
      queryKey: ["student-assignment-status", asg.id],
      queryFn: () => getStudentAssignmentStatus(asg.id),
      enabled: !!asg.id,
    })),
  });

  const submitMutation = useSubmitStudentAssignment();

  const assignmentStatusMap = new Map<
    string,
    { submission?: any; evaluation?: any; statusText: "Pending" | "Submitted" | "Graded"; grade?: string }
  >();

  assignments.forEach((asg, idx) => {
    const query = statusQueries[idx];
    if (query?.data) {
      const { submission, evaluation } = query.data;
      let statusText: "Pending" | "Submitted" | "Graded" = "Pending";
      let grade = "";
      if (evaluation) { statusText = "Graded"; grade = `${evaluation.marksObtained}/${asg.maxMarks}`; }
      else if (submission) { statusText = "Submitted"; }
      assignmentStatusMap.set(asg.id, { submission, evaluation, statusText, grade });
    } else {
      assignmentStatusMap.set(asg.id, { statusText: "Pending" });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const picked = Array.from(e.target.files); // capture synchronously before clearing
    e.target.value = "";
    setSelectedFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...picked.filter((f) => !existing.has(f.name))];
    });
  };

  const handleRemoveFile = (name: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!submitAsg) return;
    if (selectedFiles.length === 0) {
      toast.error("Please choose at least one file to upload.");
      return;
    }
    submitMutation.mutate(
      { id: submitAsg.id, files: selectedFiles, remarks: remarks.trim() },
      {
        onSuccess: () => {
          toast.success("Assignment submitted successfully!");
          setSelectedFiles([]);
          setRemarks("");
          setSubmitAsg(null);
        },
        onError: (err: any) => {
          console.error(err);
          toast.error("Failed to submit assignment.");
        },
      }
    );
  };

  const closeDialog = () => {
    if (!submitMutation.isPending) {
      setSubmitAsg(null);
      setSelectedFiles([]);
      setRemarks("");
    }
  };

  const submissionsHistory: any[] = [];
  assignments.forEach((asg) => {
    const statusInfo = assignmentStatusMap.get(asg.id);
    if (statusInfo && (statusInfo.submission || statusInfo.evaluation)) {
      const sub = statusInfo.submission;
      const fileUrls: string[] = sub?.fileUrls ?? (sub?.fileUrl ? [sub.fileUrl] : []);
      submissionsHistory.push({
        id: sub?.id || statusInfo.evaluation?.id || asg.id,
        assignmentId: asg.id,
        assignmentTitle: asg.title,
        subject: asg.subject,
        submittedAt: sub?.submittedAt
          ? new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Recently",
        files: fileUrls.map((url: string) => ({ url, name: url.split("/").pop() || "file" })),
        fileNames: fileUrls.map((url: string) => url.split("/").pop() || "file"),
        status: statusInfo.evaluation ? "Graded" : "Submitted",
        grade: statusInfo.grade,
        feedback: statusInfo.evaluation?.remarks || sub?.remarks,
        remarks: sub?.remarks,
      });
    }
  });

  const isSubmitting = submitMutation.isPending;

  const statusBadge = (status: "Pending" | "Submitted" | "Graded") => {
    if (status === "Graded") return (
      <Badge variant="outline" className="text-[9px] font-bold py-0.5 px-2 rounded-full bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1 w-fit">
        <Check className="w-3 h-3" /> Graded
      </Badge>
    );
    if (status === "Submitted") return (
      <Badge variant="outline" className="text-[9px] font-bold py-0.5 px-2 rounded-full bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1 w-fit">
        <Clock className="w-3 h-3" /> Submitted
      </Badge>
    );
    return (
      <Badge variant="outline" className="text-[9px] font-bold py-0.5 px-2 rounded-full bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-1 w-fit">
        <AlertCircle className="w-3 h-3" /> Pending
      </Badge>
    );
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Assignments & Submissions"
        description="View your active homework tasks, upload completed files, and review evaluations from your tutors."
      />

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="mb-1">
          <TabsTrigger value="assignments" className="text-xs font-semibold px-4">
            <BookOpen className="w-3.5 h-3.5" /> Assigned Work
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs font-semibold px-4">
            <CheckCircle2 className="w-3.5 h-3.5" /> Submission History
          </TabsTrigger>
        </TabsList>

        {/* ── Assignments tab ─────────────────────── */}
        <TabsContent value="assignments">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <p className="text-sm font-bold text-slate-800">Assigned Homework</p>
              <p className="text-xs text-slate-400 mt-0.5">Click "Submit" on any pending task to upload your work.</p>
            </div>
            <div className="overflow-x-auto">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-slate-50/30">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">Assignment</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Subject</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Due Date</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[12%]">Max Marks</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[13%]">Status</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-50">
                  {isLoadingAsg ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                        <div className="flex justify-center items-center gap-2">
                          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--brand-green)", borderTopColor: "transparent" }} />
                          Loading assignments...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : assignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400 font-medium">
                        No assignments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignments.map((asg) => {
                      const statusInfo = assignmentStatusMap.get(asg.id);
                      const statusText = statusInfo?.statusText || "Pending";
                      return (
                        <TableRow key={asg.id} className="hover:bg-slate-50/60 transition-colors">
                          <TableCell className="px-6 py-4">
                            <p className="text-xs font-bold text-slate-800 truncate leading-none">{asg.title}</p>
                            {asg.description && (
                              <p className="text-[10px] text-slate-400 mt-1 truncate">{asg.description}</p>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-xs font-medium text-slate-600">{asg.subject}</TableCell>
                          <TableCell className="px-6 py-4 text-xs text-center font-medium text-slate-600">
                            {new Date(asg.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-xs text-center font-bold text-slate-700">{asg.maxMarks}</TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex justify-center">{statusBadge(statusText)}</div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            {statusText === "Graded" ? (
                              <span className="text-xs font-black" style={{ color: "var(--brand-green)" }}>{statusInfo?.grade}</span>
                            ) : statusText === "Submitted" ? (
                              <span className="text-[10px] font-semibold text-slate-400">Awaiting review</span>
                            ) : (
                              <Button
                                onClick={() => setSubmitAsg(asg)}
                                className="text-white text-[10px] font-bold px-3 py-1.5 h-auto rounded-lg cursor-pointer shadow-sm transition-all"
                                style={{ background: "var(--brand-green)" }}
                              >
                                Submit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ── Submission History tab ───────────────── */}
        <TabsContent value="history">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <p className="text-sm font-bold text-slate-800">Submission History</p>
              <p className="text-xs text-slate-400 mt-0.5">All your uploaded work and evaluation results.</p>
            </div>
            <div className="overflow-x-auto">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-slate-50/30">
                  <TableRow>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[30%]">Assignment</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[13%]">Subject</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Submitted</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[12%]">Files</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[13%]">Status</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[10%]">Grade</TableHead>
                    <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[7%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-50">
                  {submissionsHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="px-6 py-12 text-center text-xs text-slate-400 font-medium">
                        No submissions yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissionsHistory.map((sub) => (
                      <TableRow key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                        <TableCell className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-800 truncate leading-none">{sub.assignmentTitle}</p>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs font-medium text-slate-600">{sub.subject}</TableCell>
                        <TableCell className="px-6 py-4 text-[10px] text-center text-slate-500 font-medium">{sub.submittedAt}</TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span className="text-xs font-bold text-slate-700">{(sub.fileNames as string[]).length}</span>
                          <span className="text-[10px] text-slate-400 ml-1">file{(sub.fileNames as string[]).length !== 1 ? "s" : ""}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex justify-center">
                            {sub.status === "Graded" ? (
                              <Badge variant="outline" className="text-[9px] font-bold py-0.5 px-2 rounded-full bg-emerald-50 text-emerald-700 border-emerald-100">
                                Graded
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[9px] font-bold py-0.5 px-2 rounded-full bg-blue-50 text-blue-700 border-blue-100">
                                Submitted
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          {sub.grade ? (
                            <span className="text-xs font-black" style={{ color: "var(--brand-green)" }}>{sub.grade}</span>
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setViewSub(sub)}
                            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-slate-100"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Submit Dialog ────────────────────────── */}
      {submitAsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDialog}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Dialog header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between" style={{ background: "var(--brand-bg)" }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brand-green)" }}>
                  Submit Assignment
                </p>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">{submitAsg.title}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{submitAsg.subject}</p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                disabled={isSubmitting}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dialog body */}
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {submitAsg.description && (
                <div className="text-[10px] text-slate-500 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3">
                  {submitAsg.description}
                </div>
              )}

              {/* File dropzone */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Upload Files <span style={{ color: "var(--brand-green)" }}>*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.xlsx,.png,.jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors"
                  style={{ borderColor: "var(--brand-light)", background: "var(--brand-bg)" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: "var(--brand-green)" }} />
                  <p className="text-xs font-bold text-slate-700">Click or drag files here</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">PDF, DOCX, XLSX, PNG, JPG — multiple allowed</p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {selectedFiles.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between gap-2 border border-slate-100 rounded-lg px-3 py-2"
                        style={{ background: "var(--brand-light-green)" }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--brand-green)" }} />
                          <span className="text-[10px] font-semibold text-slate-700 truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[9px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file.name)}
                            className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Remarks <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add a note for your tutor..."
                  className="text-xs min-h-16 max-h-28 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={closeDialog}
                  className="flex-1 rounded-xl border-slate-200 text-slate-500 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedFiles.length === 0}
                  className="flex-1 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ background: "var(--brand-green)" }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" /> Submit Homework
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Submission Dialog ───────────────── */}
      {viewSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewSub(null)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between" style={{ background: "var(--brand-bg)" }}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--brand-green)" }}>
                  Submission Details
                </p>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">{viewSub.assignmentTitle}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{viewSub.subject} · Submitted {viewSub.submittedAt}</p>
              </div>
              <button
                type="button"
                onClick={() => setViewSub(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">

              {/* Status badge */}
              <div className="flex items-center gap-2">
                {viewSub.status === "Graded" ? (
                  <Badge variant="outline" className="text-[10px] font-bold py-1 px-3 rounded-full bg-emerald-50 text-emerald-700 border-emerald-100 flex items-center gap-1.5">
                    <Check className="w-3 h-3" /> Graded
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] font-bold py-1 px-3 rounded-full bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Submitted — Awaiting Review
                  </Badge>
                )}
              </div>

              {/* Uploaded files */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Uploaded Files ({(viewSub.files as { url: string; name: string }[]).length})
                </p>
                <div className="space-y-1.5">
                  {(viewSub.files as { url: string; name: string }[]).map((file) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2.5 border rounded-xl px-3.5 py-2.5 group transition-all hover:shadow-sm"
                      style={{ background: "var(--brand-light-green)", borderColor: "var(--brand-light)" }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--brand-green)" }} />
                        <span className="text-[11px] font-semibold text-slate-700 truncate group-hover:underline">
                          {file.name}
                        </span>
                      </div>
                      <span
                        className="text-[9px] font-bold flex-shrink-0 px-2 py-0.5 rounded-md"
                        style={{ color: "var(--brand-dark)", background: "var(--brand-light-green)" }}
                      >
                        View ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Remarks (student) */}
              {viewSub.remarks && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Remarks</p>
                  <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-3 leading-relaxed italic">
                    "{viewSub.remarks}"
                  </p>
                </div>
              )}

              {/* Evaluation section */}
              {viewSub.status === "Graded" && (
                <div className="rounded-xl border border-emerald-100 overflow-hidden">
                  <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tutor Evaluation
                    </p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-600">Score Obtained</span>
                      <span className="text-sm font-black" style={{ color: "var(--brand-green)" }}>{viewSub.grade}</span>
                    </div>
                    {viewSub.feedback && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feedback</p>
                        <p className="text-xs text-slate-600 bg-white border border-emerald-100 rounded-lg p-3 leading-relaxed italic">
                          "{viewSub.feedback}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="button"
                onClick={() => setViewSub(null)}
                className="w-full text-xs font-bold rounded-xl cursor-pointer"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
