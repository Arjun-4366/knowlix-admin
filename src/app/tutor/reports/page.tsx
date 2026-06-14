"use client";

import { useState, Suspense } from "react";
import { FileText, History } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import TutorReportGenerator from "@/components/tutor/TutorReportGenerator";
import TutorReportHistory from "@/components/tutor/TutorReportHistory";
import { GradeCardReport, ReportStudent } from "@/components/tutor/TutorReportStats";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { useGetProgressReports } from "@/querys/tutor/progressQuery";

type Tab = "generate" | "history";

function TutorReportsContent() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [activeTemplateId, setActiveTemplateId] = useState<"monthly" | "five-month" | "annual">("monthly");

  const { data: studentsResponse, isLoading: studentsLoading } = useGetTutorStudents();
  const apiStudents = studentsResponse?.data ?? [];
  const students: ReportStudent[] = apiStudents.map((s) => ({
    id: s.id,
    name: s.studentName,
    programName: s.programName ?? s.class ?? "",
    admissionNo: s.admissionNumber ?? s.id,
  }));

  const { data: reportsResponse, isLoading: reportsLoading } = useGetProgressReports();
  const apiReports = reportsResponse?.data ?? [];

  const handleGenerateReport = (_report: GradeCardReport) => {};

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "generate", label: "Generate Report", icon: <FileText className="w-4 h-4" /> },
    { id: "history", label: "Saved Reports", icon: <History className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Progress Reports"
        description="Generate official grade cards for your students with marks and PDF download."
      />

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === "history" && apiReports.length > 0 && (
              <span className="ml-1 bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {apiReports.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {studentsLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTab === "generate" ? (
        <TutorReportGenerator
          students={students}
          activeTemplateId={activeTemplateId}
          setActiveTemplateId={setActiveTemplateId}
          onGenerateReport={handleGenerateReport}
        />
      ) : (
        <TutorReportHistory
          apiReports={apiReports}
          students={students}
          isLoading={reportsLoading}
        />
      )}
    </div>
  );
}

export default function TutorReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TutorReportsContent />
    </Suspense>
  );
}
