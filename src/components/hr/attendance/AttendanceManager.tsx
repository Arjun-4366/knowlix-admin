"use client";

import { useState, useSyncExternalStore } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import {
  DEFAULT_ATTENDANCE_DATE,
  holidayCalendar,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialShiftAssignments,
  shiftTemplates,
  workPolicies,
} from "./attendanceData";
import AttendanceOverview from "./AttendanceOverview";
import DailyAttendanceTracker from "./DailyAttendanceTracker";
import HolidayCalendar from "./HolidayCalendar";
import LeaveRequestBoard from "./LeaveRequestBoard";
import ShiftManagementPanel from "./ShiftManagementPanel";
import {
  AttendanceStatus,
  EnrichedAttendanceRecord,
  EnrichedLeaveRequest,
  EnrichedShiftAssignment,
  LeaveStatus,
} from "./types";
import {
  getEmployeesServerSnapshot,
  loadEmployees,
  subscribeToEmployees,
} from "../employees/employeeData";

function resolveShiftName(shiftId: string) {
  return (
    shiftTemplates.find((shift) => shift.id === shiftId)?.name || "Unassigned Shift"
  );
}

export default function AttendanceManager() {
  const employees = useSyncExternalStore(
    subscribeToEmployees,
    loadEmployees,
    getEmployeesServerSnapshot
  );
  const [selectedDate, setSelectedDate] = useState(DEFAULT_ATTENDANCE_DATE);
  const [attendanceRecords, setAttendanceRecords] =
    useState(initialAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const effectiveSelectedDate = selectedDate || DEFAULT_ATTENDANCE_DATE;

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status === "Active" || employee.status === "On Probation"
  );
  const employeeLookup = new Map(
    activeEmployees.map((employee) => [employee.id, employee])
  );

  const attendanceView: EnrichedAttendanceRecord[] = attendanceRecords
    .filter((record) => employeeLookup.has(record.employeeId))
    .map((record) => {
      const employee = employeeLookup.get(record.employeeId);

      return {
        ...record,
        employeeName: employee?.name || "Unknown Employee",
        department: employee?.department || "Unmapped",
        designation: employee?.designation || "Profile missing",
        shiftName: resolveShiftName(record.shiftId),
      };
    });

  const leaveView: EnrichedLeaveRequest[] = leaveRequests
    .filter((request) => employeeLookup.has(request.employeeId))
    .map((request) => {
      const employee = employeeLookup.get(request.employeeId);

      return {
        ...request,
        employeeName: employee?.name || "Unknown Employee",
        department: employee?.department || "Unmapped",
        designation: employee?.designation || "Profile missing",
      };
    });

  const assignmentView: EnrichedShiftAssignment[] = initialShiftAssignments
    .filter((assignment) => employeeLookup.has(assignment.employeeId))
    .map((assignment) => {
      const employee = employeeLookup.get(assignment.employeeId);

      return {
        ...assignment,
        employeeName: employee?.name || "Unknown Employee",
        department: employee?.department || "Unmapped",
        designation: employee?.designation || "Profile missing",
        shiftName: resolveShiftName(assignment.shiftId),
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
  const pendingLeaveCount = leaveView.filter(
    (request) => request.status === "Pending"
  ).length;
  const approvedLeaveCount = leaveView.filter(
    (request) => request.status === "Approved"
  ).length;
  const leaveStartingSoonCount = leaveView.filter(
    (request) =>
      request.status === "Pending" &&
      differenceInCalendarDays(
        parseISO(request.startDate),
        parseISO(effectiveSelectedDate)
      ) >= 0 &&
      differenceInCalendarDays(
        parseISO(request.startDate),
        parseISO(effectiveSelectedDate)
      ) <= 7
  ).length;
  const upcomingHolidays = holidayCalendar.filter(
    (holiday) =>
      differenceInCalendarDays(
        parseISO(holiday.date),
        parseISO(effectiveSelectedDate)
      ) >= 0 &&
      differenceInCalendarDays(
        parseISO(holiday.date),
        parseISO(effectiveSelectedDate)
      ) <= 90
  );
  const nextHoliday = upcomingHolidays[0];
  const staffedHours = assignmentView.reduce(
    (total, assignment) => total + assignment.weeklyHours,
    0
  );
  const onsiteAssignmentCount = assignmentView.filter(
    (assignment) => assignment.workMode === "Onsite"
  ).length;
  const departments = Array.from(
    new Set(activeEmployees.map((employee) => employee.department))
  );
  const filteredAssignments = assignmentView.filter((assignment) =>
    selectedDepartment === "all"
      ? true
      : assignment.department === selectedDepartment
  );

  const handleAttendanceStatusChange = (
    recordId: string,
    status: AttendanceStatus
  ) => {
    setAttendanceRecords((currentRecords) =>
      currentRecords.map((record) => {
        if (record.id !== recordId) {
          return record;
        }

        if (status === "On Leave" || status === "Absent") {
          return {
            ...record,
            status,
            checkIn: undefined,
            checkOut: undefined,
            hoursWorked: 0,
          };
        }

        return {
          ...record,
          status,
        };
      })
    );
  };

  const handleLeaveStatusChange = (requestId: string, status: LeaveStatus) => {
    setLeaveRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );
  };

  const handleDateChange = (value: string) => {
    setSelectedDate(value || DEFAULT_ATTENDANCE_DATE);
  };

  if (activeEmployees.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader
          title="Attendance & Leave Management"
          description="Daily attendance tracking, leave approvals, holiday planning, and shift governance."
        />

        <Card className="rounded-2xl border-slate-150 p-8 text-center bg-white shadow-sm space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            No active employees are available for attendance tracking yet.
          </p>
          <p className="text-xs text-slate-500">
            Add or reactivate employees in the directory to populate this section.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader
        title="Attendance & Leave Management"
        description={`Operational snapshot for ${format(
          parseISO(effectiveSelectedDate),
          "dd MMM yyyy"
        )}: daily attendance, leave flow, holiday visibility, and shift control.`}
      />

      <AttendanceOverview
        checkedInCount={checkedInCount}
        totalTracked={attendanceForDay.length}
        remoteCount={remoteCount}
        lateCount={lateCount}
        pendingLeaveCount={pendingLeaveCount}
        approvedLeaveCount={approvedLeaveCount}
        leaveStartingSoonCount={leaveStartingSoonCount}
        upcomingHolidayCount={upcomingHolidays.length}
        nextHolidayLabel={
          nextHoliday
            ? `${nextHoliday.name} (${format(parseISO(nextHoliday.date), "dd MMM")})`
            : "No holiday scheduled"
        }
        activeShiftCount={shiftTemplates.length}
        staffedHours={staffedHours}
        onsiteAssignmentCount={onsiteAssignmentCount}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-6">
        <DailyAttendanceTracker
          selectedDate={effectiveSelectedDate}
          onDateChange={handleDateChange}
          records={attendanceForDay}
          onStatusChange={handleAttendanceStatusChange}
        />
        <LeaveRequestBoard
          requests={leaveView}
          onStatusChange={handleLeaveStatusChange}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.95fr_1.55fr] gap-6">
        <HolidayCalendar
          holidays={upcomingHolidays}
          referenceDate={effectiveSelectedDate}
        />
        <ShiftManagementPanel
          shifts={shiftTemplates}
          assignments={filteredAssignments}
          policies={workPolicies}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          departments={departments}
        />
      </div>
    </div>
  );
}
