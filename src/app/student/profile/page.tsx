"use client";

import { Suspense } from "react";
import StudentProfile from "@/components/student/profile/StudentProfile";

function StudentProfileContent() {
  return (
    <div className="space-y-8 w-full relative pb-10">
      <StudentProfile />
    </div>
  );
}

export default function StudentProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StudentProfileContent />
    </Suspense>
  );
}
