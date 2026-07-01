"use client";

import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AwardGrowthPointsDialog } from "./AwardGrowthPointsDialog";
import { cn } from "@/lib/utils";

const GROWTH_METRICS = [
  { key: "G" as const, label: "Growth", desc: "Performance & progress of assigned students", badge: "bg-emerald-100 text-emerald-700", pts: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  { key: "R" as const, label: "Responsibility", desc: "Engagement and follow-ups", badge: "bg-sky-100 text-sky-700", pts: "text-sky-700 bg-sky-50 border-sky-100" },
  { key: "O" as const, label: "Ownership", desc: "Accountability and task leadership", badge: "bg-violet-100 text-violet-700", pts: "text-violet-700 bg-violet-50 border-violet-100" },
  { key: "W" as const, label: "Work Ethics", desc: "Punctuality, class preparation, and behavior", badge: "bg-amber-100 text-amber-700", pts: "text-amber-700 bg-amber-50 border-amber-100" },
  { key: "T" as const, label: "Teamwork", desc: "Cooperation with administrative coordinators", badge: "bg-rose-100 text-rose-700", pts: "text-rose-700 bg-rose-50 border-rose-100" },
  { key: "H" as const, label: "Honesty", desc: "Transparency and class logging accuracy", badge: "bg-teal-100 text-teal-700", pts: "text-teal-700 bg-teal-50 border-teal-100" },
];

interface TutorPerformanceCardProps {
  tutorId: string;
  isApproved: boolean;
  performanceData: any;
  totalGrowthPoints: number;
}

export function TutorPerformanceCard({
  tutorId,
  isApproved,
  performanceData,
  totalGrowthPoints,
}: TutorPerformanceCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="bg-white border-slate-150 shadow-sm mt-6">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Performance Rating — G-R-O-W-T-H
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="text-[10px] bg-[var(--brand-light-green)] border-[var(--brand-light)]/20 text-[var(--brand-mid)] px-2 py-0.5 rounded-md font-bold"
              >
                Lifetime Points: {totalGrowthPoints}
              </Badge>
              {isApproved && (
                <Button
                  size="sm"
                  onClick={() => setDialogOpen(true)}
                  className="h-7 text-xs font-bold bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white flex items-center gap-1.5 px-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Award Points
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cumulative breakdown across all evaluations.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GROWTH_METRICS.map((metric) => {
              const pts = performanceData?.growthBreakdown?.[metric.key] || 0;

              return (
                <div
                  key={metric.key}
                  className="flex flex-col gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-base", metric.badge)}>
                      {metric.key}
                    </div>
                    <div className={cn("px-3 py-1.5 rounded-xl border text-xl font-bold", metric.pts)}>
                      {pts} <span className="text-xs font-semibold opacity-70">pts</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{metric.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{metric.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AwardGrowthPointsDialog
        tutorId={tutorId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
