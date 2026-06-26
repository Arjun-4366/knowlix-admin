"use client";

import { useState, Suspense } from "react";
import { FileText, History } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import TutorReportGenerator from "@/components/tutor/TutorReportGenerator";
import TutorReportHistory from "@/components/tutor/TutorReportHistory";
import { GradeCardReport, ReportStudent } from "@/components/tutor/TutorReportStats";
import { useGetTutorStudents } from "@/querys/tutor/studentQuery";
import { useGetProgressReports } from "@/querys/tutor/progressQuery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Progress Reports"
        description="Generate official grade cards for your students with marks and PDF download."
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
        <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger
            value="generate"
            className="rounded-lg text-xs font-bold flex items-center gap-1.5 px-4 py-2 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            <FileText className="w-3.5 h-3.5" /> Generate Report
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-lg text-xs font-bold flex items-center gap-1.5 px-4 py-2 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            <History className="w-3.5 h-3.5" /> Saved Reports
            {apiReports.length > 0 && (
              <span className="ml-1 bg-slate-200 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {apiReports.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-5">
          {studentsLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <TutorReportGenerator
              students={students}
              activeTemplateId={activeTemplateId}
              setActiveTemplateId={setActiveTemplateId}
              onGenerateReport={handleGenerateReport}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-5">
          <TutorReportHistory
            apiReports={apiReports}
            students={students}
            isLoading={reportsLoading}
          />
        </TabsContent>
      </Tabs>
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
