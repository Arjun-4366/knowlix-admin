"use client";

import { CheckCircle2, AlertTriangle, CalendarRange, Award } from "lucide-react";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: "present" | "absent" | "late";
  remark?: string;
}

export interface AttendanceLog {
  id: string;
  sessionId: string;
  sessionName: string;
  date: string;
  time: string;
  tutorName: string;
  records: AttendanceRecord[];
  createdAt: string;
}

interface TutorAttendanceStatsProps {
  logs: AttendanceLog[];
}

export default function TutorAttendanceStats({ logs }: TutorAttendanceStatsProps) {
  // Calculations
  const totalLogs = logs.length;

  let totalRecordsCount = 0;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  logs.forEach((log) => {
    log.records.forEach((record) => {
      totalRecordsCount++;
      if (record.status === "present") presentCount++;
      else if (record.status === "absent") absentCount++;
      else if (record.status === "late") lateCount++;
    });
  });

  // Overall attendance rate: (Present + Late*0.5) / Total or just Present / Total.
  // Standard is Present/Total, or sometimes Late counts as present/partial. Let's do (Present + Late) / Total or Present / Total.
  // Let's count Late as present for the rate, or just Present. Present + Late is standard for physical presence, so:
  const presenceCount = presentCount + lateCount;
  const attendanceRate = totalRecordsCount > 0 ? Math.round((presenceCount / totalRecordsCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardStatCard
        label="Attendance Rate"
        value={`${attendanceRate}%`}
        icon={<Award className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Avg Rate"
        footerText="Average presence rate across classes"
      />

      <DashboardStatCard
        label="Sessions Logged"
        value={totalLogs}
        icon={<CalendarRange className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="Total"
        footerText="Total sessions with marked attendance"
      />

      <DashboardStatCard
        label="Present Instances"
        value={presentCount}
        icon={<CheckCircle2 className="w-6 h-6 text-[var(--brand-green)]" />}
        badgeText="On Time"
        footerText="Students marked as present"
      />

      <DashboardStatCard
        label="Late & Absent"
        value={lateCount + absentCount}
        icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
        badgeText={`${absentCount} Absent · ${lateCount} Late`}
        footerText="Need attention or makeup support"
      />
    </div>
  );
}

