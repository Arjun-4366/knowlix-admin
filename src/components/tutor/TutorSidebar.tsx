"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  ClipboardCheck,
  FileCheck,
  TrendingUp,
  MessageSquare,
  X,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useGetTutorProfile } from "@/querys/tutor/profileQuery";
import { useTutorStore } from "@/store/tutorStore";
import logo from "../../assets/images/icon.png";

type NavChild = { name: string; href: string };
type NavItem = {
  name: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
  children?: NavChild[];
};

const nav: NavItem[] = [
  { name: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
  { name: "My Students", href: "/tutor/students", icon: Users },
  { name: "Attendance", href: "/tutor/attendance", icon: ClipboardCheck },
  { name: "Assessment", href: "/tutor/assessment", icon: FileCheck },
  { name: "Notice Board", href: "/tutor/notices", icon: MessageSquare },
  { name: "Progress Reports", href: "/tutor/reports", icon: TrendingUp },
];

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function TutorSidebar({ collapsed, mobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const { data: profileResponse } = useGetTutorProfile();
  const profile = profileResponse;
  const setProfile = useTutorStore((s) => s.setProfile);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // On mobile the sidebar is always shown fully expanded
  const effectiveCollapsed = isMobile ? false : collapsed;

  useEffect(() => {
    if (profile) setProfile(profile);
  }, [profile, setProfile]);

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

  // Close mobile drawer on route change
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
        // Transitions: transform on mobile, width on desktop
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
          <p className="text-white font-bold text-sm leading-none font-heading">Knowlix</p>
          <p className="text-white/45 text-xs mt-0.5">Tutor Panel</p>
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
            const hasChildren = !!item.children;
            const isOpen = !!openDropdowns[item.name];

            if (hasChildren) {
              const isChildActive = item.children?.some((child) => pathname === child.href);
              return (
                <div key={item.name} className="flex flex-col">
                  <button
                    onClick={() =>
                      setOpenDropdowns((prev) => ({ ...prev, [item.name]: !prev[item.name] }))
                    }
                    title={effectiveCollapsed ? item.name : undefined}
                    className={cn(
                      "w-full flex items-center rounded-lg text-sm font-medium transition-all overflow-hidden cursor-pointer",
                      isChildActive
                        ? "text-white bg-white/5"
                        : "text-white/60 hover:text-white hover:bg-white/8"
                    )}
                    style={{
                      padding: effectiveCollapsed ? "10px 0" : "10px 12px",
                      justifyContent: effectiveCollapsed ? "center" : "flex-start",
                      gap: effectiveCollapsed ? 0 : "12px",
                      transition: "background 150ms ease, padding 300ms ease",
                    }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span
                      className="flex-1 whitespace-nowrap overflow-hidden text-left"
                      style={{
                        opacity: effectiveCollapsed ? 0 : 1,
                        maxWidth: effectiveCollapsed ? 0 : "200px",
                        transition: "opacity 150ms ease, max-width 300ms ease",
                      }}
                    >
                      {item.name}
                    </span>
                    {!effectiveCollapsed && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-white/55 transition-transform duration-200",
                          isOpen && "rotate-180"
                        )}
                      />
                    )}
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen && !effectiveCollapsed
                        ? "max-h-[500px] opacity-100 mt-0.5"
                        : "max-h-0 opacity-0"
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
              (item.href !== "/tutor/dashboard" && pathname.startsWith(item.href!));

            return (
              <Link
                key={item.name}
                href={item.href!}
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
                {item.badge && !effectiveCollapsed && (
                  <span
                    className="text-white text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.25)" : "var(--brand-green)",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User footer */}
      <Link
        href="/tutor/profile"
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
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "T"}
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
            <p className="text-white text-xs font-semibold truncate">
              {profile?.name || "Tutor"}
            </p>
            <p className="text-white/45 text-[10px] truncate">
              {profile?.email || "tutor@knowlix.in"}
            </p>
          </div>
        </div>
      </Link>
    </aside>
  );
}
