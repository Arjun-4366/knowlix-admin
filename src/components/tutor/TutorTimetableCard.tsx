"use client";

import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ITutorTimetableEntry } from "@/types/tutor/profile";

interface TutorTimetableCardProps {
  timetable?: ITutorTimetableEntry[] | null;
}

function formatDate(date: string) {
  try {
    return format(new Date(date), "MMM d, yyyy");
  } catch {
    return date;
  }
}

function studentsLabel(entry: ITutorTimetableEntry) {
  if (entry.students?.length) {
    return entry.students.map((s) => s.studentName).join(", ");
  }
  return `${entry.studentIds.length} student(s)`;
}

export default function TutorTimetableCard({ timetable }: TutorTimetableCardProps) {
  const entries = timetable ?? [];

  return (
    <Card className="bg-white border-slate-150 shadow-sm h-full">
      <CardHeader className="p-6 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-[var(--brand-green)]" />
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            My Timetable
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        {entries.length > 0 ? (
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors"
              >
                <div className="w-16 text-center flex-shrink-0">
                  <p className="text-xs font-bold text-[var(--brand-green)]">{formatDate(entry.date)}</p>
                  <p className="text-[10px] text-slate-600">{entry.day}</p>
                </div>
                <div className="w-px h-8 bg-slate-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {entry.subjectName ?? "Subject"}
                  </p>
                  <p className="text-xs text-slate-600 font-semibold truncate">
                    {studentsLabel(entry)}
                  </p>
                </div>
                <p className="text-xs font-semibold text-slate-700 flex-shrink-0">
                  {entry.startTime} - {entry.endTime}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 py-4 text-center">No timetable slots scheduled yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
