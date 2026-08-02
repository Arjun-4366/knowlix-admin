export interface ITimetableEntry {
  id: string;
  tutorId: string;
  tutorName?: string;
  studentIds: string[];
  studentNames?: string[];
  subjectId: string;
  subjectName?: string;
  date: string;
  day?: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateTimetablePayload {
  tutorId: string;
  studentIds: string[];
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export type IUpdateTimetablePayload = Partial<ICreateTimetablePayload>;

export interface ITimetableQueryParams {
  tutorId?: string;
  month?: number;
  year?: number;
  page?: number;
  limit?: number;
}

export interface ITimetableResponse {
  data: ITimetableEntry[];
  status: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
