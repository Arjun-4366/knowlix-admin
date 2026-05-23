"use client";

import { useState } from "react";
import AdminDashboardOverview from "@/components/admin/dashboard/AdminDashboardOverview";
import AdminTutorDirectory from "@/components/admin/dashboard/AdminTutorDirectory";
import AdminStudentDirectory from "@/components/admin/dashboard/AdminStudentDirectory";
import AdminSessionTracker from "@/components/admin/dashboard/AdminSessionTracker";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<"dashboard" | "tutors" | "students" | "sessions">("dashboard");

  const handleBack = () => setActiveView("dashboard");

  switch (activeView) {
    case "tutors":
      return <AdminTutorDirectory onBack={handleBack} />;
    case "students":
      return <AdminStudentDirectory onBack={handleBack} />;
    case "sessions":
      return <AdminSessionTracker onBack={handleBack} />;
    default:
      return <AdminDashboardOverview onViewChange={setActiveView} />;
  }
}
