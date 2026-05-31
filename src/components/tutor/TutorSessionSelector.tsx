"use client";

import { Check, Video, Clock, Users, BookOpen, Loader2 } from "lucide-react";
import { ITutorSession } from "@/types/tutor/attendance";
import { useGetSessions } from "@/querys/tutor/attendanceQuery";

interface TutorSessionSelectorProps {
  selectedSessionId: string | null;
  onSelect: (session: ITutorSession | null) => void;
}

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function TutorSessionSelector({ selectedSessionId, onSelect }: TutorSessionSelectorProps) {
  const { data: sessionsResponse, isLoading } = useGetSessions();
  const sessions = sessionsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Session (Optional)
        </label>
        <div className="flex items-center gap-2 py-4 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading sessions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Link to Session (Optional)
        </label>
        {selectedSessionId && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer underline"
          >
            Clear selection
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="py-4 text-center text-slate-400 text-xs font-semibold border border-dashed border-slate-200 rounded-xl">
          No sessions found. Attendance will be logged without a session link.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {sessions.map((session) => {
            const isSelected = selectedSessionId === session.id;
            const statusStyle = STATUS_STYLES[session.status] || STATUS_STYLES.scheduled;
            const scheduledDate = new Date(session.scheduledAt);

            return (
              <button
                key={session.id}
                type="button"
                onClick={() => onSelect(isSelected ? null : session)}
                className={`p-4 rounded-xl border text-left transition-all relative group cursor-pointer ${
                  isSelected
                    ? "bg-[var(--brand-light-green)]/30 border-[var(--brand-green)] shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                {/* Top row: title + status badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-bold text-slate-800 leading-tight truncate flex-1">
                    {session.title}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 capitalize ${statusStyle}`}>
                    {session.status}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {session.subject}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {session.studentIds.length} {session.type === "individual" ? "Student" : "Students"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {scheduledDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {" · "}
                    {scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    {session.durationMinutes} min
                  </span>
                </div>

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute right-3.5 top-3.5 w-5 h-5 rounded-full bg-[var(--brand-green)] flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 text-white stroke-[3px]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
