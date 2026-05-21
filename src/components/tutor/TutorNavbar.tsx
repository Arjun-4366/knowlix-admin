"use client";

import { useRouter, usePathname } from "next/navigation";
import { Bell, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useConfirmation } from "@/context/ConfirmationContext";

const pageTitles: Record<string, { title: string; section?: string }> = {
  "/tutor/dashboard":  { title: "Dashboard" },
  "/tutor/students":   { title: "My Students" },
  "/tutor/attendance": { title: "Attendance" },
  "/tutor/assessment": { title: "Assessment" },
  "/tutor/reports":    { title: "Progress Reports" },
};

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function TutorNavbar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { confirm } = useConfirmation();
  const meta = pageTitles[pathname] ?? { title: "Tutor" };

  const handleLogout = () => {
    confirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      confirmText: "Sign Out",
      variant: "danger",
      onConfirm: async () => {
        localStorage.removeItem("token");
        router.push("/");
      },
    });
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Sidebar toggle */}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        {meta.section && (
          <>
            <span className="text-gray-300 text-sm">/</span>
            <span className="text-gray-400 text-sm">{meta.section}</span>
          </>
        )}
        <span
          className="text-sm font-semibold font-heading"
          style={{ color: "var(--brand-dark)" }}
        >
          {meta.title}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
