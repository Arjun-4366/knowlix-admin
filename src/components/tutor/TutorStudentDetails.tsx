"use client";

import {
  ArrowLeft,
  FileText,
  CheckCircle,
  GraduationCap,
  MapPin,
  User,
  Package,
  ShieldAlert,
} from "lucide-react";
import { Student } from "@/components/students/StudentStats";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TutorStudentDetailsProps {
  student: Student;
  onBack: () => void;
}

export default function TutorStudentDetails({
  student,
  onBack,
}: TutorStudentDetailsProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
      case "Pending Approval":
      case "Pending":
      case "In Review":
        return "bg-slate-50 text-slate-650 border-slate-200/60";
      case "Rejected":
        return "bg-red-55/10 text-red-700 border-red-200/60";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const docsProgress = student.documentsSubmitted ? student.documentsSubmitted.length : 0;

  return (
    <div className="space-y-6 pb-12 relative max-w-5xl">
      {/* Back Link */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[var(--brand-green)] font-semibold text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Student Roster
        </button>
      </div>

      {/* Student Profile Header */}
      <Card className="bg-white border-slate-150 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-2xl border border-[var(--brand-light)]/20 shadow-inner flex-shrink-0">
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

        {/* Admission Status */}
        <div className="flex flex-col sm:items-end gap-1 pt-4 border-t md:border-t-0 md:pt-0">
          <span className="block text-[10px] uppercase font-bold text-slate-400">Admission Status</span>
          <Badge variant="outline" className={cn(
            "inline-flex px-3 py-1 rounded-full text-xs font-bold border mt-1 shadow-sm h-6",
            getStatusBadgeClass(student.admissionStatus)
          )}>
            {student.admissionStatus}
          </Badge>
        </div>
      </Card>

      {/* Main Details Section */}
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
              <span className="block text-[10px] uppercase font-bold text-slate-400">Subject</span>
              <span className="text-sm font-semibold text-slate-700">{student.courseName || "General"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Package & Registration Info */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[var(--brand-green)]" />
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

        {/* Assigned Staff Info (Read-Only for Tutors) */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">Staff Contacts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-3.5">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 font-heading">Academic Coordinator</span>
              <span className="text-sm font-semibold text-slate-700 block mt-0.5">{student.coordinatorName || "Not Assigned"}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 font-heading">Subject Tutor</span>
              <span className="text-sm font-semibold text-slate-700 block mt-0.5">{student.subjectTutor || "Not Assigned"}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 font-heading">Mentor</span>
              <span className="text-sm font-semibold text-slate-700 block mt-0.5">{student.mentorSalesBro || "Not Assigned"}</span>
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
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">Document Checklist</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Documents submitted by student/parent and verified by coordinator.</p>
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
                      {isSubmitted ? "Verified" : "Pending upload"}
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
