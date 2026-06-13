"use client";

import { use, useEffect, useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Star,
  AlertCircle,
  UserCheck,
  GraduationCap,
  BookOpen,
  Clock,
  Mail,
  Users,
  Loader2,
  Calendar,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmation } from "@/context/ConfirmationContext";

import {
  useGetTutor,
  useApproveTutor,
  useAwardGrowthPoints,
  useAssignStudentsToTutor,
} from "@/querys/admin/tutorQuery";
import { useGetStudents } from "@/querys/admin/studentQuery";
import { ITutor } from "@/types/admin/tutor";
import { TutorGrowthHistory } from "@/components/admin/tutor/TutorGrowthHistory";
import { TutorPerformanceCard } from "@/components/admin/tutor/TutorPerformanceCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

const GROWTH_METRICS = [
  {
    key: "G" as const,
    label: "Growth (G)",
    desc: "Performance & progress of assigned students",
  },
  {
    key: "R" as const,
    label: "Responsibility (R)",
    desc: "Engagement and follow-ups",
  },
  {
    key: "O" as const,
    label: "Ownership (O)",
    desc: "Accountability and task leadership",
  },
  {
    key: "W" as const,
    label: "Work Ethics (W)",
    desc: "Punctuality, class preparation, and behavior",
  },
  {
    key: "T" as const,
    label: "Teamwork (T)",
    desc: "Cooperation with administrative coordinators",
  },
  {
    key: "H" as const,
    label: "Honesty (H)",
    desc: "Transparency and class logging accuracy",
  },
];

function TutorDetailContent({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { confirm } = useConfirmation();

  // Queries
  const { data: tutorDetails, isLoading: isTutorLoading, isError } = useGetTutor(id);
  const tutor = tutorDetails?.tutor;
  const performanceData = tutorDetails;
  const { data: studentsResponse, isLoading: isStudentsLoading } = useGetStudents();

  // Mutations
  const { mutateAsync: approveTutor, isPending: isApproving } = useApproveTutor();
  const { mutateAsync: awardGrowthPoints, isPending: isAwardingPoints } = useAwardGrowthPoints();
  const { mutateAsync: assignStudents, isPending: isAssigning } = useAssignStudentsToTutor();

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);



  const handleApprove = () => {
    if (!tutor) return;
    confirm({
      title: "Approve Tutor",
      message: `Are you sure you want to approve & admit "${tutor.name}" as an active tutor?`,
      confirmText: "Approve",
      onConfirm: async () => {
        try {
          await approveTutor({ id, status: "approved" });
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  // Assigned students filter
  const assignedStudents = useMemo(() => {
    return tutorDetails?.assignedStudents || [];
  }, [tutorDetails]);

  const unassignedStudents = useMemo(() => {
    if (!tutor || !studentsResponse?.data) return [];
    const assignedIds = new Set((tutorDetails?.assignedStudents || []).map(s => s.id));
    return studentsResponse.data.filter((s) => !assignedIds.has(s.id));
  }, [tutor, studentsResponse, tutorDetails]);

  const handleAddStudent = async () => {
    if (selectedStudentIds.length === 0 || !tutor) return;
    try {
      await assignStudents({ id, payload: { add: selectedStudentIds } });
      setSelectedStudentIds([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!tutor) return;
    confirm({
      title: "Remove Student",
      message: "Are you sure you want to remove this student from the tutor's workload?",
      confirmText: "Remove",
      variant: "danger",
      onConfirm: async () => {
        try {
          await assignStudents({ id, payload: { remove: [studentId] } });
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  if (isTutorLoading) {
    return (
      <div className="space-y-6 max-w-5xl animate-in fade-in duration-300 w-full">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 w-full">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Tutor Not Found</h3>
          <p className="text-sm text-slate-500 mt-1">
            No tutor matching ID &quot;{id}&quot; was found.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/tutor")}
          className="flex items-center gap-1.5 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tutors
        </Button>
      </div>
    );
  }

  const isApproved = tutor.status === "approved";
  const overallScore = tutor.performanceScore || 0;

  return (
    <div className="space-y-6 pb-12 relative max-w-5xl w-full">
      {/* Back Link */}
      <div>
        <button
          onClick={() => router.push("/admin/tutor")}
          className="flex items-center gap-2 text-slate-500 hover:text-[var(--brand-green)] font-semibold text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tutors Directory
        </button>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-2xl border border-[var(--brand-light)]/20 shadow-inner flex-shrink-0">
              {tutor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {tutor.name}
                </h1>
                <Badge
                  variant="outline"
                  className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200"
                >
                  ID: {tutor.id.substring(tutor.id.length - 8)}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                    isApproved
                      ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {tutor.status === "pending" ? "Awaiting HR" : tutor.status.charAt(0).toUpperCase() + tutor.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {tutor.email}
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="text-center md:text-right">
              <p className="text-3xl font-bold text-slate-800">
                {overallScore.toFixed(1)}
              </p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">GROWTH Index / 5.0</p>
              <div className="flex items-center justify-start md:justify-end gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "w-3.5 h-3.5",
                      s <= Math.round(overallScore)
                        ? "fill-[var(--brand-green)] text-[var(--brand-green)]"
                        : "text-slate-200"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending HR Banner */}
      {!isApproved && (
        <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Pending HR Recruitment Approval</p>
              <p className="text-xs text-amber-700/80 mt-0.5">
                This tutor is in the recruitment pool. Permissions and student assignment are locked until approved.
              </p>
            </div>
          </div>
          <Button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm flex-shrink-0 flex items-center gap-1.5"
          >
            {isApproving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <UserCheck className="w-4 h-4 mr-1.5" />
            Approve & Admit
          </Button>
        </div>
      )}

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Profile Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-3.5">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Subject Expertise</span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {tutor.subjects && tutor.subjects.length > 0 ? tutor.subjects.join(", ") : "General"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Experience</span>
              <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{tutor.experience}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Availability</span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {Array.isArray(tutor.availability) ? tutor.availability.join(", ") : tutor.availability}
              </span>
            </div>
          </CardContent>
        </Card>



        {/* Assigned Students */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Assigned Workload
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 flex flex-col gap-4">
            {isStudentsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ) : assignedStudents.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden max-h-[160px] overflow-y-auto">
                {assignedStudents.map((s) => (
                  <div key={s.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50 group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs flex-shrink-0">
                        {s.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{s.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Grade {s.class} {s.courseType ? `• ${s.courseType}` : s.package ? `• ${s.package.replace("_", " ")}` : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all rounded-full w-6 h-6"
                      onClick={() => handleRemoveStudent(s.id)}
                      disabled={isAssigning}
                      title="Remove Student"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No students currently assigned to this tutor.
              </p>
            )}

            {isApproved && (
              <div className="pt-2 mt-auto border-t border-slate-100 flex flex-col gap-2">
                {selectedStudentIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudentIds.map(id => {
                      const student = unassignedStudents.find(s => s.id === id);
                      if (!student) return null;
                      return (
                        <Badge key={id} variant="secondary" className="flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200 pr-1 border border-slate-200 text-[10px]">
                          {student.studentName}
                          <button onClick={() => setSelectedStudentIds(prev => prev.filter(s => s !== id))} className="text-slate-400 hover:text-red-500 rounded-full p-0.5 hover:bg-slate-200/50">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Select
                    value=""
                    onValueChange={(val) => {
                      if (val && !selectedStudentIds.includes(val)) {
                        setSelectedStudentIds(prev => [...prev, val]);
                      }
                    }}
                    disabled={isAssigning || unassignedStudents.filter(s => !selectedStudentIds.includes(s.id)).length === 0}
                  >
                    <SelectTrigger className="h-8 text-xs font-semibold bg-slate-50/50 border-slate-200 rounded-lg flex-1">
                      <SelectValue placeholder={unassignedStudents.filter(s => !selectedStudentIds.includes(s.id)).length > 0 ? "Select students to assign..." : "No available students"} />
                    </SelectTrigger>
                    <SelectContent>
                      {unassignedStudents.filter(s => !selectedStudentIds.includes(s.id)).map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.studentName} (Grade {s.class})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="h-8 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white px-4 rounded-lg flex-shrink-0 font-bold"
                    disabled={selectedStudentIds.length === 0 || isAssigning}
                    onClick={handleAddStudent}
                  >
                    {isAssigning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    ) : null}
                    Assign
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schedule, Remarks & Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Class Statistics */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Class Statistics
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-3.5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">Total Sessions</span>
              <span className="text-sm font-bold text-slate-800">{tutorDetails?.totalSessions || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">Conducted</span>
              <span className="text-sm font-bold text-green-600">{tutorDetails?.conducted || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">Not Conducted</span>
              <span className="text-sm font-bold text-red-600">{tutorDetails?.notConducted || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500">Postponed</span>
              <span className="text-sm font-bold text-amber-600">{tutorDetails?.postponed || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500">Attendance Rate</span>
              <span className="text-sm font-bold text-blue-600">{tutorDetails?.attendanceRate || 0}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Slots */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Weekly Schedule Slots
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            {tutor.slots && tutor.slots.length > 0 ? (
              <div className="space-y-3">
                {tutor.slots.map((slot, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shadow-sm">
                        {slot.day.substring(0, 3)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{slot.day}</p>
                        <p className="text-xs text-slate-500">{slot.startTime} - {slot.endTime}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5",
                        slot.filled ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-green)]/20"
                      )}
                    >
                      {slot.filled ? "Filled" : "Available"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">No slots assigned yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Remarks */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Admin Remarks
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2 text-[10px]">Positive Remarks</p>
              {tutor.positiveRemarks ? (
                <div className="p-3 bg-green-50 text-green-800 text-sm rounded-xl border border-green-100 whitespace-pre-wrap">
                  {tutor.positiveRemarks}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No positive remarks recorded.</p>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase mb-2 text-[10px]">Areas of Improvement</p>
              {tutor.negativeRemarks ? (
                <div className="p-3 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100 whitespace-pre-wrap">
                  {tutor.negativeRemarks}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No areas of improvement recorded.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* G-R-O-W-T-H Performance Ratings */}
      <TutorPerformanceCard
        tutorId={id}
        isApproved={isApproved}
        performanceData={performanceData}
        totalGrowthPoints={tutorDetails?.totalGrowthPoints ?? tutor.growthPoints ?? 0}
      />

      {/* Growth History Component */}
      <TutorGrowthHistory tutorId={id} />
    </div>
  );
}

export default function TutorDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading tutor details...</div>}>
      <TutorDetailContent params={params} />
    </Suspense>
  );
}
