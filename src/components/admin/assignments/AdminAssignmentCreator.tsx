"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, FileText, CheckCircle2, AlertCircle, X, Search, Filter, Check, Award, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Assignment, Submission } from "@/components/student/assignments/StudentAssignmentManager";

const SUBJECT_OPTIONS = ["Mathematics", "Physics", "Chemistry", "English", "Social Studies", "Computer Science"];
const GRADE_OPTIONS = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

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

export default function AdminAssignmentCreator() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState(SUBJECT_OPTIONS[0]);
  const [newDueDate, setNewDueDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTargetGrade, setNewTargetGrade] = useState(GRADE_OPTIONS[2]); // Default Grade 10

  // Evaluation states
  const [evaluatingSub, setEvaluatingSub] = useState<Submission | null>(null);
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [feedback, setFeedback] = useState("");

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

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDueDate) {
      toast.error("Please fill in both the title and due date.");
      return;
    }

    const newAsg: Assignment = {
      id: `ASG-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      subject: newSubject,
      dueDate: newDueDate,
      status: "Active",
      totalStudents: newTargetGrade === "Grade 10" ? 3 : 1, // Rahul Sharma, Meera Joshi etc. are Grade 10
      submittedCount: 0,
      tutorName: "Administrator"
    };

    const updated = [newAsg, ...assignments];
    setAssignments(updated);
    localStorage.setItem("knowlix_assignments", JSON.stringify(updated));
    toast.success("Assignment created and published successfully!");

    // Reset Form
    setNewTitle("");
    setNewDueDate("");
    setNewDesc("");
    setShowAddForm(false);
  };

  const handleDeleteAssignment = (id: string) => {
    if (confirm("Are you sure you want to delete this assignment? All associated student submissions will be lost.")) {
      const updatedAsg = assignments.filter((a) => a.id !== id);
      const updatedSub = submissions.filter((s) => s.assignmentId !== id);
      
      setAssignments(updatedAsg);
      setSubmissions(updatedSub);
      
      localStorage.setItem("knowlix_assignments", JSON.stringify(updatedAsg));
      localStorage.setItem("knowlix_submissions", JSON.stringify(updatedSub));
      
      toast.success("Assignment deleted successfully.");
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = assignments.map((asg) => {
      if (asg.id === id) {
        const nextStatus: "Active" | "Completed" = asg.status === "Active" ? "Completed" : "Active";
        return { ...asg, status: nextStatus };
      }
      return asg;
    });
    setAssignments(updated);
    localStorage.setItem("knowlix_assignments", JSON.stringify(updated));
    toast.success("Assignment status toggled.");
  };

  const handleEvaluateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!evaluatingSub) return;
    if (!obtainedMarks.trim()) {
      toast.error("Please enter obtained marks.");
      return;
    }

    const updatedSub = submissions.map((sub) => {
      if (sub.id === evaluatingSub.id) {
        return {
          ...sub,
          status: "Graded" as const,
          grade: `${obtainedMarks}/${maxMarks}`,
          feedback: feedback.trim()
        };
      }
      return sub;
    });

    setSubmissions(updatedSub);
    localStorage.setItem("knowlix_submissions", JSON.stringify(updatedSub));

    // Also push to knowlix_evaluations for tutor logs compatibility
    const storedEval = localStorage.getItem("knowlix_evaluations");
    let evals = [];
    if (storedEval) {
      try {
        evals = JSON.parse(storedEval);
      } catch (e) {}
    }
    const newEval = {
      id: `EVL-${Date.now()}`,
      studentId: evaluatingSub.studentId,
      studentName: evaluatingSub.studentName,
      assessmentType: "Assignment",
      assessmentId: evaluatingSub.assignmentId,
      assessmentTitle: evaluatingSub.assignmentTitle,
      maxMarks: parseInt(maxMarks) || 100,
      obtainedMarks: parseInt(obtainedMarks) || 0,
      grade: parseInt(obtainedMarks) / (parseInt(maxMarks) || 100) >= 0.9 ? "A+" : "A",
      remarks: feedback.trim(),
      evaluatedAt: new Date().toISOString().split("T")[0],
      tutorName: "Administrator"
    };
    evals = [newEval, ...evals];
    localStorage.setItem("knowlix_evaluations", JSON.stringify(evals));

    toast.success(`Submission graded: ${obtainedMarks}/${maxMarks}`);
    setObtainedMarks("");
    setFeedback("");
    setEvaluatingSub(null);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Assignment Creator & Submissions"
        description="Publish homework tasks for student classes and grade their submitted reports."
      />

      <Tabs defaultValue="list">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
            <TabsTrigger
              value="list"
              className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
            >
              Assignments List
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
            >
              Student Submissions ({submissions.filter((s) => s.status === "Submitted").length})
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
              showAddForm
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white shadow-sm"
            }`}
          >
            {showAddForm ? (
              <>
                <X className="w-3.5 h-3.5" /> Cancel
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Create Assignment
              </>
            )}
          </Button>
        </div>

        {/* Create Assignment Form */}
        {showAddForm && (
          <div className="mb-6">
            <Card className="bg-white border-slate-150 shadow-sm overflow-hidden animate-slide-down">
              <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Create New Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddAssignment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Assignment Title
                      </label>
                      <Input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Calculus Limits Sheet 2"
                        className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                        required
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Subject
                      </label>
                      <Select value={newSubject} onValueChange={setNewSubject}>
                        <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECT_OPTIONS.map((sub) => (
                            <SelectItem key={sub} value={sub} className="font-medium text-xs">
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target Grade */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Target Grade
                      </label>
                      <Select value={newTargetGrade} onValueChange={setNewTargetGrade}>
                        <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADE_OPTIONS.map((grade) => (
                            <SelectItem key={grade} value={grade} className="font-medium text-xs">
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Due Date */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Due Date
                      </label>
                      <Input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-3 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Description / Instructions
                      </label>
                      <Textarea
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Provide details or upload guidelines..."
                        className="min-h-10 max-h-24 bg-white border border-slate-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <FileText className="w-4 h-4" /> Save Assignment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* List Tab */}
        <TabsContent value="list" className="mt-0 outline-none">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
                    Active
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">
                    Assignment Details
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                    Due Date
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[17%]">
                    Submissions
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[8%]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {assignments.length > 0 ? (
                  assignments.map((asg) => (
                    <TableRow
                      key={asg.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        asg.status === "Completed" ? "bg-slate-50/30 text-slate-400" : ""
                      }`}
                    >
                      <TableCell className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={asg.status === "Completed"}
                          onChange={() => handleToggleStatus(asg.id)}
                          className="w-4.5 h-4.5 accent-[var(--brand-green)] border-slate-300 rounded-md cursor-pointer transition-all"
                          title="Toggle Status"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <p className={`text-sm font-bold text-slate-700 leading-none truncate ${asg.status === "Completed" ? "line-through text-slate-400" : ""}`}>
                          {asg.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                          {asg.subject} · {asg.description || "No description"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-650 truncate block">
                          {new Date(asg.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-750 block">
                          {asg.submittedCount} / {asg.totalStudents} Submitted
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {asg.status === "Completed" ? (
                          <Badge
                            variant="outline"
                            className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          >
                            <AlertCircle className="w-3 h-3 mr-1 text-[var(--brand-green)]" /> Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-right">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteAssignment(asg.id)}
                          className="rounded-lg text-slate-450 hover:text-red-650 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-12 text-center text-slate-450 text-sm font-medium">
                      No assignments created yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="mt-0 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[30%]">Student</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">Assignment</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Submitted</TableHead>
                    <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[15%]">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-100">
                  {submissions.length > 0 ? (
                    submissions.map((sub) => (
                      <TableRow
                        key={sub.id}
                        onClick={() => sub.status === "Submitted" && setEvaluatingSub(sub)}
                        className={`transition-colors cursor-pointer ${
                          sub.status === "Submitted" ? "hover:bg-slate-50 font-semibold" : "hover:bg-slate-50/50 text-slate-400"
                        }`}
                      >
                        <TableCell className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-800 leading-none">{sub.studentName}</p>
                          <span className="text-[9px] text-slate-400 font-semibold mt-1 block">ID: {sub.studentId}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-700 leading-none truncate">{sub.assignmentTitle}</p>
                          <span className="text-[9px] text-[var(--brand-green)] font-semibold mt-1 block truncate">
                            File: {sub.fileName} ({sub.fileSize})
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-xs text-slate-600 font-medium">
                          {sub.submittedAt}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          {sub.status === "Graded" ? (
                            <span className="text-xs font-black text-slate-800">{sub.grade}</span>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[8px] font-bold rounded-full py-0.5 px-1.5 shadow-none">
                              Evaluate
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="px-6 py-12 text-center text-slate-450 text-xs font-medium">
                        No submissions uploaded by students yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Evaluation Details Form */}
            <div>
              {evaluatingSub ? (
                <Card className="bg-white border-slate-150 shadow-sm overflow-hidden animate-slide-down">
                  <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Evaluate Student</span>
                      <Button variant="ghost" size="icon-sm" onClick={() => setEvaluatingSub(null)} className="rounded-lg">
                        <X className="w-4 h-4 text-slate-400" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleEvaluateSubmit} className="space-y-4">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student Name</h4>
                        <p className="text-xs font-bold text-slate-700 mt-1">{evaluatingSub.studentName} ({evaluatingSub.studentId})</p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Assignment</h4>
                        <p className="text-xs font-bold text-slate-700 mt-1">{evaluatingSub.assignmentTitle}</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between">
                        <div className="truncate pr-4">
                          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Attached File</span>
                          <span className="text-xs font-semibold text-slate-700 truncate block mt-0.5">{evaluatingSub.fileName}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => toast.success(`Simulating file download: ${evaluatingSub.fileName}`)}
                          className="h-8 text-[10px] px-2.5 rounded-lg border-slate-200 font-bold hover:bg-slate-100 cursor-pointer flex items-center gap-1 flex-shrink-0"
                        >
                          <Download className="w-3 h-3" /> Download
                        </Button>
                      </div>

                      {/* Marks */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Marks Obtained</label>
                          <Input
                            type="number"
                            min="0"
                            max={maxMarks}
                            value={obtainedMarks}
                            onChange={(e) => setObtainedMarks(e.target.value)}
                            placeholder="e.g. 92"
                            className="h-9 rounded-lg text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Out Of</label>
                          <Input
                            type="number"
                            value={maxMarks}
                            onChange={(e) => setMaxMarks(e.target.value)}
                            className="h-9 rounded-lg text-xs bg-slate-50 text-slate-500"
                            disabled
                          />
                        </div>
                      </div>

                      {/* Feedback */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Feedback / Comments</label>
                        <Textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Provide grading remarks..."
                          className="min-h-16 max-h-24 text-xs rounded-lg"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-4 h-4" /> Submit Evaluation
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-450 text-xs font-semibold">
                  Select a student submission to evaluate.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
