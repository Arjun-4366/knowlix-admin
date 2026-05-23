"use client";

import { Suspense } from "react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import ReportsDashboard from "@/components/admin/reports/ReportsDashboard";

function ReportsContent() {
  return (
    <div className="space-y-8 w-full relative pb-10">
      <DashboardHeader
        title="Reports & Analytics"
        description="Generate and export comprehensive reports on tutor performance, student diagnostics, attendance logs, sessions, and academy revenue."
      />

      <ReportsDashboard />
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ReportsContent />
    </Suspense>
  );
}
