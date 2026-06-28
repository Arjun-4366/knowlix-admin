import { useState } from "react";
import { Search, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dummy Today's Sessions Data
const dummySessions = [
  { id: "SES-201", time: "09:00 AM - 10:30 AM", class: "Grade 12 Physics", tutor: "Dr. Ramesh Prasad", status: "Conducted", reason: "", remarks: "Excellent participation. Covered mechanics questions." },
  { id: "SES-202", time: "11:00 AM - 12:30 PM", class: "Grade 10 Mathematics", tutor: "Amit Shah", status: "Conducted", reason: "", remarks: "Completed Chapter 4 practice sheets." },
  { id: "SES-203", time: "02:00 PM - 03:30 PM", class: "Grade 11 Chemistry", tutor: "Priya Nair", status: "Postponed", reason: "Tutor medical emergency", remarks: "Rescheduled to Saturday 4 PM." },
  { id: "SES-204", time: "04:00 PM - 05:30 PM", class: "Grade 8 English", tutor: "Sarah Jenkins", status: "Conducted", reason: "", remarks: "Focused on grammar exercises. Reading assignment given." },
  { id: "SES-205", time: "06:00 PM - 07:30 PM", class: "Grade 9 Computer Science", tutor: "David Miller", status: "Not Conducted", reason: "Student absent without notice", remarks: "Called parent, they requested reschedule." },
  { id: "SES-206", time: "07:30 PM - 09:00 PM", class: "Grade 10 Science", tutor: "Ananya Roy", status: "Conducted", reason: "", remarks: "Session went well. Reviewed respiratory systems." },
];

interface AdminSessionTrackerProps {
  onBack: () => void;
}

export default function AdminSessionTracker({ onBack }: AdminSessionTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionFilter, setSessionFilter] = useState<"all" | "Conducted" | "Not Conducted" | "Postponed">("all");

  const filteredSessions = dummySessions.filter(s => {
    const matchesSearch = s.tutor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.class.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = sessionFilter === "all" || s.status === sessionFilter;
    return matchesSearch && matchesStatus;
  });

  const searchAction = (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
      <input
        type="text"
        placeholder="Search class, tutor..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-55 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
        <DashboardHeader
          title="Today's Active Sessions"
          description="Track and manage classes conducted, cancelled, or postponed today."
          onBack={onBack}
          actions={searchAction}
        />

        {/* Filter Bar styled to match project tabs layout */}
        <div className="flex flex-wrap items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl w-fit mt-2">
          {(["all", "Conducted", "Not Conducted", "Postponed"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSessionFilter(filter)}
              className={cn(
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                sessionFilter === filter
                  ? "bg-[var(--brand-green)] text-white shadow-none"
                  : "text-slate-600 hover:text-slate-850"
              )}
            >
              {filter === "all" ? "All Sessions" : filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse text-left">
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-slate-50/50">
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Time Slot</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Class / Subject</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Tutor</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Reason for Postponement</TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Tutor Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => (
                  <TableRow key={session.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">{session.time}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-semibold text-slate-805">{session.class}</TableCell>
                    <TableCell className="px-6 py-4 text-sm text-slate-600 font-medium">{session.tutor}</TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                        session.status === "Conducted" && "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
                        session.status === "Not Conducted" && "bg-red-50 text-red-700 border-red-200",
                        session.status === "Postponed" && "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {session.status === "Conducted" && <CheckCircle className="w-3.5 h-3.5 text-[var(--brand-green)]" />}
                        {session.status === "Not Conducted" && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                        {session.status === "Postponed" && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                        {session.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-slate-600">
                      {session.status === "Postponed" ? (
                        <span className="text-amber-700 font-medium bg-amber-50/50 px-2 py-1 rounded border border-amber-100">{session.reason}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-slate-600 italic">
                      &ldquo;{session.remarks}&rdquo;
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-8 text-center text-slate-600 text-sm">
                    No sessions found matching your query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
