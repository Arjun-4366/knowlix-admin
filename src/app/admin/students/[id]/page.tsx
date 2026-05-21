"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, FileText, CheckCircle, Info, ShieldAlert, GraduationCap, MapPin, User, UserCheck } from "lucide-react";
import { Student } from "@/components/students/StudentStats";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load students database from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("knowlix_students");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Student[];
        setStudents(parsed);
        const match = parsed.find((s) => s.id === id);
        if (match) {
          setStudent(match);
        }
      } catch (e) {
        console.error("Error loading students:", e);
      }
    }
  }, [id]);

  const handleUpdateStatus = (newStatus: string) => {
    if (!student) return;

    const updatedStudent = { ...student, admissionStatus: newStatus };
    setStudent(updatedStudent);

    const updatedList = students.map((s) => (s.id === student.id ? updatedStudent : s));
    setStudents(updatedList);
    localStorage.setItem("knowlix_students", JSON.stringify(updatedList));

    triggerToast(`Updated status to "${newStatus}"`);
  };

  const handleUpdateAssignment = (field: keyof Student, value: string) => {
    if (!student) return;

    const updatedStudent = { ...student, [field]: value };
    setStudent(updatedStudent);

    const updatedList = students.map((s) => (s.id === student.id ? updatedStudent : s));
    setStudents(updatedList);
    localStorage.setItem("knowlix_students", JSON.stringify(updatedList));

    let label = "";
    if (field === "coordinatorName") label = "Academic Coordinator";
    else if (field === "subjectTutor") label = "Subject Tutor";
    else if (field === "mentorSalesBro") label = "Mentor - Sales Bro";
    else label = String(field);

    triggerToast(`Updated ${label} to "${value}"`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
      case "Pending Approval":
      case "Pending":
      case "In Review":
        return "bg-slate-50 text-slate-650 border-slate-200/60";
      case "Rejected":
        return "bg-slate-100 text-slate-500 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Info className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Student Not Found</h3>
          <p className="text-sm text-slate-500 mt-1">We couldn&apos;t find a student matching ID &quot;{id}&quot;.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/students")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-650 hover:bg-slate-50 text-sm font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Button>
      </div>
    );
  }

  const docsProgress = student.documentsSubmitted ? student.documentsSubmitted.length : 0;

  return (
    <div className="space-y-6 pb-12 relative max-w-5xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--brand-dark)] text-white border border-slate-700/30 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-5 h-5 rounded-full bg-[var(--brand-green)] flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Back Link */}
      <div>
        <button
          onClick={() => router.push("/admin/students")}
          className="flex items-center gap-2 text-slate-500 hover:text-[var(--brand-green)] font-semibold text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Students Directory
        </button>
      </div>

      {/* Student Main Profile Header Panel */}
      <Card className="bg-white border-slate-150 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-2xl border border-[var(--brand-light)]/20 shadow-inner">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2.5">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{student.name}</h1>
              <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                {student.id}
              </Badge>
            </div>
            <p className="text-sm text-slate-550 font-semibold mt-1">
              {student.courseName ? `${student.courseName} / ` : ""}
              {student.courseType} • {student.grade}
            </p>
          </div>
        </div>

        {/* Status Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
          <div className="text-left sm:text-right">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Admission Status</span>
            <Badge variant="outline" className={cn(
              "inline-flex px-3 py-1 rounded-full text-xs font-bold border mt-1 shadow-sm h-6",
              getStatusBadgeClass(student.admissionStatus)
            )}>
              {student.admissionStatus}
            </Badge>
          </div>

          <div className="w-full sm:w-auto">
            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Modify Status</span>
            <Select value={student.admissionStatus} onValueChange={handleUpdateStatus}>
              <SelectTrigger className="px-3.5 py-1.5 text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl w-full sm:w-44 justify-between h-9 text-slate-700">
                <SelectValue placeholder={student.admissionStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Main Info Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Card */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">Academic Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-3.5">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Class / Grade</span>
              <span className="text-sm font-semibold text-slate-700">{student.grade}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Course / Program</span>
              <span className="text-sm font-semibold text-slate-700">{student.courseType}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Course Subject</span>
              <span className="text-sm font-semibold text-slate-700">{student.courseName || "General"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Administration Info */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">Registration Info</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-3.5">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Parent / Guardian Name</span>
              <span className="text-sm font-semibold text-slate-700">{student.parentName}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Location / Origin</span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {student.location}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Package Selected</span>
              <span className="text-sm font-semibold text-slate-700">{student.packageSelection}</span>
            </div>
          </CardContent>
        </Card>

        {/* Coordinator Profile */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">Staff Assignments</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-4">
            <div className="space-y-1.5">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Academic Coordinator</span>
              <Select
                value={student.coordinatorName || "David Miller"}
                onValueChange={(val) => handleUpdateAssignment("coordinatorName", val)}
              >
                <SelectTrigger className="w-full text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 h-8 justify-between">
                  <SelectValue placeholder={student.coordinatorName} />
                </SelectTrigger>
                <SelectContent>
                  {["Dr. Ramesh Prasad", "Amit Shah", "Sarah Jenkins", "David Miller", "Ananya Roy"].map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Subject Tutor</span>
              <Select
                value={student.subjectTutor || "Dr. Ramesh Prasad"}
                onValueChange={(val) => handleUpdateAssignment("subjectTutor", val)}
              >
                <SelectTrigger className="w-full text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 h-8 justify-between">
                  <SelectValue placeholder={student.subjectTutor} />
                </SelectTrigger>
                <SelectContent>
                  {["Dr. Ramesh Prasad", "Amit Shah", "Sarah Jenkins", "David Miller", "Ananya Roy"].map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Mentor - Sales Bro</span>
              <Select
                value={student.mentorSalesBro || "Sarah Jenkins"}
                onValueChange={(val) => handleUpdateAssignment("mentorSalesBro", val)}
              >
                <SelectTrigger className="w-full text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 h-8 justify-between">
                  <SelectValue placeholder={student.mentorSalesBro} />
                </SelectTrigger>
                <SelectContent>
                  {["Dr. Ramesh Prasad", "Amit Shah", "Sarah Jenkins", "David Miller", "Ananya Roy"].map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="block text-[10px] uppercase font-bold text-slate-450">School Branch</span>
                <span className="text-xs font-semibold text-slate-700">Knowlix Learning Center</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="block text-[10px] uppercase font-bold text-slate-450">Access Key</span>
                <span className="text-xs font-mono text-slate-500 uppercase">{student.id.toLowerCase()}-session-prod</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Checklist Panel */}
      <Card className="bg-white border-slate-150 p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--brand-green)]" />
            <div>
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">Required Document Submission</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Checked items are verified and approved by the admissions coordinator.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700">{docsProgress} / 4 Submitted</span>
            </div>
            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[var(--brand-green)] h-full rounded-full transition-all duration-500"
                style={{ width: `${(docsProgress / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Birth Certificate", "Transfer Certificate", "Previous Academic Records", "Identification Documents"].map((doc) => {
            const isSubmitted = student.documentsSubmitted?.includes(doc);

            return (
              <div
                key={doc}
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-between transition-all",
                  isSubmitted
                    ? "border-[var(--brand-green)]/35 bg-[var(--brand-light-green)]/15"
                    : "border-slate-200 bg-slate-50/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border",
                    isSubmitted
                      ? "bg-[var(--brand-light-green)] text-[var(--brand-green)] border-[var(--brand-light)]/20"
                      : "bg-white text-slate-400 border-slate-200"
                  )}>
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">{doc}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">
                      {isSubmitted ? "File upload verified" : "Pending parent upload"}
                    </p>
                  </div>
                </div>

                <div>
                  {isSubmitted ? (
                    <Badge variant="outline" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand-green)] bg-[var(--brand-light-green)] px-2.5 py-1 rounded-lg border border-[var(--brand-light)]/20 shadow-sm h-7">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-450 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm h-7">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
