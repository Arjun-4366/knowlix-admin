"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Check, X } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import StudentStats, { Student } from "@/components/students/StudentStats";
import StudentTable from "@/components/students/StudentTable";
import AddStudentForm from "@/components/students/AddStudentForm";
import { Button } from "@/components/ui/button";

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

function StudentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and sync with localStorage
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
    }
  }, []);

  const saveStudents = (updatedList: Student[]) => {
    setStudents(updatedList);
    localStorage.setItem("knowlix_students", JSON.stringify(updatedList));
  };

  useEffect(() => {
    if (searchParams && searchParams.get("add") === "true") {
      setIsModalOpen(true);
      router.replace("/admin/students");
    }
  }, [searchParams, router]);

  const handleAddStudent = (newStudent: Omit<Student, "id">) => {
    const nextIdNum =
      students.length > 0
        ? Math.max(...students.map((s) => parseInt(s.id.split("-")[1]))) + 1
        : 101;
    const nextId = `STU-${nextIdNum}`;

    const updated = [
      ...students,
      {
        ...newStudent,
        id: nextId,
      },
    ];
    saveStudents(updated);
    setIsModalOpen(false);
    triggerToast(`Student "${newStudent.name}" registered successfully!`);
  };

  const handleDeleteStudent = (id: string) => {
    const studentName = students.find((s) => s.id === id)?.name || "";
    const updated = students.filter((s) => s.id !== id);
    saveStudents(updated);
    triggerToast(`Student "${studentName}" deleted successfully.`);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updated = students.map((s) => (s.id === id ? { ...s, admissionStatus: newStatus } : s));
    saveStudents(updated);
    const studentName = students.find((s) => s.id === id)?.name || "";
    triggerToast(`Updated ${studentName}'s status to "${newStatus}"`);
  };

  const handleViewStudent = (student: Student) => {
    router.push(`/admin/students/${student.id}`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const actions = (
    <Button
      onClick={() => setIsModalOpen(true)}
      className="w-full h-10 px-4 py-2.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm shadow-md shadow-green-600/10 hover:shadow-lg transition-all"
    >
      <Plus className="w-4 h-4 mr-1.5" />
      Add Student
    </Button>
  );

  return (
    <div className="space-y-8 w-full relative pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--brand-dark)] text-white border border-slate-700/30 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-5 h-5 rounded-full bg-[var(--brand-green)] flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <DashboardHeader
        title="Students Directory"
        description="View admissions status, custom packages, coordinators, and document checklists."
        actions={actions}
      />

      <StudentStats students={students} />

      <StudentTable
        students={students}
        onDeleteStudent={handleDeleteStudent}
        onUpdateStatus={handleUpdateStatus}
        onViewStudent={handleViewStudent}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <AddStudentForm
            onSubmit={handleAddStudent}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentsContent />
    </Suspense>
  );
}
