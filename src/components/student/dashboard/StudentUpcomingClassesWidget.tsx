"use client";

import { ExternalLink, Video, CalendarClock } from "lucide-react";

interface LiveClass {
  id: string;
  date: string;
  time: string;
  subject: string;
  topic: string;
  tutor: string;
  meetLink: string;
  status: string;
}

interface StudentUpcomingClassesWidgetProps {
  classes: LiveClass[];
}

export default function StudentUpcomingClassesWidget({
  classes,
}: StudentUpcomingClassesWidgetProps) {
  const hasActive = classes.some((c) => c.status === "Active");

  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-[var(--brand-dark)]/15">
      {/* Gradient header */}
      <div className="px-6 py-5 bg-gradient-to-r from-[var(--brand-dark)] to-[var(--brand-mid)] relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-40 h-12 bg-[var(--brand-light-green)]/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Upcoming Live Classes</h2>
              <p className="text-[10px] text-white/60 mt-0.5">Click Join Room to enter your virtual classroom</p>
            </div>
          </div>
          {hasActive && (
            <span className="flex items-center gap-1.5 text-[9px] font-black text-white bg-white/15 border border-white/20 px-2.5 py-1 rounded-full animate-pulse flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              LIVE NOW
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-5 space-y-3">
        {classes.length === 0 ? (
          <div className="py-8 text-center">
            <CalendarClock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No upcoming classes scheduled</p>
            <p className="text-xs text-slate-600 mt-0.5">Check back later for new sessions</p>
          </div>
        ) : (
          classes.map((cls) => {
            const isActive = cls.status === "Active";
            const isDone = cls.status === "Completed" || cls.status === "Not Conducted";
            return (
              <div
                key={cls.id}
                className={`rounded-xl overflow-hidden border transition-all ${
                  isActive
                    ? "border-[var(--brand-dark)]/25 shadow-sm"
                    : "border-slate-200"
                } ${isDone ? "opacity-60" : ""}`}
              >
                {/* Active: colored top strip */}
                {isActive && (
                  <div className="h-1 bg-gradient-to-r from-[var(--brand-dark)] to-[var(--brand-mid)]" />
                )}

                <div className={`p-4 ${isActive ? "bg-[var(--brand-light-green)]/30" : "bg-white"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider">
                          {cls.date} · {cls.time}
                        </span>
                        {isActive && (
                          <span className="text-[8px] font-black text-[var(--brand-mid)] bg-[var(--brand-light-green)] px-1.5 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                            ● Active Now
                          </span>
                        )}
                        {isDone && (
                          <span
                            className={`text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                              cls.status === "Completed"
                                ? "text-emerald-700 bg-emerald-100"
                                : "text-red-700 bg-red-100"
                            }`}
                          >
                            {cls.status}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{cls.subject}</h4>
                      <p className="text-[10px] text-slate-600 leading-normal truncate">
                        {cls.topic}
                      </p>
                      <p className="text-[10px] text-slate-600 font-semibold">
                        Tutor: {cls.tutor}
                      </p>
                    </div>

                    {isDone ? (
                      <span className="flex-shrink-0 px-3 py-2 text-[10px] font-bold rounded-lg bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed">
                        Room Closed
                      </span>
                    ) : (
                      <a
                        href={cls.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold rounded-lg transition-all ${
                          isActive
                            ? "bg-[var(--brand-dark)] hover:bg-[var(--brand-mid)] text-white shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        }`}
                      >
                        Join Room
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
