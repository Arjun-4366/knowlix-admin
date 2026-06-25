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
      className="flex-shrink-0 flex flex-col h-full overflow-hidden bg-white"
      style={{
        borderRight: "1px solid #e2e8f0",
        width: collapsed ? "64px" : "240px",
        transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center border-b border-slate-100 flex-shrink-0"
        style={{
          padding: collapsed ? "18px 0" : "18px 20px",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "padding 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          gap: "12px",
        }}
      >
        <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
          <Image src="/icon.png" alt="Knowlix" width={36} height={36} className="w-full h-full object-contain" priority />
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
          <p className="font-bold text-sm leading-none font-heading" style={{ color: "var(--brand-dark)" }}>
            Knowlix
          </p>
          <p className="text-slate-400 text-xs mt-0.5">Student Panel</p>
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
                  isActive
                    ? "font-semibold"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                )}
                style={{
                  background: isActive ? "var(--brand-light-green)" : undefined,
                  color: isActive ? "var(--brand-dark)" : undefined,
                  padding: collapsed ? "10px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  gap: collapsed ? 0 : "12px",
                  transition: "background 150ms ease, padding 300ms ease",
                }}
              >
                <Icon
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: isActive ? "var(--brand-green)" : undefined }}
                />
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

      {/* My Profile footer link */}
      <Link
        href="/student/profile"
        title={collapsed ? "My Profile" : undefined}
        className={cn(
          "border-t border-slate-100 flex-shrink-0 flex items-center gap-3 transition-all",
          pathname === "/student/profile" ? "bg-slate-50" : "hover:bg-slate-50"
        )}
        style={{
          padding: collapsed ? "16px 0" : "14px 16px",
          justifyContent: collapsed ? "center" : "flex-start",
          transition: "padding 300ms ease, background 150ms ease",
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
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
          <p className="text-xs font-semibold" style={{ color: "var(--brand-dark)" }}>My Profile</p>
          <p className="text-slate-400 text-[10px]">View account details</p>
        </div>
      </Link>
    </aside>
  );
}
