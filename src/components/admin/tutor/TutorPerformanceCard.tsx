"use client";

import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AwardGrowthPointsDialog } from "./AwardGrowthPointsDialog";

const GROWTH_METRICS = [
  { key: "G" as const, label: "Growth (G)", desc: "Performance & progress of assigned students" },
  { key: "R" as const, label: "Responsibility (R)", desc: "Engagement and follow-ups" },
  { key: "O" as const, label: "Ownership (O)", desc: "Accountability and task leadership" },
  { key: "W" as const, label: "Work Ethics (W)", desc: "Punctuality, class preparation, and behavior" },
  { key: "T" as const, label: "Teamwork (T)", desc: "Cooperation with administrative coordinators" },
  { key: "H" as const, label: "Honesty (H)", desc: "Transparency and class logging accuracy" },
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
          <p className="text-xs text-slate-400 mt-1">
            Cumulative G-R-O-W-T-H breakdown across all evaluations.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GROWTH_METRICS.map((metric) => {
              const pts = performanceData?.growthBreakdown?.[metric.key] || 0;
              const maxDisplay = 30;
              const pct = Math.min(100, (pts / maxDisplay) * 100);

              return (
                <div
                  key={metric.key}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/40"
                >
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-slate-750">{metric.label}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{metric.desc}</span>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--brand-green)] transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold text-slate-800 flex-shrink-0 w-10 text-right">
                    {pts}
                  </span>
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
