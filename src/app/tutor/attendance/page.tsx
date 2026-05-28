"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Student } from "@/components/admin/students/StudentStats";
import TutorAttendanceStats, { AttendanceLog } from "@/components/tutor/TutorAttendanceStats";
import TutorMarkAttendance from "@/components/tutor/TutorMarkAttendance";
import TutorAttendanceHistory from "@/components/tutor/TutorAttendanceHistory";

const initialStudents: Student[] = [
  {
    id: "STU-101",
    name: "Rahul Sharma",
    parentName: "Anil Sharma",
    grade: "Grade 10",
    location: "Bangalore, IN",
    courseType: "Online School",
    courseName: "Mathematics",
    packageSelection: "3 Months",
    documentsSubmitted: ["Birth Certificate", "Transfer Certificate", "Previous Academic Records", "Identification Documents"],
    coordinatorName: "Dr. Ramesh Prasad",
    subjectTutor: "Dr. Ramesh Prasad",
    mentorSalesBro: "Sarah Jenkins",
    admissionStatus: "Approved",
  },
  {
    id: "STU-102",
    name: "Sneha Reddy",
    parentName: "V. Reddy",
    grade: "Grade 12",
    location: "Hyderabad, IN",
    courseType: "Online Tuition",
    courseName: "Science",
    packageSelection: "6 Months",
    documentsSubmitted: ["Birth Certificate", "Identification Documents"],
    coordinatorName: "Sarah Jenkins",
    subjectTutor: "Amit Shah",
    mentorSalesBro: "David Miller",
    admissionStatus: "In Review",
  },
  {
    id: "STU-103",
    name: "Kabir Malhotra",
    parentName: "Sanjay Malhotra",
    grade: "Grade 8",
    location: "Delhi, IN",
    courseType: "Online School",
    courseName: "English",
    packageSelection: "1 Year",
    documentsSubmitted: ["Birth Certificate", "Transfer Certificate", "Previous Academic Records", "Identification Documents"],
    coordinatorName: "Amit Shah",
    subjectTutor: "Ananya Roy",
    mentorSalesBro: "Sarah Jenkins",
    admissionStatus: "Approved",
  },
  {
    id: "STU-104",
    name: "Aria Fernandes",
    parentName: "J. Fernandes",
    grade: "Grade 11",
    location: "Goa, IN",
    courseType: "Hybrid Learning",
    courseName: "Social Studies",
    packageSelection: "2 Months",
    documentsSubmitted: ["Birth Certificate", "Previous Academic Records"],
    coordinatorName: "David Miller",
    subjectTutor: "Dr. Ramesh Prasad",
    mentorSalesBro: "Amit Shah",
    admissionStatus: "Pending Approval",
  },
  {
    id: "STU-105",
    name: "Vikram Sen",
    parentName: "Rajesh Sen",
    grade: "Grade 9",
    location: "Kolkata, IN",
    courseType: "Online Tuition",
    courseName: "Computer Science",
    packageSelection: "1 Month",
    documentsSubmitted: ["Identification Documents"],
    coordinatorName: "Ananya Roy",
    subjectTutor: "Sarah Jenkins",
    mentorSalesBro: "David Miller",
    admissionStatus: "Rejected",
  },
  {
    id: "STU-106",
    name: "Meera Joshi",
    parentName: "Sunita Joshi",
    grade: "Grade 10",
    location: "Pune, IN",
    courseType: "Online School",
    courseName: "Physics",
    packageSelection: "Custom (9 Months)",
    documentsSubmitted: ["Birth Certificate", "Transfer Certificate", "Previous Academic Records", "Identification Documents"],
    coordinatorName: "Dr. Ramesh Prasad",
    subjectTutor: "Dr. Ramesh Prasad",
    mentorSalesBro: "Sarah Jenkins",
    admissionStatus: "Approved",
  },
];

// Helper to construct dates relative to today
const getDateAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

const dummyLogs: AttendanceLog[] = [
  {
    id: "ATT-1",
    sessionId: "SESS-M10",
    sessionName: "Mathematics - Grade 10 (Online School)",
    date: getDateAgo(1),
    time: "03:00 PM",
    tutorName: "Dr. Ramesh Prasad",
    records: [
      { studentId: "STU-101", studentName: "Rahul Sharma", status: "Present" },
      { studentId: "STU-104", studentName: "Aria Fernandes", status: "Late", remark: "Joined class 10 minutes late due to system update" },
      { studentId: "STU-106", studentName: "Meera Joshi", status: "Present" },
    ],
    createdAt: new Date(getDateAgo(1) + "T16:00:00Z").toISOString(),
  },
  {
    id: "ATT-2",
    sessionId: "SESS-P10",
    sessionName: "Physics - Grade 10 (Online School)",
    date: getDateAgo(3),
    time: "04:30 PM",
    tutorName: "Dr. Ramesh Prasad",
    records: [
      { studentId: "STU-101", studentName: "Rahul Sharma", status: "Present" },
      { studentId: "STU-104", studentName: "Aria Fernandes", status: "Absent", remark: "Informed tutor of family event ahead of time" },
      { studentId: "STU-106", studentName: "Meera Joshi", status: "Present" },
    ],
    createdAt: new Date(getDateAgo(3) + "T17:30:00Z").toISOString(),
  },
  {
    id: "ATT-3",
    sessionId: "SESS-M10",
    sessionName: "Mathematics - Grade 10 (Online School)",
    date: getDateAgo(4),
    time: "03:00 PM",
    tutorName: "Dr. Ramesh Prasad",
    records: [
      { studentId: "STU-101", studentName: "Rahul Sharma", status: "Present" },
      { studentId: "STU-104", studentName: "Aria Fernandes", status: "Present" },
      { studentId: "STU-106", studentName: "Meera Joshi", status: "Present" },
    ],
    createdAt: new Date(getDateAgo(4) + "T16:00:00Z").toISOString(),
  },
];

function TutorAttendanceContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);

  // Load from local storage
  useEffect(() => {
    // 1. Students
    const storedStudents = localStorage.getItem("knowlix_students");
    if (storedStudents) {
      try {
        setStudents(JSON.parse(storedStudents));
      } catch (e) {
        console.error("Error parsing stored students:", e);
      }
    } else {
      localStorage.setItem("knowlix_students", JSON.stringify(initialStudents));
      setStudents(initialStudents);
    }

    // 2. Attendance logs
    const storedLogs = localStorage.getItem("knowlix_attendance_logs");
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (e) {
        console.error("Error parsing stored attendance logs:", e);
      }
    } else {
      localStorage.setItem("knowlix_attendance_logs", JSON.stringify(dummyLogs));
      setLogs(dummyLogs);
    }
  }, []);

  const handleSaveLog = (newLog: AttendanceLog) => {
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("knowlix_attendance_logs", JSON.stringify(updated));
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((log) => log.id !== id);
    setLogs(updated);
    localStorage.setItem("knowlix_attendance_logs", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 w-full pb-10">
      <DashboardHeader
        title="Attendance Management"
        description="Mark daily session attendance for your assigned students and track class presence records."
      />

      {/* Analytics Cards */}
      <TutorAttendanceStats logs={logs} />

      {/* Tabs */}
      <Tabs defaultValue="mark">
        <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-6">
          <TabsTrigger
            value="mark"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Mark Attendance
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Attendance History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mark" className="mt-0 outline-none">
          <TutorMarkAttendance students={students} onSaveLog={handleSaveLog} />
        </TabsContent>

        <TabsContent value="history" className="mt-0 outline-none">
          <TutorAttendanceHistory logs={logs} onDeleteLog={handleDeleteLog} />
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
