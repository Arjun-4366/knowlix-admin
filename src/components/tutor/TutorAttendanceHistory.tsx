"use client";

import { useState } from "react";
import { Search, Eye, Trash2, Calendar, FileSpreadsheet, X, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useConfirmation } from "@/context/ConfirmationContext";
import { AttendanceLog } from "./TutorAttendanceStats";
import { toast } from "react-hot-toast";

interface TutorAttendanceHistoryProps {
  logs: AttendanceLog[];
  onDeleteLog: (id: string) => void;
}

export default function TutorAttendanceHistory({ logs, onDeleteLog }: TutorAttendanceHistoryProps) {
  const { confirm } = useConfirmation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.sessionName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSession = sessionFilter === "All" || log.sessionId === sessionFilter;
    const matchesDate = !dateFilter || log.date === dateFilter;

    return matchesSearch && matchesSession && matchesDate;
  });

  const getBreakdown = (log: AttendanceLog) => {
    let p = 0, a = 0, l = 0;
    log.records.forEach((r) => {
      if (r.status === "Present") p++;
      else if (r.status === "Absent") a++;
      else if (r.status === "Late") l++;
    });
    return { present: p, absent: a, late: l };
  };

  const getStatusBadge = (status: "Present" | "Absent" | "Late") => {
    switch (status) {
      case "Present":
        return (
          <Badge variant="outline" className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Present
          </Badge>
        );
      case "Late":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Late
          </Badge>
        );
      case "Absent":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-250 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Absent
          </Badge>
        );
    }
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: "Delete Attendance Log",
      message: `Are you sure you want to delete the attendance log for ${name}? This action cannot be undone.`,
      confirmText: "Delete Log",
      variant: "danger",
      onConfirm: async () => {
        onDeleteLog(id);
        toast.success("Attendance log successfully deleted.");
      },
    });
  };

  // Get distinct session names in logs for filtering dropdown
  const uniqueSessions = Array.from(new Set(logs.map((l) => JSON.stringify({ id: l.sessionId, name: l.sessionName })))).map(
    (s) => JSON.parse(s) as { id: string; name: string }
  );

  return (
    <div className="space-y-4">
      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <Input
            type="text"
            placeholder="Search class or session name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-10 bg-white border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-xs font-semibold w-[160px]"
            />
          </div>

          {/* Session Dropdown Filter */}
          <Select value={sessionFilter} onValueChange={setSessionFilter}>
            <SelectTrigger className="h-10 text-xs font-semibold bg-white border-slate-200 rounded-xl w-[200px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All" className="text-xs font-semibold">All Classes</SelectItem>
              {uniqueSessions.map((sess) => (
                <SelectItem key={sess.id} value={sess.id} className="text-xs font-semibold">
                  {sess.name.length > 25 ? `${sess.name.substring(0, 25)}...` : sess.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filter Button */}
          {(dateFilter || sessionFilter !== "All" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDateFilter("");
                setSessionFilter("All");
                setSearchQuery("");
              }}
              className="h-10 text-xs font-semibold hover:bg-slate-100 rounded-xl px-3 cursor-pointer"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* ── History Table ── */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">
                Date & Time
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">
                Class / Session Name
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[30%]">
                Attendance Breakdown
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[17%]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const { present, absent, late } = getBreakdown(log);
                const total = present + absent + late;
                const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

                return (
                  <TableRow key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Date and Time */}
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800 leading-none">
                        {new Date(log.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        {log.time}
                      </span>
                    </TableCell>

                    {/* Session Name */}
                    <TableCell className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700 leading-none truncate">
                        {log.sessionName}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        Logged by {log.tutorName}
                      </span>
                    </TableCell>

                    {/* Breakdown Badges */}
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-[var(--brand-green)] bg-[var(--brand-light-green)]/40 px-2 py-0.5 rounded-md border border-[var(--brand-light)]/20">
                          {present} P
                        </span>
                        {late > 0 && (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {late} L
                          </span>
                        )}
                        <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                          {absent} A
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 ml-1">
                          ({pct}% Rate)
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-6 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setSelectedLog(log)}
                          title="View Log Details"
                          className="rounded-lg text-slate-450 hover:text-[var(--brand-green)] hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(log.id, log.sessionName)}
                          title="Delete Log"
                          className="rounded-lg text-slate-450 hover:text-red-650 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="px-6 py-12 text-center text-slate-450 text-sm">
                  No attendance records found matching filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Custom Modal: Log Details ── */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100 animate-scale-up">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold text-[var(--brand-green)] uppercase tracking-wider bg-[var(--brand-light-green)] px-2 py-0.5 rounded-full">
                  Attendance Details
                </span>
                <h3 className="text-base font-bold text-slate-800 mt-2 font-heading">
                  {selectedLog.sessionName}
                </h3>
                <p className="text-xs text-slate-450 font-semibold mt-1">
                  Logged on {new Date(selectedLog.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })} at {selectedLog.time}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-150 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Student Details</span>
                <span>Status & Comments</span>
              </div>

              <div className="divide-y divide-slate-100">
                {selectedLog.records.map((record) => (
                  <div key={record.studentId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs border border-[var(--brand-light)]/20 shadow-sm flex-shrink-0">
                        {record.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{record.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ID: {record.studentId}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1.5">
                      {getStatusBadge(record.status)}
                      {record.remark && (
                        <p className="text-[11px] font-semibold text-slate-500 italic bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150/60 mt-0.5 max-w-xs text-left sm:text-right">
                          "{record.remark}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/20 flex justify-end">
              <Button
                onClick={() => setSelectedLog(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2 rounded-xl cursor-pointer"
              >
                Close View
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
