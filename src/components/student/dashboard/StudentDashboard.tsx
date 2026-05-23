"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Subcomponents
import StudentStatsGrid from "./StudentStatsGrid";
import StudentAttendanceWidget from "./StudentAttendanceWidget";
import StudentAssignmentsWidget from "./StudentAssignmentsWidget";
import StudentProgressReportWidget from "./StudentProgressReportWidget";
import StudentUpcomingClassesWidget from "./StudentUpcomingClassesWidget";
import StudentBillingWidget from "./StudentBillingWidget";
import StudentPaymentModal from "./StudentPaymentModal";
import StudentClassroomModal from "./StudentClassroomModal";

// Static mock student information
const studentInfo = {
  name: "Rahul Sharma",
  id: "STU-101",
  grade: "Grade 10",
  courseType: "Online School",
  courseName: "Mathematics & Physics",
  coordinator: "Dr. Ramesh Prasad",
};

// 1. Attendance Overview mock data
const initialAttendance = {
  rate: 95,
  scheduled: 20,
  present: 19,
  absent: 1,
  excused: 0,
  history: [
    { date: "2026-05-22", subject: "Mathematics", status: "Present" },
    { date: "2026-05-20", subject: "Physics", status: "Present" },
    { date: "2026-05-18", subject: "Mathematics", status: "Absent" },
    { date: "2026-05-15", subject: "Physics", status: "Present" },
    { date: "2026-05-13", subject: "Mathematics", status: "Present" },
  ],
};

// 2. Assignments Completed mock data
const initialAssignments = [
  { id: "ASM-201", title: "Trigonometry Exercise Sheet", subject: "Mathematics", dueDate: "2026-05-25", status: "Pending", grade: "-" },
  { id: "ASM-202", title: "Kinematics Formula Graphing", subject: "Physics", dueDate: "2026-05-22", status: "Submitted", grade: "-" },
  { id: "ASM-203", title: "Calculus Limits Application", subject: "Mathematics", dueDate: "2026-05-18", status: "Graded", grade: "95/100" },
  { id: "ASM-204", title: "Newton Laws Lab Practical Write-up", subject: "Physics", dueDate: "2026-05-12", status: "Graded", grade: "92/100" },
  { id: "ASM-205", title: "Vector Operations Worksheet", subject: "Mathematics", dueDate: "2026-05-08", status: "Graded", grade: "94/100" },
];

// 3. Average Score mock data
const scoreOverview = {
  average: 93.6,
  totalTests: 8,
  rankInClass: 3,
  percentile: 96.5,
};

// 4. Fees Due mock data
const initialFees = {
  dueAmount: 15000,
  dueDate: "2026-06-01",
  paymentStatus: "Pending",
  invoices: [
    { id: "INV-2026-05", month: "May 2026", amount: 15000, status: "Paid", paidOn: "2026-05-02" },
    { id: "INV-2026-04", month: "April 2026", amount: 15000, status: "Paid", paidOn: "2026-04-03" },
    { id: "INV-2026-03", month: "March 2026", amount: 15000, status: "Paid", paidOn: "2026-03-01" },
  ],
};

// 5. Subject-wise Progress Report mock data
const subjectProgress = [
  { subject: "Mathematics", progress: 95, grade: "A+", tutor: "Dr. Ramesh Prasad" },
  { subject: "Physics", progress: 92, grade: "A", tutor: "Dr. Ramesh Prasad" },
  { subject: "Chemistry", progress: 88, grade: "A-", tutor: "Vikram Malhotra" },
  { subject: "English Literature", progress: 94, grade: "A+", tutor: "Sarah Jenkins" },
  { subject: "Computer Science", progress: 96, grade: "A+", tutor: "David Miller" },
];

// 6. Upcoming Classes mock data
const upcomingClasses = [
  { id: "CLS-401", date: "Today", time: "16:00 - 17:00", subject: "Mathematics", topic: "Integration & Calculus Core", tutor: "Dr. Ramesh Prasad", status: "Active" },
  { id: "CLS-402", date: "Tomorrow", time: "17:30 - 18:30", subject: "Physics", topic: "Thermodynamics Theory", tutor: "Dr. Ramesh Prasad", status: "Scheduled" },
  { id: "CLS-403", date: "2026-05-25", time: "15:00 - 16:00", subject: "Chemistry", topic: "Chemical Equilibrium Intro", tutor: "Vikram Malhotra", status: "Scheduled" },
  { id: "CLS-404", date: "2026-05-26", time: "18:00 - 19:30", subject: "Computer Science", topic: "Object Oriented Design", tutor: "David Miller", status: "Scheduled" },
];

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [fees, setFees] = useState(initialFees);
  
  // Modals state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [classRoomModalOpen, setClassRoomModalOpen] = useState(false);
  const [activeClass, setActiveClass] = useState<typeof upcomingClasses[0] | null>(null);

  // Payment simulated state
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    // Load from local storage if available
    const storedAsg = localStorage.getItem("knowlix_assignments");
    const storedSub = localStorage.getItem("knowlix_submissions");
    
    let loadedAsg = initialAssignments;
    let loadedSub: any[] = [];

    if (storedAsg) {
      try {
        loadedAsg = JSON.parse(storedAsg);
      } catch (e) {}
    } else {
      localStorage.setItem("knowlix_assignments", JSON.stringify(initialAssignments));
    }

    if (storedSub) {
      try {
        loadedSub = JSON.parse(storedSub);
      } catch (e) {}
    }

    // Map to student dashboard formats
    const mapped = loadedAsg.map((asg) => {
      const sub = loadedSub.find((s: any) => s.assignmentId === asg.id && s.studentId === "STU-101");
      return {
        id: asg.id,
        title: asg.title,
        subject: asg.subject,
        dueDate: asg.dueDate,
        status: sub ? sub.status : "Pending",
        grade: sub?.grade || "-"
      };
    });

    setAssignments(mapped);
  }, []);

  // Simulation handlers
  const handleAssignmentSubmit = (id: string) => {
    const storedAsg = localStorage.getItem("knowlix_assignments");
    const storedSub = localStorage.getItem("knowlix_submissions");
    
    let loadedAsg: any[] = [];
    let loadedSub: any[] = [];
    if (storedAsg) {
      try { loadedAsg = JSON.parse(storedAsg); } catch(e) {}
    }
    if (storedSub) {
      try { loadedSub = JSON.parse(storedSub); } catch(e) {}
    }

    const matchedAsg = loadedAsg.find((a: any) => a.id === id);
    if (matchedAsg) {
      matchedAsg.submittedCount += 1;
      localStorage.setItem("knowlix_assignments", JSON.stringify(loadedAsg));
    }

    const newSubmission = {
      id: `SUB-${Date.now()}`,
      assignmentId: id,
      assignmentTitle: matchedAsg ? matchedAsg.title : "Trigonometry Exercise Sheet",
      studentId: "STU-101",
      studentName: "Rahul Sharma",
      submittedAt: new Date().toISOString().split("T")[0],
      fileName: "rahul_sharma_submission.pdf",
      fileSize: "1.2 MB",
      status: "Submitted" as const
    };

    const nextSubs = [...loadedSub, newSubmission];
    localStorage.setItem("knowlix_submissions", JSON.stringify(nextSubs));

    setAssignments((prev) =>
      prev.map((asm) => (asm.id === id ? { ...asm, status: "Submitted" } : asm))
    );
    toast.success("Assignment submitted successfully!");
  };

  const handleFeePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    
    setTimeout(() => {
      setFees((prev) => ({
        ...prev,
        dueAmount: 0,
        paymentStatus: "Paid",
        invoices: [
          {
            id: "INV-2026-06",
            month: "June 2026 (Advance)",
            amount: prev.dueAmount,
            status: "Paid",
            paidOn: new Date().toISOString().split("T")[0],
          },
          ...prev.invoices,
        ],
      }));
      setPaying(false);
      setPaymentModalOpen(false);
      toast.success("Fees paid successfully! Thank you.");
    }, 1500);
  };

  const handleJoinClass = (cls: typeof upcomingClasses[0]) => {
    setActiveClass(cls);
    setClassRoomModalOpen(true);
  };

  const completedCount = assignments.filter((a) => a.status === "Submitted" || a.status === "Graded").length;
  const totalCount = assignments.length;
  const assignmentsPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-6xl relative pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--brand-dark)] to-[var(--brand-mid)] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-white/5">
        {/* Background visual accents */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[var(--brand-green)]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-[10px] font-bold tracking-widest px-3 py-1 bg-white/10 text-[var(--brand-light)] border border-white/10 rounded-full uppercase">
              Student Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-heading mt-3">
              Hello, {studentInfo.name}! 👋
            </h1>
            <p className="text-white/70 text-sm mt-1.5 max-w-xl">
              You are currently enrolled in **{studentInfo.courseType}** for **{studentInfo.grade}**. Keep up the excellent work!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-shrink-0 text-xs">
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">Admission ID</p>
              <p className="text-white font-bold text-sm mt-0.5">{studentInfo.id}</p>
            </div>
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">Lead Tutor</p>
              <p className="text-white font-bold text-sm mt-0.5 truncate">{studentInfo.coordinator}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <StudentStatsGrid
        attendanceRate={initialAttendance.rate}
        presentCount={initialAttendance.present}
        scheduledCount={initialAttendance.scheduled}
        assignmentsPercent={assignmentsPercent}
        completedAssignments={completedCount}
        totalAssignments={totalCount}
        averageScore={scoreOverview.average}
        rankInClass={scoreOverview.rankInClass}
        dueAmount={fees.dueAmount}
        dueDate={fees.dueDate}
        onPayClick={() => setPaymentModalOpen(true)}
      />

      {/* Main Widgets layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Assignments */}
        <div className="lg:col-span-2 space-y-8">
          <StudentProgressReportWidget progressList={subjectProgress} />
          
          <StudentAssignmentsWidget
            assignments={assignments}
            onSubmitFile={handleAssignmentSubmit}
          />
        </div>

        {/* Right Column: Attendance Ring, Upcoming Live Classes & Billing history */}
        <div className="space-y-8">
          <StudentAttendanceWidget
            rate={initialAttendance.rate}
            scheduled={initialAttendance.scheduled}
            present={initialAttendance.present}
            absent={initialAttendance.absent}
            excused={initialAttendance.excused}
            history={initialAttendance.history}
          />

          <StudentUpcomingClassesWidget
            classes={upcomingClasses}
            onJoinClass={handleJoinClass}
          />

          <StudentBillingWidget invoices={fees.invoices} />
        </div>
      </div>

      {/* Payment simulated Modal */}
      {paymentModalOpen && (
        <StudentPaymentModal
          dueAmount={fees.dueAmount}
          dueDate={fees.dueDate}
          onClose={() => setPaymentModalOpen(false)}
          onSubmit={handleFeePaymentSubmit}
          paying={paying}
        />
      )}

      {/* Classroom join modal */}
      {classRoomModalOpen && activeClass && (
        <StudentClassroomModal
          activeClass={activeClass}
          onClose={() => setClassRoomModalOpen(false)}
        />
      )}
    </div>
  );
}
