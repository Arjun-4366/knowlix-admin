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
import { useGetTutors } from "@/querys/admin/tutorQuery";
import { useGetMentors } from "@/querys/admin/mentorQuery";
import { useGetCoordinators } from "@/querys/admin/coordinatorQuery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent();

  const { data: tutorsResponse } = useGetTutors();
  const { data: mentorsResponse } = useGetMentors();
  const { data: coordinatorsResponse } = useGetCoordinators();

  const tutorsList = tutorsResponse?.data ?? [];
  const mentorsList = mentorsResponse?.data ?? [];
  const coordinatorsList = coordinatorsResponse?.data ?? [];

  const [assignedTutorId, setAssignedTutorId] = useState("");
  const [assignedMentorId, setAssignedMentorId] = useState("");
  const [assignedCoordinatorId, setAssignedCoordinatorId] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");

  useEffect(() => {
    if (student) {
      setAssignedTutorId(student.assignedTutorId || "");
      setAssignedMentorId(student.assignedMentorId || "");
      setAssignedCoordinatorId(student.assignedCoordinatorId || "");
      setCoordinatorName(student.coordinatorName || "");
    }
  }, [student]);

  const handleUpdateStatus = async (admissionStatus: string) => {
    try {
      await updateStudent({ id, data: { admissionStatus } });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignmentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateStudent({
        id,
        data: {
          coordinatorName,
          assignedTutorId,
          assignedMentorId,
          assignedCoordinatorId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading student details...</div>;
  }

  if (!student) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Info className="h-6 w-6" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-800">Student Not Found</h3>
          <p className="mt-1 text-sm text-slate-500">
            We could not find a student matching ID &quot;{id}&quot;.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/students")}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-slate-650 transition-all hover:bg-slate-50"
        >
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
    <div className="relative max-w-5xl space-y-6 pb-12">
      <div>
        <button
          onClick={() => router.push("/admin/students")}
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[var(--brand-green)]"
        >
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
                className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500"
              >
                {student.id}
              </Badge>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-550">
              {student.courseType} / Grade {student.class}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center md:border-t-0 md:pt-0">
          <div className="text-left sm:text-right">
            <span className="block text-[10px] font-bold uppercase text-slate-400">
              Admission Status
            </span>
            <Badge
              variant="outline"
              className={cn(
                "mt-1 inline-flex h-6 rounded-full border px-3 py-1 text-xs font-bold shadow-sm",
                getStatusBadgeClass(student.admissionStatus),
              )}
            >
              {displayStatus}
            </Badge>
          </div>

          <div className="w-full sm:w-auto">
            <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Modify Status
            </span>
            <Select
              value={student.admissionStatus}
              onValueChange={handleUpdateStatus}
              disabled={isUpdating}
            >
              <SelectTrigger className="h-9 w-full justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:w-44">
                <SelectValue placeholder={displayStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
          <CardContent className="space-y-3.5 p-6 pt-3">
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Class / Grade
              </span>
              <span className="text-sm font-semibold text-slate-700">
                Grade {student.class}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Course / Program
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {student.courseType}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Package Selected
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {formatPackage(student.package, student.customPackageDetails)}
              </span>
            </div>
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
          <CardContent className="space-y-3.5 p-6 pt-3">
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Parent / Guardian Name
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {student.parentName}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Location / Origin
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {student.place}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Email
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {student.email || "Not provided"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-150 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100 p-6 pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[var(--brand-green)]" />
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Staff Assignments
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-3">
            <form className="space-y-3" onSubmit={handleAssignmentSubmit}>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">
                  Assigned Admissions Coordinator
                </Label>
                <Select
                  value={assignedCoordinatorId}
                  onValueChange={(val) => {
                    setAssignedCoordinatorId(val);
                    const selected = coordinatorsList.find((c) => c.id === val);
                    if (selected) {
                      setCoordinatorName(selected.name);
                    }
                  }}
                >
                  <SelectTrigger className="h-9 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <SelectValue placeholder="Select Coordinator" />
                  </SelectTrigger>
                  <SelectContent>
                    {coordinatorsList.map((coordinator) => (
                      <SelectItem key={coordinator.id} value={coordinator.id}>
                        {coordinator.name} ({coordinator.designation})
                      </SelectItem>
                    ))}
                    {assignedCoordinatorId && !coordinatorsList.some((c) => c.id === assignedCoordinatorId) && (
                      <SelectItem value={assignedCoordinatorId}>
                        {coordinatorName ? `${coordinatorName} (ID: ${assignedCoordinatorId})` : `ID: ${assignedCoordinatorId}`}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">
                  Assigned Tutor
                </Label>
                <Select value={assignedTutorId} onValueChange={setAssignedTutorId}>
                  <SelectTrigger className="h-9 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <SelectValue placeholder="Select Tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    {tutorsList.map((tutor) => (
                      <SelectItem key={tutor.id} value={tutor.id}>
                        {tutor.name} ({tutor.subjects ? tutor.subjects.join(", ") : "No subjects"})
                      </SelectItem>
                    ))}
                    {assignedTutorId && !tutorsList.some((t) => t.id === assignedTutorId) && (
                      <SelectItem value={assignedTutorId}>
                        ID: {assignedTutorId}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-slate-400">
                  Assigned Mentor
                </Label>
                <Select value={assignedMentorId} onValueChange={setAssignedMentorId}>
                  <SelectTrigger className="h-9 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <SelectValue placeholder="Select Mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentorsList.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        {mentor.name} ({mentor.designation})
                      </SelectItem>
                    ))}
                    {assignedMentorId && !mentorsList.some((m) => m.id === assignedMentorId) && (
                      <SelectItem value={assignedMentorId}>
                        ID: {assignedMentorId}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isUpdating}
                className="h-9 w-full rounded-xl bg-[var(--brand-green)] text-xs font-bold text-white hover:bg-[var(--brand-mid)]"
              >
                {isUpdating ? <ButtonLoader /> : "Update Assignments"}
              </Button>
            </form>
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
              <p className="mt-0.5 text-xs text-slate-400">
                Document data is loaded from the student documents endpoint when available.
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
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border",
                      isSubmitted
                        ? "border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] text-[var(--brand-green)]"
                        : "border-slate-200 bg-white text-slate-400",
                    )}
                  >
                    <FileText className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-700">
                      {document.label}
                    </h4>
                    <p className="mt-0.5 truncate text-[10px] text-slate-450">
                      {isSubmitted ? documentUrl : "Pending parent upload"}
                    </p>
                  </div>
                </div>

                {isSubmitted ? (
                  <Badge
                    variant="outline"
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] px-2.5 py-1 text-xs font-bold text-[var(--brand-green)] shadow-sm"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-450 shadow-sm"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Pending
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default function StudentDetailsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading student details...</div>}>
      <StudentDetailsContent params={params} />
    </Suspense>
  );
}
