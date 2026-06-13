"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAwardGrowthPoints } from "@/querys/admin/tutorQuery";

const GROWTH_METRICS = [
  {
    key: "G" as const,
    label: "Growth (G)",
    desc: "Performance & progress of assigned students",
  },
  {
    key: "R" as const,
    label: "Responsibility (R)",
    desc: "Engagement and follow-ups",
  },
  {
    key: "O" as const,
    label: "Ownership (O)",
    desc: "Accountability and task leadership",
  },
  {
    key: "W" as const,
    label: "Work Ethics (W)",
    desc: "Punctuality, class preparation, and behavior",
  },
  {
    key: "T" as const,
    label: "Teamwork (T)",
    desc: "Cooperation with administrative coordinators",
  },
  {
    key: "H" as const,
    label: "Honesty (H)",
    desc: "Transparency and class logging accuracy",
  },
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
  const { mutateAsync: awardGrowthPoints, isPending: isAwardingPoints } = useAwardGrowthPoints();

  const handleUpdateRating = async (category: string, value: number) => {
    try {
      await awardGrowthPoints({
        tutorId,
        category,
        evaluationArea: "admin_evaluation",
        points: value,
        description: `Awarded ${value} points for category ${category}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="bg-white border-slate-150 shadow-sm mt-6">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[var(--brand-green)]" />
            <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Performance Rating — G-R-O-W-T-H
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] bg-[var(--brand-light-green)] border-[var(--brand-light)]/20 text-[var(--brand-mid)] px-2 py-0.5 rounded-md font-bold"
          >
            Lifetime Growth Points: {totalGrowthPoints}
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Click stars to award growth points under specific evaluation criteria.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GROWTH_METRICS.map((metric) => {
            const currentCategoryPoints = performanceData?.growthBreakdown?.[metric.key] || 0;
            const mappedStars = Math.min(5, Math.max(0, currentCategoryPoints));

            return (
              <div
                key={metric.key}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/40 gap-4"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-750">
                    {metric.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {metric.desc}
                  </span>
                  <span className="text-[9px] font-bold text-[var(--brand-green)] mt-1 block">
                    Category Total: {currentCategoryPoints} pts
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      disabled={!isApproved || isAwardingPoints}
                      onClick={() => handleUpdateRating(metric.key, val)}
                      className="disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "w-5 h-5",
                          val <= mappedStars
                            ? "fill-[var(--brand-green)] text-[var(--brand-green)]"
                            : "text-slate-200"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
