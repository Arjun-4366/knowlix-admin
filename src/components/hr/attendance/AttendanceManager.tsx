"use client";

import { useState } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Loader2 } from "lucide-react";
import { DEFAULT_ATTENDANCE_DATE } from "./attendanceData";
import AttendanceOverview from "./AttendanceOverview";
import DailyAttendanceTracker from "./DailyAttendanceTracker";
import HolidayCalendar from "./HolidayCalendar";
import {
  AttendanceStatus,
  EnrichedAttendanceRecord,
  HolidayItem,
} from "./types";
import { Employee } from "../employees/types";
import {
  useGetHolidays,
  useCreateHoliday,
  useDeleteHoliday,
  useGetHRTutorAttendance,
  useApproveAttendance,
  useGetTutorsHR,
} from "@/querys/admin/hrQuery";
import { IHoliday } from "@/types/admin/hr";

function toHolidayItem(h: IHoliday): HolidayItem {
  return {
    id: h.id,
    name: h.name,
    date: h.date.slice(0, 10),
    type: h.isOptional ? "Optional" : "National",
    appliesTo: h.description || "All teams",
  };
}

const mapTutorToEmployee = (tutor: any): Employee => {
  const tutorId = tutor.id || tutor._id || "";
  let mappedStatus: Employee["status"] = "Active";
  if (tutor.status === "pending") {
    mappedStatus = "On Probation";
  } else if (tutor.status === "rejected") {
    mappedStatus = "Terminated";
  }

  let mappedDept: Employee["department"] = "Tutor";
  let mappedRole = "Tutor";
  if (tutor.role === "mentor_sales_bro") {
    mappedDept = "Sales";
    mappedRole = "Mentor/Sales Rep";
  } else if (tutor.role === "academic_coordinator") {
    mappedDept = "Academics";
    mappedRole = "Academic Coordinator";
  }

  return {
    id: tutorId,
    name: tutor.name || "Unnamed Tutor",
    email: tutor.email || "",
    phone: tutor.phone || "",
    address: tutor.availability || "Online / Remote",
    dob: "1990-01-01",
    emergencyContact: {
      name: "Emergency Contact",
      relationship: "Family",
      phone: tutor.phone || "",
    },
    designation: mappedRole,
    department: mappedDept,
    dateOfJoining: tutor.createdAt ? tutor.createdAt.slice(0, 10) : new Date().toISOString().split("T")[0],
    status: mappedStatus,
    manager: "HR Manager",
    salaryDetails: {
      base: 40000,
      allowance: 10000,
      pf: 4800,
      ctc: 600000,
    },
    documents: [],
    joiningRecords: {
      probationEnd: "",
      joiningNotes: `Experience: ${tutor.experience || "Not specified"}. Availability: ${tutor.availability || "Not specified"}.`,
    },
  };
};

function toAttendanceRecord(r: any): EnrichedAttendanceRecord {
  let dateStr = "";
  if (r.date) {
    dateStr = r.date.slice(0, 10);
  }

  let checkInVal: string | undefined;
  if (r.checkIn) {
    const t = new Date(r.checkIn);
    checkInVal = isNaN(t.getTime()) ? undefined : format(t, "HH:mm");
  }

  let checkOutVal: string | undefined;
  if (r.checkOut) {
    const t = new Date(r.checkOut);
    checkOutVal = isNaN(t.getTime()) ? undefined : format(t, "HH:mm");
  }

  let mappedStatus: AttendanceStatus = "Present";
  if (r.status === "present") mappedStatus = "Present";
  else if (r.status === "absent") mappedStatus = "Absent";
  else if (r.status === "half_day") mappedStatus = "On Leave";
  else if (r.status === "late") mappedStatus = "Late";

  return {
    id: r.id || r._id,
    employeeId: r.employeeId || r.tutorId,
    date: dateStr,
    shiftId: "SHIFT-GEN",
    checkIn: checkInVal,
    checkOut: checkOutVal,
    hoursWorked: r.workHours ?? 0,
    status: mappedStatus,
    notes: r.remarks || "",
    employeeName: "Tutor",
    department: "Tutor",
    designation: "Tutor",
    shiftName: "General",
  };
}

export default function AttendanceManager() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_ATTENDANCE_DATE);

  const { data: tutorsRes, isLoading: tutorsLoading } = useGetTutorsHR();
  const { data: attendanceRes, isLoading: attendanceLoading } = useGetHRTutorAttendance();
  const { data: holidaysRes, isLoading: holidaysLoading } = useGetHolidays();

  const createHolidayMutation = useCreateHoliday();
  const deleteHolidayMutation = useDeleteHoliday();
  const approveAttendanceMutation = useApproveAttendance();

  const employees = tutorsRes?.data ? (tutorsRes.data as any[]).map(mapTutorToEmployee) : [];
  const rawAttendance = attendanceRes?.data ? (attendanceRes.data as any[]).map(toAttendanceRecord) : [];
  const holidays = holidaysRes?.data ? (holidaysRes.data as IHoliday[]).map(toHolidayItem) : [];

  const effectiveSelectedDate = selectedDate || DEFAULT_ATTENDANCE_DATE;

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status === "Active" || employee.status === "On Probation"
  );
  const employeeLookup = new Map(
    activeEmployees.map((employee) => [employee.id, employee])
  );

  const attendanceView: EnrichedAttendanceRecord[] = rawAttendance
    .filter((record) => employeeLookup.has(record.employeeId))
    .map((record) => {
      const employee = employeeLookup.get(record.employeeId);
      return {
        ...record,
        employeeName: employee?.name || "Unknown Employee",
        department: employee?.department || "Unmapped",
        designation: employee?.designation || "Profile missing",
        shiftName: "General",
      };
    });

  const attendanceForDay = attendanceView.filter(
    (record) => record.date === effectiveSelectedDate
  );
  const checkedInCount = attendanceForDay.filter((record) =>
    ["Present", "Late", "Remote"].includes(record.status)
  ).length;
  const remoteCount = attendanceForDay.filter(
    (record) => record.status === "Remote"
  ).length;
  const lateCount = attendanceForDay.filter(
    (record) => record.status === "Late"
  ).length;

  const upcomingHolidays = [...holidays].sort((left, right) =>
    left.date.localeCompare(right.date)
  );
  const nextHoliday = upcomingHolidays.find(
    (holiday) =>
      differenceInCalendarDays(
        parseISO(holiday.date),
        parseISO(effectiveSelectedDate)
      ) >= 0
  );

  const handleAttendanceStatusChange = (
    recordId: string,
    status: AttendanceStatus
  ) => {
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(recordId);
    if (isMongoId) {
      const backendStatus = status === "Absent" ? "rejected" : "approved";
      approveAttendanceMutation.mutate({
        id: recordId,
        data: {
          status: backendStatus,
          remarks: `Status updated to ${status} via HR Attendance Dashboard`,
        },
      });
    } else {
      toast.error("Offline updates are not supported for attendance.");
    }
  };

  const handleDateChange = (value: string) => {
    setSelectedDate(value || DEFAULT_ATTENDANCE_DATE);
  };

  if (tutorsLoading || attendanceLoading) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader
          title="Attendance Management"
          description="Daily attendance tracking and holiday planning."
        />
        <div className="flex h-96 items-center justify-center bg-white rounded-2xl border border-slate-150 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader
        title="Attendance Management"
        description={`Operational snapshot for ${format(
          parseISO(effectiveSelectedDate),
          "dd MMM yyyy"
        )}: daily attendance and holiday visibility.`}
      />

      <AttendanceOverview
        checkedInCount={checkedInCount}
        totalTracked={attendanceForDay.length}
        remoteCount={remoteCount}
        lateCount={lateCount}
        upcomingHolidayCount={upcomingHolidays.length}
        nextHolidayLabel={
          nextHoliday
            ? `${nextHoliday.name} (${format(parseISO(nextHoliday.date), "dd MMM")})`
            : "No holiday scheduled"
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        <DailyAttendanceTracker
          selectedDate={effectiveSelectedDate}
          onDateChange={handleDateChange}
          records={attendanceForDay}
          onStatusChange={handleAttendanceStatusChange}
        />
        <HolidayCalendar
          holidays={upcomingHolidays}
          referenceDate={effectiveSelectedDate}
          loading={holidaysLoading}
          onCreateHoliday={async (data) => {
            await createHolidayMutation.mutateAsync(data);
          }}
          onDeleteHoliday={async (id) => {
            await deleteHolidayMutation.mutateAsync(id);
          }}
        />
      </div>
    </div>
  );
}
