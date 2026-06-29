import { IApiResponse } from "@/types/admin/api";

export interface IStudentDocuments {
  birthCertificate: string | File;
  transferCertificate: string | File;
  previousAcademicRecord: string | File;
  identificationDocument: string | File;
}

export type StudentAdmissionStatus =
  | "pending"
  | "active"
  | "inactive"
  | "approved"
  | "rejected"
  | "in_review"
  | string;

export interface IStudentStaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  status?: string;
}

export interface IStudent {
  id: string;
  admissionNumber?: string;
  studentName: string;
  parentName: string;
  class: string;
  standardId?: string;
  syllabus?: string;
  syllabusId?: string;
  email?: string;
  phone?: string;
  place: string;
  courseType: string;
  package: string;
  customPackageDetails?: string;
  documents: IStudentDocuments;
  coordinatorName?: string | null;
  mentorName?: string | null;
  admissionStatus: StudentAdmissionStatus;
  assignedTutorId?: string | null;
  mentorId?: string | null;
  assignedMentorId?: string | null;
  coordinatorId?: string | null;
  assignedCoordinatorId?: string | null;
  coordinator?: IStudentStaffMember | null;
  mentor?: IStudentStaffMember | null;
  tutors?: Array<{ id: string; name: string }> | null;
  programId?: string | null;
  programName?: string | null;
  courseId?: string | null;
  courseName?: string | null;
  totalFee?: number;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateStudentPayload {
  studentName: string;
  admissionNumber?: string;
  parentName: string;
  standardId: string;
  syllabusId?: string;
  email: string;
  phone: string;
  password: string;
  place: string;
  courseType?: string;
  package: string;
  customPackageDetails?: string;
  documents: IStudentDocuments;
  admissionStatus: StudentAdmissionStatus;
  assignedTutorId?: string;
  mentorId: string;
  coordinatorId: string;
  coordinatorName?: string;
  programId?: string;
  courseId?: string;
  totalFee?: number;
  paidAmount?: number;
}

export type IUpdateStudentPayload = Partial<ICreateStudentPayload>;

export interface IStudentSummary {
  admissionTaken: number;
  courseCompleted: number;
  inactive: number;
  pending: number;
  total: number;
}

export interface IStudentsResponse extends IApiResponse<IStudent[]> {
  message: string;
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  summary: IStudentSummary;
}

export type IStudentResponse = IApiResponse<IStudent>;

// Sessions
export interface ISessionAttendance {
  id: string;
  tutorId: string;
  studentId: string;
  sessionId: string;
  date: string;
  status: "present" | "absent" | "late";
  createdAt: string;
}
export interface IStudentSession {
  id: string;
  tutorId: string;
  type: "individual" | "group";
  studentIds: string[];
  title: string;
  subject: string;
  meetLink: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "conducted" | "completed" | "not_conducted";
  notes: string;
  createdAt: string;
  updatedAt: string;
  tutorName: string;
  attendance: ISessionAttendance | null;
}
export interface IStudentSessionsResponse {
  data: IStudentSession[];
  message: string;
  status: string;
  summary: { absent: number; late: number; present: number; total: number };
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

// Exams
export interface IExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade: string;
  remarks: string;
  enteredAt: string;
}
export interface IStudentExam {
  id: string;
  tutorId: string;
  studentIds: string[];
  title: string;
  subject: string;
  examDate: string;
  status: string;
  maxMarks: number;
  createdAt: string;
  updatedAt: string;
  tutorName: string;
  result: IExamResult | null;
}
export interface IStudentExamsResponse {
  data: IStudentExam[];
  message: string;
  status: string;
  summary: { evaluated: number; pending: number; total: number };
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

// Assignments
export interface IAssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl: string;
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
export interface IStudentAssignment {
  id: string;
  tutorId: string;
  studentIds: string[];
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: string;
  maxMarks: number;
  createdAt: string;
  updatedAt: string;
  tutorName: string;
  submission: IAssignmentSubmission | null;
  evaluation: IAssignmentEvaluation | null;
}
export interface IStudentAssignmentsResponse {
  data: IStudentAssignment[];
  message: string;
  status: string;
  summary: { evaluated: number; pending: number; submitted: number; total: number };
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface IStudentDocumentsResponse {
  documents: IStudentDocuments;
  status: string;
  studentId: string;
}

export interface IAssignTutorPayload {
  studentId: string;
  tutorId: string;
}
