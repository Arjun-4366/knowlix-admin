"use client";

import { Calendar1, Clock3, MapPinned } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AttendanceStatus, EnrichedAttendanceRecord } from "./types";

interface DailyAttendanceTrackerProps {
  selectedDate: string;
  onDateChange: (value: string) => void;
  records: EnrichedAttendanceRecord[];
  onStatusChange: (recordId: string, status: AttendanceStatus) => void;
}

const statusOptions: AttendanceStatus[] = [
  "Present",
  "Late",
  "Remote",
  "On Leave",
  "Absent",
];

const statusClassMap: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Late: "bg-amber-50 text-amber-700 border-amber-200",
  Remote: "bg-sky-50 text-sky-700 border-sky-200",
  "On Leave": "bg-violet-50 text-violet-700 border-violet-200",
  Absent: "bg-rose-50 text-rose-700 border-rose-200",
};

function renderTime(value?: string) {
  return value || "--";
}

export default function DailyAttendanceTracker({
  selectedDate,
  onDateChange,
  records,
  onStatusChange,
}: DailyAttendanceTrackerProps) {
  const lateCount = records.filter((record) => record.status === "Late").length;
  const remoteCount = records.filter((record) => record.status === "Remote").length;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-850">Daily Attendance Tracking</h2>
          <p className="text-xs text-slate-500 mt-1">
            Mark presence, flag late check-ins, and monitor work-hour completion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full bg-slate-50 text-slate-600 border-slate-200 text-[10px] px-2.5 py-1"
          >
            {records.length} tracked
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full bg-amber-50 text-amber-700 border-amber-200 text-[10px] px-2.5 py-1"
          >
            {lateCount} late
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full bg-sky-50 text-sky-700 border-sky-200 text-[10px] px-2.5 py-1"
          >
            {remoteCount} remote
          </Badge>
          <div className="relative">
            <Calendar1 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-10 pl-9 w-[170px] bg-white border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      <div className="p-2">
        <Table>
          <TableHeader className="bg-slate-50/70">
            <TableRow className="border-slate-100 hover:bg-slate-50/70">
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Employee
              </TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Shift
              </TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Check In
              </TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Check Out
              </TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Hours
              </TableHead>
              <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id} className="border-slate-100 hover:bg-slate-50/60">
                  <TableCell className="px-4 py-3 align-top whitespace-normal">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">{record.employeeName}</p>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {record.designation}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                        <MapPinned className="w-3 h-3" />
                        {record.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 align-top whitespace-normal">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-700">{record.shiftName}</p>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        {record.notes || "Standard schedule follow-through."}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                    {renderTime(record.checkIn)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                    {renderTime(record.checkOut)}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                      {record.hoursWorked > 0 ? `${record.hoursWorked.toFixed(1)}h` : "--"}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border text-[10px] font-bold px-2 py-1",
                          statusClassMap[record.status]
                        )}
                      >
                        {record.status}
                      </Badge>
                      <Select
                        value={record.status}
                        onValueChange={(value) =>
                          onStatusChange(record.id, value as AttendanceStatus)
                        }
                      >
                        <SelectTrigger className="h-8 w-[132px] rounded-lg border-slate-200 bg-white text-[10px] font-semibold text-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              className="text-[10px] font-semibold"
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-slate-100 hover:bg-white">
                <TableCell
                  colSpan={6}
                  className="px-4 py-16 text-center text-sm text-slate-500 whitespace-normal"
                >
                  No attendance records are mapped for this day yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
