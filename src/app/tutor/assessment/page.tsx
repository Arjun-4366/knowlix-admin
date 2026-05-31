"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Student } from "@/components/admin/students/StudentStats";
import TutorAssessmentStats, {
  Exam,
  Evaluation,
} from "@/components/tutor/TutorAssessmentStats";
import TutorAssignmentCreator from "@/components/tutor/assignments/TutorAssignmentCreator";
import TutorExamManager from "@/components/tutor/TutorExamManager";
import TutorEvaluationManager from "@/components/tutor/TutorEvaluationManager";
import { useGetTutorAssignments } from "@/querys/tutor/assignmentQuery";
import { useGetTutorExams } from "@/querys/tutor/examQuery";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { IStudent } from "@/types/admin/student";
import { ITutorExam } from "@/types/tutor/exams";

const getDateAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

const initialEvaluations: Evaluation[] = [
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
  const { data: assignmentsResponse, isLoading: loadingAssignments } = useGetTutorAssignments();
  const { data: examsResponse, isLoading: loadingExams } = useGetTutorExams();
  const { data: studentsResponse, isLoading: loadingStudents } = useGetTutorStudents();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const assignments = assignmentsResponse?.data || [];
  const exams = examsResponse?.data || [];
  const students = studentsResponse?.data || [];

  // Load from local storage
  useEffect(() => {
    // 3. Evaluations
    const storedEvaluations = localStorage.getItem("knowlix_evaluations");
    if (storedEvaluations) {
      try {
        const parsed = JSON.parse(storedEvaluations) as Evaluation[];
        const cleaned = parsed.filter((ev) => ev.assessmentType !== "Assignment");
        setEvaluations(cleaned);
        localStorage.setItem("knowlix_evaluations", JSON.stringify(cleaned));
      } catch (e) {
        console.error("Error parsing stored evaluations:", e);
      }
    } else {
      localStorage.setItem("knowlix_evaluations", JSON.stringify(initialEvaluations));
      setEvaluations(initialEvaluations);
    }
  }, []);

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

  const isLoading = loadingAssignments || loadingExams || loadingStudents;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <TutorAssignmentCreator hideHeader={true} hideStats={true} />
        </TabsContent>

        <TabsContent value="exams" className="mt-0 outline-none">
          <TutorExamManager />
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
