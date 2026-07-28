"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetStudentProfile } from "@/querys/student/studentQuery";
import logo from "../../../assets/images/icon.png"

type NavItem = {
  name: string;
  icon: React.ElementType;
  href: string;
};

const nav: NavItem[] = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "Notice Board", href: "/student/notices", icon: MessageSquare },
  { name: "Assignments", href: "/student/assignments", icon: BookOpen },
  { name: "Chatbot Assistant", href: "/student/chatbot", icon: Bot },
  { name: "My Schedule", href: "/student/schedule", icon: Calendar },
  { name: "Results & Grades", href: "/student/results", icon: Award },
  { name: "Billing & Fees", href: "/student/billing", icon: CreditCard },
];

interface Props {
  collapsed: boolean;
}

export default function StudentSidebar({ collapsed }: Props) {
  const pathname = usePathname();
  const { data: profile } = useGetStudentProfile();

  return (
    <aside
      className="flex-shrink-0 flex flex-col h-full overflow-hidden"
      style={{
        background: "var(--brand-dark)",
        width: collapsed ? "64px" : "240px",
        transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: collapsed ? "18px 0" : "18px 20px",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "padding 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          gap: "12px",
        }}
      >
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={logo} alt="Knowlix" width={36} height={36} className="w-full h-full object-contain" priority />
        </div>
        <div
          className="overflow-hidden"
          style={{
            opacity: collapsed ? 0 : 1,
            maxWidth: collapsed ? 0 : "120px",
            transition: "opacity 200ms ease, max-width 300ms ease",
            whiteSpace: "nowrap",
          }}
        >
          <p className="font-bold text-sm leading-none font-heading text-white">
            Knowlix
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Student Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ padding: collapsed ? "16px 8px" : "16px 12px", transition: "padding 300ms ease" }}
      >
        <div className="space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all overflow-hidden",
                  isActive ? "font-semibold" : ""
                )}
                style={{
                  background: isActive ? "rgba(255,255,255,0.15)" : undefined,
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                  padding: collapsed ? "10px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: collapsed ? 0 : "12px",
                  transition: "background 150ms ease, color 150ms ease, padding 300ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = "";
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                  }
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span
                  className="flex-1 whitespace-nowrap overflow-hidden"
                  style={{
                    opacity: collapsed ? 0 : 1,
                    maxWidth: collapsed ? 0 : "200px",
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
          padding: collapsed ? "16px 0" : "16px",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
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
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : "150px",
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
