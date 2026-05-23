"use client";

import { Suspense } from "react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import StudentDashboard from "@/components/student/dashboard/StudentDashboard";


function StudentDashboardContent() {
  return (
    <div className="space-y-8 w-full relative pb-10">
      <DashboardHeader
        title="Student Dashboard"
        description="Review your academics, track assignments, verify attendance records, pay dues, and join live online classes."
      />
      <StudentDashboard />
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}
