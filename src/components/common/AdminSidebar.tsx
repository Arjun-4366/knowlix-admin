"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Home, Info, BookOpen, FileText,
  Users, ImageIcon, Briefcase, MessageSquare, Settings,
  ChevronDown, GraduationCap, Star, Globe, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavChild = { name: string; href: string };
type NavItem = {
  name: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
  children?: NavChild[];
};

const nav: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Tutors", href: "/admin/tutor", icon: GraduationCap },
  { name: "Notice Board", href: "/admin/notices", icon: MessageSquare },
  { name: "Assignments", href: "/admin/assignments", icon: BookOpen },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  {
    name: "Website",
    icon: Globe,
    children: [
      { name: "Home Page", href: "/admin/website/home" },
      { name: "About", href: "/admin/website/about" },
      { name: "Programs", href: "/admin/website/programs" },
      { name: "Blog", href: "/admin/website/blog" },
      { name: "Team", href: "/admin/website/team" },
      { name: "Reviews", href: "/admin/website/reviews" },
      { name: "Gallery", href: "/admin/website/gallery" },
      { name: "Careers", href: "/admin/website/careers" },
      { name: "Enquiries", href: "/admin/website/enquiries" },
      // { name: "Settings", href: "/admin/website/settings" },
    ],
  },
];

interface Props {
  collapsed: boolean;
}

export default function AdminSidebar({ collapsed }: Props) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    nav.forEach((item) => {
      if (item.children?.some((child) => pathname === child.href)) {
        initial[item.name] = true;
      }
    });
    return initial;
  });

  useEffect(() => {
    nav.forEach((item) => {
      if (item.children?.some((child) => pathname === child.href)) {
        setOpenDropdowns((prev) => ({ ...prev, [item.name]: true }));
      }
    });
  }, [pathname]);

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
          <p className="text-white/45 text-xs mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden"
        style={{ padding: collapsed ? "16px 8px" : "16px 12px", transition: "padding 300ms ease" }}
      >
        {nav.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const isOpen = !!openDropdowns[item.name];

          if (hasChildren) {
            const isChildActive = item.children?.some((child) => pathname === child.href);

            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => setOpenDropdowns((prev) => ({ ...prev, [item.name]: !prev[item.name] }))}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "w-full flex items-center rounded-lg text-sm font-medium transition-all overflow-hidden cursor-pointer",
                    isChildActive ? "text-white bg-white/5" : "text-white/60 hover:text-white hover:bg-white/8"
                  )}
                  style={{
                    padding: collapsed ? "10px 0" : "10px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: collapsed ? 0 : "12px",
                    transition: "background 150ms ease, padding 300ms ease, justify-content 300ms ease",
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span
                    className="flex-1 whitespace-nowrap overflow-hidden text-left"
                    style={{
                      opacity: collapsed ? 0 : 1,
                      maxWidth: collapsed ? 0 : "200px",
                      transition: "opacity 150ms ease, max-width 300ms ease",
                    }}
                  >
                    {item.name}
                  </span>
                  {!collapsed && (
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-white/55 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {/* Submenu with animation */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen && !collapsed ? "max-h-[500px] opacity-100 mt-0.5" : "max-h-0 opacity-0"
                  )}
                >
                  <div
                    className="pl-5 pr-1 py-1 flex flex-col space-y-0.5 border-l border-white/10"
                    style={{ marginLeft: "1.25rem" }}
                  >
                    {item.children?.map((child) => {
                      const isChildSelected = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "flex items-center rounded-lg text-xs font-medium py-2 px-3 transition-all",
                            isChildSelected
                              ? "text-white bg-[var(--brand-green)]"
                              : "text-white/50 hover:text-white hover:bg-white/5"
                          )}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href!));

          return (
            <Link
              key={item.name}
              href={item.href!}
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
                transition: "background 150ms ease, padding 300ms ease, justify-content 300ms ease",
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
              {item.badge && !collapsed && (
                <span
                  className="text-white text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: isActive ? "rgba(255,255,255,0.25)" : "var(--brand-green)" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="border-t border-white/10 flex-shrink-0"
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
            A
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
            <p className="text-white text-xs font-semibold">Admin</p>
            <p className="text-white/45 text-xs">admin@knowlix.in</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
