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

export interface IStudent {
  id: string;
  admissionNumber?: string;
  studentName: string;
  parentName: string;
  class: string;
  email?: string;
  phone?: string;
  place: string;
  courseType: string;
  package: string;
  customPackageDetails?: string;
  documents: IStudentDocuments;
  coordinatorName: string;
  admissionStatus: StudentAdmissionStatus;
  assignedTutorId: string | null;
  assignedMentorId: string | null;
  assignedCoordinatorId: string | null;
  programId?: string | null;
  programName?: string | null;
  courseId?: string | null;
  courseName?: string | null;
  syllabus?: string;
  totalFee?: number;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateStudentPayload {
  studentName: string;
  admissionNumber?: string;
  parentName: string;
  class: string;
  email: string;
  phone: string;
  password: string;
  place: string;
  courseType: string;
  package: string;
  customPackageDetails: string;
  documents: IStudentDocuments;
  coordinatorName: string;
  admissionStatus: StudentAdmissionStatus;
  assignedTutorId: string;
  assignedMentorId: string;
  assignedCoordinatorId: string;
  programId?: string;
  courseId?: string;
  syllabus?: string;
  totalFee?: number;
  paidAmount?: number;
}

export type IUpdateStudentPayload = Partial<ICreateStudentPayload>;

export interface IStudentsResponse extends IApiResponse<IStudent[]> {
  message: string;
  total: number;
}

export type IStudentResponse = IApiResponse<IStudent>;

export interface IStudentDocumentsResponse {
  documents: IStudentDocuments;
  status: string;
  studentId: string;
}

export interface IAssignTutorPayload {
  studentId: string;
  tutorId: string;
}
