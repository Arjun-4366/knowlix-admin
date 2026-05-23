"use client";

import { useState, useEffect } from "react";
import { FileText, Calendar, User, Upload, CheckCircle2, AlertCircle, Clock, Check, Download, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

// Type definitions
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

const initialAssignments: Assignment[] = [
  {
    id: "ASG-1",
    title: "Calculus Limits Sheet",
    description: "Complete all questions from Section 4.2 in the workbook.",
    subject: "Mathematics",
    dueDate: "2026-05-28",
    status: "Active",
    totalStudents: 3,
    submittedCount: 2,
    tutorName: "Dr. Ramesh Prasad",
  },
  {
    id: "ASG-2",
    title: "Newton's Laws Lab Report",
    description: "Submit PDF report for the gravity acceleration experiment.",
    subject: "Physics",
    dueDate: "2026-05-21",
    status: "Completed",
    totalStudents: 3,
    submittedCount: 3,
    tutorName: "Dr. Ramesh Prasad",
  },
  {
    id: "ASG-3",
    title: "Medieval History Essay",
    description: "Write a 500-word summary on feudal structures.",
    subject: "Social Studies",
    dueDate: "2026-06-01",
    status: "Active",
    totalStudents: 1,
    submittedCount: 0,
    tutorName: "Dr. Ramesh Prasad",
  }
];

const initialSubmissions: Submission[] = [
  {
    id: "SUB-101",
    assignmentId: "ASG-2",
    assignmentTitle: "Newton's Laws Lab Report",
    studentId: "STU-101",
    studentName: "Rahul Sharma",
    submittedAt: "2026-05-20",
    fileName: "rahul_sharma_newton_laws_lab.pdf",
    fileSize: "2.4 MB",
    status: "Graded",
    grade: "94/100",
    feedback: "Excellent lab structure, very detailed graphs and formulas."
  }
];

export default function StudentAssignmentManager() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  
  // File upload state simulation
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const studentId = "STU-101";
  const studentName = "Rahul Sharma";

  useEffect(() => {
    // Load assignments
    const storedAsg = localStorage.getItem("knowlix_assignments");
    if (storedAsg) {
      try {
        setAssignments(JSON.parse(storedAsg));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("knowlix_assignments", JSON.stringify(initialAssignments));
      setAssignments(initialAssignments);
    }

    // Load submissions
    const storedSub = localStorage.getItem("knowlix_submissions");
    if (storedSub) {
      try {
        setSubmissions(JSON.parse(storedSub));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem("knowlix_submissions", JSON.stringify(initialSubmissions));
      setSubmissions(initialSubmissions);
    }
  }, []);

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

    setSubmitting(true);

    setTimeout(() => {
      const newSubmission: Submission = {
        id: `SUB-${Date.now()}`,
        assignmentId: selectedAsg.id,
        assignmentTitle: selectedAsg.title,
        studentId: studentId,
        studentName: studentName,
        submittedAt: new Date().toISOString().split("T")[0],
        fileName: mockFileName,
        fileSize: "1.8 MB",
        status: "Submitted"
      };

      // Save submission
      const updatedSub = [...submissions, newSubmission];
      setSubmissions(updatedSub);
      localStorage.setItem("knowlix_submissions", JSON.stringify(updatedSub));

      // Update assignments list
      const updatedAsg = assignments.map((asg) => {
        if (asg.id === selectedAsg.id) {
          return {
            ...asg,
            submittedCount: asg.submittedCount + 1
          };
        }
        return asg;
      });
      setAssignments(updatedAsg);
      localStorage.setItem("knowlix_assignments", JSON.stringify(updatedAsg));

      toast.success("Assignment submitted successfully!");
      setSubmitting(false);
      setSelectedFile(null);
      setMockFileName("");
      setSelectedAsg(null);
    }, 1500);
  };

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
                    {assignments.length > 0 ? (
                      assignments.map((asg) => {
                        // Find if student submitted this assignment
                        const sub = submissions.find((s) => s.assignmentId === asg.id && s.studentId === studentId);
                        
                        let statusText: "Pending" | "Submitted" | "Graded" = "Pending";
                        if (sub) {
                          statusText = sub.status;
                        }

                        return (
                          <TableRow key={asg.id} className="hover:bg-slate-50/60 transition-colors">
                            <TableCell className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-800 truncate leading-none">{asg.title}</p>
                              <span className="text-[9px] text-slate-450 mt-1.5 block font-semibold">
                                {asg.subject} • Uploaded by {asg.tutorName}
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
                                <span className="text-xs font-black text-slate-800">{sub?.grade}</span>
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
                {submissions.find((s) => s.assignmentId === selectedAsg.id && s.studentId === studentId) ? (
                  // Submitted review
                  (() => {
                    const sub = submissions.find((s) => s.assignmentId === selectedAsg.id && s.studentId === studentId)!;
                    return (
                      <div className="space-y-4">
                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                          <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> File Submitted Successfully
                          </h4>
                          <div className="text-xs text-slate-700 flex items-center justify-between font-semibold mt-1">
                            <span className="truncate max-w-[150px]">{sub.fileName}</span>
                            <span className="text-[10px] text-slate-400">{sub.fileSize}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 block">Submitted on {sub.submittedAt}</p>
                        </div>
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

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      {submitting ? (
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
            // Static review panel of student submissions
            <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
              <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Submission History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {submissions.map((sub) => (
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
                              <p className="text-[10px] text-slate-600 leading-normal italic whitespace-pre-line">
                                "{sub.feedback}"
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
