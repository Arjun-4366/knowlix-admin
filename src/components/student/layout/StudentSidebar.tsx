"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Bot,
  Calendar,
  Award,
  CreditCard,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetStudentProfile } from "@/querys/student/studentQuery";
import logo from "../../../assets/images/icon.png";

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
};

const nav: NavItem[] = [
  { name: "Dashboard",        href: "/student/dashboard",   icon: LayoutDashboard },
  { name: "Notice Board",     href: "/student/notices",     icon: MessageSquare },
  { name: "Assignments",      href: "/student/assignments", icon: BookOpen },
  { name: "Chatbot Assistant",href: "/student/chatbot",     icon: Bot },
  { name: "My Schedule",      href: "/student/schedule",    icon: Calendar },
  { name: "Results & Grades", href: "/student/results",     icon: Award },
  { name: "Billing & Fees",   href: "/student/billing",     icon: CreditCard },
];

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function StudentSidebar({ collapsed, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const { data: profile } = useGetStudentProfile();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // On mobile always fully expanded; on desktop follow collapsed state
  const effectiveCollapsed = isMobile ? false : collapsed;

  // Close drawer on route change
  useEffect(() => {
    if (mobileOpen) onMobileClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden flex-shrink-0",
        // Mobile: fixed overlay drawer
        "fixed inset-y-0 left-0 z-50",
        // Desktop: back in the flex flow
        "md:relative md:z-auto md:inset-auto",
        // Mobile slide in/out; desktop always visible
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        // Width: always 240px on mobile; follows collapsed on desktop
        "w-60",
        collapsed ? "md:w-16" : "md:w-60",
        // Transitions
        "transition-transform md:transition-[width] duration-300 md:ease-[cubic-bezier(0.4,0,0.2,1)]",
      )}
      style={{ background: "var(--brand-dark)" }}
    >
      {/* Logo */}
      <div
        className="flex items-center border-b border-white/10 flex-shrink-0"
        style={{
          padding: effectiveCollapsed ? "18px 0" : "18px 20px",
          justifyContent: effectiveCollapsed ? "center" : "flex-start",
          transition: "padding 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          gap: "12px",
        }}
      >
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={logo}
            alt="Knowlix"
            width={36}
            height={36}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div
          className="overflow-hidden flex-1"
          style={{
            opacity: effectiveCollapsed ? 0 : 1,
            maxWidth: effectiveCollapsed ? 0 : "120px",
            transition: "opacity 200ms ease, max-width 300ms ease",
            whiteSpace: "nowrap",
          }}
        >
          <p className="font-bold text-sm leading-none font-heading text-white">Knowlix</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Student Panel</p>
        </div>

        {/* Close button — mobile only */}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="ml-auto p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{
          padding: effectiveCollapsed ? "16px 8px" : "16px 12px",
          transition: "padding 300ms ease",
        }}
      >
        <div className="space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                title={effectiveCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all overflow-hidden",
                  isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/8"
                )}
                style={{
                  background: isActive ? "var(--brand-green)" : undefined,
                  padding: effectiveCollapsed ? "10px 0" : "10px 12px",
                  justifyContent: effectiveCollapsed ? "center" : "flex-start",
                  gap: effectiveCollapsed ? 0 : "12px",
                  transition: "background 150ms ease, padding 300ms ease",
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span
                  className="flex-1 whitespace-nowrap overflow-hidden"
                  style={{
                    opacity: effectiveCollapsed ? 0 : 1,
                    maxWidth: effectiveCollapsed ? 0 : "200px",
                    transition: "opacity 150ms ease, max-width 300ms ease",
                  }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User footer */}
      <Link
        href="/student/profile"
        className="border-t border-white/10 flex-shrink-0 hover:bg-white/5 transition-colors cursor-pointer"
        style={{
          padding: effectiveCollapsed ? "16px 0" : "16px",
          display: "flex",
          justifyContent: effectiveCollapsed ? "center" : "flex-start",
          transition: "padding 300ms ease",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: "var(--brand-green)" }}
          >
            {profile?.studentName ? profile.studentName.charAt(0).toUpperCase() : "S"}
          </div>
          <div
            className="overflow-hidden"
            style={{
              opacity: effectiveCollapsed ? 0 : 1,
              maxWidth: effectiveCollapsed ? 0 : "150px",
              transition: "opacity 200ms ease, max-width 300ms ease",
              whiteSpace: "nowrap",
            }}
          >
            <p className="text-white text-xs font-semibold truncate">{profile?.studentName || "Student"}</p>
            <p className="text-white/45 text-[10px] truncate">{profile?.email || "student@knowlix.in"}</p>
          </div>
        </div>
      </Link>
    </aside>
  );
}
