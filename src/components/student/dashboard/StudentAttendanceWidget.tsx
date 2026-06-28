"use client";

import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceLog {
  date: string;
  subject: string;
  status: string;
}

interface StudentAttendanceWidgetProps {
  rate: number;
  present: number;
  absent: number;
  history: AttendanceLog[];
}

export default function StudentAttendanceWidget({
  rate,
  present,
  absent,
  history,
}: StudentAttendanceWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Attendance Overview</h2>
            <p className="text-xs text-slate-600 mt-0.5">Summary of attendance compliance & logs</p>
          </div>
          <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 shadow-none text-[10px]">
            Presence Ratio
          </Badge>
        </div>

        <div className="p-6 flex flex-col sm:flex-row items-center gap-6 border-b border-slate-50">
          {/* Circular progress SVG */}
          <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="var(--brand-green)"
                strokeWidth="3"
                strokeDasharray={`${rate} 100`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black text-slate-800 font-heading">{rate}%</span>
              <span className="text-[9px] font-bold text-slate-600 uppercase">Rate</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 w-full text-center">
            <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] font-bold text-slate-600 uppercase block">Present</span>
              <span className="text-sm font-black text-emerald-600 mt-1 block">{present}</span>
            </div>
            <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] font-bold text-slate-600 uppercase block">Absent</span>
              <span className="text-sm font-black text-red-500 mt-1 block">{absent}</span>
            </div>
          </div>
        </div>

        {/* History table */}
        <div className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-slate-50/20">
              <TableRow>
                <TableHead className="px-5 py-2.5 text-xs font-bold text-slate-600 uppercase tracking-wider w-[40%]">Date</TableHead>
                <TableHead className="px-5 py-2.5 text-xs font-bold text-slate-600 uppercase tracking-wider w-[40%]">Subject</TableHead>
                <TableHead className="px-5 py-2.5 text-xs font-bold text-slate-600 uppercase tracking-wider text-right w-[20%]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {history.map((log, idx) => (
                <TableRow key={idx} className="hover:bg-slate-50/40 transition-colors">
                  <TableCell className="px-5 py-3 text-xs text-slate-600 font-semibold flex items-center gap-1.5 flex-shrink-0 min-w-0">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    {log.date}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-xs font-semibold text-slate-750 truncate">{log.subject}</TableCell>
                  <TableCell className="px-5 py-3 text-right">
                    <Badge
                      className={`text-[9px] font-bold py-0 px-2 border ${
                        log.status === "Present"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : log.status === "Absent"
                          ? "bg-red-50 text-red-700 border-red-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
