"use client";

import { useState } from "react";
import { Plus, Calendar, Award, CheckCircle2, AlertCircle, X, Save, Users, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useGetTutorExams, useCreateTutorExam, useUpdateTutorExamStatus } from "@/querys/tutor/examQuery";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { toast } from "react-hot-toast";

const SUBJECT_OPTIONS = ["Mathematics", "Physics", "Chemistry", "English", "Social Studies", "Computer Science", "Biology"];

export default function TutorExamManager() {
  const { data: examsResponse, isLoading: loadingExams } = useGetTutorExams();
  const { data: studentsResponse, isLoading: loadingStudents } = useGetTutorStudents();
  const { mutate: createExam, isPending: isCreating } = useCreateTutorExam();
  const { mutate: updateStatus } = useUpdateTutorExamStatus();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState(SUBJECT_OPTIONS[0]);
  const [newDate, setNewDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const exams = examsResponse?.data || [];
  const students = studentsResponse?.data || [];

  // Build student ID to Name map for display
  const studentMap = new Map(students.map((s) => [s.id, s.studentName]));

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDate || selectedStudentIds.length === 0) {
      toast.error("Please fill in all the required fields and select at least one student.");
      return;
    }

    const marks = parseFloat(maxMarks);
    if (isNaN(marks) || marks <= 0) {
      toast.error("Please enter a valid max marks value.");
      return;
    }

    createExam(
      {
        studentIds: selectedStudentIds,
        title: newTitle.trim(),
        subject: newSubject,
        examDate: newDate,
        maxMarks: marks,
      },
      {
        onSuccess: () => {
          toast.success(`Exam "${newTitle}" scheduled successfully!`);
          // Reset Form
          setNewTitle("");
          setNewDate("");
          setMaxMarks("100");
          setSelectedStudentIds([]);
          setShowAddForm(false);
        },
        onError: () => {
          toast.error("Failed to schedule exam. Please try again.");
        },
      }
    );
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "conducted" ? "pending" : "conducted";
    updateStatus(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success("Exam status updated successfully!");
        },
        onError: () => {
          toast.error("Failed to update exam status.");
        },
      }
    );
  };

  const isLoading = loadingExams || loadingStudents;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with toggle form button */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider font-heading">
          Exams List
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
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
              <Plus className="w-3.5 h-3.5" /> Schedule Exam
            </>
          )}
        </Button>
      </div>

      {/* ── Add Exam Form ── */}
      {showAddForm && (
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden animate-slide-down">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Schedule New Exam
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Title */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Exam Title
                  </label>
                  <Input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Calculus Mid-Term"
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

                {/* Exam Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Exam Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Max Marks */}
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
              </div>

              {/* Student checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Assign To Students ({selectedStudentIds.length} selected)
                </label>
                {students.length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold">No students in your roster.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {students.map((s) => {
                      const selected = selectedStudentIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleStudent(s.id)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer text-xs font-bold ${
                            selected
                              ? "bg-[var(--brand-light-green)]/40 border-[var(--brand-green)] text-[var(--brand-mid)]"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                            selected ? "bg-[var(--brand-green)] border-[var(--brand-green)]" : "border-slate-300"
                          }`}>
                            {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className="truncate">{s.studentName}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isCreating ? "Scheduling..." : "Schedule Exam"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Table of Exams ── */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
                Conducted
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[36%]">
                Exam Title
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                Exam Date
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                Students
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[16%]">
                Max Marks
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {exams.length > 0 ? (
              exams.map((exm) => {
                const namesList = exm.studentIds
                  .map((id) => studentMap.get(id) ?? id.substring(0, 8) + "...")
                  .join(", ");

                return (
                  <TableRow
                    key={exm.id}
                    className={`hover:bg-slate-50/60 transition-colors ${
                      exm.status === "conducted" ? "bg-slate-50/30 text-slate-400" : ""
                    }`}
                  >
                    {/* Status Checkbox */}
                    <TableCell className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={exm.status === "conducted"}
                        onChange={() => handleToggleStatus(exm.id, exm.status)}
                        className="w-4.5 h-4.5 accent-[var(--brand-green)] border-slate-350 rounded-md cursor-pointer transition-all"
                        title={exm.status === "conducted" ? "Mark Pending" : "Mark Conducted"}
                      />
                    </TableCell>

                    {/* Title and Subject */}
                    <TableCell className="px-6 py-4">
                      <p className={`text-sm font-bold text-slate-700 leading-none truncate ${exm.status === "conducted" ? "line-through text-slate-400" : ""}`}>
                        {exm.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        {exm.subject}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-750 leading-none">
                        {new Date(exm.examDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </TableCell>

                    {/* Students Assigned */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Users className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-slate-700">
                          {exm.studentIds.length} Student{exm.studentIds.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold truncate" title={namesList}>
                        {namesList}
                      </p>
                    </TableCell>

                    {/* Max Marks / Status badge combined */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="text-sm font-black text-slate-800">{exm.maxMarks}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block">marks</span>
                        </div>
                        {exm.status === "conducted" ? (
                          <Badge
                            variant="outline"
                            className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Conducted
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          >
                            <AlertCircle className="w-3 h-3 mr-1 text-[var(--brand-green)]" /> Scheduled
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-450 text-sm"
                >
                  No exams scheduled yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
