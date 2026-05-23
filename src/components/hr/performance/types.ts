export type PerformanceCycleStatus = "Active" | "Calibration" | "Closed";

export type ReviewStatus =
  | "Self Review"
  | "Manager Review"
  | "Calibration Ready"
  | "Closed";

export type PerformanceTrend = "Improving" | "Stable" | "At Risk";

export type FeedbackSource = "Manager" | "Peer" | "Self";

export type FeedbackTone = "Positive" | "Constructive";

export type GoalStatus = "On Track" | "Needs Support" | "Achieved";

export interface CoreValue {
  id: string;
  title: string;
  description: string;
}

export interface PerformanceCycle {
  id: string;
  label: string;
  reviewWindow: string;
  calibrationDate: string;
  status: PerformanceCycleStatus;
  note: string;
}

export interface ValueRating {
  valueId: string;
  score: number;
  note: string;
}

export interface PerformanceScorecard {
  id: string;
  cycleId: string;
  employeeId: string;
  reviewer: string;
  overallScore: number;
  nextReviewDate: string;
  appraisalStatus: ReviewStatus;
  trend: PerformanceTrend;
  recommendedAction: string;
  strengths: string[];
  watchouts: string[];
  managerSummary: string;
  selfSummary: string;
  valueRatings: ValueRating[];
}

export interface FeedbackEntry {
  id: string;
  cycleId: string;
  employeeId: string;
  source: FeedbackSource;
  author: string;
  title: string;
  summary: string;
  tone: FeedbackTone;
  updatedOn: string;
}

export interface GoalKpi {
  id: string;
  cycleId: string;
  employeeId: string;
  title: string;
  category: string;
  target: string;
  progress: number;
  status: GoalStatus;
  kpiLabel: string;
  currentValue: string;
  targetValue: string;
  dueDate: string;
  owner: string;
  note: string;
}

export interface EnrichedPerformanceScorecard extends PerformanceScorecard {
  employeeName: string;
  designation: string;
  department: string;
}

export interface EnrichedGoalKpi extends GoalKpi {
  employeeName: string;
  designation: string;
  department: string;
}
