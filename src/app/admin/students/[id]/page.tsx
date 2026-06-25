"use client";

import { Suspense, use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  GraduationCap,
  Info,
  MapPin,
  Phone,
  ShieldAlert,
  User,
  UserCheck,
} from "lucide-react";
import { ButtonLoader } from "@/components/shared/Loader";
import {
  formatAdmissionStatus,
  formatPackage,
  getSubmittedDocumentLabels,
} from "@/components/admin/students/studentMapper";
import { cn } from "@/lib/utils";
import {
  useGetStudent,
  useGetStudentDocuments,
  useUpdateStudent,
} from "@/querys/admin/studentQuery";
import { useGetMentors } from "@/querys/admin/mentorQuery";
import { useGetCoordinators } from "@/querys/admin/coordinatorQuery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StudentSessions from "@/components/admin/students/StudentSessions";
import StudentExams from "@/components/admin/students/StudentExams";
import StudentAssignments from "@/components/admin/students/StudentAssignments";
import { Label } from "@/components/ui/label";
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

const documentCards = [
  { key: "birthCertificate", label: "Birth Certificate" },
  { key: "transferCertificate", label: "Transfer Certificate" },
  { key: "previousAcademicRecord", label: "Previous Academic Records" },
  { key: "identificationDocument", label: "Identification Documents" },
] as const;

const getStatusBadgeClass = (status: string) => {
  switch (formatAdmissionStatus(status)) {
    case "Approved":
      return "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
    case "Pending":
    case "In Review":
      return "bg-slate-50 text-slate-650 border-slate-200/60";
    case "Inactive":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Rejected":
      return "bg-slate-100 text-slate-500 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

function StudentDetailsContent({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: student, isLoading } = useGetStudent(id);
  const { data: documentResponse } = useGetStudentDocuments(id);
  const { mutateAsync: updateStudent, isPending: isUpdating } =
    useUpdateStudent();

  const { data: mentorsResponse } = useGetMentors();
  const { data: coordinatorsResponse } = useGetCoordinators();

  const mentorsList = mentorsResponse?.data ?? [];
  const coordinatorsList = coordinatorsResponse?.data ?? [];

  const [assignedMentorId, setAssignedMentorId] = useState("");
  const [assignedCoordinatorId, setAssignedCoordinatorId] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");

  useEffect(() => {
    if (student) {
      setAssignedMentorId(
        student.mentor?.id ||
          student.assignedMentorId ||
          student.mentorId ||
          "",
      );
      setAssignedCoordinatorId(
        student.coordinator?.id ||
          student.assignedCoordinatorId ||
          student.coordinatorId ||
          "",
      );
      setCoordinatorName(
        student.coordinator?.name || student.coordinatorName || "",
      );
    }
  }, [student]);

  const handleUpdateStatus = async (admissionStatus: string) => {
    try {
      await updateStudent({ id, data: { admissionStatus } });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignmentSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      await updateStudent({
        id,
        data: {
          coordinatorName,
          mentorId: assignedMentorId,
          coordinatorId: assignedCoordinatorId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading student details...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Info className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-800">
            Student Not Found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            We could not find a student matching ID &quot;{id}&quot;.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/students")}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-slate-650 transition-all hover:bg-slate-50">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Button>
      </div>
    );
  }

  const documents = documentResponse?.documents ?? student.documents;
  const submittedDocuments = getSubmittedDocumentLabels(documents);
  const docsProgress = submittedDocuments.length;
  const displayStatus = formatAdmissionStatus(student.admissionStatus);

  return (
    <div className="relative max-w-8xl space-y-6 pb-12">
      <div>
        <button
          onClick={() => router.push("/admin/students")}
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[var(--brand-green)]">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Students Directory
        </button>
      </div>

      <Card className="flex flex-col justify-between gap-6 border-slate-150 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] text-2xl font-bold text-[var(--brand-green)] shadow-inner">
            {student.studentName.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-800">
                {student.studentName}
              </h1>
              <Badge
                variant="outline"
                className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                {student.admissionNumber || student.id}
              </Badge>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-550">
              {student.courseName
                ? `${student.courseName} (${student.programName})`
                : student.programName || student.courseType}{" "}
              / Grade {student.class}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center md:border-t-0 md:pt-0">
          <div className="w-full sm:w-auto">
            <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Modify Status
            </span>
            <Select
              key={`status-${student.admissionStatus}`}
              value={student.admissionStatus}
              onValueChange={handleUpdateStatus}
              disabled={isUpdating}>
              <SelectTrigger className="h-9 w-full justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:w-44">
                <SelectValue placeholder={displayStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="admission_taken">Admission Taken</SelectItem>
                <SelectItem value="course_completed">
                  Course Completed
                </SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-slate-150 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 p-6 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-[var(--brand-green)]" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Academic Profile
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-4">
            <div>
              <span className="block text-xs font-bold text-slate-700">Class / Grade</span>
              <span className="text-sm font-semibold text-slate-900">Grade {student.class}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700">Course / Program</span>
              <span className="text-sm font-semibold text-slate-900">
                {student.courseName
                  ? `${student.courseName} (${student.programName})`
                  : student.programName || student.courseType || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700">Package Selected</span>
              <span className="text-sm font-semibold text-slate-900">
                {formatPackage(student.package, student.customPackageDetails)}
              </span>
            </div>
            {student.totalFee !== undefined && (
              <div>
                <span className="block text-xs font-bold text-slate-700">Fee Status</span>
                <span className="text-sm font-semibold text-slate-900">
                  Paid: ₹{student.paidAmount || 0} / Total: ₹{student.totalFee}
                  {student.totalFee > (student.paidAmount || 0) && (
                    <span className="ml-2 font-bold" style={{ color: "var(--brand-green)" }}>
                      (₹{student.totalFee - (student.paidAmount || 0)} Pending)
                    </span>
                  )}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-150 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 p-6 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[var(--brand-green)]" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Registration Info
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-4">
            <div>
              <span className="block text-xs font-bold text-slate-700">Parent / Guardian</span>
              <span className="text-sm font-semibold text-slate-900">{student.parentName || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700">Email</span>
              <span className="text-sm font-semibold text-slate-900">{student.email || "Not provided"}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700">Phone</span>
              <span className="text-sm font-semibold text-slate-900">{student.phone || "Not provided"}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-700">Location</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {student.place || "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-150 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 p-6 pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[var(--brand-green)]" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Team & Assignments
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-3">
            <form
              id="assignments-form"
              className="space-y-3"
              onSubmit={handleAssignmentSubmit}>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-600">
                  Assigned Admissions Coordinator
                </Label>
                <select
                  value={assignedCoordinatorId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAssignedCoordinatorId(val);
                    const selected =
                      coordinatorsList.find((c) => c.id === val) ??
                      (student?.coordinator?.id === val
                        ? student.coordinator
                        : null);
                    if (selected) setCoordinatorName(selected.name);
                  }}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]">
                  <option value="">Select Coordinator</option>
                  {student?.coordinator && (
                    <option value={student.coordinator.id}>
                      {student.coordinator.name}
                      {student.coordinator.designation
                        ? ` (${student.coordinator.designation})`
                        : ""}
                    </option>
                  )}
                  {coordinatorsList
                    .filter((c) => c.id !== student?.coordinator?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.designation})
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-600">
                  Assigned Mentor
                </Label>
                <select
                  value={assignedMentorId}
                  onChange={(e) => setAssignedMentorId(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]">
                  <option value="">Select Mentor</option>
                  {student?.mentor && (
                    <option value={student.mentor.id}>
                      {student.mentor.name}
                      {student.mentor.designation
                        ? ` (${student.mentor.designation})`
                        : ""}
                    </option>
                  )}
                  {mentorsList
                    .filter((m) => m.id !== student?.mentor?.id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.designation})
                      </option>
                    ))}
                </select>
              </div>
            </form>

            {student.tutors && student.tutors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <p className="text-[10px] font-bold uppercase text-slate-600">
                  Assigned Tutors
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {student.tutors.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--brand-light-green)] text-[var(--brand-mid)] border border-[var(--brand-green)]/20">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              form="assignments-form"
              disabled={isUpdating}
              className="mt-4 h-9 w-full rounded-xl bg-[var(--brand-green)] text-xs font-bold text-white hover:bg-[var(--brand-mid)]">
              {isUpdating ? <ButtonLoader /> : "Update Assignments"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="space-y-5 border-slate-150 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--brand-green)]" />
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Required Document Submission
              </CardTitle>
              <p className="mt-0.5 text-xs text-slate-600">
                Document data is loaded from the student documents endpoint when
                available.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700">
                {docsProgress} / 4 Submitted
              </span>
            </div>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[var(--brand-green)] transition-all duration-500"
                style={{ width: `${(docsProgress / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {documentCards.map((document) => {
            const documentUrl = documents?.[document.key];
            const isSubmitted = Boolean(documentUrl);

            return (
              <div
                key={document.key}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-4 transition-all",
                  isSubmitted
                    ? "border-[var(--brand-green)]/35 bg-[var(--brand-light-green)]/15"
                    : "border-slate-200 bg-slate-50/50",
                )}>
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border",
                      isSubmitted
                        ? "border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] text-[var(--brand-green)]"
                        : "border-slate-200 bg-white text-slate-400",
                    )}>
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-700">
                      {document.label}
                    </h4>
                    <p className="mt-0.5 truncate text-[10px] text-slate-450">
                      {isSubmitted ? (
                        typeof documentUrl === "string" ? (
                          <a
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-[var(--brand-green)] font-semibold transition-colors">
                            {documentUrl}
                          </a>
                        ) : (
                          (documentUrl as File).name
                        )
                      ) : (
                        "Pending parent upload"
                      )}
                    </p>
                  </div>
                </div>

                {isSubmitted ? (
                  <Badge
                    variant="outline"
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] px-2.5 py-1 text-xs font-bold text-[var(--brand-green)] shadow-sm">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-450 shadow-sm">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Pending
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <StudentSessions studentId={id} />
      <StudentExams studentId={id} />
      <StudentAssignments studentId={id} />
    </div>
  );
}

export default function StudentDetailsPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">
          Loading student details...
        </div>
      }>
      <StudentDetailsContent params={params} />
    </Suspense>
  );
}
