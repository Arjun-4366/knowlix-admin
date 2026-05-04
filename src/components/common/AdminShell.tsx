"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <AdminNavbar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main className="flex-1 overflow-y-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ background: "var(--brand-bg)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
