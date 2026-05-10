"use client";

import { useState } from "react";
import { GraduationCap, BookOpen } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import ProgramsManager from "@/components/programs/ProgramsManager";
import CoursesManager from "@/components/programs/CoursesManager";

type Tab = "programs" | "courses";

export default function ProgramsPage() {
  const [tab, setTab] = useState<Tab>("programs");

  return (
    <div className="max-w-7xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Programs & Courses"
        description="Manage your online school and tuition programs along with their individual courses"
      />

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
        {([
          { id: "programs" as Tab, label: "Programs", icon: GraduationCap },
          { id: "courses"  as Tab, label: "Courses",  icon: BookOpen },
        ] as const).map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                active
                  ? "bg-[#16a34a] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "programs" && <ProgramsManager />}
      {tab === "courses"  && <CoursesManager />}
    </div>
  );
}
