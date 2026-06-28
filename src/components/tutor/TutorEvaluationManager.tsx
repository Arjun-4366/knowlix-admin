"use client";

import { useState, useEffect } from "react";
import { Award, Search, Trash2, Check, Sparkles, X, Lock } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirmation } from "@/context/ConfirmationContext";
import { IStudent } from "@/types/admin/student";
import { ITutorExam } from "@/types/tutor/exams";
import { Evaluation } from "./TutorAssessmentStats";
import { ITutorAssignment } from "@/types/tutor/assignments";
import { useEvaluateTutorAssignment } from "@/querys/tutor/assignmentQuery";
import { useEnterTutorExamResults } from "@/querys/tutor/examQuery";
import { toast } from "react-hot-toast";

interface TutorEvaluationManagerProps {
  students: IStudent[];
  assignments: ITutorAssignment[];
  exams: ITutorExam[];
  evaluations: Evaluation[];
  onAddEvaluation: (evaluation: Evaluation) => void;
  onDeleteEvaluation: (id: string) => void;
}

const GRADE_OPTIONS = ["A+", "A", "B", "C", "D", "F"];

export default function TutorEvaluationManager({
  students,
  assignments,
  exams,
  evaluations,
  onAddEvaluation,
  onDeleteEvaluation,
}: TutorEvaluationManagerProps) {
  const { confirm } = useConfirmation();
  const { mutate: evaluateAssignment, isPending: isEvaluatingAssignment } = useEvaluateTutorAssignment();
  const { mutate: enterExamResults, isPending: isEnteringExamResults } = useEnterTutorExamResults();

  const isSubmitting = isEvaluatingAssignment || isEnteringExamResults;

  // Use all assigned students directly from query response
  const myStudents = students;

  // State variables for form
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [assessmentType, setAssessmentType] = useState<"Assignment" | "Exam">("Assignment");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [grade, setGrade] = useState("A");
  const [remarks, setRemarks] = useState("");

  // Search filter for history
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const [showForm, setShowForm] = useState(false);

  // Pre-fill student dropdown if students are available
  useEffect(() => {
    if (myStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(myStudents[0].id);
    }
  }, [myStudents, selectedStudentId]);

  // Available assessments based on selected type
  const activeAssignments = assignments;
  const activeExams = exams;

  const currentAssessments = assessmentType === "Assignment" ? activeAssignments : activeExams;

  // Auto-select first assessment item when list changes
  useEffect(() => {
    if (currentAssessments.length > 0) {
      setSelectedAssessmentId(currentAssessments[0].id);
    } else {
      setSelectedAssessmentId("");
    }
  }, [assessmentType, assignments, exams]);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudentId || !selectedAssessmentId || !obtainedMarks) {
      toast.error("Please fill in all assessment information.");
      return;
    }

    const studentObj = myStudents.find((s) => s.id === selectedStudentId);
    const assessmentObj = currentAssessments.find((a) => a.id === selectedAssessmentId);

    if (!studentObj || !assessmentObj) return;

    const obt = parseFloat(obtainedMarks);
    const max = assessmentObj.maxMarks;

    if (obt > max) {
      toast.error("Obtained marks cannot exceed maximum marks.");
      return;
    }

    const newEvaluation: Evaluation = {
      id: `EVL-${Date.now()}`,
      studentId: studentObj.id,
      studentName: studentObj.studentName,
      assessmentType,
      assessmentId: assessmentObj.id,
      assessmentTitle: assessmentObj.title,
      maxMarks: max,
      obtainedMarks: obt,
      grade,
      remarks: remarks.trim(),
      evaluatedAt: new Date().toISOString(),
      tutorName: "Dr. Ramesh Prasad",
    };

    if (assessmentType === "Assignment") {
      evaluateAssignment(
        {
          id: selectedAssessmentId,
          data: {
            studentId: selectedStudentId,
            marksObtained: obt,
            remarks: remarks.trim(),
            completed: true,
          },
        },
        {
          onSuccess: () => {
            onAddEvaluation(newEvaluation);
            toast.success(`Evaluation recorded for ${studentObj.studentName}!`);
            setObtainedMarks("");
            setRemarks("");
            setShowForm(false);
          },
          onError: () => {
            toast.error("Failed to submit assignment evaluation to the backend.");
          },
        }
      );
    } else {
      enterExamResults(
        {
          id: selectedAssessmentId,
          data: {
            results: [
              {
                studentId: selectedStudentId,
                marksObtained: obt,
                grade,
                remarks: remarks.trim(),
              },
            ],
          },
        },
        {
          onSuccess: () => {
            onAddEvaluation(newEvaluation);
            toast.success(`Exam results entered for ${studentObj.studentName}!`);
            setObtainedMarks("");
            setRemarks("");
            setShowForm(false);
          },
          onError: () => {
            toast.error("Failed to submit exam results to the backend.");
          },
        }
      );
    }
  };

  const handleDelete = (id: string, name: string, title: string) => {
    confirm({
      title: "Delete Evaluation",
      message: `Are you sure you want to delete the evaluation of "${title}" for ${name}?`,
      confirmText: "Delete Entry",
      variant: "danger",
      onConfirm: async () => {
        onDeleteEvaluation(id);
        toast.success("Evaluation record deleted.");
      },
    });
  };

  // Filter history list
  const filteredEvaluations = evaluations.filter((ev) => {
    const matchesSearch =
      ev.studentName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      ev.assessmentTitle.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesSearch;
  });

  const getGradeBadgeClass = (gradeVal: string) => {
    if (gradeVal === "A+" || gradeVal === "A") {
      return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
    }
    if (gradeVal === "B" || gradeVal === "C") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Header with toggle form button */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider font-heading">
          Evaluations List
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={`font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
            showForm
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white shadow-sm"
          }`}
        >
          {showForm ? (
            <>
              <X className="w-3.5 h-3.5" /> Cancel
            </>
          ) : (
            <>
              <Award className="w-3.5 h-3.5" /> Enter Marks
            </>
          )}
        </Button>
      </div>

      {/* ── Manual Marks Entry Form ── */}
      {showForm && (
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden animate-slide-down">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--brand-green)]" />
              Manual Marks Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {myStudents.length > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Select Student */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Select Student
                    </label>
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                      <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                        <SelectValue placeholder="Select Student" />
                      </SelectTrigger>
                      <SelectContent>
                        {myStudents.map((s) => (
                          <SelectItem key={s.id} value={s.id} className="text-xs font-medium">
                            {s.studentName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Assessment Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Assessment Type
                    </label>
                    <Select
                      value={assessmentType}
                      onValueChange={(val) => setAssessmentType(val as "Assignment" | "Exam")}
                    >
                      <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Assignment" className="text-xs font-medium">Assignment</SelectItem>
                        <SelectItem value="Exam" className="text-xs font-medium">Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Specific Assessment Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Select Task
                    </label>
                    {currentAssessments.length > 0 ? (
                      <Select value={selectedAssessmentId} onValueChange={setSelectedAssessmentId}>
                        <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                          <SelectValue placeholder="Select Task" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentAssessments.map((a) => (
                            <SelectItem key={a.id} value={a.id} className="text-xs font-medium">
                              {a.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-10 flex items-center px-3 border border-dashed border-slate-250 bg-slate-50/50 rounded-xl text-xs text-slate-600 font-semibold">
                        No {assessmentType.toLowerCase()}s found
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Maximum Marks — locked from the selected assessment */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Maximum Marks
                    </label>
                    <div className="h-10 flex items-center justify-between px-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-sm font-bold text-slate-700">
                        {currentAssessments.find((a) => a.id === selectedAssessmentId)?.maxMarks ?? "—"}
                      </span>
                      <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Obtained Marks */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Obtained Marks
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="e.g. 85"
                      value={obtainedMarks}
                      onChange={(e) => setObtainedMarks(e.target.value)}
                      className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>

                  {/* Select Grade */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Select Grade
                    </label>
                    <Select value={grade} onValueChange={setGrade}>
                      <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                        <SelectValue placeholder="Select Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_OPTIONS.map((g) => (
                          <SelectItem key={g} value={g} className="text-xs font-medium">
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Performance Remarks
                  </label>
                  <Textarea
                    placeholder="e.g. Excellent work, solid command over concepts..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="min-h-12 max-h-24 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!selectedAssessmentId || isSubmitting}
                    className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Saving..." : "Save Evaluation Entry"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center text-slate-600 text-sm">
                You do not have any approved, active students assigned to you to evaluate.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Table of History ── */}
      <div className="space-y-4">
        {/* Search header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 z-10" />
            <Input
              type="text"
              placeholder="Search evaluation by student or task name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-10 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* List of past evaluations */}
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden max-h-[520px] overflow-y-auto">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[35%]">
                  Student & Task
                </TableHead>
                <TableHead className="px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[25%]">
                  Score
                </TableHead>
                <TableHead className="px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[18%]">
                  Grade
                </TableHead>
                <TableHead className="px-5 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-[22%]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {filteredEvaluations.length > 0 ? (
                filteredEvaluations.map((ev) => (
                  <TableRow key={ev.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Student name and task title */}
                    <TableCell className="px-5 py-3.5">
                      <p className="text-sm font-bold text-slate-750 truncate leading-none">
                        {ev.studentName}
                      </p>
                      <span className="text-[10px] text-slate-600 font-semibold block mt-1.5 truncate">
                        {ev.assessmentType}: {ev.assessmentTitle}
                      </span>
                    </TableCell>

                    {/* Score */}
                    <TableCell className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-slate-650">
                        {ev.obtainedMarks} / {ev.maxMarks}
                      </span>
                      <span className="text-[10px] text-slate-600 block mt-0.5">
                        ({Math.round((ev.obtainedMarks / ev.maxMarks) * 100)}%)
                      </span>
                    </TableCell>

                    {/* Grade */}
                    <TableCell className="px-5 py-3.5">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${getGradeBadgeClass(
                          ev.grade
                        )}`}
                      >
                        {ev.grade}
                      </Badge>
                    </TableCell>

                    {/* Remarks and delete */}
                    <TableCell className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ev.remarks && (
                          <span
                            title={ev.remarks}
                            className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md cursor-help max-w-[80px] truncate"
                          >
                            Remarks
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(ev.id, ev.studentName, ev.assessmentTitle)}
                          title="Delete Evaluation"
                          className="rounded-lg text-slate-600 hover:text-red-650 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-5 py-12 text-center text-slate-600 text-sm"
                  >
                    No evaluation records found matching search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
