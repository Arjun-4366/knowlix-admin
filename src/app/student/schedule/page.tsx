"use client";

import { Suspense } from "react";
import StudentSchedule from "@/components/student/schedule/StudentSchedule";

export default function StudentSchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentSchedule />
    </Suspense>
  );
}
