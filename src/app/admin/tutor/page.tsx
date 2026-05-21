"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, Search } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Student } from "@/components/students/StudentStats";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Modular Component Imports
import TutorStats from "@/components/tutors/TutorStats";
import TutorTable from "@/components/tutors/TutorTable";
import AddTutorForm from "@/components/tutors/AddTutorForm";

// Interface Definitions
export interface Tutor {
  id: string;
  name: string;
  email: string;
  subject: string;
  experience: string;
  availability: string; // "Full-time" | "Part-time" | "Weekends Only"
  status: "Pending HR Approval" | "Approved";
  permissions: {
    uploadNotes: boolean;
    editNotes: boolean;
    shareMaterials: boolean;
  };
  growthMetrics: {
    growthOfStudents: number; // 1-5
    responsibility: number;   // 1-5
    ownership: number;        // 1-5
    workEthics: number;       // 1-5
    teamwork: number;         // 1-5
    honesty: number;          // 1-5
  };
}

// Initial Mock Tutors Data
const initialTutors: Tutor[] = [
  {
    id: "TUT-001",
    name: "Dr. Ramesh Prasad",
    email: "ramesh.prasad@knowlix.com",
    subject: "Advanced Physics",
    experience: "8 years",
    availability: "Full-time",
    status: "Approved",
    permissions: { uploadNotes: true, editNotes: true, shareMaterials: true },
    growthMetrics: { growthOfStudents: 5, responsibility: 5, ownership: 5, workEthics: 5, teamwork: 4, honesty: 5 }
  },
  {
    id: "TUT-002",
    name: "Sarah Jenkins",
    email: "sarah.j@knowlix.com",
    subject: "English Literature",
    experience: "5 years",
    availability: "Part-time",
    status: "Approved",
    permissions: { uploadNotes: true, editNotes: false, shareMaterials: true },
    growthMetrics: { growthOfStudents: 4, responsibility: 5, ownership: 4, workEthics: 5, teamwork: 5, honesty: 5 }
  },
  {
    id: "TUT-003",
    name: "Amit Shah",
    email: "amit.shah@knowlix.com",
    subject: "Mathematics (JEE)",
    experience: "12 years",
    availability: "Full-time",
    status: "Approved",
    permissions: { uploadNotes: true, editNotes: true, shareMaterials: true },
    growthMetrics: { growthOfStudents: 5, responsibility: 5, ownership: 5, workEthics: 4, teamwork: 5, honesty: 5 }
  },
  {
    id: "TUT-004",
    name: "Priya Nair",
    email: "priya.nair@knowlix.com",
    subject: "Organic Chemistry",
    experience: "6 years",
    availability: "Part-time",
    status: "Approved",
    permissions: { uploadNotes: true, editNotes: false, shareMaterials: false },
    growthMetrics: { growthOfStudents: 4, responsibility: 4, ownership: 4, workEthics: 4, teamwork: 4, honesty: 5 }
  },
  {
    id: "TUT-005",
    name: "David Miller",
    email: "david.m@knowlix.com",
    subject: "Computer Science (Python)",
    experience: "4 years",
    availability: "Full-time",
    status: "Approved",
    permissions: { uploadNotes: true, editNotes: true, shareMaterials: false },
    growthMetrics: { growthOfStudents: 4, responsibility: 5, ownership: 5, workEthics: 5, teamwork: 4, honesty: 5 }
  },
  {
    id: "TUT-006",
    name: "Ananya Roy",
    email: "ananya.roy@knowlix.com",
    subject: "Biology",
    experience: "7 years",
    availability: "Part-time",
    status: "Approved",
    permissions: { uploadNotes: false, editNotes: false, shareMaterials: true },
    growthMetrics: { growthOfStudents: 4, responsibility: 4, ownership: 5, workEthics: 4, teamwork: 5, honesty: 5 }
  },
  {
    id: "TUT-007",
    name: "Vikram Malhotra",
    email: "vikram.m@knowlix.com",
    subject: "Chemistry",
    experience: "3 years",
    availability: "Part-time",
    status: "Pending HR Approval",
    permissions: { uploadNotes: false, editNotes: false, shareMaterials: false },
    growthMetrics: { growthOfStudents: 3, responsibility: 3, ownership: 3, workEthics: 3, teamwork: 3, honesty: 3 }
  },
  {
    id: "TUT-008",
    name: "Sneha Sen",
    email: "sneha.sen@knowlix.com",
    subject: "Mathematics",
    experience: "2 years",
    availability: "Part-time",
    status: "Pending HR Approval",
    permissions: { uploadNotes: false, editNotes: false, shareMaterials: false },
    growthMetrics: { growthOfStudents: 3, responsibility: 3, ownership: 3, workEthics: 3, teamwork: 3, honesty: 3 }
  }
];

function TutorsContent() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "recruitment">("active");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [expFilter, setExpFilter] = useState("All");

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from Local Storage
  useEffect(() => {
    const storedTutors = localStorage.getItem("knowlix_tutors");
    if (storedTutors) {
      try {
        setTutors(JSON.parse(storedTutors));
      } catch (e) {
        console.error("Error parsing stored tutors:", e);
      }
    } else {
      localStorage.setItem("knowlix_tutors", JSON.stringify(initialTutors));
      setTutors(initialTutors);
    }

    const storedStudents = localStorage.getItem("knowlix_students");
    if (storedStudents) {
      try {
        setStudents(JSON.parse(storedStudents));
      } catch (e) {
        console.error("Error parsing stored students:", e);
      }
    }
  }, []);

  const saveTutorsState = (updatedList: Tutor[]) => {
    setTutors(updatedList);
    localStorage.setItem("knowlix_tutors", JSON.stringify(updatedList));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3050);
  };

  // HR Action: Approve and Admit Tutor
  const handleApproveTutor = (tutorId: string) => {
    const updated = tutors.map(t =>
      t.id === tutorId ? { ...t, status: "Approved" as const } : t
    );
    saveTutorsState(updated);
    const name = tutors.find(t => t.id === tutorId)?.name || "Tutor";
    triggerToast(`HR Approved & Admitted: "${name}" is now active in the system.`);
  };



  // Register New Tutor
  const handleAddTutor = (tutorData: {
    name: string;
    email: string;
    subject: string;
    experienceNum: string;
    availability: string;
    status: "Pending HR Approval" | "Approved";
  }) => {
    const nextIdNum = tutors.length > 0 ? Math.max(...tutors.map(t => parseInt(t.id.split("-")[1]))) + 1 : 1;
    const nextId = `TUT-${String(nextIdNum).padStart(3, "0")}`;

    const newTutor: Tutor = {
      id: nextId,
      name: tutorData.name,
      email: tutorData.email,
      subject: tutorData.subject,
      experience: `${tutorData.experienceNum} years`,
      availability: tutorData.availability,
      status: tutorData.status,
      permissions: { uploadNotes: false, editNotes: false, shareMaterials: false },
      growthMetrics: { growthOfStudents: 3, responsibility: 3, ownership: 3, workEthics: 3, teamwork: 3, honesty: 3 }
    };

    saveTutorsState([...tutors, newTutor]);
    setIsAddModalOpen(false);
    triggerToast(`Tutor "${tutorData.name}" registered successfully!`);
  };

  // Calculate overall performance rating average for a tutor
  const calculateTutorAverage = (tutor: Tutor) => {
    const m = tutor.growthMetrics;
    const sum = m.growthOfStudents + m.responsibility + m.ownership + m.workEthics + m.teamwork + m.honesty;
    return (sum / 6).toFixed(2);
  };

  // Overall stats calculations
  const totalTutors = tutors.length;
  const activeCount = tutors.filter(t => t.status === "Approved").length;
  const pendingCount = tutors.filter(t => t.status === "Pending HR Approval").length;

  const companyAverage = (() => {
    const approvedTutors = tutors.filter(t => t.status === "Approved");
    if (approvedTutors.length === 0) return "0.0";
    const sum = approvedTutors.reduce((acc, t) => acc + parseFloat(calculateTutorAverage(t)), 0);
    return (sum / approvedTutors.length).toFixed(2);
  })();

  // Filter & Search Logic
  const filteredTutors = tutors.filter((tutor) => {
    const matchesTab = activeTab === "active" ? tutor.status === "Approved" : tutor.status === "Pending HR Approval";

    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = subjectFilter === "All" || tutor.subject.toLowerCase().includes(subjectFilter.toLowerCase());

    let matchesExp = true;
    if (expFilter === "<5") {
      const yrs = parseInt(tutor.experience);
      matchesExp = yrs < 5;
    } else if (expFilter === "5-10") {
      const yrs = parseInt(tutor.experience);
      matchesExp = yrs >= 5 && yrs <= 10;
    } else if (expFilter === ">10") {
      const yrs = parseInt(tutor.experience);
      matchesExp = yrs > 10;
    }

    return matchesTab && matchesSearch && matchesSubject && matchesExp;
  });

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

      {/* Header Banner */}
      <DashboardHeader
        title="Tutors Management"
        description="Recruit, approve, grant study permissions, and monitor G-R-O-W-T-H performance ratings."
        actions={
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full h-10 px-4 py-2.5 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm shadow-md shadow-green-600/10 hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Tutor
          </Button>
        }
      />

      {/* Stats Section */}
      <TutorStats
        totalTutors={totalTutors}
        activeCount={activeCount}
        pendingCount={pendingCount}
        companyAverage={companyAverage}
      />

      {/* Tabs & Filters */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val as "active" | "recruitment");
        }}
      >
        <TabsList className="mb-4 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger
            value="active"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Active Tutors ({activeCount})
          </TabsTrigger>
          <TabsTrigger
            value="recruitment"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Recruitment Pool ({pendingCount})
          </TabsTrigger>
        </TabsList>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <Input
              type="text"
              placeholder="Search tutors by name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-10 bg-white border border-slate-200 focus:border-green-500 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Subject Expertise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Subject Expertise</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
              </SelectContent>
            </Select>

            <Select value={expFilter} onValueChange={setExpFilter}>
              <SelectTrigger className="h-9 text-xs font-semibold bg-white border-slate-200 rounded-xl">
                <SelectValue placeholder="All Experiences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Experiences</SelectItem>
                <SelectItem value="<5">Less than 5 years</SelectItem>
                <SelectItem value="5-10">5 to 10 years</SelectItem>
                <SelectItem value=">10">More than 10 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Directory Table (shared across both tabs — filtered by activeTab state) */}
        <TabsContent value="active" forceMount className="data-[state=inactive]:hidden mt-0">
          <TutorTable
            tutors={filteredTutors}
            students={students}
            onApproveTutor={handleApproveTutor}
          />
        </TabsContent>
        <TabsContent value="recruitment" forceMount className="data-[state=inactive]:hidden mt-0">
          <TutorTable
            tutors={filteredTutors}
            students={students}
            onApproveTutor={handleApproveTutor}
          />
        </TabsContent>
      </Tabs>


      {/* Add Tutor Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <AddTutorForm
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddTutor}
          />
        </div>
      )}
    </div>
  );
}

export default function TutorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorsContent />
    </Suspense>
  );
}
