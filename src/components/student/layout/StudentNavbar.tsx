"use client";

import { useRouter, usePathname } from "next/navigation";
import { Bell, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useConfirmation } from "@/context/ConfirmationContext";

const pageTitles: Record<string, string> = {
  "/student/dashboard":   "Dashboard",
  "/student/notices":     "Notice Board",
  "/student/assignments": "Assignments",
  "/student/chatbot":     "Chatbot Assistant",
  "/student/schedule":    "My Schedule",
  "/student/results":     "Results & Grades",
  "/student/billing":     "Billing & Fees",
  "/student/profile":     "My Profile",
};

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onMobileToggle: () => void;
}

export default function StudentNavbar({ collapsed, onToggle, onMobileToggle }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { confirm } = useConfirmation();
  const title = pageTitles[pathname] ?? "Student Portal";

  const handleLogout = () => {
    confirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out from the student portal?",
      confirmText: "Sign Out",
      variant: "danger",
      onConfirm: async () => {
        localStorage.removeItem("token");
        router.push("/");
      },
    });
  };

  return (
    <header
      className="h-14 bg-white flex items-center justify-between px-4 flex-shrink-0"
      style={{ borderBottom: "1px solid var(--brand-light)" }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileToggle}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={onToggle}
          className="hidden md:flex p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>

        <span
          className="text-sm font-semibold font-heading"
          style={{ color: "var(--brand-dark)" }}
        >
          {title}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
