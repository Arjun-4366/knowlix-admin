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
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmation } from "@/context/ConfirmationContext";

import {
  useGetTutor,
  useGetTutorPerformance,
  useApproveTutor,
  useUpdateTutorPermissions,
  useAwardGrowthPoints,
} from "@/querys/admin/tutorQuery";
import { useGetStudents } from "@/querys/admin/studentQuery";
import { ITutor } from "@/types/admin/tutor";

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
  const { data: tutor, isLoading: isTutorLoading, isError } = useGetTutor(id);
  const { data: performanceData, isLoading: isPerfLoading } = useGetTutorPerformance(id);
  const { data: studentsResponse, isLoading: isStudentsLoading } = useGetStudents();

  // Mutations
  const { mutateAsync: approveTutor, isPending: isApproving } = useApproveTutor();
  const { mutateAsync: updateTutorPermissions, isPending: isUpdatingPermissions } = useUpdateTutorPermissions();
  const { mutateAsync: awardGrowthPoints, isPending: isAwardingPoints } = useAwardGrowthPoints();

  const handleTogglePermission = async (key: keyof ITutor["permissions"]) => {
    if (!tutor) return;
    const updatedPermissions = {
      ...tutor.permissions,
      [key]: !tutor.permissions[key],
    };
    try {
      await updateTutorPermissions({ id, permissions: updatedPermissions });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateRating = async (category: string, value: number) => {
    if (!tutor) return;
    try {
      await awardGrowthPoints({
        tutorId: id,
        category,
        evaluationArea: "admin_evaluation",
        points: value,
        description: `Awarded ${value} points for category ${category}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

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
    if (!tutor || !studentsResponse?.data) return [];
    return studentsResponse.data.filter((s) => s.assignedTutorId === tutor.id);
  }, [tutor, studentsResponse]);

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
                  {tutor.status === "pending" ? "Awaiting HR" : tutor.status}
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
                {tutor.availability}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Access Permissions */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Access Control
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-3">
            {[
              { key: "canUploadNotes" as const, label: "Upload Notes & Documents" },
              { key: "canEditNotes" as const, label: "Edit / Delete Study Notes" },
              { key: "canShareMaterial" as const, label: "Share Study Materials" },
            ].map((perm) => (
              <div
                key={perm.key}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all",
                  tutor.permissions?.[perm.key]
                    ? "border-[var(--brand-green)]/35 bg-[var(--brand-light-green)]/10"
                    : "border-slate-200 bg-slate-50/30"
                )}
              >
                <span className="text-xs font-bold text-slate-700">{perm.label}</span>
                <Switch
                  disabled={!isApproved || isUpdatingPermissions}
                  checked={tutor.permissions?.[perm.key] || false}
                  onCheckedChange={() => handleTogglePermission(perm.key)}
                />
              </div>
            ))}
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
          <CardContent className="p-6 pt-4">
            {isStudentsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ) : assignedStudents.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden max-h-[160px] overflow-y-auto">
                {assignedStudents.map((s) => (
                  <div key={s.id} className="p-3 flex items-center gap-2.5 hover:bg-slate-50/50">
                    <div className="w-7 h-7 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs flex-shrink-0">
                      {s.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{s.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        Grade {s.class} • {s.courseType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No students currently assigned to this tutor.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* G-R-O-W-T-H Performance Ratings */}
      <Card className="bg-white border-slate-150 shadow-sm">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Performance Rating — G-R-O-W-T-H
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] bg-[var(--brand-light-green)] border-[var(--brand-light)]/20 text-[var(--brand-mid)] px-2 py-0.5 rounded-md font-bold"
            >
              Lifetime Growth Points: {tutor.growthPoints || 0}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click stars to award growth points under specific evaluation criteria.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GROWTH_METRICS.map((metric) => {
              const currentCategoryPoints = performanceData?.growthBreakdown?.[metric.key] || 0;
              // Map continuous points scale to star visual levels (1 to 5)
              const mappedStars = Math.min(5, Math.max(0, currentCategoryPoints));

              return (
                <div
                  key={metric.key}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/40 gap-4"
                >
                  <div>
                    <span className="block text-xs font-bold text-slate-750">
                      {metric.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {metric.desc}
                    </span>
                    <span className="text-[9px] font-bold text-[var(--brand-green)] mt-1 block">
                      Category Total: {currentCategoryPoints} pts
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        disabled={!isApproved || isAwardingPoints}
                        onClick={() => handleUpdateRating(metric.key, val)}
                        className="disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={cn(
                            "w-5 h-5",
                            val <= mappedStars
                              ? "fill-[var(--brand-green)] text-[var(--brand-green)]"
                              : "text-slate-200"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
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
