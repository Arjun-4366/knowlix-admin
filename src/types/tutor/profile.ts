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

export interface IStaffRef {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
  status?: string;
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
  programId?: string;
  programName?: string;
  courseId?: string;
  courseName?: string;
  package?: string;
  admissionStatus?: string;
  totalFee?: number;
  paidAmount?: number;
  assignedMentorId?: string;
  mentorName?: string;
  assignedCoordinatorId?: string;
  coordinatorName?: string;
  coordinator?: IStaffRef;
  mentor?: IStaffRef;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAttendanceLog {
  id: string;
  date: string;
  status: string;
  totalMinutes: number;
  workHours: number;
  sessionCount: number;
  createdAt: string;
  updatedAt: string;
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
  role?: string;
  status: string;
  profileImage?: string;
  growthPoints: number;
  performanceScore: number;
  permissions?: ITutorPermissions;
  positiveRemarks?: string[] | null;
  negativeRemarks?: string[] | null;
  syllabus: string[];
  slots: ISlotEntry[];
  assignedStudentIds?: IAssignedStudent[] | string[];
  attendance?: IAttendanceLog[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateTutorProfilePayload {
  availability: string[];
  subjectEntries: ISubjectEntry[];
  syllabus: string[];
  slots: ISlotEntry[];
}
