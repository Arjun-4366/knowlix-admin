"use client";

import { useState } from "react";
import AdminDashboardOverview from "@/components/dashboard/admin/AdminDashboardOverview";
import AdminTutorDirectory from "@/components/dashboard/admin/AdminTutorDirectory";
import AdminStudentDirectory from "@/components/dashboard/admin/AdminStudentDirectory";
import AdminSessionTracker from "@/components/dashboard/admin/AdminSessionTracker";

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
