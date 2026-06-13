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
