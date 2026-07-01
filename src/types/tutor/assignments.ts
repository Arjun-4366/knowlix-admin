export type TutorAssignmentStatus = "assigned" | "submitted" | "evaluated" | "expired" | "pending";

export interface IAssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrls: string[];
  remarks: string;
  status: string;
  submittedAt: string;
}

export interface IAssignmentEvaluation {
  id: string;
  assignmentId: string;
  studentId: string;
  marksObtained: number;
  remarks: string;
  completed: boolean;
  evaluatedAt: string;
}

export interface IAssignmentStudent {
  studentId: string;
  studentName: string;
  submission: IAssignmentSubmission | null;
  evaluation: IAssignmentEvaluation | null;
}

export interface ITutorAssignment {
  id: string;
  tutorId: string;
  studentIds: string[];
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: TutorAssignmentStatus;
  maxMarks: number;
  createdAt: string;
  updatedAt: string;
  students?: IAssignmentStudent[];
  submittedCount?: number;
  evaluatedCount?: number;
  pendingCount?: number;
}

export interface ITutorAssignmentsResponse {
  data: ITutorAssignment[];
  status: string;
  total: number;
}

export interface ICreateAssignmentPayload {
  studentIds: string[];
  title: string;
  description: string;
  subject: string;
  dueDate: string;   // ISO date string e.g. "2026-05-30"
  maxMarks: number;
}

export interface IEvaluateAssignmentPayload {
  studentId: string;
  marksObtained: number;
  remarks: string;
}

