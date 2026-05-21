"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import TutorReportStats, { ProgressReport } from "@/components/tutor/TutorReportStats";
import TutorReportTemplates from "@/components/tutor/TutorReportTemplates";
import TutorReportGenerator from "@/components/tutor/TutorReportGenerator";
import TutorReportHistory from "@/components/tutor/TutorReportHistory";

import { Student } from "@/components/students/StudentStats";
import { Evaluation } from "@/components/tutor/TutorAssessmentStats";

interface AttendanceLog {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  tutorName: string;
}

// ─── Initial Mock Students if not present ──────────────────────────────────
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

// ─── Initial Mock Reports ──────────────────────────────────────────────────
const initialReports: ProgressReport[] = [
  {
    id: "REP-1",
    studentId: "STU-101",
    studentName: "Rahul Sharma",
    templateId: "monthly",
    templateName: "Monthly Academic Check",
    period: "April 2026",
    attendanceRate: 96,
    academicScores: [
      { subject: "Newton's Laws Lab", score: 94 },
      { subject: "Calculus Limits Sheet", score: 88 },
      { subject: "Kinematics Mechanics Quiz", score: 76 }
    ],
    behavioralRatings: {
      attentiveness: "Excellent",
      participation: "Good",
      homeworkPunctuality: "Excellent"
    },
    tutorFeedback: "Rahul has shown great interest in physics experiments. His Newton's laws lab report was outstanding. He is encouraged to practice complex derivatives to further raise his Calculus marks.",
    overallGrade: "A",
    generatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    tutorName: "Dr. Ramesh Prasad"
  },
  {
    id: "REP-2",
    studentId: "STU-106",
    studentName: "Meera Joshi",
    templateId: "monthly",
    templateName: "Monthly Academic Check",
    period: "April 2026",
    attendanceRate: 98,
    academicScores: [
      { subject: "Newton's Laws Lab", score: 82 },
      { subject: "Intro Mechanics Practice", score: 95 }
    ],
    behavioralRatings: {
      attentiveness: "Excellent",
      participation: "Excellent",
      homeworkPunctuality: "Excellent"
    },
    tutorFeedback: "Meera is an exceptional student. She communicates ideas clearly and helps peers during group discussions. Splendid performance overall.",
    overallGrade: "A+",
    generatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    tutorName: "Dr. Ramesh Prasad"
  }
];

function TutorReportsContent() {
  const [activeTab, setActiveTab] = useState("templates");
  const [activeTemplateId, setActiveTemplateId] = useState<"monthly" | "term-end" | "weekly">("monthly");

  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // Synchronize localStorage
  useEffect(() => {
    // 1. Reports
    const storedReports = localStorage.getItem("knowlix_progress_reports");
    if (storedReports) {
      try {
        setReports(JSON.parse(storedReports));
      } catch (e) {
        console.error("Error parsing reports:", e);
      }
    } else {
      localStorage.setItem("knowlix_progress_reports", JSON.stringify(initialReports));
      setReports(initialReports);
    }

    // 2. Students
    const storedStudents = localStorage.getItem("knowlix_students");
    if (storedStudents) {
      try {
        setStudents(JSON.parse(storedStudents));
      } catch (e) {
        console.error("Error parsing students:", e);
      }
    } else {
      localStorage.setItem("knowlix_students", JSON.stringify(initialStudents));
      setStudents(initialStudents);
    }

    // 3. Attendance Logs
    const storedLogs = localStorage.getItem("knowlix_attendance_logs");
    if (storedLogs) {
      try {
        setAttendanceLogs(JSON.parse(storedLogs));
      } catch (e) {
        console.error("Error parsing attendance logs:", e);
      }
    }

    // 4. Evaluations
    const storedEvls = localStorage.getItem("knowlix_evaluations");
    if (storedEvls) {
      try {
        setEvaluations(JSON.parse(storedEvls));
      } catch (e) {
        console.error("Error parsing evaluations:", e);
      }
    }
  }, []);

  const handleSelectTemplate = (templateId: "monthly" | "term-end" | "weekly") => {
    setActiveTemplateId(templateId);
    setActiveTab("generate");
  };

  const handleGenerateReport = (newReport: ProgressReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem("knowlix_progress_reports", JSON.stringify(updated));
    setActiveTab("history");
  };

  const handleDeleteReport = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem("knowlix_progress_reports", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 w-full pb-10">
      <DashboardHeader
        title="Student Progress Reports"
        description="Select report templates, automatically calculate academic scores and attendance, and generate professional certificates or marksheets."
      />

      {/* Analytics stats */}
      <TutorReportStats reports={reports} students={students} />

      {/* Main portal navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-6">
          <TabsTrigger
            value="templates"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Report Templates
          </TabsTrigger>
          <TabsTrigger
            value="generate"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Generate Report
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Report History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-0 outline-none">
          <TutorReportTemplates onSelectTemplate={handleSelectTemplate} />
        </TabsContent>

        <TabsContent value="generate" className="mt-0 outline-none">
          <TutorReportGenerator
            students={students}
            attendanceLogs={attendanceLogs}
            evaluations={evaluations}
            activeTemplateId={activeTemplateId}
            setActiveTemplateId={setActiveTemplateId}
            onGenerateReport={handleGenerateReport}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-0 outline-none">
          <TutorReportHistory reports={reports} onDeleteReport={handleDeleteReport} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TutorReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorReportsContent />
    </Suspense>
  );
}
