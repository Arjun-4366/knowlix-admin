"use client";

import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/20">
        <h2 className="text-sm font-bold text-slate-800">Upcoming Live Classes</h2>
        <p className="text-xs text-slate-600 mt-0.5">Click join to open virtual classroom portal</p>
      </div>
      <div className="p-5 space-y-4">
        {classes.map((cls) => {
          const isActive = cls.status === "Active";
          return (
            <div
              key={cls.id}
              className={`p-4 border rounded-xl space-y-3 transition-all ${
                isActive
                  ? "bg-[var(--brand-light-green)]/15 border-[var(--brand-light)]/40 ring-1 ring-[var(--brand-green)]/20"
                  : "border-slate-150 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider block">
                  {cls.date} • {cls.time}
                </span>
                {isActive && (
                  <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-[var(--brand-green)] px-1.5 py-0.5 rounded-full bg-[var(--brand-light-green)] ring-1 ring-[var(--brand-light)]/30 animate-pulse">
                    ● Active Now
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-805">{cls.subject}</h4>
                <p className="text-[10px] text-slate-600 mt-0.5">Topic: {cls.topic}</p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100/50 pt-3">
                <span className="text-[10px] text-slate-600 font-semibold">Tutor: {cls.tutor}</span>
                <a
                  href={cls.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-1 px-3 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all ${
                    isActive
                      ? "bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white shadow shadow-green-650/10"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  Join Room
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
