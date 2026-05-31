"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle2, XCircle, Clock, Calendar, Save, UserCheck } from "lucide-react";
import { IStudent } from "@/types/admin/student";
import { ITutorSession } from "@/types/tutor/attendance";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useMarkTutorAttendance } from "@/querys/tutor/attendanceQuery";
import TutorSessionSelector from "./TutorSessionSelector";

interface TutorMarkAttendanceProps {
  students: IStudent[];
  onSuccess?: () => void;
}

export default function TutorMarkAttendance({ students, onSuccess }: TutorMarkAttendanceProps) {
  const { mutate: markAttendance, isPending } = useMarkTutorAttendance();

  const [selectedSession, setSelectedSession] = useState<ITutorSession | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<Record<string, { status: "present" | "absent" | "late"; remark: string }>>({});

  // All approved/active students the tutor can mark attendance for
  const allAssignedStudents = useMemo(
    () => students.filter(
      (s) => s.admissionStatus?.toLowerCase() === "approved" || s.admissionStatus?.toLowerCase() === "active"
    ),
    [students]
  );

  // When a session is selected → look up session.studentIds from the FULL students list (any status)
  // When no session → use only approved/active assigned students
  const activeStudents = useMemo(() => {
    if (!selectedSession) return allAssignedStudents;
    const sessionStudentIds = new Set(selectedSession.studentIds);
    return students.filter((s) => sessionStudentIds.has(s.id));
  }, [selectedSession, allAssignedStudents, students]);

  // When active student list changes, reset records
  useEffect(() => {
    const initial: Record<string, { status: "present" | "absent" | "late"; remark: string }> = {};
    activeStudents.forEach((s) => {
      initial[s.id] = { status: "present", remark: "" };
    });
    setRecords(initial);
  }, [activeStudents]);

  // When a session is selected, also pre-fill the date from scheduledAt
  const handleSessionSelect = (session: ITutorSession | null) => {
    setSelectedSession(session);
    if (session?.scheduledAt) {
      setSelectedDate(session.scheduledAt.split("T")[0]);
    }
  };

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    setRecords((prev) => ({ ...prev, [studentId]: { ...prev[studentId], status } }));
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setRecords((prev) => ({ ...prev, [studentId]: { ...prev[studentId], remark } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStudents.length === 0) {
      toast.error("No active students to mark attendance for.");
      return;
    }

    const recordsPayload = activeStudents.map((s) => {
      const state = records[s.id] || { status: "present", remark: "" };
      return {
        studentId: s.id,
        ...(selectedSession ? { sessionId: selectedSession.id } : {}),
        date: selectedDate,
        status: state.status,
        remarks: state.remark || "",
      };
    });

    markAttendance(
      { records: recordsPayload },
      {
        onSuccess: () => {
          const reset: Record<string, { status: "present" | "absent" | "late"; remark: string }> = {};
          activeStudents.forEach((s) => { reset[s.id] = { status: "present", remark: "" }; });
          setRecords(reset);
          toast.success("Attendance successfully marked!");
          onSuccess?.();
        },
        onError: (err) => {
          console.error("Failed to mark attendance:", err);
          toast.error("Failed to mark attendance. Please try again.");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Configuration Card ── */}
      <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Attendance Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Session Date */}
          <div className="max-w-xs space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Session Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 h-11 bg-white border border-slate-200 rounded-xl"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Session Selector */}
          <TutorSessionSelector
            selectedSessionId={selectedSession?.id ?? null}
            onSelect={handleSessionSelect}
          />

          {/* Session selected info banner */}
          {selectedSession && (
            <div className="flex items-center gap-3 bg-[var(--brand-light-green)]/30 border border-[var(--brand-green)]/30 rounded-xl px-4 py-3">
              <UserCheck className="w-4 h-4 text-[var(--brand-green)] flex-shrink-0" />
              <p className="text-xs font-semibold text-[var(--brand-mid)]">
                Session selected — roster filtered to{" "}
                <span className="font-bold">{activeStudents.length}</span> student{activeStudents.length !== 1 ? "s" : ""} from this session.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Students List ── */}
      <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Student Attendance Roster
            </CardTitle>
            <span className="text-xs font-semibold text-slate-400">
              {activeStudents.length} Students
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeStudents.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {activeStudents.map((student) => {
                const state = records[student.id] || { status: "present", remark: "" };
                return (
                  <div
                    key={student.id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/20 transition-all"
                  >
                    {/* Student Identity */}
                    <div className="flex items-center gap-3 min-w-[240px]">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-sm border border-[var(--brand-light)]/20 shadow-sm">
                        {student.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-none">{student.studentName}</p>
                        <p className="text-[11px] text-slate-450 font-semibold mt-1">
                          ID: {student.id} · Class {student.class}
                        </p>
                      </div>
                    </div>

                    {/* Status Pills */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, "present")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          state.status === "present"
                            ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/40 shadow-sm scale-[1.03]"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${state.status === "present" ? "text-[var(--brand-green)]" : "text-slate-400"}`} />
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, "late")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          state.status === "late"
                            ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm scale-[1.03]"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 ${state.status === "late" ? "text-amber-500" : "text-slate-400"}`} />
                        Late
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, "absent")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          state.status === "absent"
                            ? "bg-red-50 text-red-700 border-red-200 shadow-sm scale-[1.03]"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <XCircle className={`w-3.5 h-3.5 ${state.status === "absent" ? "text-red-500" : "text-slate-400"}`} />
                        Absent
                      </button>
                    </div>

                    {/* Remarks */}
                    <div className="flex-1 max-w-sm">
                      <Input
                        type="text"
                        placeholder="Add optional remarks..."
                        value={state.remark}
                        onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                        className="h-9 text-xs border border-slate-200 rounded-lg w-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-450 text-sm">
              {selectedSession
                ? "No matching students found in your roster for the selected session."
                : "You do not have any approved, active students assigned to you."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Submit ── */}
      <div className="flex items-center justify-between pt-2">
        {activeStudents.length === 0 && (
          <p className="text-xs text-slate-400 font-semibold">
            Add students to your roster to submit attendance.
          </p>
        )}
        <div className="ml-auto">
          <Button
            type="submit"
            disabled={isPending || activeStudents.length === 0}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isPending ? "Saving..." : "Submit Attendance Log"}
          </Button>
        </div>
      </div>
    </form>
  );
}
