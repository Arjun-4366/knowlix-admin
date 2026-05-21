"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Student } from "@/components/students/StudentStats";
import TutorAssessmentStats, {
  Assignment,
  Exam,
  Evaluation,
} from "@/components/tutor/TutorAssessmentStats";
import TutorAssignmentManager from "@/components/tutor/TutorAssignmentManager";
import TutorExamManager from "@/components/tutor/TutorExamManager";
import TutorEvaluationManager from "@/components/tutor/TutorEvaluationManager";

const initialStudents: Student[] = [
  {
    id: "STU-101",
    name: "Rahul Sharma",
    parentName: "Anil Sharma",
    grade: "Grade 10",
    location: "Bangalore, IN",
    courseType: "Online School",
    courseName: "Mathematics",
    packageSelection: "3 Months",
    documentsSubmitted: ["Birth Certificate", "Transfer Certificate", "Previous Academic Records", "Identification Documents"],
    coordinatorName: "Dr. Ramesh Prasad",
    subjectTutor: "Dr. Ramesh Prasad",
    mentorSalesBro: "Sarah Jenkins",
    admissionStatus: "Approved",
  },
  {
    id: "STU-102",
    name: "Sneha Reddy",
    parentName: "V. Reddy",
    grade: "Grade 12",
    location: "Hyderabad, IN",
    courseType: "Online Tuition",
    courseName: "Science",
    packageSelection: "6 Months",
    documentsSubmitted: ["Birth Certificate", "Identification Documents"],
    coordinatorName: "Sarah Jenkins",
    subjectTutor: "Amit Shah",
    mentorSalesBro: "David Miller",
    admissionStatus: "In Review",
  },
  {
    id: "STU-103",
    name: "Kabir Malhotra",
    parentName: "Sanjay Malhotra",
    grade: "Grade 8",
    location: "Delhi, IN",
    courseType: "Online School",
    courseName: "English",
    packageSelection: "1 Year",
    documentsSubmitted: ["Birth Certificate", "Transfer Certificate", "Previous Academic Records", "Identification Documents"],
    coordinatorName: "Amit Shah",
    subjectTutor: "Ananya Roy",
    mentorSalesBro: "Sarah Jenkins",
    admissionStatus: "Approved",
  },
  {
    id: "STU-104",
    name: "Aria Fernandes",
    parentName: "J. Fernandes",
    grade: "Grade 11",
    location: "Goa, IN",
    courseType: "Hybrid Learning",
    courseName: "Social Studies",
    packageSelection: "2 Months",
    documentsSubmitted: ["Birth Certificate", "Previous Academic Records"],
    coordinatorName: "David Miller",
    subjectTutor: "Dr. Ramesh Prasad",
    mentorSalesBro: "Amit Shah",
    admissionStatus: "Pending Approval",
  },
  {
    id: "STU-105",
    name: "Vikram Sen",
    parentName: "Rajesh Sen",
    grade: "Grade 9",
    location: "Kolkata, IN",
    courseType: "Online Tuition",
    courseName: "Computer Science",
    packageSelection: "1 Month",
    documentsSubmitted: ["Identification Documents"],
    coordinatorName: "Ananya Roy",
    subjectTutor: "Sarah Jenkins",
    mentorSalesBro: "David Miller",
    admissionStatus: "Rejected",
  },
  {
    id: "STU-106",
    name: "Meera Joshi",
    parentName: "Sunita Joshi",
    grade: "Grade 10",
    location: "Pune, IN",
    courseType: "Online School",
    courseName: "Physics",
    packageSelection: "Custom (9 Months)",
    documentsSubmitted: ["Birth Certificate", "Transfer Certificate", "Previous Academic Records", "Identification Documents"],
    coordinatorName: "Dr. Ramesh Prasad",
    subjectTutor: "Dr. Ramesh Prasad",
    mentorSalesBro: "Sarah Jenkins",
    admissionStatus: "Approved",
  },
];

// Helper to construct dates relative to today
const getDateAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

const initialAssignments: Assignment[] = [
  {
    id: "ASG-1",
    title: "Calculus Limits Sheet",
    description: "Complete all questions from Section 4.2 in the workbook.",
    subject: "Mathematics",
    dueDate: getDateAgo(-3), // 3 days from now
    status: "Active",
    totalStudents: 3,
    submittedCount: 2,
    tutorName: "Dr. Ramesh Prasad",
  },
  {
    id: "ASG-2",
    title: "Newton's Laws Lab",
    description: "Submit PDF report for the gravity acceleration experiment.",
    subject: "Physics",
    dueDate: getDateAgo(2), // 2 days ago
    status: "Completed",
    totalStudents: 3,
    submittedCount: 3,
    tutorName: "Dr. Ramesh Prasad",
  },
  {
    id: "ASG-3",
    title: "Medieval History Essay",
    description: "Write a 500-word summary on feudal structures.",
    subject: "Social Studies",
    dueDate: getDateAgo(-7), // 7 days from now
    status: "Active",
    totalStudents: 1,
    submittedCount: 0,
    tutorName: "Dr. Ramesh Prasad",
  },
];

const initialExams: Exam[] = [
  {
    id: "EXM-1",
    title: "Calculus Mid-Term Exam",
    subject: "Mathematics",
    date: getDateAgo(-1), // Tomorrow
    time: "03:00 PM",
    duration: "90 min",
    status: "Pending",
    tutorName: "Dr. Ramesh Prasad",
  },
  {
    id: "EXM-2",
    title: "Kinematics Mechanics Quiz",
    subject: "Physics",
    date: getDateAgo(4), // 4 days ago
    time: "04:30 PM",
    duration: "45 min",
    status: "Conducted",
    tutorName: "Dr. Ramesh Prasad",
  },
];

const initialEvaluations: Evaluation[] = [
  {
    id: "EVL-1",
    studentId: "STU-101",
    studentName: "Rahul Sharma",
    assessmentType: "Assignment",
    assessmentId: "ASG-2",
    assessmentTitle: "Newton's Laws Lab",
    maxMarks: 100,
    obtainedMarks: 94,
    grade: "A+",
    remarks: "Excellent lab structure, very detailed graphs.",
    evaluatedAt: getDateAgo(1),
    tutorName: "Dr. Ramesh Prasad",
  },
  {
    id: "EVL-2",
    studentId: "STU-106",
    studentName: "Meera Joshi",
    assessmentType: "Assignment",
    assessmentId: "ASG-2",
    assessmentTitle: "Newton's Laws Lab",
    maxMarks: 100,
    obtainedMarks: 82,
    grade: "A",
    remarks: "Good analysis, but calculations had minor errors.",
    evaluatedAt: getDateAgo(1),
    tutorName: "Dr. Ramesh Prasad",
  },
  {
    id: "EVL-3",
    studentId: "STU-101",
    studentName: "Rahul Sharma",
    assessmentType: "Exam",
    assessmentId: "EXM-2",
    assessmentTitle: "Kinematics Mechanics Quiz",
    maxMarks: 50,
    obtainedMarks: 38,
    grade: "B",
    remarks: "Solid overall, review circular motion concepts.",
    evaluatedAt: getDateAgo(3),
    tutorName: "Dr. Ramesh Prasad",
  },
];

function TutorAssessmentContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // Load from local storage
  useEffect(() => {
    // 1. Students
    const storedStudents = localStorage.getItem("knowlix_students");
    if (storedStudents) {
      try {
        setStudents(JSON.parse(storedStudents));
      } catch (e) {
        console.error("Error parsing stored students:", e);
      }
    } else {
      localStorage.setItem("knowlix_students", JSON.stringify(initialStudents));
      setStudents(initialStudents);
    }

    // 2. Assignments
    const storedAssignments = localStorage.getItem("knowlix_assignments");
    if (storedAssignments) {
      try {
        setAssignments(JSON.parse(storedAssignments));
      } catch (e) {
        console.error("Error parsing stored assignments:", e);
      }
    } else {
      localStorage.setItem("knowlix_assignments", JSON.stringify(initialAssignments));
      setAssignments(initialAssignments);
    }

    // 3. Exams
    const storedExams = localStorage.getItem("knowlix_exams");
    if (storedExams) {
      try {
        setExams(JSON.parse(storedExams));
      } catch (e) {
        console.error("Error parsing stored exams:", e);
      }
    } else {
      localStorage.setItem("knowlix_exams", JSON.stringify(initialExams));
      setExams(initialExams);
    }

    // 4. Evaluations
    const storedEvaluations = localStorage.getItem("knowlix_evaluations");
    if (storedEvaluations) {
      try {
        setEvaluations(JSON.parse(storedEvaluations));
      } catch (e) {
        console.error("Error parsing stored evaluations:", e);
      }
    } else {
      localStorage.setItem("knowlix_evaluations", JSON.stringify(initialEvaluations));
      setEvaluations(initialEvaluations);
    }
  }, []);

  // Assignments Handlers
  const handleAddAssignment = (newAsg: Assignment) => {
    const updated = [newAsg, ...assignments];
    setAssignments(updated);
    localStorage.setItem("knowlix_assignments", JSON.stringify(updated));
  };

  const handleToggleAssignmentStatus = (id: string) => {
    const updated = assignments.map((asg) => {
      if (asg.id === id) {
        const nextStatus: "Active" | "Completed" = asg.status === "Active" ? "Completed" : "Active";
        // If changing status to Completed, let's pretend all students submitted it if submittedCount is 0
        const nextSubmitted = nextStatus === "Completed" ? asg.totalStudents : asg.submittedCount;
        return { ...asg, status: nextStatus, submittedCount: nextSubmitted };
      }
      return asg;
    });
    setAssignments(updated);
    localStorage.setItem("knowlix_assignments", JSON.stringify(updated));
  };

  const handleDeleteAssignment = (id: string) => {
    const updated = assignments.filter((asg) => asg.id !== id);
    setAssignments(updated);
    localStorage.setItem("knowlix_assignments", JSON.stringify(updated));
  };

  // Exams Handlers
  const handleAddExam = (newExm: Exam) => {
    const updated = [newExm, ...exams];
    setExams(updated);
    localStorage.setItem("knowlix_exams", JSON.stringify(updated));
  };

  const handleToggleExamStatus = (id: string) => {
    const updated = exams.map((exm) => {
      if (exm.id === id) {
        return {
          ...exm,
          status: (exm.status === "Pending" ? "Conducted" : "Pending") as "Pending" | "Conducted",
        };
      }
      return exm;
    });
    setExams(updated);
    localStorage.setItem("knowlix_exams", JSON.stringify(updated));
  };

  const handleDeleteExam = (id: string) => {
    const updated = exams.filter((exm) => exm.id !== id);
    setExams(updated);
    localStorage.setItem("knowlix_exams", JSON.stringify(updated));
  };

  // Evaluations Handlers
  const handleAddEvaluation = (newEvl: Evaluation) => {
    const updated = [newEvl, ...evaluations];
    setEvaluations(updated);
    localStorage.setItem("knowlix_evaluations", JSON.stringify(updated));
  };

  const handleDeleteEvaluation = (id: string) => {
    const updated = evaluations.filter((ev) => ev.id !== id);
    setEvaluations(updated);
    localStorage.setItem("knowlix_evaluations", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 w-full pb-10">
      <DashboardHeader
        title="Assessment & Evaluation"
        description="Manage homework assignments, track test schedules, and manually evaluate/grade student performance."
      />

      {/* Analytics stats */}
      <TutorAssessmentStats
        assignments={assignments}
        exams={exams}
        evaluations={evaluations}
      />

      {/* Tabs */}
      <Tabs defaultValue="assignments">
        <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-6">
          <TabsTrigger
            value="assignments"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Assignment Management
          </TabsTrigger>
          <TabsTrigger
            value="exams"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Exam Management
          </TabsTrigger>
          <TabsTrigger
            value="evaluation"
            className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:shadow-none data-[state=active]:text-white cursor-pointer"
          >
            Evaluation & Marks Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-0 outline-none">
          <TutorAssignmentManager
            assignments={assignments}
            onAddAssignment={handleAddAssignment}
            onToggleAssignmentStatus={handleToggleAssignmentStatus}
            onDeleteAssignment={handleDeleteAssignment}
          />
        </TabsContent>

        <TabsContent value="exams" className="mt-0 outline-none">
          <TutorExamManager
            exams={exams}
            onAddExam={handleAddExam}
            onToggleExamStatus={handleToggleExamStatus}
            onDeleteExam={handleDeleteExam}
          />
        </TabsContent>

        <TabsContent value="evaluation" className="mt-0 outline-none">
          <TutorEvaluationManager
            students={students}
            assignments={assignments}
            exams={exams}
            evaluations={evaluations}
            onAddEvaluation={handleAddEvaluation}
            onDeleteEvaluation={handleDeleteEvaluation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TutorAssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorAssessmentContent />
    </Suspense>
  );
}
