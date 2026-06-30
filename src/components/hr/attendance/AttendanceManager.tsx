"use client";

import { useEffect, useState } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Loader2 } from "lucide-react";
import AttendanceOverview from "./AttendanceOverview";
import DailyAttendanceTracker from "./DailyAttendanceTracker";
import HolidayCalendar from "./HolidayCalendar";
import { AttendanceStatus, EnrichedAttendanceRecord, HolidayItem } from "./types";
import {
  useGetHolidays,
  useCreateHoliday,
  useDeleteHoliday,
  useGetHRTutorAttendance,
  useApproveAttendance,
  useApproveBulkAttendance,
  useGetTutorsHR,
} from "@/querys/admin/hrQuery";
import { IHoliday, IHRAttendanceRecord } from "@/types/admin/hr";

const PAGE_LIMIT = 20;

function toHolidayItem(h: IHoliday): HolidayItem {
  return {
    id: h.id,
    name: h.name,
    date: h.date.slice(0, 10),
    type: h.isOptional ? "Optional" : "National",
    appliesTo: h.description || "All teams",
  };
}

function toAttendanceRecord(r: IHRAttendanceRecord): EnrichedAttendanceRecord {
  const dateStr = r.date ? r.date.slice(0, 10) : "";

  let checkInVal: string | undefined;
  if (r.checkIn) {
    const t = new Date(r.checkIn);
    if (!isNaN(t.getTime())) checkInVal = format(t, "HH:mm");
  }

  let checkOutVal: string | undefined;
  if (r.checkOut) {
    const t = new Date(r.checkOut);
    if (!isNaN(t.getTime())) checkOutVal = format(t, "HH:mm");
  }

  let mappedStatus: AttendanceStatus = "Present";
  if (r.status === "pending_approval") mappedStatus = "Pending";
  else if (r.status === "approved")    mappedStatus = "Approved";
  else if (r.status === "rejected")    mappedStatus = "Rejected";
  else if (r.status === "present")     mappedStatus = "Present";
  else if (r.status === "absent")      mappedStatus = "Absent";
  else if (r.status === "half_day")    mappedStatus = "On Leave";
  else if (r.status === "late")        mappedStatus = "Late";

  const tutor = r.tutor;

  return {
    id: r.id,
    employeeId: tutor?.id || r.tutorId,
    date: dateStr,
    shiftId: "SHIFT-GEN",
    checkIn: checkInVal,
    checkOut: checkOutVal,
    hoursWorked: r.workHours ?? 0,
    status: mappedStatus,
    notes: r.remarks || "",
    employeeName: tutor?.name || "Unknown Tutor",
    employeeEmail: tutor?.email || "",
    department: "Tutor",
    designation: "Subject Tutor",
    shiftName: "General",
  };
}

export default function AttendanceManager() {
  const [search, setSearch]             = useState("");
  const [debouncedSearch, setDebounced] = useState("");
  const [tutorId, setTutorId]           = useState("");
  const [from, setFrom]                 = useState("");
  const [to, setTo]                     = useState("");
  const [page, setPage]                 = useState(1);

  // 400ms debounce on search
  useEffect(() => {
    const t = setTimeout(() => { setDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [tutorId, from, to]);

  const queryParams = {
    search:   debouncedSearch || undefined,
    tutorId:  tutorId || undefined,
    from:     from || undefined,
    to:       to || undefined,
    page,
    limit:    PAGE_LIMIT,
  };

  const { data: attendanceRes, isLoading: attendanceLoading } = useGetHRTutorAttendance(queryParams);
  const { data: holidaysRes, isLoading: holidaysLoading }     = useGetHolidays();
  const { data: tutorsRes }                                   = useGetTutorsHR({ limit: 200 });

  const createHolidayMutation     = useCreateHoliday();
  const deleteHolidayMutation     = useDeleteHoliday();
  const approveAttendanceMutation = useApproveAttendance();
  const { mutate: bulkApprove, isPending: isBulkSubmitting } = useApproveBulkAttendance();

  const records: EnrichedAttendanceRecord[] = (attendanceRes?.data ?? []).map(
    (r: any) => toAttendanceRecord(r as IHRAttendanceRecord)
  );
  const total   = attendanceRes?.total ?? 0;
  const summary = attendanceRes?.summary;
  const tutors  = (tutorsRes?.data ?? []).map((t) => ({ id: t.id, name: t.name }));

  const holidays         = (holidaysRes?.data ?? []).map(toHolidayItem);
  const upcomingHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  const todayStr         = new Date().toISOString().split("T")[0];
  const nextHoliday      = upcomingHolidays.find(
    (h) => differenceInCalendarDays(parseISO(h.date), parseISO(todayStr)) >= 0
  );

  const pendingCount  = summary?.pending_approval ?? 0;
  const approvedCount = summary?.approved ?? 0;

  const handleApprove = (id: string) => {
    approveAttendanceMutation.mutate({ id, data: { status: "approved", remarks: "Approved by HR" } });
  };

  const handleReject = (id: string) => {
    approveAttendanceMutation.mutate({ id, data: { status: "rejected", remarks: "Rejected by HR" } });
  };

  const handleBulkApprove = (from: string, to: string, remarks: string) => {
    bulkApprove({ tutorId, from: from || undefined, to: to || undefined, status: "approved", remarks: remarks || undefined });
  };

  if (attendanceLoading && records.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader title="Attendance Management" description="Daily attendance tracking and holiday planning." />
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
        description="Review and approve tutor attendance records. Use filters to narrow by name, date, or range."
      />

      <AttendanceOverview
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        totalCount={total}
        upcomingHolidayCount={upcomingHolidays.length}
        nextHolidayLabel={
          nextHoliday
            ? `${nextHoliday.name} (${format(parseISO(nextHoliday.date), "dd MMM")})`
            : "No holiday scheduled"
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        <DailyAttendanceTracker
          records={records}
          isLoading={attendanceLoading}
          search={search}
          onSearchChange={setSearch}
          tutorId={tutorId}
          onTutorIdChange={setTutorId}
          tutors={tutors}
          from={from}
          onFromChange={setFrom}
          to={to}
          onToChange={setTo}  
          page={page}
          limit={PAGE_LIMIT}
          total={total}
          onPageChange={setPage}
          onApprove={handleApprove}
          onReject={handleReject}
          onBulkApprove={handleBulkApprove}
          isBulkSubmitting={isBulkSubmitting}
        />
        <HolidayCalendar
          holidays={upcomingHolidays}
          referenceDate={todayStr}
          loading={holidaysLoading}
          onCreateHoliday={async (data) => { await createHolidayMutation.mutateAsync(data); }}
          onDeleteHoliday={async (id) => { await deleteHolidayMutation.mutateAsync(id); }}
        />
      </div>
    </div>
  );
}
