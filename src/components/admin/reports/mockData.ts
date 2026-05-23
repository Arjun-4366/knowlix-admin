import {
  TutorPerformanceReport,
  StudentPerformanceReport,
  AttendanceReport,
  SessionReport,
  RevenueReport
} from "./types";

export const mockTutors: TutorPerformanceReport[] = [
  {
    id: "TUT-001",
    name: "Dr. Ramesh Prasad",
    subject: "Advanced Physics & Mathematics",
    classesConducted: 42,
    rating: 4.95,
    retentionRate: 98,
    satisfactionRate: 99,
    performanceTier: "Outstanding",
    activeStudents: 14
  },
  {
    id: "TUT-002",
    name: "Amit Shah",
    subject: "Mathematics (JEE)",
    classesConducted: 38,
    rating: 4.90,
    retentionRate: 95,
    satisfactionRate: 96,
    performanceTier: "Outstanding",
    activeStudents: 12
  },
  {
    id: "TUT-003",
    name: "Sarah Jenkins",
    subject: "English Literature",
    classesConducted: 35,
    rating: 4.85,
    retentionRate: 92,
    satisfactionRate: 94,
    performanceTier: "Excellent",
    activeStudents: 10
  },
  {
    id: "TUT-004",
    name: "David Miller",
    subject: "Computer Science",
    classesConducted: 30,
    rating: 4.82,
    retentionRate: 90,
    satisfactionRate: 91,
    performanceTier: "Excellent",
    activeStudents: 8
  },
  {
    id: "TUT-005",
    name: "Ananya Roy",
    subject: "Biology",
    classesConducted: 28,
    rating: 4.80,
    retentionRate: 88,
    satisfactionRate: 90,
    performanceTier: "Very Good",
    activeStudents: 7
  },
  {
    id: "TUT-006",
    name: "Vikram Malhotra",
    subject: "Chemistry (NEET)",
    classesConducted: 25,
    rating: 4.65,
    retentionRate: 85,
    satisfactionRate: 87,
    performanceTier: "Very Good",
    activeStudents: 6
  },
  {
    id: "TUT-007",
    name: "Pooja Hegde",
    subject: "Social Studies & History",
    classesConducted: 18,
    rating: 4.25,
    retentionRate: 70,
    satisfactionRate: 75,
    performanceTier: "Needs Attention",
    activeStudents: 4
  },
  {
    id: "TUT-008",
    name: "Karan Johar",
    subject: "Art & Communication",
    classesConducted: 12,
    rating: 3.90,
    retentionRate: 60,
    satisfactionRate: 65,
    performanceTier: "Needs Attention",
    activeStudents: 3
  }
];

export const mockStudents: StudentPerformanceReport[] = [
  {
    id: "STU-101",
    name: "Rahul Sharma",
    grade: "Grade 10",
    courseType: "Online School",
    courseName: "Mathematics",
    avgAcademicScore: 94,
    attendanceRate: 97,
    assignmentsSubmitted: 18,
    assignmentsTotal: 18,
    tutorName: "Dr. Ramesh Prasad",
    performanceTier: "Top Performer"
  },
  {
    id: "STU-102",
    name: "Sneha Reddy",
    grade: "Grade 12",
    courseType: "Online Tuition",
    courseName: "Science",
    avgAcademicScore: 78,
    attendanceRate: 92,
    assignmentsSubmitted: 15,
    assignmentsTotal: 18,
    tutorName: "Amit Shah",
    performanceTier: "Average"
  },
  {
    id: "STU-103",
    name: "Kabir Malhotra",
    grade: "Grade 8",
    courseType: "Online School",
    courseName: "English",
    avgAcademicScore: 88,
    attendanceRate: 95,
    assignmentsSubmitted: 16,
    assignmentsTotal: 18,
    tutorName: "Ananya Roy",
    performanceTier: "Top Performer"
  },
  {
    id: "STU-104",
    name: "Aria Fernandes",
    grade: "Grade 11",
    courseType: "Hybrid Learning",
    courseName: "Social Studies",
    avgAcademicScore: 65,
    attendanceRate: 85,
    assignmentsSubmitted: 11,
    assignmentsTotal: 18,
    tutorName: "Dr. Ramesh Prasad",
    performanceTier: "Needs Support"
  },
  {
    id: "STU-105",
    name: "Vikram Sen",
    grade: "Grade 9",
    courseType: "Online Tuition",
    courseName: "Computer Science",
    avgAcademicScore: 55,
    attendanceRate: 78,
    assignmentsSubmitted: 9,
    assignmentsTotal: 18,
    tutorName: "Sarah Jenkins",
    performanceTier: "Needs Support"
  },
  {
    id: "STU-106",
    name: "Meera Joshi",
    grade: "Grade 10",
    courseType: "Online School",
    courseName: "Physics",
    avgAcademicScore: 89,
    attendanceRate: 96,
    assignmentsSubmitted: 17,
    assignmentsTotal: 18,
    tutorName: "Dr. Ramesh Prasad",
    performanceTier: "Top Performer"
  },
  {
    id: "STU-107",
    name: "Aman Gupta",
    grade: "Grade 12",
    courseType: "Online Tuition",
    courseName: "Mathematics",
    avgAcademicScore: 82,
    attendanceRate: 90,
    assignmentsSubmitted: 14,
    assignmentsTotal: 18,
    tutorName: "Amit Shah",
    performanceTier: "Average"
  },
  {
    id: "STU-108",
    name: "Tanya Sen",
    grade: "Grade 7",
    courseType: "Online School",
    courseName: "English",
    avgAcademicScore: 71,
    attendanceRate: 88,
    assignmentsSubmitted: 13,
    assignmentsTotal: 18,
    tutorName: "Sarah Jenkins",
    performanceTier: "Average"
  }
];

export const mockAttendance: AttendanceReport[] = [
  {
    id: "ATT-001",
    studentId: "STU-101",
    studentName: "Rahul Sharma",
    grade: "Grade 10",
    courseName: "Mathematics",
    sessionsScheduled: 20,
    sessionsPresent: 19,
    sessionsAbsent: 1,
    sessionsExcused: 0,
    attendanceRate: 95
  },
  {
    id: "ATT-002",
    studentId: "STU-102",
    studentName: "Sneha Reddy",
    grade: "Grade 12",
    courseName: "Science",
    sessionsScheduled: 20,
    sessionsPresent: 18,
    sessionsAbsent: 1,
    sessionsExcused: 1,
    attendanceRate: 90
  },
  {
    id: "ATT-003",
    studentId: "STU-103",
    studentName: "Kabir Malhotra",
    grade: "Grade 8",
    courseName: "English",
    sessionsScheduled: 15,
    sessionsPresent: 14,
    sessionsAbsent: 0,
    sessionsExcused: 1,
    attendanceRate: 93
  },
  {
    id: "ATT-004",
    studentId: "STU-104",
    studentName: "Aria Fernandes",
    grade: "Grade 11",
    courseName: "Social Studies",
    sessionsScheduled: 15,
    sessionsPresent: 12,
    sessionsAbsent: 2,
    sessionsExcused: 1,
    attendanceRate: 80
  },
  {
    id: "ATT-005",
    studentId: "STU-105",
    studentName: "Vikram Sen",
    grade: "Grade 9",
    courseName: "Computer Science",
    sessionsScheduled: 12,
    sessionsPresent: 9,
    sessionsAbsent: 3,
    sessionsExcused: 0,
    attendanceRate: 75
  },
  {
    id: "ATT-006",
    studentId: "STU-106",
    studentName: "Meera Joshi",
    grade: "Grade 10",
    courseName: "Physics",
    sessionsScheduled: 22,
    sessionsPresent: 21,
    sessionsAbsent: 0,
    sessionsExcused: 1,
    attendanceRate: 95
  },
  {
    id: "ATT-007",
    studentId: "STU-107",
    studentName: "Aman Gupta",
    grade: "Grade 12",
    courseName: "Mathematics",
    sessionsScheduled: 18,
    sessionsPresent: 16,
    sessionsAbsent: 1,
    sessionsExcused: 1,
    attendanceRate: 88
  },
  {
    id: "ATT-008",
    studentId: "STU-108",
    studentName: "Tanya Sen",
    grade: "Grade 7",
    courseName: "English",
    sessionsScheduled: 16,
    sessionsPresent: 14,
    sessionsAbsent: 2,
    sessionsExcused: 0,
    attendanceRate: 87
  }
];

export const mockSessions: SessionReport[] = [
  {
    id: "SES-1001",
    date: "2026-05-22",
    timeSlot: "16:00 - 17:00",
    studentName: "Rahul Sharma",
    tutorName: "Dr. Ramesh Prasad",
    subject: "Mathematics",
    duration: 60,
    status: "Completed",
    remarks: "Excellent grasp of trigonometry formulas."
  },
  {
    id: "SES-1002",
    date: "2026-05-22",
    timeSlot: "17:30 - 18:30",
    studentName: "Sneha Reddy",
    tutorName: "Amit Shah",
    subject: "Science",
    duration: 60,
    status: "Completed",
    remarks: "Needs practice in organic chemistry IUPAC naming."
  },
  {
    id: "SES-1003",
    date: "2026-05-22",
    timeSlot: "15:00 - 16:00",
    studentName: "Kabir Malhotra",
    tutorName: "Ananya Roy",
    subject: "English",
    duration: 60,
    status: "Completed",
    remarks: "Wrote a creative essay with good grammar structure."
  },
  {
    id: "SES-1004",
    date: "2026-05-21",
    timeSlot: "16:00 - 17:00",
    studentName: "Aria Fernandes",
    tutorName: "Dr. Ramesh Prasad",
    subject: "Social Studies",
    duration: 60,
    status: "Cancelled",
    remarks: "Cancelled by student due to family event."
  },
  {
    id: "SES-1005",
    date: "2026-05-21",
    timeSlot: "18:00 - 19:30",
    studentName: "Vikram Sen",
    tutorName: "Sarah Jenkins",
    subject: "Computer Science",
    duration: 90,
    status: "Completed",
    remarks: "Intro to Python loops completed. Needs homework revision."
  },
  {
    id: "SES-1006",
    date: "2026-05-20",
    timeSlot: "16:30 - 17:30",
    studentName: "Meera Joshi",
    tutorName: "Dr. Ramesh Prasad",
    subject: "Physics",
    duration: 60,
    status: "Completed",
    remarks: "Worked on kinematics numerical problems."
  },
  {
    id: "SES-1007",
    date: "2026-05-20",
    timeSlot: "19:00 - 20:00",
    studentName: "Aman Gupta",
    tutorName: "Amit Shah",
    subject: "Mathematics",
    duration: 60,
    status: "Scheduled",
    remarks: "Upcoming session on Calculus integration."
  },
  {
    id: "SES-1008",
    date: "2026-05-20",
    timeSlot: "15:30 - 16:30",
    studentName: "Tanya Sen",
    tutorName: "Sarah Jenkins",
    subject: "English",
    duration: 60,
    status: "Scheduled",
    remarks: "Upcoming reading comprehension practice."
  }
];

export const mockRevenue: RevenueReport[] = [
  {
    invoiceId: "INV-2026-001",
    date: "2026-05-20",
    studentName: "Rahul Sharma",
    courseType: "Online School",
    courseName: "Mathematics",
    packageName: "3 Months",
    amount: 45000,
    paymentStatus: "Paid",
    paymentMethod: "UPI"
  },
  {
    invoiceId: "INV-2026-002",
    date: "2026-05-18",
    studentName: "Sneha Reddy",
    courseType: "Online Tuition",
    courseName: "Science",
    packageName: "6 Months",
    amount: 60000,
    paymentStatus: "Paid",
    paymentMethod: "Net Banking"
  },
  {
    invoiceId: "INV-2026-003",
    date: "2026-05-15",
    studentName: "Kabir Malhotra",
    courseType: "Online School",
    courseName: "English",
    packageName: "1 Year",
    amount: 110000,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card"
  },
  {
    invoiceId: "INV-2026-004",
    date: "2026-05-12",
    studentName: "Aria Fernandes",
    courseType: "Hybrid Learning",
    courseName: "Social Studies",
    packageName: "2 Months",
    amount: 25000,
    paymentStatus: "Paid",
    paymentMethod: "UPI"
  },
  {
    invoiceId: "INV-2026-005",
    date: "2026-05-10",
    studentName: "Vikram Sen",
    courseType: "Online Tuition",
    courseName: "Computer Science",
    packageName: "1 Month",
    amount: 12000,
    paymentStatus: "Refunded",
    paymentMethod: "UPI"
  },
  {
    invoiceId: "INV-2026-006",
    date: "2026-05-08",
    studentName: "Meera Joshi",
    courseType: "Online School",
    courseName: "Physics",
    packageName: "Custom (9 Months)",
    amount: 90000,
    paymentStatus: "Paid",
    paymentMethod: "Debit Card"
  },
  {
    invoiceId: "INV-2026-005B",
    date: "2026-05-05",
    studentName: "Vikram Sen",
    courseType: "Online Tuition",
    courseName: "Computer Science",
    packageName: "1 Month",
    amount: 12000,
    paymentStatus: "Paid",
    paymentMethod: "UPI"
  },
  {
    invoiceId: "INV-2026-007",
    date: "2026-05-02",
    studentName: "Aman Gupta",
    courseType: "Online Tuition",
    courseName: "Mathematics",
    packageName: "3 Months",
    amount: 30000,
    paymentStatus: "Pending",
    paymentMethod: "Net Banking"
  },
  {
    invoiceId: "INV-2026-008",
    date: "2026-05-01",
    studentName: "Tanya Sen",
    courseType: "Online School",
    courseName: "English",
    packageName: "6 Months",
    amount: 55000,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card"
  }
];
