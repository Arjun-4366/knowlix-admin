import { ArrowRight, CalendarClock, MessageSquareQuote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  EnrichedPerformanceScorecard,
  FeedbackEntry,
  FeedbackTone,
  PerformanceCycle,
  ReviewStatus,
} from "./types";
import { formatDateLabel } from "./utils";

interface AppraisalFeedbackPanelProps {
  cycle: PerformanceCycle;
  scorecard: EnrichedPerformanceScorecard | null;
  feedbackEntries: FeedbackEntry[];
  onAdvanceAppraisal: () => void;
}

const reviewStatusClassMap: Record<ReviewStatus, string> = {
  "Self Review": "bg-slate-100 text-slate-700 border-slate-200",
  "Manager Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Calibration Ready": "bg-sky-50 text-sky-700 border-sky-200",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const feedbackToneClassMap: Record<FeedbackTone, string> = {
  Positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Constructive: "bg-amber-50 text-amber-700 border-amber-200",
};

const nextStepMap: Record<Exclude<ReviewStatus, "Closed">, string> = {
  "Self Review": "Move To Manager Review",
  "Manager Review": "Mark Calibration Ready",
  "Calibration Ready": "Close Appraisal",
};

export default function AppraisalFeedbackPanel({
  cycle,
  scorecard,
  feedbackEntries,
  onAdvanceAppraisal,
}: AppraisalFeedbackPanelProps) {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-850">Appraisals & Feedback</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manager summaries, self-reflections, and feedback notes for the
            selected performance record.
          </p>
        </div>

        <Button
          type="button"
          onClick={onAdvanceAppraisal}
          disabled={!scorecard || scorecard.appraisalStatus === "Closed"}
          className="rounded-xl bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-semibold"
        >
          <ArrowRight className="w-4 h-4" />
          {scorecard && scorecard.appraisalStatus !== "Closed"
            ? nextStepMap[scorecard.appraisalStatus]
            : "Appraisal Closed"}
        </Button>
      </div>

      <div className="p-5 space-y-5">
        {scorecard ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                  Review Stage
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "w-fit text-[10px] font-bold rounded-full px-2 py-0.5",
                    reviewStatusClassMap[scorecard.appraisalStatus]
                  )}
                >
                  {scorecard.appraisalStatus}
                </Badge>
                <p className="text-[11px] text-slate-500">{cycle.note}</p>
              </div>

              <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                  Review Window
                </p>
                <p className="text-sm font-bold text-slate-800">{cycle.reviewWindow}</p>
                <p className="text-[11px] text-slate-500 inline-flex items-center gap-1">
                  <CalendarClock className="w-3.5 h-3.5 text-slate-400" />
                  Calibration {formatDateLabel(cycle.calibrationDate)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                  Recommended Action
                </p>
                <p className="text-xs text-slate-700 leading-normal">
                  {scorecard.recommendedAction}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-150 bg-slate-50/40 p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                  Manager Summary
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  Reviewer: {scorecard.reviewer}
                </p>
                <p className="text-xs text-slate-600 leading-normal">
                  {scorecard.managerSummary}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-150 bg-slate-50/40 p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-450">
                  Self Reflection
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  Employee voice
                </p>
                <p className="text-xs text-slate-600 leading-normal">
                  {scorecard.selfSummary}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-150 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Feedback Stream
                </h3>
              </div>

              <div className="p-4 space-y-3 max-h-[360px] overflow-y-auto">
                {feedbackEntries.length > 0 ? (
                  feedbackEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-2xl border border-slate-150 bg-white p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">
                            {entry.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {entry.source} feedback by {entry.author}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-bold rounded-full px-2 py-0.5",
                            feedbackToneClassMap[entry.tone]
                          )}
                        >
                          {entry.tone}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">
                        {entry.summary}
                      </p>
                      <p className="text-[10px] text-slate-450 inline-flex items-center gap-1">
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                        Updated {formatDateLabel(entry.updatedOn)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-sm text-slate-500">
                    No feedback entries are mapped for the selected employee in
                    this cycle.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-16 text-center text-sm text-slate-500">
            Select an employee performance record to inspect appraisal notes and
            feedback.
          </div>
        )}
      </div>
    </Card>
  );
}
