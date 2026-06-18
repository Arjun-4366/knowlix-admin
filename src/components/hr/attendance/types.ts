export type AttendanceStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Present"
  | "Late"
  | "Remote"
  | "On Leave"
  | "Absent";

export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export type LeaveType =
  | "Casual Leave"
  | "Sick Leave"
  | "Earned Leave"
  | "Comp Off";

export type HolidayType = "National" | "Company" | "Optional";

export type ShiftMode = "Onsite" | "Hybrid" | "Remote";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  shiftId: string;
  checkIn?: string;
  checkOut?: string;
  hoursWorked: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  requestedOn: string;
  status: LeaveStatus;
  coverageNote: string;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  type: HolidayType;
  appliesTo: string;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  weeklyHours: number;
  mode: ShiftMode;
  graceMinutes: number;
  description: string;
}

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  shiftId: string;
  weeklyHours: number;
  workMode: ShiftMode;
  weekOff: string;
}

export interface WorkPolicy {
  id: string;
  label: string;
  value: string;
  note: string;
}

export interface EnrichedAttendanceRecord extends AttendanceRecord {
  employeeName: string;
  employeeEmail?: string;
  department: string;
  designation: string;
  shiftName: string;
}

export interface EnrichedLeaveRequest extends LeaveRequest {
  employeeName: string;
  department: string;
  designation: string;
}

export interface EnrichedShiftAssignment extends ShiftAssignment {
  employeeName: string;
  department: string;
  designation: string;
  shiftName: string;
}
