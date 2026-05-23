"use client";

import { useRouter } from "next/navigation";
import { Bell, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useConfirmation } from "@/context/ConfirmationContext";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function HRNavbar({ collapsed, onToggle }: Props) {
  const router = useRouter();
  const { confirm } = useConfirmation();

  const handleLogout = () => {
    confirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out from the HR portal?",
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
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
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
          HR Management
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-55 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
