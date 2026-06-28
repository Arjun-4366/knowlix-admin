"use client";

import { useState } from "react";
import TutorSidebar from "./TutorSidebar";
import TutorNavbar from "./TutorNavbar";

export default function TutorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div id="tutor-shell" className="flex h-screen overflow-hidden">
      <TutorSidebar collapsed={collapsed} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TutorNavbar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
        <main
          className="flex-1 overflow-y-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ background: "var(--brand-bg)", scrollbarGutter: "stable" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
