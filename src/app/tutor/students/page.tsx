"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Student } from "@/components/students/StudentStats";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import TutorStudentStats from "@/components/tutor/TutorStudentStats";
import TutorStudentTable from "@/components/tutor/TutorStudentTable";

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

function TutorStudentsContent() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);

  // Load from local storage and sync
  useEffect(() => {
    const stored = localStorage.getItem("knowlix_students");
    if (stored) {
      try {
        setStudents(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored students:", e);
      }
    } else {
      localStorage.setItem("knowlix_students", JSON.stringify(initialStudents));
      setStudents(initialStudents);
    }
  }, []);

  const handleViewDetails = (id: string) => {
    router.push(`/tutor/students/${id}`);
  };

  return (
    <div className="space-y-8 w-full pb-10">
      <DashboardHeader
        title="Student Roster"
        description="Manage your assigned students, monitor program status, and track package selections."
      />

      <TutorStudentStats students={students} />

      <TutorStudentTable students={students} onViewStudent={handleViewDetails} />
    </div>
  );
}

export default function TutorStudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorStudentsContent />
    </Suspense>
  );
}
