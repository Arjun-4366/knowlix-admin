"use client";

import { useState } from "react";
import { Plus, Calendar, Video, Clock, Users, BookOpen, CheckCircle2, AlertCircle, X, Save, ExternalLink, Edit2, Trash2 } from "lucide-react";
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
import { useGetSessions, useCreateTutorSession, useUpdateTutorSession, useDeleteTutorSession } from "@/querys/tutor/attendanceQuery";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { TutorSessionType, ITutorSession } from "@/types/tutor/attendance";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

const SUBJECT_OPTIONS = ["Mathematics", "Physics", "Chemistry", "English", "Social Studies", "Computer Science", "Biology"];

// Helper to convert ISO UTC timestamp to local format for datetime-local input
const formatIsoToDatetimeLocal = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const pad = (num: number) => String(num).padStart(2, "0");
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

export default function TutorSessionManager() {
  const { confirm } = useConfirmation();
  const { data: sessionsResponse, isLoading: loadingSessions } = useGetSessions();
  const { data: studentsResponse, isLoading: loadingStudents } = useGetTutorStudents();
  const { mutate: createSession, isPending: isCreating } = useCreateTutorSession();
  const { mutate: updateSession, isPending: isUpdating } = useUpdateTutorSession();
  const { mutate: deleteSession } = useDeleteTutorSession();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  
  // Form States
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [sessionType, setSessionType] = useState<TutorSessionType>("group");
  const [meetLink, setMeetLink] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [notes, setNotes] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const sessions = sessionsResponse?.data || [];
  const students = studentsResponse?.data || [];

  // Filter out to only show active/approved assigned students
  const activeStudents = students.filter(
    (s) => s.admissionStatus?.toLowerCase() === "approved" || s.admissionStatus?.toLowerCase() === "active"
  );

  const studentMap = new Map(students.map((s) => [s.id, s.studentName]));

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleEdit = (session: ITutorSession) => {
    setEditingSessionId(session.id);
    setTitle(session.title);
    setSubject(session.subject);
    setSessionType(session.type);
    setMeetLink(session.meetLink);
    setScheduledAt(formatIsoToDatetimeLocal(session.scheduledAt));
    setDurationMinutes(String(session.durationMinutes));
    setNotes(session.notes || "");
    setSelectedStudentIds(session.studentIds);
    setShowAddForm(true);
    toast(`Editing class: "${session.title}"`);
  };

  const handleDelete = (id: string, sessionTitle: string) => {
    confirm({
      title: "Delete Class Session",
      message: `Are you sure you want to delete the scheduled class session "${sessionTitle}"?`,
      confirmText: "Delete Session",
      variant: "danger",
      onConfirm: async () => {
        deleteSession(id, {
          onSuccess: () => {
            toast.success("Class session deleted successfully.");
            if (editingSessionId === id) {
              handleCancel();
            }
          },
          onError: (err) => {
            console.error("Failed to delete session:", err);
            toast.error("Failed to delete class session.");
          },
        });
      },
    });
  };

  const handleCancel = () => {
    setTitle("");
    setSubject(SUBJECT_OPTIONS[0]);
    setSessionType("group");
    setMeetLink("");
    setScheduledAt("");
    setDurationMinutes("60");
    setNotes("");
    setSelectedStudentIds([]);
    setEditingSessionId(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !meetLink.trim() || !scheduledAt || selectedStudentIds.length === 0) {
      toast.error("Please fill in all required fields and select at least one student.");
      return;
    }

    // Basic URL validation
    if (!meetLink.startsWith("http://") && !meetLink.startsWith("https://")) {
      toast.error("Please enter a valid meeting URL (starting with http:// or https://).");
      return;
    }

    const duration = parseInt(durationMinutes);
    if (isNaN(duration) || duration <= 0) {
      toast.error("Please enter a valid duration (greater than 0 minutes).");
      return;
    }

    // Convert local datetime-local string to ISO UTC format
    const isoScheduledAt = new Date(scheduledAt).toISOString();

    const payload = {
      type: sessionType,
      studentIds: selectedStudentIds,
      title: title.trim(),
      subject,
      meetLink: meetLink.trim(),
      scheduledAt: isoScheduledAt,
      durationMinutes: duration,
      notes: notes.trim(),
    };

    if (editingSessionId) {
      updateSession(
        { id: editingSessionId, data: payload },
        {
          onSuccess: () => {
            toast.success(`Class session "${title}" updated successfully!`);
            handleCancel();
          },
          onError: (err) => {
            console.error("Failed to update session:", err);
            toast.error("Failed to update class session. Please try again.");
          },
        }
      );
    } else {
      createSession(
        payload,
        {
          onSuccess: () => {
            toast.success(`Class session "${title}" scheduled successfully!`);
            handleCancel();
          },
          onError: (err) => {
            console.error("Failed to create session:", err);
            toast.error("Failed to schedule class session. Please try again.");
          },
        }
      );
    }
  };

  const STATUS_STYLES: Record<string, string> = {
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    ongoing: "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
    completed: "bg-slate-100 text-slate-600 border-slate-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const isLoading = loadingSessions || loadingStudents;
  const isSubmitting = isCreating || isUpdating;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[30vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with schedule toggle button */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider font-heading">
          Class Sessions List
        </h2>
        <Button
          onClick={showAddForm ? handleCancel : () => setShowAddForm(true)}
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
              <Plus className="w-3.5 h-3.5" /> Schedule Class
            </>
          )}
        </Button>
      </div>

      {/* ── Schedule Class Form ── */}
      {showAddForm && (
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden animate-slide-down">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4 text-[var(--brand-green)]" />
              {editingSessionId ? "Edit Class Session" : "Schedule New Class Session"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Session Title
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mathematics Exam revision"
                    className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Subject
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
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

                {/* Session Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Session Type
                  </label>
                  <Select value={sessionType} onValueChange={(v) => setSessionType(v as TutorSessionType)}>
                    <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group" className="font-medium text-xs">Group Session</SelectItem>
                      <SelectItem value="individual" className="font-medium text-xs">Individual 1-on-1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Scheduled At */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date & Time
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Duration (Minutes)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Meet Link */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Google Meet Link
                  </label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <Input
                      type="url"
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                      placeholder="https://meet.google.com/abc-defg-hij"
                      className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Session Notes / Agenda
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Chapter 5 and Chapter 6 revision..."
                  className="min-h-16 max-h-32 bg-white border border-slate-200 rounded-xl text-sm"
                />
              </div>

              {/* Student checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Assign Students ({selectedStudentIds.length} selected)
                </label>
                {activeStudents.length === 0 ? (
                  <p className="text-xs text-slate-455 font-semibold p-2 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    You have no active students in your roster.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {activeStudents.map((s) => {
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

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200 text-slate-500 bg-white hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedStudentIds.length === 0}
                  className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Saving..." : editingSessionId ? "Save Changes" : "Schedule Class"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Table of Scheduled Sessions ── */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">
                Session Info
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                Date & Time
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">
                Duration
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
                Students
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[14%]">
                Meeting Link
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[14%]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {sessions.length > 0 ? (
              sessions.map((session) => {
                const namesList = session.studentIds
                  .map((id) => studentMap.get(id) ?? id.substring(0, 8) + "...")
                  .join(", ");
                const scheduledDate = new Date(session.scheduledAt);
                const statusStyle = STATUS_STYLES[session.status] || STATUS_STYLES.scheduled;

                return (
                  <TableRow key={session.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Session Info */}
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-750 truncate leading-none" title={session.title}>
                        {session.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1.5 truncate">
                        {session.subject} · {session.type === "individual" ? "1-on-1" : "Group"}
                      </span>
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-750 leading-none">
                        {scheduledDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        {scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">
                          {session.durationMinutes} min
                        </span>
                      </div>
                    </TableCell>

                    {/* Students */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-bold text-slate-700">
                          {session.studentIds.length} {session.type === "individual" ? "Student" : "Students"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold truncate" title={namesList}>
                        {namesList}
                      </p>
                    </TableCell>

                    {/* Meeting link */}
                    <TableCell className="px-6 py-4">
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--brand-green)] bg-[var(--brand-light-green)]/40 hover:bg-[var(--brand-light-green)]/70 px-2.5 py-1 rounded-lg border border-[var(--brand-light)]/20 transition-all shadow-sm"
                      >
                        <Video className="w-3 h-3 text-[var(--brand-green)]" />
                        Join Class
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm capitalize ${statusStyle}`}
                      >
                        {session.status}
                      </Badge>
                    </TableCell>

                    {/* Actions Column: Edit / Delete */}
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(session)}
                          title="Edit Session"
                          className="rounded-lg text-slate-450 hover:text-[var(--brand-green)] hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(session.id, session.title)}
                          title="Delete Session"
                          className="rounded-lg text-slate-450 hover:text-red-650 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-450 text-sm"
                >
                  No scheduled classes found. Schedule a session above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
