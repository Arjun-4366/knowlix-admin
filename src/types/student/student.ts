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

export interface IMeetSession {
  id: string;
  tutorId: string;
  type: "group" | "individual";
  studentIds: string[];
  title: string;
  subject?: string;
  meetLink: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "scheduled" | "completed" | "cancelled";
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
}

export interface IStudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl?: string;
  remarks?: string;
  status: "submitted" | "graded" | "late";
  submittedAt: string;
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

export interface IResultWithExam extends IExamResult {
  examTitle: string;
  subject: string;
  maxMarks: number;
  examDate: string;
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
