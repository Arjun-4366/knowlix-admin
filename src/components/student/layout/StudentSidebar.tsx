"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  BookOpen,
  Bot,
  Calendar,
  Award,
  CreditCard,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        className="flex items-center border-b border-white/10 flex-shrink-0"
        style={{
          padding: collapsed ? "18px 0" : "18px 20px",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "padding 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          gap: "12px",
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--brand-green)" }}
        >
          <GraduationCap className="w-5 h-5 text-white" />
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
          <p className="text-white font-bold text-sm leading-none font-heading">Knowlix</p>
          <p className="text-white/45 text-xs mt-0.5">Student Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden"
        style={{ padding: collapsed ? "16px 8px" : "16px 12px", transition: "padding 300ms ease" }}
      >
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
                isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/8"
              )}
              style={{
                background: isActive ? "var(--brand-green)" : undefined,
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 0 : "12px",
                transition: "background 150ms ease, padding 300ms ease",
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
      </nav>

      {/* My Profile footer link */}
      <Link
        href="/student/profile"
        title={collapsed ? "My Profile" : undefined}
        className={cn(
          "border-t border-white/10 flex-shrink-0 flex items-center gap-3 transition-all",
          pathname === "/student/profile" ? "bg-white/10" : "hover:bg-white/5"
        )}
        style={{
          padding: collapsed ? "16px 0" : "14px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "padding 300ms ease, background 150ms ease",
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 flex-shrink-0"
          style={{ background: "var(--brand-green)" }}
        >
          <UserCircle className="w-4 h-4" />
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
          <p className="text-white text-xs font-semibold">My Profile</p>
          <p className="text-white/45 text-[10px]">View account details</p>
        </div>
      </Link>
    </aside>
  );
}
