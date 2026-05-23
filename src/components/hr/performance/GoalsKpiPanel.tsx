import { Activity, Flag, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EnrichedGoalKpi, GoalStatus } from "./types";
import { formatDateLabel, formatPercent } from "./utils";

interface GoalsKpiPanelProps {
  cycleLabel: string;
  employeeName: string | null;
  goals: EnrichedGoalKpi[];
  onResolveSupportGoals: () => void;
}

const goalStatusClassMap: Record<GoalStatus, string> = {
  "On Track": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Needs Support": "bg-amber-50 text-amber-700 border-amber-200",
  Achieved: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function GoalsKpiPanel({
  cycleLabel,
  employeeName,
  goals,
  onResolveSupportGoals,
}: GoalsKpiPanelProps) {
  const achievedCount = goals.filter((goal) => goal.status === "Achieved").length;
  const supportCount = goals.filter(
    (goal) => goal.status === "Needs Support"
  ).length;
  const averageProgress =
    goals.length > 0
      ? goals.reduce((total, goal) => total + goal.progress, 0) / goals.length
      : 0;

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-850">
            Goal Setting & KPI Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {employeeName
              ? `${employeeName}'s goals and KPI movement for ${cycleLabel}.`
              : `Goals and KPI movement for ${cycleLabel}.`}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={supportCount === 0}
          onClick={onResolveSupportGoals}
          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          Resolve Support Goals
        </Button>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
              Average Progress
            </p>
            <p className="text-lg font-bold text-slate-800 mt-2">
              {formatPercent(averageProgress)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 inline-flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5" />
              Current completion across mapped goals
            </p>
          </div>
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
              Achieved Goals
            </p>
            <p className="text-lg font-bold text-slate-800 mt-2">{achievedCount}</p>
            <p className="text-[11px] text-slate-500 mt-1 inline-flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" />
              Fully delivered outcomes in this cycle
            </p>
          </div>
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
              Needs Support
            </p>
            <p className="text-lg font-bold text-slate-800 mt-2">{supportCount}</p>
            <p className="text-[11px] text-slate-500 mt-1 inline-flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              Goals requiring unblockers or manager involvement
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-2xl border border-slate-150 bg-slate-50/45 p-4 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      {goal.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {goal.category} / Owner: {goal.owner}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-bold rounded-full px-2 py-0.5",
                      goalStatusClassMap[goal.status]
                    )}
                  >
                    {goal.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="font-semibold text-slate-600">
                      {goal.kpiLabel}
                    </span>
                    <span className="font-bold text-slate-800">
                      {goal.currentValue} / {goal.targetValue}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--brand-green)] to-[var(--brand-light)]"
                      style={{
                        width: `${Math.max(0, Math.min(goal.progress, 100))}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500">
                    <span>{goal.target}</span>
                    <span>{formatPercent(goal.progress)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="rounded-xl border border-slate-150 bg-white px-3 py-3">
                    <p className="font-bold uppercase tracking-wider text-slate-450">
                      Due Date
                    </p>
                    <p className="text-slate-700 font-semibold mt-1">
                      {formatDateLabel(goal.dueDate)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-150 bg-white px-3 py-3">
                    <p className="font-bold uppercase tracking-wider text-slate-450">
                      Current Note
                    </p>
                    <p className="text-slate-600 mt-1 leading-normal">
                      {goal.note}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-sm text-slate-500">
              No goals are mapped for the selected employee in this performance
              cycle.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
