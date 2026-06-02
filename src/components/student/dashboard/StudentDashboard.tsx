"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

import { useQueries } from "@tanstack/react-query";
import {
  useGetStudentDashboard,
  useGetStudentFees,
  useGetStudentAssignments
} from "@/querys/student/studentQuery";
import { getStudentAssignmentStatus } from "@/services/student/student";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Modals state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [classRoomModalOpen, setClassRoomModalOpen] = useState(false);
  const [activeClass, setActiveClass] = useState<any>(null);

  // Payment simulated state
  const [paying, setPaying] = useState(false);
  const [paidFeeIds, setPaidFeeIds] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("knowlix_paid_fee_ids");
      if (stored) {
        try {
          setPaidFeeIds(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [paymentModalOpen]);

  // Live queries from backend
  const { data: dashboardData, isLoading: isLoadingDashboard, refetch: refetchDashboard } = useGetStudentDashboard();
  const { data: feesList = [], refetch: refetchFees } = useGetStudentFees();
  const { data: dashboardAssignments = [] } = useGetStudentAssignments();

  // parallel status query for dashboard assignments
  const dashboardStatusQueries = useQueries({
    queries: (dashboardAssignments || []).slice(0, 5).map((asg) => ({
      queryKey: ["student-assignment-status", asg.id],
      queryFn: () => getStudentAssignmentStatus(asg.id),
      enabled: !!asg.id,
    })),
  });

  const studentName = user?.studentName || "Rahul Sharma";
  const studentId = user?.admissionNumber || user?.id || "KNX-2026-001";
  const leadTutor = user?.coordinatorName || "Dr. Ramesh Prasad";
  const classGrade = user?.class || "Grade 10";
  const courseType = user?.programName || "Online School";

  // Loading Skeleton
  if (isLoadingDashboard) {
    return (
      <div className="space-y-8 max-w-6xl relative pb-10 animate-pulse">
        {/* Welcome Banner Skeleton */}
        <div className="bg-slate-100 h-40 rounded-2xl p-8 border border-slate-200" />
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 h-28 rounded-2xl border border-slate-200" />
          ))}
        </div>
        {/* Main layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-100 h-80 rounded-2xl border border-slate-200" />
            <div className="bg-slate-100 h-80 rounded-2xl border border-slate-200" />
          </div>
          <div className="space-y-8">
            <div className="bg-slate-100 h-80 rounded-2xl border border-slate-200" />
            <div className="bg-slate-100 h-80 rounded-2xl border border-slate-200" />
            <div className="bg-slate-100 h-80 rounded-2xl border border-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // 1. Attendance overview calculations
  const totalClasses = dashboardData?.attendance?.total || 0;
  const presentCount = dashboardData?.attendance?.present || 0;
  const absentCount = Math.max(0, totalClasses - presentCount);
  const attendanceRate = Math.round(dashboardData?.attendance?.percentage || 0);

  // Generate logs for history table dynamically matching the counts
  const generatedHistory: any[] = [];
  const subjects = ["Mathematics", "Physics", "Chemistry", "English Literature", "Computer Science"];
  for (let i = 0; i < Math.min(totalClasses, 5); i++) {
    const d = new Date();
    d.setDate(d.getDate() - i * 2 - 1);
    const dateStr = d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    
    let status = "Present";
    if (i < absentCount) {
      status = "Absent";
    }
    generatedHistory.push({
      date: dateStr,
      subject: subjects[i % subjects.length],
      status: status
    });
  }

  // 2. Assignments
  const completedAssignments = dashboardData?.assignments?.completed || 0;
  const totalAssignments = dashboardData?.assignments?.total || 0;
  const assignmentsPercent = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100) 
    : 0;

  // 3. Average Score
  const averageScore = Math.round((dashboardData?.averageScore || 0) * 10) / 10;

  // Filter out any upcoming fees that have been paid simulated locally
  const unpaidUpcomingFees = (dashboardData?.upcomingFees || [])
    .filter((f): f is NonNullable<typeof f> => !!f && !paidFeeIds.includes(f.id));

  // 4. Fees Outstandings from dashboard data
  const dueAmount = unpaidUpcomingFees.reduce((sum, f) => sum + (f?.amount || 0), 0) || 0;
  const earliestFee = unpaidUpcomingFees[0];
  const dueDate = earliestFee?.dueDate
    ? new Date(earliestFee.dueDate).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "N/A";

  // Paid invoices list from feesList
  const paidInvoices = (feesList || [])
    .filter((fee): fee is NonNullable<typeof fee> => !!fee)
    .map((fee) => {
      const isLocallyPaid = paidFeeIds.includes(fee.id);
      const status = isLocallyPaid ? "paid" : fee.status;
      const paidAt = isLocallyPaid ? (fee.paidAt || new Date().toISOString()) : fee.paidAt;

      return {
        id: fee.transactionId || fee.id || "INV-MOCK",
        month: fee.month || "N/A",
        amount: fee.amount || 0,
        status: status === "paid" ? "Paid" : (status || "pending"),
        paidOn: paidAt
          ? new Date(paidAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })
          : "N/A",
      };
    })
    .filter((inv) => inv.status === "Paid");

  // 5. Subject-wise Progress
  const getLetterGrade = (score: number) => {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const subjectProgress = (dashboardData?.subjectProgress || []).map((sp) => ({
    subject: sp.subject,
    progress: Math.round(sp.averageScore),
    grade: getLetterGrade(sp.averageScore),
    tutor: leadTutor
  }));

  // 6. Upcoming Classes mapping
  const mappedUpcomingClasses = (dashboardData?.upcomingClasses || [])
    .filter((session): session is NonNullable<typeof session> => !!session && !!session.scheduledAt)
    .map((session: any) => {
      const scheduledDate = new Date(session.scheduledAt);
      const dateStr = scheduledDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const isToday = scheduledDate.toDateString() === new Date().toDateString();
      
      const startHours = scheduledDate.getHours().toString().padStart(2, "0");
      const startMins = scheduledDate.getMinutes().toString().padStart(2, "0");
      const endHours = new Date(scheduledDate.getTime() + (session.durationMinutes || 60) * 60000).getHours().toString().padStart(2, "0");
      const endMins = new Date(scheduledDate.getTime() + (session.durationMinutes || 60) * 60000).getMinutes().toString().padStart(2, "0");
      const timeStr = `${startHours}:${startMins} - ${endHours}:${endMins}`;

      return {
        id: session.id,
        date: isToday ? "Today" : dateStr,
        time: timeStr,
        subject: session.subject,
        topic: session.tutorRemarks || "Core Concepts Review",
        tutor: session.tutorName || leadTutor,
        status: isToday ? "Active" : "Scheduled",
      };
    });

  const handleAssignmentSubmitRedirect = () => {
    router.push("/student/assignments");
  };

  const handleFeePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    
    // Simulate payment call success and refresh fees list
    setTimeout(() => {
      setPaying(false);
      setPaymentModalOpen(false);
      toast.success("Fees paid successfully! Thank you.");

      // Save paid fee IDs in localStorage to persist paid state across panels
      const currentPendingIds = (dashboardData?.upcomingFees || [])
        .filter((f): f is NonNullable<typeof f> => !!f)
        .map((f) => f.id);

      const stored = localStorage.getItem("knowlix_paid_fee_ids");
      let paidIds: string[] = [];
      if (stored) {
        try {
          paidIds = JSON.parse(stored);
        } catch (error) {
          console.error("Failed to parse paid IDs from localStorage", error);
        }
      }
      const newPaidIds = Array.from(new Set([...paidIds, ...currentPendingIds]));
      localStorage.setItem("knowlix_paid_fee_ids", JSON.stringify(newPaidIds));

      refetchDashboard();
      refetchFees();
    }, 1500);
  };

  const handleJoinClass = (cls: any) => {
    setActiveClass(cls);
    setClassRoomModalOpen(true);
  };

  const mappedAssignments = (dashboardAssignments || [])
    .filter((asg): asg is NonNullable<typeof asg> => !!asg)
    .slice(0, 5)
    .map((asg, idx) => {
      const query = dashboardStatusQueries[idx];
      let status = "Pending";
      let grade = "-";

      if (query && query.data) {
        const { submission, evaluation } = query.data;
        if (evaluation) {
          status = "Graded";
          grade = `${evaluation.marksObtained}/${asg.maxMarks || 100}`;
        } else if (submission) {
          status = "Submitted";
        }
      } else {
        if (asg.status === "evaluated") {
          status = "Graded";
        } else if (asg.status === "submitted") {
          status = "Submitted";
        }
      }

      return {
        id: asg.id,
        title: asg.title,
        subject: asg.subject,
        dueDate: asg.dueDate
          ? new Date(asg.dueDate).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })
          : "N/A",
        status,
        grade
      };
    });

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
              Hello, {studentName}! 👋
            </h1>
            <p className="text-white/70 text-sm mt-1.5 max-w-xl">
              You are currently enrolled in **{courseType}** for **{classGrade}**. Keep up the excellent work!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-shrink-0 text-xs">
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">Admission ID</p>
              <p className="text-white font-bold text-sm mt-0.5">{studentId}</p>
            </div>
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">Lead Tutor</p>
              <p className="text-white font-bold text-sm mt-0.5 truncate">{leadTutor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <StudentStatsGrid
        attendanceRate={attendanceRate}
        presentCount={presentCount}
        scheduledCount={totalClasses}
        assignmentsPercent={assignmentsPercent}
        completedAssignments={completedAssignments}
        totalAssignments={totalAssignments}
        averageScore={averageScore}
        rankInClass={1}
        dueAmount={dueAmount}
        dueDate={dueDate}
        onPayClick={() => setPaymentModalOpen(true)}
      />

      {/* Main Widgets layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Assignments */}
        <div className="lg:col-span-2 space-y-8">
          <StudentProgressReportWidget progressList={subjectProgress} />
          
          <StudentAssignmentsWidget
            assignments={mappedAssignments}
            onSubmitFile={handleAssignmentSubmitRedirect}
          />
        </div>

        {/* Right Column: Attendance Ring, Upcoming Live Classes & Billing history */}
        <div className="space-y-8">
          <StudentAttendanceWidget
            rate={attendanceRate}
            scheduled={totalClasses}
            present={presentCount}
            absent={absentCount}
            excused={0}
            history={generatedHistory}
          />

          <StudentUpcomingClassesWidget
            classes={mappedUpcomingClasses}
            onJoinClass={handleJoinClass}
          />

          <StudentBillingWidget invoices={paidInvoices} />
        </div>
      </div>

      {/* Payment simulated Modal */}
      {paymentModalOpen && (
        <StudentPaymentModal
          dueAmount={dueAmount}
          dueDate={dueDate}
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

