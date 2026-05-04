"use client";

import { Bell, LogOut, ExternalLink, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const pageTitles: Record<string, { title: string; section?: string }> = {
  "/admin/dashboard": { title: "Dashboard" },
  "/admin/home": { title: "Home Page" },
  "/admin/about": { title: "About" },
  "/admin/courses": { title: "Courses" },
  "/admin/blog": { title: "Blog" },
  "/admin/team": { title: "Team" },
  "/admin/gallery": { title: "Gallery" },
  "/admin/careers": { title: "Careers" },
  "/admin/enquiries": { title: "Enquiries" },
  "/admin/settings": { title: "Settings" },
};

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminNavbar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();
  const meta = pageTitles[pathname] ?? { title: "Admin" };

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
        <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
