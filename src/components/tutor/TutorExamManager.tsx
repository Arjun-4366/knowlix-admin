"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, Award, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
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
import { useConfirmation } from "@/context/ConfirmationContext";
import { Exam } from "./TutorAssessmentStats";
import { toast } from "react-hot-toast";

interface TutorExamManagerProps {
  exams: Exam[];
  onAddExam: (exam: Exam) => void;
  onToggleExamStatus: (id: string) => void;
  onDeleteExam: (id: string) => void;
}

const SUBJECT_OPTIONS = ["Mathematics", "Physics", "Chemistry", "English", "Social Studies", "Computer Science"];

export default function TutorExamManager({
  exams,
  onAddExam,
  onToggleExamStatus,
  onDeleteExam,
}: TutorExamManagerProps) {
  const { confirm } = useConfirmation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState(SUBJECT_OPTIONS[0]);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDuration, setNewDuration] = useState("60 min");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDate || !newTime) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const newExam: Exam = {
      id: `EXM-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      date: newDate,
      time: newTime,
      duration: newDuration,
      status: "Pending",
      tutorName: "Dr. Ramesh Prasad",
    };

    onAddExam(newExam);
    toast.success(`Exam "${newTitle}" scheduled successfully!`);

    // Reset Form
    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string, title: string) => {
    confirm({
      title: "Delete Exam Schedule",
      message: `Are you sure you want to delete the exam "${title}"? This will cancel the test schedule.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        onDeleteExam(id);
        toast.success("Exam schedule successfully deleted.");
      },
    });
  };

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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="space-y-1">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Time */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      type="text"
                      placeholder="e.g. 04:30 PM"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Duration
                  </label>
                  <Select value={newDuration} onValueChange={setNewDuration}>
                    <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                      <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30 min" className="text-xs">30 minutes</SelectItem>
                      <SelectItem value="45 min" className="text-xs">45 minutes</SelectItem>
                      <SelectItem value="60 min" className="text-xs">60 minutes</SelectItem>
                      <SelectItem value="90 min" className="text-xs">90 minutes</SelectItem>
                      <SelectItem value="120 min" className="text-xs">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Award className="w-4 h-4" /> Save Exam Schedule
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
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
                Conducted
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[40%]">
                Exam Title
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                Date & Time
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
                Duration
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
            {exams.length > 0 ? (
              exams.map((exm) => (
                <TableRow
                  key={exm.id}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    exm.status === "Conducted" ? "bg-slate-50/30 text-slate-400" : ""
                  }`}
                >
                  {/* Status Checkbox */}
                  <TableCell className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={exm.status === "Conducted"}
                      onChange={() => onToggleExamStatus(exm.id)}
                      className="w-4.5 h-4.5 accent-[var(--brand-green)] border-slate-350 rounded-md cursor-pointer transition-all"
                      title={exm.status === "Conducted" ? "Mark Pending" : "Mark Conducted"}
                    />
                  </TableCell>

                  {/* Title and Subject */}
                  <TableCell className="px-6 py-4">
                    <p className={`text-sm font-bold text-slate-700 leading-none truncate ${exm.status === "Conducted" ? "line-through text-slate-400" : ""}`}>
                      {exm.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                      {exm.subject}
                    </span>
                  </TableCell>

                  {/* Date & Time */}
                  <TableCell className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-750 leading-none">
                      {new Date(exm.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <span className="text-[10px] text-slate-450 font-semibold block mt-1">
                      {exm.time}
                    </span>
                  </TableCell>

                  {/* Duration */}
                  <TableCell className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-650 truncate block">
                      {exm.duration}
                    </span>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="px-6 py-4">
                    {exm.status === "Conducted" ? (
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
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(exm.id, exm.title)}
                        title="Delete Schedule"
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
                  colSpan={6}
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
