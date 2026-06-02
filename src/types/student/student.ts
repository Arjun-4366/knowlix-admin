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

export interface IStudentDashboard {
  attendance: {
    total: number;
    present: number;
    percentage: number;
  };
  assignments: {
    completed: number;
    pending: number;
    total: number;
  };
  averageScore: number;
  feesDue: number;
  upcomingFees: IFeeRecord[];
  subjectProgress: ISubjectProgress[];
  upcomingClasses: ISession[];
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

export interface IAnnouncement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorRole: string;
  targetAudience: "all" | "tutors" | "students" | "hr" | "staff";
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotice {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorRole: string;
  department?: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

export interface IStudentNoticesResponse {
  announcements: IAnnouncement[] | null;
  notices: INotice[] | null;
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
  today: ISession[] | null;
  upcoming: ISession[] | null;
  mentorMeetings: IMeetSession[] | null;
  examTimetable: IExam[] | null;
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
  total: number;
  summary: {
    totalDue: number;
    totalPaid: number;
  };
  data: IFeeRecord[];
}

export interface IStudentFeeStatusResponse {
  currentMonth?: IFeeRecord;
  overdue: IFeeRecord[];
  upcoming: IFeeRecord[];
}
