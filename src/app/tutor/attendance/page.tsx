"use client";

import { useState, Suspense } from "react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TutorAttendanceStats, { AttendanceLog } from "@/components/tutor/TutorAttendanceStats";
import TutorMarkAttendance from "@/components/tutor/TutorMarkAttendance";
import TutorAttendanceHistory from "@/components/tutor/TutorAttendanceHistory";
import TutorSessionManager from "@/components/tutor/TutorSessionManager";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { useGetTutorAttendance } from "@/querys/tutor/attendanceQuery";
import { useGetTutorProfile } from "@/querys/tutor/profileQuery";
import { ITutorAttendanceRecord } from "@/types/tutor/attendance";
import { IStudent } from "@/types/admin/student";

// Helper to group flat attendance records by date
const groupAttendanceRecords = (
  records: ITutorAttendanceRecord[],
  studentsList: IStudent[],
  tutorName: string
): AttendanceLog[] => {
  const groups: Record<string, AttendanceLog> = {};

  // Create a map of student ID -> student name for fast lookup
  const studentMap = new Map(studentsList.map((s) => [s.id, s.studentName]));

  records.forEach((rec) => {
    const dateString = rec.date ? rec.date.split("T")[0] : "";
    if (!dateString) return;

    const studentName = studentMap.get(rec.studentId) || `Student (${rec.studentId})`;

    const uiRecord = {
      studentId: rec.studentId,
      studentName,
      status: rec.status,
      remark: rec.remarks || "",
    };

    if (groups[dateString]) {
      groups[dateString].records.push(uiRecord);
      // Keep the latest createdAt to determine correct time
      if (new Date(rec.createdAt) > new Date(groups[dateString].createdAt)) {
        groups[dateString].createdAt = rec.createdAt;
        try {
          groups[dateString].time = new Date(rec.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch {
          // ignore invalid date time formatting
        }
      }
    } else {
      let recordTime = "12:00 PM";
      try {
        if (rec.createdAt) {
          recordTime = new Date(rec.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      } catch {
        // ignore
      }

      groups[dateString] = {
        id: dateString,
        sessionId: "",
        sessionName: "Daily Attendance",
        date: dateString,
        time: recordTime,
        tutorName,
        records: [uiRecord],
        createdAt: rec.createdAt || new Date().toISOString(),
      };
    }
  });

  // Sort logs by date descending
  return Object.values(groups).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

function TutorAttendanceContent() {
  const [activeTab, setActiveTab] = useState("mark");

  const { data: studentsResponse, isLoading: loadingStudents } = useGetTutorStudents();
  const { data: attendanceResponse, isLoading: loadingAttendance } = useGetTutorAttendance();
  const { data: profileResponse, isLoading: loadingProfile } = useGetTutorProfile();

  if (loadingStudents || loadingAttendance || loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const students = studentsResponse?.data || [];
  const rawRecords = attendanceResponse?.data || [];
  const tutorName = profileResponse?.name || "Tutor";

  // Transform flat backend records to grouped UI AttendanceLog format
  const logs = groupAttendanceRecords(rawRecords, students, tutorName);

  return (
    <div className="space-y-8 w-full pb-10">
      <DashboardHeader
        title="Attendance Management"
        description="Mark daily session attendance for your assigned students and track class presence records."
      />

      {/* Analytics Cards */}
      <TutorAttendanceStats logs={logs} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-6">
          <TabsTrigger
            value="mark"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger
            value="sessions"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Class Sessions
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Attendance History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="mt-0 outline-none">
          <TutorMarkAttendance students={students} onSuccess={() => setActiveTab("history")} />
        </TabsContent>

        <TabsContent value="sessions" className="mt-0 outline-none">
          <TutorSessionManager />
        </TabsContent>

        <TabsContent value="history" className="mt-0 outline-none">
          <TutorAttendanceHistory logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TutorAttendancePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorAttendanceContent />
    </Suspense>
  );
}
