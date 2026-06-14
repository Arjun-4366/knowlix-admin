export type IProgressReportType = "monthly" | "five-month" | "annual";

export interface IProgressSubjectMark {
  maxMarks: number;
  scoredMarks: number;
}

export interface IProgressSubject {
  subjectName: string;
  fa: IProgressSubjectMark;
  sa?: IProgressSubjectMark;
  totalMax: number;
  totalScored: number;
  grade: string;
}

export interface IProgressReport {
  id: string;
  tutorId: string;
  studentId: string;
  reportType: IProgressReportType;
  academicYear: string;
  examTitle: string;
  subjects: IProgressSubject[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateProgressPayload {
  studentId: string;
  reportType: IProgressReportType;
  academicYear: string;
  examTitle: string;
  subjects: IProgressSubject[];
}

export type IUpdateProgressPayload = Partial<ICreateProgressPayload>;

export interface IProgressReportsResponse {
  data: IProgressReport[];
  status: string;
  total: number;
}
