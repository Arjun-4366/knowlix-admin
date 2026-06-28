"use client";

import { Badge } from "@/components/ui/badge";

interface SubjectProgress {
  subject: string;
  progress: number;
  grade: string;
  tutor: string;
}

interface StudentProgressReportWidgetProps {
  progressList: SubjectProgress[];
}

export default function StudentProgressReportWidget({
  progressList,
}: StudentProgressReportWidgetProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
        <div>
          <h2 className="text-sm font-bold text-slate-805">Subject-wise Academic Progress</h2>
          <p className="text-xs text-slate-600 mt-0.5">Average score and assigned tutor per curriculum block</p>
        </div>
        <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 shadow-none text-[10px]">
          Grade Card
        </Badge>
      </div>
      <div className="p-6 space-y-5">
        {progressList.map((subj) => {
          return (
            <div key={subj.subject} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-855">{subj.subject}</p>
                  <p className="text-[10px] text-slate-600 font-semibold">Tutor: {subj.tutor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-750">{subj.progress}%</span>
                  <Badge variant="outline" className="text-[9px] font-black py-0 px-2 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                    {subj.grade}
                  </Badge>
                </div>
              </div>
              {/* Visual bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${subj.progress}%`,
                    backgroundColor:
                      subj.progress >= 95
                        ? "var(--brand-green)"
                        : subj.progress >= 90
                        ? "#3b82f6"
                        : "#eab308",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
