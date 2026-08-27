"use client";

import { useState } from "react";
import { Plus, Calendar, FileText, Trash2, CheckCircle2, AlertCircle, X } from "lucide-react";
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
import { Assignment } from "./TutorAssessmentStats";
import { toast } from "react-hot-toast";

interface TutorAssignmentManagerProps {
  assignments: Assignment[];
  onAddAssignment: (assignment: Assignment) => void;
  onToggleAssignmentStatus: (id: string) => void;
  onDeleteAssignment: (id: string) => void;
}

const SUBJECT_OPTIONS = ["Mathematics", "Physics", "Chemistry", "English", "Social Studies", "Computer Science"];

export default function TutorAssignmentManager({
  assignments,
  onAddAssignment,
  onToggleAssignmentStatus,
  onDeleteAssignment,
}: TutorAssignmentManagerProps) {
  const { confirm } = useConfirmation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState(SUBJECT_OPTIONS[0]);
  const [newDueDate, setNewDueDate] = useState("");
  const [newTotalStudents, setNewTotalStudents] = useState("3");
  const [newDesc, setNewDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDueDate) {
      toast.error("Please fill in the title and due date.");
      return;
    }

    const newAssignment: Assignment = {
      id: `ASG-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      subject: newSubject,
      dueDate: newDueDate,
      status: "Active",
      totalStudents: parseInt(newTotalStudents) || 1,
      submittedCount: 0,
      tutorName: "Dr. Ramesh Prasad",
    };

    onAddAssignment(newAssignment);
    toast.success(`Assignment "${newTitle}" created successfully!`);

    // Reset Form
    setNewTitle("");
    setNewDueDate("");
    setNewDesc("");
    setShowAddForm(false);
  };

  const handleDelete = (id: string, title: string) => {
    confirm({
      title: "Delete Assignment",
      message: `Are you sure you want to delete the assignment "${title}"? Any student submissions associated with this may be affected.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        onDeleteAssignment(id);
        toast.success("Assignment successfully deleted.");
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with toggle form button */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider font-heading">
          Assignments List
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
              <Plus className="w-3.5 h-3.5" /> Create Assignment
            </>
          )}
        </Button>
      </div>

      {/* ── Add Assignment Form ── */}
      {showAddForm && (
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden animate-slide-down">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Create New Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Assignment Title
                  </label>
                  <Input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Calculus Practice Sheet 2"
                    className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
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

                {/* Due Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 z-10" />
                    <Input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Student Target Count */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Target Students Count
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={newTotalStudents}
                    onChange={(e) => setNewTotalStudents(e.target.value)}
                    className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Description / Instructions
                  </label>
                  <Textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Provide description or special submission details..."
                    className="min-h-10 max-h-24 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Save Assignment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Table of Assignments ── */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <Table className="table-fixed w-full min-w-[680px]">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[10%]">
                Complete
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[35%]">
                Assignment Details
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[18%]">
                Due Date
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[17%]">
                Submissions
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider w-[12%]">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-[8%]">
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
                    asg.status === "Completed" ? "bg-slate-50/30 text-slate-600" : ""
                  }`}
                >
                  {/* Status Checkbox */}
                  <TableCell className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={asg.status === "Completed"}
                      onChange={() => onToggleAssignmentStatus(asg.id)}
                      className="w-4.5 h-4.5 accent-[var(--brand-green)] border-slate-350 rounded-md cursor-pointer transition-all"
                      title={asg.status === "Completed" ? "Mark Active" : "Mark Completed"}
                    />
                  </TableCell>

                  {/* Title and subject */}
                  <TableCell className="px-6 py-4">
                    <p className={`text-sm font-bold text-slate-700 leading-none truncate ${asg.status === "Completed" ? "line-through text-slate-600" : ""}`}>
                      {asg.title}
                    </p>
                    <span className="text-[10px] text-slate-600 font-semibold block mt-1">
                      {asg.subject} · {asg.description || "No description"}
                    </span>
                  </TableCell>

                  {/* Due Date */}
                  <TableCell className="px-6 py-4">
                    <span className="text-xs font-semibold text-slate-650 truncate block">
                      {new Date(asg.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  {/* Submissions Stats */}
                  <TableCell className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-750 block">
                      {asg.submittedCount} / {asg.totalStudents} Submitted
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-550 ${
                          asg.status === "Completed" ? "bg-slate-300" : "bg-[var(--brand-green)]"
                        }`}
                        style={{ width: `${(asg.submittedCount / asg.totalStudents) * 100}%` }}
                      />
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="px-6 py-4">
                    {asg.status === "Completed" ? (
                      <Badge
                        variant="outline"
                        className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Checked
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

                  {/* Actions */}
                  <TableCell className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(asg.id, asg.title)}
                        title="Delete Assignment"
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
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-600 text-sm"
                >
                  No assignments created yet.
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
