"use client";

import { useState } from "react";
import HRSidebar from "./HRSidebar";
import HRNavbar from "./HRNavbar";

export default function HRShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <HRSidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <HRNavbar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main
          className="flex-1 overflow-y-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ background: "var(--brand-bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
