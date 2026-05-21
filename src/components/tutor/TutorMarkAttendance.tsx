"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Calendar, Check, Save } from "lucide-react";
import { Student } from "@/components/students/StudentStats";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { AttendanceLog, AttendanceRecord } from "./TutorAttendanceStats";

// Mock sessions list for Dr. Ramesh Prasad
const AVAILABLE_SESSIONS = [
  { id: "SESS-M10", name: "Mathematics - Grade 10 (Online School)", subject: "Mathematics" },
  { id: "SESS-P10", name: "Physics - Grade 10 (Online School)", subject: "Physics" },
  { id: "SESS-S11", name: "Social Studies - Grade 11 (Hybrid)", subject: "Social Studies" },
  { id: "SESS-GEN", name: "General Tutorial / Mentoring Session", subject: "General" },
];

interface TutorMarkAttendanceProps {
  students: Student[];
  onSaveLog: (log: AttendanceLog) => void;
}

export default function TutorMarkAttendance({ students, onSaveLog }: TutorMarkAttendanceProps) {
  // Tutor context: Dr. Ramesh Prasad
  const myAssignedStudents = students.filter(
    (s) => s.subjectTutor === "Dr. Ramesh Prasad" && s.admissionStatus === "Approved"
  );

  const [selectedSessionId, setSelectedSessionId] = useState(AVAILABLE_SESSIONS[0].id);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Local state for attendance records
  const [records, setRecords] = useState<Record<string, { status: "Present" | "Absent" | "Late"; remark: string }>>({});

  // Reset or initialize records when assigned students change or session changes
  useEffect(() => {
    const initial: Record<string, { status: "Present" | "Absent" | "Late"; remark: string }> = {};
    myAssignedStudents.forEach((student) => {
      initial[student.id] = {
        status: "Present", // default to Present
        remark: "",
      };
    });
    setRecords(initial);
  }, [students]);

  const handleStatusChange = (studentId: string, status: "Present" | "Absent" | "Late") => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remark,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (myAssignedStudents.length === 0) {
      toast.error("No active students assigned to you to mark attendance.");
      return;
    }

    const session = AVAILABLE_SESSIONS.find((s) => s.id === selectedSessionId);
    if (!session) return;

    // Construct logs
    const logRecords: AttendanceRecord[] = myAssignedStudents.map((s) => {
      const studentState = records[s.id] || { status: "Present", remark: "" };
      return {
        studentId: s.id,
        studentName: s.name,
        status: studentState.status,
        remark: studentState.remark,
      };
    });

    const newLog: AttendanceLog = {
      id: `ATT-${Date.now()}`,
      sessionId: session.id,
      sessionName: session.name,
      date: selectedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tutorName: "Dr. Ramesh Prasad",
      records: logRecords,
      createdAt: new Date().toISOString(),
    };

    onSaveLog(newLog);

    // Reset records back to all present
    const resetRecords: Record<string, { status: "Present" | "Absent" | "Late"; remark: string }> = {};
    myAssignedStudents.forEach((student) => {
      resetRecords[student.id] = {
        status: "Present",
        remark: "",
      };
    });
    setRecords(resetRecords);

    toast.success(`Attendance successfully logged for ${session.name}!`);
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
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Session / Class
              </label>
              <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
                <SelectTrigger className="h-11 bg-white border-slate-200 rounded-xl font-medium">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_SESSIONS.map((sess) => (
                    <SelectItem key={sess.id} value={sess.id} className="font-medium text-sm">
                      {sess.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
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
          </div>
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
              {myAssignedStudents.length} Students Assigned
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {myAssignedStudents.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {myAssignedStudents.map((student) => {
                const state = records[student.id] || { status: "Present", remark: "" };
                return (
                  <div
                    key={student.id}
                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/20 transition-all"
                  >
                    {/* Student Identity */}
                    <div className="flex items-center gap-3 min-w-[240px]">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-sm border border-[var(--brand-light)]/20 shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-none">
                          {student.name}
                        </p>
                        <p className="text-[11px] text-slate-450 font-semibold mt-1">
                          ID: {student.id} · {student.grade}
                        </p>
                      </div>
                    </div>

                    {/* Interactive Pills for Status */}
                    <div className="flex items-center gap-2">
                      {/* Present Pill */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, "Present")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          state.status === "Present"
                            ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/40 shadow-sm scale-[1.03]"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${state.status === "Present" ? "text-[var(--brand-green)]" : "text-slate-400"}`} />
                        Present
                      </button>

                      {/* Late Pill */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, "Late")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          state.status === "Late"
                            ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm scale-[1.03]"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 ${state.status === "Late" ? "text-amber-500" : "text-slate-400"}`} />
                        Late
                      </button>

                      {/* Absent Pill */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, "Absent")}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          state.status === "Absent"
                            ? "bg-red-50 text-red-700 border-red-200 shadow-sm scale-[1.03]"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <XCircle className={`w-3.5 h-3.5 ${state.status === "Absent" ? "text-red-500" : "text-slate-400"}`} />
                        Absent
                      </button>
                    </div>

                    {/* Remarks Input */}
                    <div className="flex-1 max-w-sm">
                      <Input
                        type="text"
                        placeholder="Add optional remarks (e.g. late arrival, network issue)..."
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
              You do not have any approved, active students assigned to you.
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Submit Area ── */}
      {myAssignedStudents.length > 0 && (
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Submit Attendance Log
          </Button>
        </div>
      )}
    </form>
  );
}
