"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Subcomponents
import StudentStatsGrid from "./StudentStatsGrid";
import StudentAttendanceWidget from "./StudentAttendanceWidget";
import StudentAssignmentsWidget from "./StudentAssignmentsWidget";
import StudentProgressReportWidget from "./StudentProgressReportWidget";
import StudentUpcomingClassesWidget from "./StudentUpcomingClassesWidget";
import StudentBillingWidget from "./StudentBillingWidget";

import { useQueries } from "@tanstack/react-query";
import {
  useGetStudentDashboard,
  useGetStudentFees,
  useGetStudentAssignments,
} from "@/querys/student/studentQuery";
import { getStudentAssignmentStatus } from "@/services/student/student";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);


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

  // Live queries from backend
  const { data: dashboardData, isLoading: isLoadingDashboard } =
    useGetStudentDashboard();
  const { data: feesSummary } = useGetStudentFees();
  const { data: assignmentsRes } = useGetStudentAssignments({ limit: 5 });
  const dashboardAssignments = assignmentsRes?.data ?? [];

  // parallel status query for dashboard assignments
  const dashboardStatusQueries = useQueries({
    queries: (dashboardAssignments || []).slice(0, 5).map((asg) => ({
      queryKey: ["student-assignment-status", asg.id],
      queryFn: () => getStudentAssignmentStatus(asg.id),
      enabled: !!asg.id,
    })),
  });

  const studentName = user?.studentName || "";
  const studentId = user?.admissionNumber || user?.id || "";
  const coordinatorName = user?.coordinatorName || "";
  const classGrade = user?.class || "";
  const courseType = user?.programName || "";

  // Loading Skeleton
  if (isLoadingDashboard) {
    return (
      <div className="space-y-6 max-w-8xl relative pb-10 animate-pulse">
        {/* Welcome Banner Skeleton */}
        <div className="bg-slate-100 h-40 rounded-2xl p-8 border border-slate-200" />
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-slate-100 h-28 rounded-2xl border border-slate-200"
            />
          ))}
        </div>
        {/* Priority row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-100 h-64 rounded-2xl border border-slate-200" />
          <div className="bg-slate-100 h-64 rounded-2xl border border-slate-200" />
        </div>
        {/* Content row skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-100 h-52 rounded-2xl border border-slate-200" />
            <div className="bg-slate-100 h-52 rounded-2xl border border-slate-200" />
          </div>
          <div className="bg-slate-100 h-[26rem] rounded-2xl border border-slate-200" />
        </div>
      </div>
    );
  }

  // 1. Attendance overview calculations
  const totalClasses = dashboardData?.attendance?.total || 0;
  const presentCount = dashboardData?.attendance?.present || 0;
  const absentCount =
    dashboardData?.attendance?.absent ??
    Math.max(0, totalClasses - presentCount);
  const attendanceRate = Math.round(dashboardData?.attendance?.percentage || 0);

  const attendanceHistory = (dashboardData?.attendance?.classes || []).map(
    (cls) => ({
      date: new Date(cls.date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      subject: cls.subject,
      status: cls.status.charAt(0).toUpperCase() + cls.status.slice(1),
    }),
  );

  // 2. Assignments
  const completedAssignments = dashboardData?.assignments?.completed || 0;
  const pendingAssignments = dashboardData?.assignments?.pending || 0;
  const totalAssignments = dashboardData?.assignments?.total || 0;
  const assignmentsPercent =
    totalAssignments > 0
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;

  // 3. Average Score
  const averageScore = Math.round((dashboardData?.averageScore || 0) * 10) / 10;

  // 4. Fees Outstanding from dashboard data
  const dueAmount = dashboardData?.feesDue || 0;

  const feesSummaryData = {
    totalFee: feesSummary?.totalFee || 0,
    paidAmount: feesSummary?.paidAmount || 0,
    dueAmount: feesSummary?.dueAmount || dueAmount,
  };

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
  }));

  // 6. Upcoming Classes mapping
  const mappedUpcomingClasses = (dashboardData?.upcomingClasses || [])
    .filter(
      (session): session is NonNullable<typeof session> =>
        !!session && !!session.scheduledAt,
    )
    .map((session) => {
      const scheduledDate = new Date(session.scheduledAt);
      const dateStr = scheduledDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const isToday =
        scheduledDate.toDateString() === new Date().toDateString();

      const endDate = new Date(
        scheduledDate.getTime() + (session.durationMinutes || 60) * 60000,
      );
      const now = new Date();
      // "Active" is a derived UI state, not a stored status: only a
      // still-"scheduled" session whose time window includes now is live.
      const isLive =
        session.status === "scheduled" && now >= scheduledDate && now <= endDate;
      const statusLabel =
        session.status === "completed"
          ? "Completed"
          : session.status === "not_conducted"
          ? "Not Conducted"
          : isLive
          ? "Active"
          : "Scheduled";

      const startHours = scheduledDate.getHours().toString().padStart(2, "0");
      const startMins = scheduledDate.getMinutes().toString().padStart(2, "0");
      const endHours = new Date(
        scheduledDate.getTime() + (session.durationMinutes || 60) * 60000,
      )
        .getHours()
        .toString()
        .padStart(2, "0");
      const endMins = new Date(
        scheduledDate.getTime() + (session.durationMinutes || 60) * 60000,
      )
        .getMinutes()
        .toString()
        .padStart(2, "0");
      const timeStr = `${startHours}:${startMins} - ${endHours}:${endMins}`;

      const tutorRef =
        session.tutorId && typeof session.tutorId === "object"
          ? session.tutorId
          : { id: typeof session.tutorId === "string" ? session.tutorId : "", name: session.tutorName || "" };

      return {
        id: session.id,
        date: isToday ? "Today" : dateStr,
        time: timeStr,
        subject: session.subject || "",
        topic: session.title || "",
        notes: session.notes || "",
        type: session.type,
        durationMinutes: session.durationMinutes,
        tutorId: tutorRef,
        meetLink: session.meetLink,
        status: statusLabel,
      };
    });

  const handleAssignmentSubmitRedirect = () => {
    router.push("/student/assignments");
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
              year: "numeric",
            })
          : "N/A",
        status,
        grade,
      };
    });

  return (
    <div className="space-y-6 max-w-8xl relative pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[var(--brand-dark)] to-[var(--brand-mid)] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-white/5">
        {/* Background visual accents */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[var(--brand-green)]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-[10px] font-bold tracking-widest px-3 py-1 bg-white text-[var(--brand-light)] border border-white/10 rounded-full uppercase">
              Student Portal
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-heading mt-3">
              Hello, {studentName}! 👋
            </h1>
            <p className="text-white/70 text-sm mt-1.5 max-w-xl">
              You are currently enrolled in{" "}
              <span className="text-white font-semibold">{courseType}</span> for{" "}
              <span className="text-white font-semibold">{classGrade}</span>. Keep up the excellent work!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex-shrink-0 text-xs">
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">
                Admission ID
              </p>
              <p className="text-white font-bold text-sm mt-0.5">{studentId}</p>
            </div>
            <div>
              <p className="text-white/45 font-bold uppercase tracking-wider text-[9px]">
                Coordinator
              </p>
              <p className="text-white font-bold text-sm mt-0.5 truncate">
                {coordinatorName}
              </p>
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
        pendingAssignments={pendingAssignments}
        totalAssignments={totalAssignments}
        averageScore={averageScore}
        dueAmount={dueAmount}
      />

      {/* Priority Row: Upcoming Classes + Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentUpcomingClassesWidget classes={mappedUpcomingClasses} />
        </div>
        <div>
          <StudentBillingWidget summary={feesSummaryData} />
        </div>
      </div>

      {/* Content Row: Progress + Assignments (left) | Attendance (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <StudentProgressReportWidget progressList={subjectProgress} />
          <StudentAssignmentsWidget
            assignments={mappedAssignments}
            onSubmitFile={handleAssignmentSubmitRedirect}
          />
        </div>
        <div>
          <StudentAttendanceWidget
            rate={attendanceRate}
            present={presentCount}
            absent={absentCount}
            history={attendanceHistory}
          />
        </div>
      </div>

    </div>
  );
}
