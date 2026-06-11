export interface ISubjectEntry {
  name: string;
  syllabi: string[];
}

export interface ISlotEntry {
  day: string;
  startTime: string;
  endTime: string;
  filled: boolean;
}

export interface ITutorPermissions {
  canUploadNotes: boolean;
  canEditNotes: boolean;
  canShareMaterial: boolean;
}

export interface IAssignedStudent {
  id: string;
  admissionNumber?: string;
  studentName: string;
  email: string;
  phone: string;
  parentName?: string;
  class?: string;
  place?: string;
  syllabus?: string;
  courseType?: string;
  programName?: string;
  package?: string;
  admissionStatus?: string;
  totalFee?: number;
  paidAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITutorProfilePayload {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjectEntries: ISubjectEntry[];
  subjects: string[];
  experience: string;
  availability: string[];
  role: string;
  status: string;
  profileImage?: string;
  growthPoints: number;
  performanceScore: number;
  permissions?: ITutorPermissions;
  positiveRemarks: string[] | null;
  negativeRemarks: string[] | null;
  syllabus: string[];
  slots: ISlotEntry[];
  assignedStudentIds?: IAssignedStudent[] | string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateTutorProfilePayload {
  availability: string[];
  subjectEntries: ISubjectEntry[];
  syllabus: string[];
  slots: ISlotEntry[];
}
