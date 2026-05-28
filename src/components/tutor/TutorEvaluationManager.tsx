"use client";

import { useState, useEffect } from "react";
import { Award, Search, Trash2, Check, Sparkles } from "lucide-react";
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
import { Student } from "@/components/admin/students/StudentStats";
import { Assignment, Exam, Evaluation } from "./TutorAssessmentStats";
import { toast } from "react-hot-toast";

interface TutorEvaluationManagerProps {
  students: Student[];
  assignments: Assignment[];
  exams: Exam[];
  evaluations: Evaluation[];
  onAddEvaluation: (evaluation: Evaluation) => void;
  onDeleteEvaluation: (id: string) => void;
}

const GRADE_OPTIONS = ["A+", "A", "B", "C", "D", "F"];

const calculateAutoGrade = (obtained: number, max: number): string => {
  if (max <= 0) return "F";
  const pct = (obtained / max) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
};

export default function TutorEvaluationManager({
  students,
  assignments,
  exams,
  evaluations,
  onAddEvaluation,
  onDeleteEvaluation,
}: TutorEvaluationManagerProps) {
  const { confirm } = useConfirmation();

  // Filter approved students assigned to Dr. Ramesh Prasad
  const myStudents = students.filter(
    (s) => s.subjectTutor === "Dr. Ramesh Prasad" && s.admissionStatus === "Approved"
  );

  // State variables for form
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [assessmentType, setAssessmentType] = useState<"Assignment" | "Exam">("Assignment");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [obtainedMarks, setObtainedMarks] = useState("");
  const [grade, setGrade] = useState("A");
  const [isGradeOverridden, setIsGradeOverridden] = useState(false);
  const [remarks, setRemarks] = useState("");

  // Search filter for history
  const [searchQuery, setSearchQuery] = useState("");

  // Pre-fill student dropdown if students are available
  useEffect(() => {
    if (myStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(myStudents[0].id);
    }
  }, [myStudents, selectedStudentId]);

  // Available assessments based on selected type
  const activeAssignments = assignments.filter((a) => a.tutorName === "Dr. Ramesh Prasad");
  const activeExams = exams.filter((e) => e.tutorName === "Dr. Ramesh Prasad");

  const currentAssessments = assessmentType === "Assignment" ? activeAssignments : activeExams;

  // Auto-select first assessment item when list changes
  useEffect(() => {
    if (currentAssessments.length > 0) {
      setSelectedAssessmentId(currentAssessments[0].id);
    } else {
      setSelectedAssessmentId("");
    }
  }, [assessmentType, assignments, exams]);

  // Auto-calculate grade when marks change, unless manually overridden
  useEffect(() => {
    const obt = parseFloat(obtainedMarks);
    const max = parseFloat(maxMarks);
    if (!isNaN(obt) && !isNaN(max) && max > 0 && !isGradeOverridden) {
      const calculated = calculateAutoGrade(obt, max);
      setGrade(calculated);
    }
  }, [obtainedMarks, maxMarks, isGradeOverridden]);

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
    const max = parseFloat(maxMarks);

    if (obt > max) {
      toast.error("Obtained marks cannot exceed maximum marks.");
      return;
    }

    const newEvaluation: Evaluation = {
      id: `EVL-${Date.now()}`,
      studentId: studentObj.id,
      studentName: studentObj.name,
      assessmentType,
      assessmentId: assessmentObj.id,
      assessmentTitle: "title" in assessmentObj ? (assessmentObj as Assignment).title : (assessmentObj as Exam).title,
      maxMarks: max,
      obtainedMarks: obt,
      grade,
      remarks: remarks.trim(),
      evaluatedAt: new Date().toISOString(),
      tutorName: "Dr. Ramesh Prasad",
    };

    onAddEvaluation(newEvaluation);
    toast.success(`Evaluation recorded for ${studentObj.name}!`);

    // Reset Form
    setObtainedMarks("");
    setRemarks("");
    setIsGradeOverridden(false);
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
      ev.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.assessmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ── Left Column: Form ── */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden h-full">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--brand-green)]" />
              Manual Marks Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {myStudents.length > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Select Student */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Select Student
                  </label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                      <SelectValue placeholder="Select Student" />
                    </SelectTrigger>
                    <SelectContent>
                      {myStudents.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="text-xs font-medium">
                          {s.name} ({s.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Assessment Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                              {"title" in a ? (a as Assignment).title : (a as Exam).title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-10 flex items-center px-3 border border-dashed border-slate-250 bg-slate-50/50 rounded-xl text-xs text-slate-400 font-semibold">
                        No {assessmentType.toLowerCase()}s found
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Maximum Marks */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Maximum Marks
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={maxMarks}
                      onChange={(e) => setMaxMarks(e.target.value)}
                      className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>

                  {/* Obtained Marks */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                </div>

                {/* Grade Entry */}
                <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-150 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Assigned Grade
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-lg font-black text-slate-800">{grade}</span>
                      {!isGradeOverridden && obtainedMarks && (
                        <span className="text-[10px] font-bold text-[var(--brand-green)] flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3 fill-[var(--brand-green)] text-[var(--brand-green)]" /> Auto-calculated
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Grade Override Option */}
                  <div className="w-[120px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Override Grade
                    </span>
                    <Select
                      value={isGradeOverridden ? grade : "auto"}
                      onValueChange={(val) => {
                        if (val === "auto") {
                          setIsGradeOverridden(false);
                          const obt = parseFloat(obtainedMarks);
                          const max = parseFloat(maxMarks);
                          if (!isNaN(obt) && !isNaN(max) && max > 0) {
                            setGrade(calculateAutoGrade(obt, max));
                          }
                        } else {
                          setIsGradeOverridden(true);
                          setGrade(val);
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs font-semibold bg-white border-slate-250 rounded-lg">
                        <SelectValue placeholder="Auto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto" className="text-xs">Auto (Calculated)</SelectItem>
                        {GRADE_OPTIONS.map((g) => (
                          <SelectItem key={g} value={g} className="text-xs font-semibold">
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                <Button
                  type="submit"
                  disabled={!selectedAssessmentId}
                  className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold h-10 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Check className="w-4 h-4" /> Save Evaluation Entry
                </Button>
              </form>
            ) : (
              <div className="p-8 text-center text-slate-450 text-sm">
                You do not have any approved, active students assigned to you to evaluate.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Right Column: History ── */}
      <div className="lg:col-span-3 space-y-4">
        {/* Search header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
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
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">
                  Student & Task
                </TableHead>
                <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">
                  Score
                </TableHead>
                <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                  Grade
                </TableHead>
                <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[22%]">
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
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1.5 truncate">
                        {ev.assessmentType}: {ev.assessmentTitle}
                      </span>
                    </TableCell>

                    {/* Score */}
                    <TableCell className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-slate-650">
                        {ev.obtainedMarks} / {ev.maxMarks}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
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
                            className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md cursor-help max-w-[80px] truncate"
                          >
                            Remarks
                          </span>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(ev.id, ev.studentName, ev.assessmentTitle)}
                          title="Delete Evaluation"
                          className="rounded-lg text-slate-450 hover:text-red-650 hover:bg-red-50 transition-all cursor-pointer"
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
                    className="px-5 py-12 text-center text-slate-450 text-sm"
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
