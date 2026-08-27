"use client";

import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ITimetableEntry } from "@/types/admin/timetable";

interface TutorTimetableCardProps {
  timetable?: ITimetableEntry[] | null;
}

function formatDate(date: string) {
  try {
    return format(new Date(date), "MMM d, yyyy");
  } catch {
    return date;
  }
}

export function TutorTimetableCard({ timetable }: TutorTimetableCardProps) {
  const entries = timetable ?? [];

  return (
    <Card className="bg-white border-slate-150 shadow-sm">
      <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-[var(--brand-green)]" />
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Timetable
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        {entries.length > 0 ? (
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-800 shadow-sm">
                    <span className="text-[9px] font-bold uppercase leading-none text-slate-500">
                      {entry.day?.substring(0, 3) ?? ""}
                    </span>
                    <span className="text-xs font-bold leading-tight">
                      {formatDate(entry.date).split(" ")[1]?.replace(",", "")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {entry.subjectName ?? entry.subjectId}
                    </p>
                    <p className="text-xs text-slate-700 truncate">
                      {entry.studentNames?.length ? entry.studentNames.join(", ") : `${entry.studentIds.length} student(s)`}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs font-bold text-slate-800">{formatDate(entry.date)}</p>
                  <p className="text-[11px] text-slate-600">
                    {entry.startTime} - {entry.endTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-700 italic">No timetable slots scheduled yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
