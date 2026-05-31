export type TutorAssignmentStatus = "assigned" | "submitted" | "evaluated" | "expired";

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
  completed: boolean;
}

