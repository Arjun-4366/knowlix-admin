"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useTutorStore } from "@/store/tutorStore";
import { ICreateAssignmentPayload } from "@/types/tutor/assignments";

interface Student {
  id: string;
  studentName: string;
}

interface CreateAssignmentFormProps {
  students: Student[];
  isCreating: boolean;
  onSubmit: (payload: ICreateAssignmentPayload) => void;
}

export default function CreateAssignmentForm({
  students,
  isCreating,
  onSubmit,
}: CreateAssignmentFormProps) {
  const subjects = useTutorStore((s) => s.subjects);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(subjects[0] ?? "");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("50");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject(subjects[0] ?? "");
    setDueDate("");
    setMaxMarks("50");
    setSelectedStudentIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!subject) {
      toast.error("Subject is required.");
      return;
    }
    if (!dueDate) {
      toast.error("Due date is required.");
      return;
    }
    if (selectedStudentIds.length === 0) {
      toast.error("Select at least one student.");
      return;
    }
    const marks = parseInt(maxMarks);
    if (isNaN(marks) || marks <= 0) {
      toast.error("Enter a valid max marks value.");
      return;
    }

    onSubmit({
      studentIds: selectedStudentIds,
      title: title.trim(),
      description: description.trim(),
      subject,
      dueDate,
      maxMarks: marks,
    });

    resetForm();
  };

  return (
    <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          New Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Title + Subject + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Algebra Worksheet - Chapter 5"
                className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Subject
              </label>
              {subjects.length > 0 ? (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10 w-full bg-white border border-slate-200 rounded-xl text-sm px-3 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30">
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject"
                  className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                />
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-10 pl-10 bg-white border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2: Description + Max Marks */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Description / Instructions
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Complete exercises 1 to 20 from chapter 5"
                className="min-h-[72px] max-h-28 bg-white border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Max Marks
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

          {/* Row 3: Student multi-select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assign To Students ({selectedStudentIds.length} selected)
            </label>
            {students.length === 0 ? (
              <p className="text-xs text-slate-400 font-semibold">
                No students in your roster.
              </p>
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
                      }`}>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                          selected
                            ? "bg-[var(--brand-green)] border-[var(--brand-green)]"
                            : "border-slate-300"
                        }`}>
                        {selected && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
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
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50">
              {isCreating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isCreating ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
