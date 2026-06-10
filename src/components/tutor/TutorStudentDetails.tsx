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
import { ITutorStudentDetailData } from "@/services/tutor/students";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, X, Clock, XCircle } from "lucide-react";

interface TutorStudentDetailsProps {
  data: ITutorStudentDetailData;
  onBack: () => void;
}

export default function TutorStudentDetails({
  data,
  onBack,
}: TutorStudentDetailsProps) {
  const { student, attendanceSummary, exams, attendanceBySessions } = data;
  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "active":
        return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
      case "pending":
      case "in review":
      case "in_review":
      case "pending_approval":
        return "bg-slate-50 text-slate-650 border-slate-200/60";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const submittedDocs: string[] = [];
  if (student.documents?.birthCertificate) submittedDocs.push("Birth Certificate");
  if (student.documents?.transferCertificate) submittedDocs.push("Transfer Certificate");
  if (student.documents?.previousAcademicRecord) submittedDocs.push("Previous Academic Records");
  if (student.documents?.identificationDocument) submittedDocs.push("Identification Documents");

  const docsProgress = submittedDocs.length;

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
            {student.studentName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2.5">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{student.studentName}</h1>
              <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                {student.admissionNumber || student.id.substring(0, 8)}
              </Badge>
            </div>
            <p className="text-sm text-slate-550 font-semibold mt-1">
              {student.courseName || student.courseType} • Class {student.class}
            </p>
          </div>
        </div>

        {/* Admission Status */}
        <div className="flex flex-col sm:items-end gap-1 pt-4 border-t md:border-t-0 md:pt-0">
          <span className="block text-[10px] uppercase font-bold text-slate-400">Admission Status</span>
          <Badge variant="outline" className={cn(
            "inline-flex px-3 py-1 rounded-full text-xs font-bold border mt-1 shadow-sm h-6 capitalize",
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
              <span className="text-sm font-semibold text-slate-700">Class {student.class}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Syllabus</span>
              <span className="text-sm font-semibold text-slate-700">{student.syllabus || "N/A"}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Course</span>
              <span className="text-sm font-semibold text-slate-700">{student.courseName || student.courseType}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Program</span>
              <span className="text-sm font-semibold text-slate-700">{student.programName || "N/A"}</span>
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Email</span>
                <span className="text-sm font-semibold text-slate-700 truncate block">{student.email || "N/A"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Phone</span>
                <span className="text-sm font-semibold text-slate-700">{student.phone || "N/A"}</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Location / Origin</span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {student.place || "N/A"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Package Selected</span>
              <span className="text-sm font-semibold text-slate-700 capitalize">{student.package?.replace("_", " ")}</span>
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
            const isSubmitted = submittedDocs.includes(doc);

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
                    <Badge variant="outline" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-455 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm h-7">
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

      {/* Attendance Summary & Exams section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Attendance Summary */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-[var(--brand-light-green)]/30 rounded-xl p-3 border border-[var(--brand-light)]/20">
                <span className="block text-[10px] uppercase font-bold text-[var(--brand-green)] mb-1">Present</span>
                <span className="text-xl font-black text-slate-800">{attendanceSummary.present}</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                <span className="block text-[10px] uppercase font-bold text-amber-600 mb-1">Late</span>
                <span className="text-xl font-black text-slate-800">{attendanceSummary.late}</span>
              </div>
              <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                <span className="block text-[10px] uppercase font-bold text-red-600 mb-1">Absent</span>
                <span className="text-xl font-black text-slate-800">{attendanceSummary.absent}</span>
              </div>
            </div>
            <div className="mt-4 text-center text-xs font-semibold text-slate-500">
              Total Recorded Sessions: <span className="font-bold text-slate-700">{attendanceSummary.total}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Exams */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              Exams & Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-[300px] overflow-y-auto">
            {exams.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {exams.map((exam) => (
                  <div key={exam.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{exam.title}</h4>
                        <p className="text-xs text-slate-500 font-semibold">
                          {exam.subject}
                          {typeof exam.tutorId === "object" && exam.tutorId?.name && ` • By ${exam.tutorId.name}`}
                        </p>
                      </div>
                      {exam.status === "conducted" ? (
                        <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] font-bold">
                          Conducted
                        </Badge>
                      ) : exam.status === "cancelled" ? (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px] font-bold">
                          Cancelled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 text-[10px] font-bold">
                          Scheduled
                        </Badge>
                      )}
                    </div>
                    {exam.result && (
                      <div className="mt-2 flex items-center gap-2 bg-[var(--brand-light-green)]/20 p-2 rounded-lg border border-[var(--brand-light)]/20">
                        <div className="bg-white w-8 h-8 rounded-md flex items-center justify-center font-black text-[var(--brand-green)] border border-[var(--brand-light)]/30 text-xs">
                          {exam.result.grade}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">
                            {exam.result.marksObtained} / {exam.maxMarks} marks
                          </p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                            {exam.result.remarks || "No remarks"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400 font-semibold">
                No exams recorded for this student.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card className="bg-white border-slate-150 shadow-sm mt-6">
        <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-h-[350px] overflow-y-auto">
          {attendanceBySessions.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {attendanceBySessions
                .flatMap((group) =>
                  group.attendance.map((att) => ({
                    ...att,
                    sessionTitle: group.session?.title,
                    sessionDate: group.session?.scheduledAt,
                  }))
                )
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record) => (
                  <div key={record.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                        {record.sessionTitle ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-green)]"></span>
                            {record.sessionTitle}
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            Regular Class
                          </>
                        )}
                        {typeof record.tutorId === "object" && record.tutorId?.name && ` • ${record.tutorId.name}`}
                      </p>
                      {record.remarks && (
                        <p className="text-[10px] text-slate-400 mt-1 italic">
                          "{record.remarks}"
                        </p>
                      )}
                    </div>
                    <div>
                      {record.status === "present" ? (
                        <Badge variant="outline" className="bg-[var(--brand-light-green)]/30 text-[var(--brand-green)] border-[var(--brand-light)]/40 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Present
                        </Badge>
                      ) : record.status === "late" ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[10px] font-bold">
                          <Clock className="w-3 h-3 mr-1" /> Late
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px] font-bold">
                          <XCircle className="w-3 h-3 mr-1" /> Absent
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-400 font-semibold">
              No attendance records found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
