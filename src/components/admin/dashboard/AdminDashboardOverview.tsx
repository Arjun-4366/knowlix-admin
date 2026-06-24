"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import DashboardContentLinksCard from "@/components/admin/dashboard/overview/DashboardContentLinksCard";
import DashboardOverviewHeader from "@/components/admin/dashboard/overview/DashboardOverviewHeader";
import DashboardOverviewModals, {
  DashboardOverviewModalType,
} from "@/components/admin/dashboard/overview/DashboardOverviewModals";
import DashboardOverviewStats from "@/components/admin/dashboard/overview/DashboardOverviewStats";
import DashboardQuickActionsCard from "@/components/admin/dashboard/overview/DashboardQuickActionsCard";
import DashboardRecentEnquiriesCard from "@/components/admin/dashboard/overview/DashboardRecentEnquiriesCard";
import DashboardTopTutorsCard from "@/components/admin/dashboard/overview/DashboardTopTutorsCard";
import Loader from "@/components/shared/Loader";
import { useGetDashboard } from "@/querys/admin/dashboardQuery";
import { ITopTutor } from "@/types/admin/dashboard";

interface AdminDashboardOverviewProps {
  onViewChange: (view: "tutors" | "students" | "sessions") => void;
}

export default function AdminDashboardOverview({
  onViewChange,
}: AdminDashboardOverviewProps) {
  const router = useRouter();
  const { data: dashboardData, isLoading } = useGetDashboard();

  const [activeModal, setActiveModal] =
    useState<DashboardOverviewModalType>(null);
  const [selectedTutor, setSelectedTutor] = useState<ITopTutor | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openTutorReport = (tutor: ITopTutor) => {
    setSelectedTutor(tutor);
    setActiveModal("tutor-report");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedTutor(null);
  };

  if (isLoading) {
    return <Loader text="Loading Dashboard Data..." />;
  }

  return (
    <div className="relative w-full space-y-8 pb-8">
      {toastMessage && (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl border border-[var(--brand-light)]/25 bg-[var(--brand-dark)] px-4 py-3 text-white shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand-green)]">
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      <DashboardOverviewHeader />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3">
          <DashboardOverviewStats
            dashboardData={dashboardData}
            onViewChange={onViewChange}
          />
        </div>

        <DashboardQuickActionsCard
          onAddStudent={() => router.push("/admin/students?add=true")}
          onAddTutor={() => setActiveModal("add-tutor")}
          onAssignTutor={() => setActiveModal("assign-tutor")}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
        <div className="space-y-8 xl:col-span-8 2xl:col-span-9">
          <DashboardContentLinksCard />
          <DashboardTopTutorsCard
            tutors={dashboardData?.top5Tutors ?? []}
            onTutorSelect={openTutorReport}
          />
        </div>

        <div className="space-y-8 xl:col-span-4 2xl:col-span-3">
          <DashboardRecentEnquiriesCard />
        </div>
      </div>

      <DashboardOverviewModals
        key={activeModal ?? "closed"}
        activeModal={activeModal}
        selectedTutor={selectedTutor}
        onClose={closeModal}
        onToast={triggerToast}
      />
    </div>
  );
}
