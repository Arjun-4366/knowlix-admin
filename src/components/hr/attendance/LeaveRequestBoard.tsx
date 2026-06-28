"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarRange, CheckCheck, Clock3, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EnrichedLeaveRequest, LeaveStatus } from "./types";

interface LeaveRequestBoardProps {
  requests: EnrichedLeaveRequest[];
  onStatusChange: (requestId: string, status: LeaveStatus) => void;
}

type RequestFilter = "All" | LeaveStatus;

const filterOptions: RequestFilter[] = ["All", "Pending", "Approved", "Rejected"];

const statusClassMap: Record<LeaveStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDateRange(startDate: string, endDate: string) {
  const start = format(parseISO(startDate), "dd MMM");
  const end = format(parseISO(endDate), "dd MMM");
  return startDate === endDate ? start : `${start} - ${end}`;
}

export default function LeaveRequestBoard({
  requests,
  onStatusChange,
}: LeaveRequestBoardProps) {
  const [activeFilter, setActiveFilter] = useState<RequestFilter>("Pending");

  const visibleRequests = requests.filter((request) =>
    activeFilter === "All" ? true : request.status === activeFilter
  );

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-850">Leave Requests & Approvals</h2>
        <p className="text-xs text-slate-600 mt-1">
          Review pending leave demand, approve cover plans, and close requests.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {filterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setActiveFilter(option)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer",
                activeFilter === option
                  ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-700"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[640px] overflow-y-auto">
        {visibleRequests.length > 0 ? (
          visibleRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-slate-150 bg-slate-50/40 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">{request.employeeName}</p>
                  <p className="text-[11px] font-semibold text-slate-600">
                    {request.designation} • {request.department}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full border text-[10px] font-bold px-2.5 py-1",
                    statusClassMap[request.status]
                  )}
                >
                  {request.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-1">
                  <CalendarRange className="w-3 h-3 text-slate-600" />
                  {formatDateRange(request.startDate, request.endDate)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-1">
                  <Clock3 className="w-3 h-3 text-slate-600" />
                  {request.days} day{request.days > 1 ? "s" : ""}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-1">
                  {request.leaveType}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Reason
                  </p>
                  <p className="text-xs text-slate-700 leading-normal mt-1">
                    {request.reason}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Coverage Plan
                  </p>
                  <p className="text-xs text-slate-600 leading-normal mt-1">
                    {request.coverageNote}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-[10px] font-semibold text-slate-600">
                  Requested on {format(parseISO(request.requestedOn), "dd MMM yyyy")}
                </p>

                {request.status === "Pending" && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onStatusChange(request.id, "Rejected")}
                      className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onStatusChange(request.id, "Approved")}
                      className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white rounded-xl"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-sm text-slate-600">
            No leave requests match the current filter.
          </div>
        )}
      </div>
    </Card>
  );
}
