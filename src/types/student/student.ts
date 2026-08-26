export interface IStudentUser {
  id: string;
  admissionNumber: string;
  studentName: string;
  email: string;
  phone: string;
  parentName: string;
  class: string;
  place: string;
  programName?: string;
  courseName?: string;
  coordinatorName?: string;
  mentorName?: string;
  subjectIds?: string[];
  subjectNames?: string[];
  subjects?: { id: string; name: string }[];
  admissionStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAttendanceClass {
  sessionId: string;
  title: string;
  subject: string;
  date: string;
  status: "present" | "absent" | "late";
}

export interface IStudentDashboard {
  attendance: {
    total: number;
    present: number;
    absent: number;
    percentage: number;
    classes: IAttendanceClass[];
  };
  assignments: {
    completed: number;
    pending: number;
    total: number;
  };
  averageScore: number;
  feesDue: number;
  subjectProgress: ISubjectProgress[];
  upcomingClasses: IMeetSession[];
}

export interface ISubjectProgress {
  subject: string;
  totalExams: number;
  averageScore: number;
}

export interface ISession {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "conducted" | "not_conducted" | "postponed";
  tutorRemarks?: string;
  createdAt: string;
  updatedAt: string;
  tutorName?: string;
}

export interface IFeeRecord {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  month: string;
  dueDate: string;
  paidAt?: string;
  status: "pending" | "paid" | "overdue" | "waived";
  paymentMethod?: string;
  transactionId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INoticeItem {
  id: string;
  category: "announcement" | "notice";
  title: string;
  content: string;
  authorId: string;
  department?: string;
  audience: string;
  priority: "low" | "medium" | "high";
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INoticesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IStudentNoticesResponse {
  data: INoticeItem[];
  pagination: INoticesPagination;
}

export interface IPopulatedTutorRef {
  id: string;
  name: string;
}

export interface IMeetSession {
  id: string;
  tutorId: string | IPopulatedTutorRef;
  type: "group" | "individual";
  studentIds: string[];
  title: string;
  subject?: string;
  meetLink: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "scheduled" | "completed" | "not_conducted";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tutorName?: string;
}

export interface IExam {
  id: string;
  tutorId: string;
  studentIds: string[];
  title: string;
  subject: string;
  examDate: string;
  status: "pending" | "conducted" | "cancelled";
  maxMarks: number;
  createdAt: string;
  updatedAt: string;
}

export interface IStudentScheduleResponse {
  data: IMeetSession[];
  pagination: INoticesPagination;
}

export interface IStudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrls?: string[];
  fileUrl?: string;
  remarks?: string;
  status: "submitted" | "graded" | "late" | "evaluated";
  submittedAt: string;
}

export interface IAssignment {
  id: string;
  tutorId: string;
  studentIds: string[];
  title: string;
  description?: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "evaluated" | "missed";
  maxMarks: number;
  createdAt: string;
  updatedAt: string;
  tutorName?: string;
  submission?: IStudentSubmission | null;
  evaluation?: IAssignmentEvaluation | null;
}

export interface IAssignmentEvaluation {
  id: string;
  assignmentId: string;
  studentId: string;
  marksObtained: number;
  remarks?: string;
  completed: boolean;
  evaluatedAt: string;
}

export interface IAssignmentStatusResponse {
  assignment: IAssignment;
  submission?: IStudentSubmission;
  evaluation?: IAssignmentEvaluation;
}

export interface IExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  enteredAt: string;
}

export interface IPopulatedExam {
  id: string;
  tutorId: { id: string; name: string };
  studentIds: string[];
  title: string;
  subject: string;
  examDate: string;
  status: string;
  maxMarks: number;
  createdAt: string;
  updatedAt: string;
}

export interface IResultWithExam {
  id: string;
  examId: IPopulatedExam;
  studentId: string;
  marksObtained: number;
  grade?: string;
  remarks?: string;
  enteredAt: string;
  percentage: number;
}

export interface ISubjectGrade {
  subject: string;
  totalExams: number;
  totalMarks: number;
  maxMarks: number;
  averageScore: number;
  percentage: number;
  letterGrade: string;
}

export interface IMonthlyTrend {
  month: string;
  totalExams: number;
  averageScore: number;
  percentage: number;
}

export interface IStudentFeesResponse {
  dueAmount: number;
  paidAmount: number;
  totalFee: number;
}

export interface IStudentFeeStatusResponse {
  currentMonth?: IFeeRecord;
  overdue: IFeeRecord[];
  upcoming: IFeeRecord[];
}

export interface IStudentDocuments {
  birthCertificate?: string;
  transferCertificate?: string;
  previousAcademicRecord?: string;
  identificationDocument?: string;
}

export interface IStudentProfile {
  id: string;
  admissionNumber: string;
  studentName: string;
  email: string;
  phone: string;
  parentName: string;
  class: string;
  place: string;
  programId?: string;
  programName?: string;
  courseId?: string;
  courseName?: string;
  syllabus?: string;
  syllabusId?: string;
  package?: string;
  documents?: IStudentDocuments;
  admissionStatus: string;
  totalFee?: number;
  paidAmount?: number;
  subjectIds?: string[];
  subjectNames?: string[];
  subjects?: Array<{ id: string; name: string }>;
  assignedMentorId?: string;
  mentorName?: string;
  assignedCoordinatorId?: string;
  coordinatorName?: string;
  createdAt: string;
  updatedAt: string;  
}
