"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, ExternalLink, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useConfirmation } from "@/context/ConfirmationContext";

const pageTitles: Record<string, { title: string; section?: string }> = {
  "/admin/dashboard": { title: "Dashboard" },
  "/admin/home":      { title: "Home Page" },
  "/admin/about":     { title: "About" },
  "/admin/programs":  { title: "Programs & Courses" },
  "/admin/blog":      { title: "Blog" },
  "/admin/team":      { title: "Team" },
  "/admin/gallery":   { title: "Gallery" },
  "/admin/careers":   { title: "Careers" },
  "/admin/enquiries": { title: "Enquiries" },
  "/admin/reviews":   { title: "Reviews" },
  "/admin/settings":  { title: "Settings" },
};

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminNavbar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const { confirm } = useConfirmation();
  const meta = pageTitles[pathname] ?? { title: "Admin" };

  const handleLogout = () => {
    confirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out? Any unsaved changes will be lost.",
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

        {/* Page title */}
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
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Site
        </Link>
        <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-400 transition-colors">
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--brand-green)" }}
          />
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
