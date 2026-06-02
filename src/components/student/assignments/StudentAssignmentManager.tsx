"use client";

import { useState, useEffect } from "react";
import { FileText, Calendar, User, Upload, CheckCircle2, AlertCircle, Clock, Check, Download, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useQueries } from "@tanstack/react-query";
import {
  useGetStudentAssignments,
  useGetStudentAssignmentStatus,
  useSubmitStudentAssignment
} from "@/querys/student/studentQuery";
import { getStudentAssignmentStatus } from "@/services/student/student";
import { IAssignment } from "@/types/student/student";

// Keep type definitions for compatibility with AdminAssignmentCreator.tsx
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
  const [selectedAsg, setSelectedAsg] = useState<IAssignment | null>(null);
  
  // File upload state simulation
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch assignments list
  const { data: assignmentsData, isLoading: isLoadingAsg, error } = useGetStudentAssignments();
  const assignments = assignmentsData || [];

  // Fetch statuses of all assignments in parallel to populate the badges and list
  const statusQueries = useQueries({
    queries: assignments.map((asg) => ({
      queryKey: ["student-assignment-status", asg.id],
      queryFn: () => getStudentAssignmentStatus(asg.id),
      enabled: !!asg.id,
    })),
  });

  const submitMutation = useSubmitStudentAssignment();

  // Create a mapping of assignment ID to its live submission & evaluation status
  const assignmentStatusMap = new Map<
    string,
    {
      submission?: any;
      evaluation?: any;
      statusText: "Pending" | "Submitted" | "Graded";
      grade?: string;
    }
  >();

  assignments.forEach((asg, idx) => {
    const query = statusQueries[idx];
    if (query && query.data) {
      const { submission, evaluation } = query.data;
      let statusText: "Pending" | "Submitted" | "Graded" = "Pending";
      let grade = "";

      if (evaluation) {
        statusText = "Graded";
        grade = `${evaluation.marksObtained}/${asg.maxMarks}`;
      } else if (submission) {
        statusText = "Submitted";
      }

      assignmentStatusMap.set(asg.id, {
        submission,
        evaluation,
        statusText,
        grade,
      });
    } else {
      assignmentStatusMap.set(asg.id, {
        statusText: "Pending",
      });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setMockFileName(e.target.files[0].name);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAsg) return;
    if (!mockFileName) {
      toast.error("Please choose a file to upload.");
      return;
    }

    const mockFileUrl = `https://knowlix-cloud.s3.amazonaws.com/submissions/${Date.now()}_${mockFileName}`;

    submitMutation.mutate(
      {
        id: selectedAsg.id,
        fileUrl: mockFileUrl,
        remarks: remarks.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Assignment submitted successfully!");
          setSelectedFile(null);
          setMockFileName("");
          setRemarks("");
          setSelectedAsg(null);
        },
        onError: (err: any) => {
          console.error(err);
          toast.error("Failed to submit assignment.");
        },
      }
    );
  };

  // Build submission history list dynamically from status queries
  const submissionsHistory: any[] = [];
  assignments.forEach((asg) => {
    const statusInfo = assignmentStatusMap.get(asg.id);
    if (statusInfo && (statusInfo.submission || statusInfo.evaluation)) {
      const fileName = statusInfo.submission?.fileUrl
        ? statusInfo.submission.fileUrl.split("/").pop() || "submission.pdf"
        : "submission.pdf";
      submissionsHistory.push({
        id: statusInfo.submission?.id || statusInfo.evaluation?.id || asg.id,
        assignmentId: asg.id,
        assignmentTitle: asg.title,
        submittedAt: statusInfo.submission?.submittedAt
          ? new Date(statusInfo.submission.submittedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently",
        fileName,
        fileSize: "1.8 MB",
        status: statusInfo.evaluation ? "Graded" : "Submitted",
        grade: statusInfo.grade,
        feedback: statusInfo.evaluation?.remarks || statusInfo.submission?.remarks
      });
    }
  });

  const selectedStatusInfo = selectedAsg ? assignmentStatusMap.get(selectedAsg.id) : null;
  const isSubmitting = submitMutation.isPending;

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Assignments & Submissions"
        description="View your active homework tasks, upload completed files, and review evaluations from your tutors."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: List of assignments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Assigned Homework
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="table-fixed w-full">
                  <TableHeader className="bg-slate-50/20">
                    <TableRow>
                      <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[40%]">Assignment Details</TableHead>
                      <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[20%]">Due Date</TableHead>
                      <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[20%]">Status</TableHead>
                      <TableHead className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">Action / Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100">
                    {isLoadingAsg ? (
                      <TableRow>
                        <TableCell colSpan={4} className="px-6 py-12 text-center text-slate-450 text-xs font-medium">
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
                            Loading assignments...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : assignments.length > 0 ? (
                      assignments.map((asg) => {
                        const statusInfo = assignmentStatusMap.get(asg.id);
                        const statusText = statusInfo?.statusText || "Pending";

                        return (
                          <TableRow key={asg.id} className="hover:bg-slate-50/60 transition-colors">
                            <TableCell className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-800 truncate leading-none">{asg.title}</p>
                              <span className="text-[9px] text-slate-450 mt-1.5 block font-semibold">
                                {asg.subject} • Max Marks: {asg.maxMarks}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-xs text-center font-medium text-slate-650">
                              {new Date(asg.dueDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center">
                              <Badge
                                variant="outline"
                                className={`text-[9px] font-bold py-0.5 px-2 border rounded-full ${
                                  statusText === "Graded"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : statusText === "Submitted"
                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                }`}
                              >
                                {statusText === "Graded" ? (
                                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Graded</span>
                                ) : statusText === "Submitted" ? (
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted</span>
                                ) : (
                                  <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pending</span>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              {statusText === "Graded" ? (
                                <span className="text-xs font-black text-slate-800">{statusInfo?.grade}</span>
                              ) : statusText === "Submitted" ? (
                                <Button
                                  variant="ghost"
                                  onClick={() => setSelectedAsg(asg)}
                                  className="text-[10px] font-bold text-[var(--brand-green)] hover:bg-[var(--brand-light-green)] px-2.5 py-1 h-auto rounded-lg cursor-pointer transition-colors"
                                >
                                  View Details
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => setSelectedAsg(asg)}
                                  className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white text-[10px] font-bold px-2.5 py-1 h-auto rounded-lg cursor-pointer shadow-sm transition-all"
                                >
                                  Submit File
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="px-6 py-12 text-center text-slate-450 text-xs font-medium">
                          No assignments uploaded yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Submit details or review panel */}
        <div className="space-y-6">
          {selectedAsg ? (
            <Card className="bg-white border-slate-150 shadow-sm overflow-hidden animate-slide-down">
              <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Submit Assignment</span>
                  <Button variant="ghost" size="icon-sm" onClick={() => setSelectedAsg(null)} className="rounded-lg">
                    <X className="w-4 h-4 text-slate-400" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Assignment Name</h4>
                  <p className="text-sm text-slate-700 mt-1 font-semibold">{selectedAsg.title}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Description / Instructions</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {selectedAsg.description || "No specific instructions provided."}
                  </p>
                </div>

                {/* Check submission */}
                {selectedStatusInfo && (selectedStatusInfo.submission || selectedStatusInfo.evaluation) ? (
                  // Submitted review
                  (() => {
                    const sub = selectedStatusInfo.submission;
                    const evalInfo = selectedStatusInfo.evaluation;
                    const fileName = sub?.fileUrl ? sub.fileUrl.split("/").pop() || "submission.pdf" : "submission.pdf";
                    return (
                      <div className="space-y-4">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                          <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> File Submitted Successfully
                          </h4>
                          <div className="text-xs text-slate-700 flex items-center justify-between font-semibold mt-1">
                            <span className="truncate max-w-[150px]">{fileName}</span>
                            <span className="text-[10px] text-slate-400">1.8 MB</span>
                          </div>
                          {sub?.submittedAt && (
                            <p className="text-[10px] text-slate-400 mt-1 block">
                              Submitted on {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          )}
                          {sub?.remarks && (
                            <p className="text-[10px] text-slate-500 italic mt-1 bg-white p-2 rounded border border-slate-100">
                              Remarks: "{sub.remarks}"
                            </p>
                          )}
                        </div>

                        {/* If evaluated, show details here too */}
                        {evalInfo && (
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-2">
                            <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Evaluated
                            </h4>
                            <div className="flex justify-between items-center text-xs font-bold text-slate-750">
                              <span>Obtained Score:</span>
                              <span className="text-[var(--brand-green)]">{evalInfo.marksObtained} / {selectedAsg.maxMarks}</span>
                            </div>
                            {evalInfo.remarks && (
                              <p className="text-[10px] text-slate-650 italic mt-1 bg-white p-2 rounded border border-emerald-100">
                                Feedback: "{evalInfo.remarks}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  // Upload Form
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Upload Completed File
                      </label>
                      <div className="border-2 border-dashed border-slate-200 hover:border-[var(--brand-green)] rounded-2xl p-6 text-center cursor-pointer transition-colors relative">
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          accept=".pdf,.docx,.xlsx,.png,.jpg"
                        />
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-700">
                          {mockFileName ? mockFileName : "Click or drag file to upload"}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          Supports PDF, DOCX, XLSX up to 10MB
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Remarks / Notes
                      </label>
                      <Textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add comments for your tutor..."
                        className="text-xs min-h-16 max-h-24 rounded-xl"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" /> Submit Homework
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ) : (
            // Dynamic review panel of student submissions
            <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
              <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Submission History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {submissionsHistory.length > 0 ? (
                    submissionsHistory.map((sub) => (
                      <div key={sub.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50/40 transition-all space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[150px]">
                              {sub.assignmentTitle}
                            </h4>
                            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                              Submitted on {sub.submittedAt}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${
                              sub.status === "Graded"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-blue-50 text-blue-700 border-blue-100"
                            }`}
                          >
                            {sub.status}
                          </Badge>
                        </div>

                        {/* File Details */}
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 bg-slate-50/60 border border-slate-100 p-2 rounded-lg">
                          <div className="flex items-center gap-1.5 truncate">
                            <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{sub.fileName}</span>
                          </div>
                          <span className="text-slate-400 text-[9px]">{sub.fileSize}</span>
                        </div>

                        {/* Tutor Grade & Remarks */}
                        {sub.status === "Graded" && (
                          <div className="bg-slate-50 border-t border-slate-100 p-3 rounded-lg mt-2 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-800">Obtained Grade:</span>
                              <span className="font-black text-[var(--brand-green)] bg-[var(--brand-light-green)] px-2 py-0.5 rounded-md text-[10px]">
                                {sub.grade}
                              </span>
                            </div>
                            {sub.feedback && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">
                                  Tutor Feedback
                                </span>
                                <p className="text-[10px] text-slate-650 leading-normal italic whitespace-pre-line">
                                  "{sub.feedback}"
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                      No submissions yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
