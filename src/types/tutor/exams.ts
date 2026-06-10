export type TutorExamStatus = "pending" | "conducted" | "cancelled";

export interface ITutorExam {
  id: string;
  tutorId: { id: string; name: string; email: string; phone?: string } | string;
  studentIds: string[];
  title: string;
  subject: string;
  examDate: string;  // ISO string
  status: TutorExamStatus;
  maxMarks: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITutorExamsResponse {
  data: ITutorExam[];
  status: string;
  total: number;
}

export interface ICreateExamPayload {
  studentIds: string[];
  title: string;
  subject: string;
  examDate: string;  // Format YYYY-MM-DD
  maxMarks: number;
}

export interface IUpdateExamStatusPayload {
  status: TutorExamStatus;
}

export interface IExamResultEntry {
  studentId: string;
  marksObtained: number;
  grade: string;
  remarks: string;
}

export interface IEnterExamResultsPayload {
  results: IExamResultEntry[];
}
