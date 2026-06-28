"use client";

import { use, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmation } from "@/context/ConfirmationContext";

import { useGetTutor, useApproveTutor } from "@/querys/admin/tutorQuery";

import { TutorProfileHeader } from "@/components/admin/tutor/TutorProfileHeader";
import { TutorPendingBanner } from "@/components/admin/tutor/TutorPendingBanner";
import { TutorProfileCard } from "@/components/admin/tutor/TutorProfileCard";
import { TutorWorkloadCard } from "@/components/admin/tutor/TutorWorkloadCard";
import { TutorClassStatsCard } from "@/components/admin/tutor/TutorClassStatsCard";
import { TutorScheduleCard } from "@/components/admin/tutor/TutorScheduleCard";
import { TutorRemarksCard } from "@/components/admin/tutor/TutorRemarksCard";
import { TutorPerformanceCard } from "@/components/admin/tutor/TutorPerformanceCard";
import { TutorGrowthHistory } from "@/components/admin/tutor/TutorGrowthHistory";

interface PageProps {
  params: Promise<{ id: string }>;
}

function TutorDetailContent({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { confirm } = useConfirmation();

  const { data: tutorDetails, isLoading, isError } = useGetTutor(id);
  const tutor = tutorDetails?.tutor;
  const { mutateAsync: approveTutor, isPending: isApproving } = useApproveTutor();

  const assignedStudents = useMemo(() => tutorDetails?.assignedStudents || [], [tutorDetails]);

  const handleApprove = () => {
    if (!tutor) return;
    confirm({
      title: "Approve Tutor",
      message: `Are you sure you want to approve & admit "${tutor.name}" as an active tutor?`,
      confirmText: "Approve",
      onConfirm: async () => {
        try {
          await approveTutor({ id, status: "approved" });
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 w-full">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
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
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Tutor Not Found</h3>
          <p className="text-sm text-slate-600 mt-1">
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

  return (
    <div className="space-y-6 pb-12 relative w-full">
      <TutorProfileHeader
        tutor={tutor}
        totalGrowthPoints={tutorDetails?.totalGrowthPoints ?? tutor.growthPoints ?? 0}
        onBack={() => router.push("/admin/tutor")}
      />

      {!isApproved && (
        <TutorPendingBanner onApprove={handleApprove} isApproving={isApproving} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TutorProfileCard tutor={tutor} />
        <TutorWorkloadCard
          tutorId={id}
          isApproved={isApproved}
          assignedStudents={assignedStudents}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TutorClassStatsCard
          totalSessions={tutorDetails?.totalSessions || 0}
          conducted={tutorDetails?.conducted || 0}
          notConducted={tutorDetails?.notConducted || 0}
          postponed={tutorDetails?.postponed || 0}
          attendanceRate={tutorDetails?.attendanceRate || 0}
        />
        <TutorScheduleCard slots={tutor.slots} />
        <TutorRemarksCard
          positiveRemarks={tutor.positiveRemarks}
          negativeRemarks={tutor.negativeRemarks}
        />
      </div>

      <TutorPerformanceCard
        tutorId={id}
        isApproved={isApproved}
        performanceData={tutorDetails}
        totalGrowthPoints={tutorDetails?.totalGrowthPoints ?? tutor.growthPoints ?? 0}
      />

      <TutorGrowthHistory tutorId={id} />
    </div>
  );
}

export default function TutorDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-600">Loading tutor details...</div>}>
      <TutorDetailContent params={params} />
    </Suspense>
  );
}
