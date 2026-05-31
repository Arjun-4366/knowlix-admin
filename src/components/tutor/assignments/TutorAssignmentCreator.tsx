"use client";

import { Suspense, useState } from "react";
import { Calendar, FileText, CheckCircle2, Clock, XCircle, BookOpen, Users, AlertTriangle, Plus, X, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { useGetTutorAssignments, useCreateTutorAssignment } from "@/querys/tutor/assignmentQuery";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { ITutorAssignment, TutorAssignmentStatus, ICreateAssignmentPayload } from "@/types/tutor/assignments";
import { toast } from "react-hot-toast";
import TutorEvaluateAssignmentModal from "./TutorEvaluateAssignmentModal";

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TutorAssignmentStatus, { label: string; className: string; icon: React.ReactNode }> = {
  assigned: {
    label: "Assigned",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <FileText className="w-3 h-3 mr-1" />,
  },
  submitted: {
    label: "Submitted",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="w-3 h-3 mr-1" />,
  },
  evaluated: {
    label: "Evaluated",
    className: "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
    icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
  },
  expired: {
    label: "Expired",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="w-3 h-3 mr-1" />,
  },
};

function StatusBadge({ status }: { status: TutorAssignmentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.assigned;
  return (
    <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center w-fit ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </Badge>
  );
}

// ─── Due date helpers ──────────────────────────────────────────────────────────

function formatDueDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isDueSoon(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000; // within 3 days
}

function isOverdue(dateStr: string) {
  return new Date(dateStr) < new Date();
}

// ─── Main component ────────────────────────────────────────────────────────────

function AssignmentsList({
  assignments,
  studentMap,
  onEvaluate,
}: {
  assignments: ITutorAssignment[];
  studentMap: Map<string, string>;
  onEvaluate?: (assignment: ITutorAssignment) => void;
}) {
  if (assignments.length === 0) {
    return (
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-16 text-center">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-400">No assignments found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <Table className="table-fixed w-full">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[34%]">
              Assignment Details
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[16%]">
              Due Date
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">
              Students
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
              Max Marks
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
              Status
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {assignments.map((asg) => {
            const due = asg.dueDate;
            const dueSoon = isDueSoon(due);
            const overdue = isOverdue(due) && asg.status === "assigned";
            const studentNames = asg.studentIds
              .map((id) => studentMap.get(id) ?? id.substring(0, 8) + "...")
              .join(", ");

            return (
              <TableRow key={asg.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Title + Subject */}
                <TableCell className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-800 leading-tight truncate">{asg.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <BookOpen className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] text-slate-400 font-semibold truncate">{asg.subject}</span>
                  </div>
                  {asg.description && (
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">{asg.description}</p>
                  )}
                </TableCell>

                {/* Due Date */}
                <TableCell className="px-6 py-4">
                  <div className={`flex items-center gap-1 ${overdue ? "text-red-600" : dueSoon ? "text-amber-600" : "text-slate-650"}`}>
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs font-semibold">{formatDueDate(due)}</span>
                  </div>
                  {overdue && (
                    <span className="text-[10px] font-bold text-red-500 block mt-0.5">Overdue</span>
                  )}
                  {dueSoon && !overdue && (
                    <span className="text-[10px] font-bold text-amber-500 block mt-0.5">Due soon</span>
                  )}
                </TableCell>

                {/* Students */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Users className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-700">{asg.studentIds.length} Student{asg.studentIds.length !== 1 ? "s" : ""}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold truncate">{studentNames}</p>
                </TableCell>

                {/* Max Marks */}
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-black text-slate-800">{asg.maxMarks}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block">marks</span>
                </TableCell>

                {/* Status */}
                <TableCell className="px-6 py-4">
                  <StatusBadge status={asg.status} />
                </TableCell>

                {/* Actions */}
                <TableCell className="px-6 py-4 text-right">
                  {onEvaluate && asg.status !== "evaluated" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEvaluate(asg)}
                      className="text-xs font-bold text-[var(--brand-mid)] hover:bg-[var(--brand-light-green)]/35 hover:text-[var(--brand-mid)] px-2.5 py-1.5 rounded-lg border border-[var(--brand-green)]/20 cursor-pointer transition-all"
                    >
                      Evaluate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function StatsRow({ assignments }: { assignments: ITutorAssignment[] }) {
  const total = assignments.length;
  const evaluated = assignments.filter((a) => a.status === "evaluated").length;
  const submitted = assignments.filter((a) => a.status === "submitted").length;
  const assigned = assignments.filter((a) => a.status === "assigned").length;
  const expired = assignments.filter((a) => a.status === "expired").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Total Assignments"
        value={total}
        icon={<FileText className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="All"
        footerText="All assignments assigned to students"
      />
      <DashboardStatCard
        label="Assigned"
        value={assigned}
        icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText={`${submitted} Submitted`}
        footerText="Pending submission from students"
      />
      <DashboardStatCard
        label="Evaluated"
        value={evaluated}
        icon={<CheckCircle2 className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Graded"
        footerText="Assignments reviewed and graded"
      />
      <DashboardStatCard
        label="Expired"
        value={expired}
        icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
        badgeText="Past Due"
        footerText="Past due date with no submission"
      />
    </div>
  );
}

const SUBJECT_OPTIONS = ["Mathematics", "Physics", "Chemistry", "English", "Social Studies", "Computer Science", "Biology"];

interface TutorAssignmentCreatorProps {
  hideHeader?: boolean;
  hideStats?: boolean;
}

function TutorAssignmentCreatorContent({ hideHeader = false, hideStats = false }: TutorAssignmentCreatorProps) {
  const { data: assignmentsResponse, isLoading: loadingAssignments } = useGetTutorAssignments();
  const { data: studentsResponse, isLoading: loadingStudents } = useGetTutorStudents();
  const { mutate: createAssignment, isPending: isCreating } = useCreateTutorAssignment();

  // Create-form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("50");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Evaluate-modal state
  const [evaluatingAssignment, setEvaluatingAssignment] = useState<ITutorAssignment | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  const isLoading = loadingAssignments || loadingStudents;

  const assignments = assignmentsResponse?.data || [];
  const students = studentsResponse?.data || [];

  // Build a map of studentId → studentName for fast lookup
  const studentMap = new Map(students.map((s) => [s.id, s.studentName]));

  // Split assignments by status for tabs
  const active = assignments.filter((a) => a.status === "assigned" || a.status === "submitted");
  const evaluated = assignments.filter((a) => a.status === "evaluated");
  const expired = assignments.filter((a) => a.status === "expired");

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleStartEvaluation = (asg: ITutorAssignment) => {
    setEvaluatingAssignment(asg);
    setIsEvalModalOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject(SUBJECT_OPTIONS[0]);
    setDueDate("");
    setMaxMarks("50");
    setSelectedStudentIds([]);
    setShowForm(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required."); return; }
    if (!dueDate) { toast.error("Due date is required."); return; }
    if (selectedStudentIds.length === 0) { toast.error("Select at least one student."); return; }
    const marks = parseInt(maxMarks);
    if (isNaN(marks) || marks <= 0) { toast.error("Enter a valid max marks value."); return; }

    const payload: ICreateAssignmentPayload = {
      studentIds: selectedStudentIds,
      title: title.trim(),
      description: description.trim(),
      subject,
      dueDate,
      maxMarks: marks,
    };

    createAssignment(payload, {
      onSuccess: () => {
        toast.success("Assignment created successfully!");
        resetForm();
      },
      onError: () => {
        toast.error("Failed to create assignment. Please try again.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10">
      {!hideHeader && (
        <div className="flex items-start justify-between gap-4">
          <DashboardHeader
            title="Assignments"
            description="Publish assignments for your students and track their status."
          />
          <Button
            onClick={() => setShowForm((v) => !v)}
            className={`flex-shrink-0 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
              showForm
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white shadow-sm"
            }`}
          >
            {showForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> Create Assignment</>}
          </Button>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowForm((v) => !v)}
            className={`font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
              showForm
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white shadow-sm"
            }`}
          >
            {showForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> Create Assignment</>}
          </Button>
        </div>
      )}

      {/* ── Create Form ── */}
      {showForm && (
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              New Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-5">
              {/* Row 1: Title + Subject + Due Date + Max Marks */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Algebra Worksheet - Chapter 5"
                    className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-10 w-full bg-white border border-slate-200 rounded-xl text-sm px-3 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30"
                  >
                    {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description / Instructions</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Complete exercises 1 to 20 from chapter 5"
                    className="min-h-[72px] max-h-28 bg-white border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Marks</label>
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
                  className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
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
      )}

      {/* Stats Row */}
      {!hideStats && <StatsRow assignments={assignments} />}

      {/* Tabs */}
      <Tabs defaultValue="active">
        <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-6">
          <TabsTrigger
            value="active"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Active ({active.length})
          </TabsTrigger>
          <TabsTrigger
            value="evaluated"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Evaluated ({evaluated.length})
          </TabsTrigger>
          <TabsTrigger
            value="expired"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Expired ({expired.length})
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            All ({assignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0 outline-none">
          <AssignmentsList assignments={active} studentMap={studentMap} onEvaluate={handleStartEvaluation} />
        </TabsContent>
        <TabsContent value="evaluated" className="mt-0 outline-none">
          <AssignmentsList assignments={evaluated} studentMap={studentMap} onEvaluate={handleStartEvaluation} />
        </TabsContent>
        <TabsContent value="expired" className="mt-0 outline-none">
          <AssignmentsList assignments={expired} studentMap={studentMap} onEvaluate={handleStartEvaluation} />
        </TabsContent>
        <TabsContent value="all" className="mt-0 outline-none">
          <AssignmentsList assignments={assignments} studentMap={studentMap} onEvaluate={handleStartEvaluation} />
        </TabsContent>
      </Tabs>

      {/* Evaluate Modal */}
      <TutorEvaluateAssignmentModal
        isOpen={isEvalModalOpen}
        onClose={() => {
          setIsEvalModalOpen(false);
          setEvaluatingAssignment(null);
        }}
        assignment={evaluatingAssignment}
        studentMap={studentMap}
      />
    </div>
  );
}

export default function TutorAssignmentCreator({ hideHeader = false, hideStats = false }: TutorAssignmentCreatorProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorAssignmentCreatorContent hideHeader={hideHeader} hideStats={hideStats} />
    </Suspense>
  );
}
