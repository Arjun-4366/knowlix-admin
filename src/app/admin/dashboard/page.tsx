import { MessageSquare, FileText, Users, Briefcase, Clock } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "New Enquiries", value: "12", icon: MessageSquare, color: "#dbeafe", iconColor: "#1d4ed8", href: "/admin/enquiries" },
  { label: "Blog Posts", value: "8", icon: FileText, color: "#fef9c3", iconColor: "#92400e", href: "/admin/blog" },
  { label: "Active Mentors", value: "33", icon: Users, color: "#dcfce7", iconColor: "#15803d", href: "/admin/team" },
  { label: "Open Positions", value: "6", icon: Briefcase, color: "#fce7f3", iconColor: "#9d174d", href: "/admin/careers" },
];

const sections = [
  { label: "Home Page", desc: "Hero, stats, why parents, testimonials, FAQ, CTA", href: "/admin/home", color: "#0d3b2e" },
  { label: "About", desc: "Story, vision & mission, core values, founder message", href: "/admin/about", color: "#0d3b2e" },
  { label: "Courses", desc: "Online school program and online tuition subjects", href: "/admin/courses", color: "#0d3b2e" },
  { label: "Blog", desc: "Create and manage blog posts and categories", href: "/admin/blog", color: "#0d3b2e" },
  { label: "Team", desc: "Leadership profiles and mentor directory", href: "/admin/team", color: "#0d3b2e" },
  { label: "Gallery", desc: "Photos and videos from classes and events", href: "/admin/gallery", color: "#0d3b2e" },
  { label: "Careers", desc: "Open positions and job applications", href: "/admin/careers", color: "#0d3b2e" },
  { label: "Settings", desc: "Contact info, social links, and site settings", href: "/admin/settings", color: "#0d3b2e" },
];

const recentEnquiries = [
  { name: "Sunita Rao", grade: "Grade 9", time: "2 hours ago", status: "new" },
  { name: "Shalini Krishnan", grade: "Grade 12", time: "5 hours ago", status: "new" },
  { name: "Rahul Mehta", grade: "Grade 4", time: "1 day ago", status: "new" },
  { name: "Manoj Verma", grade: "Grade 6", time: "1 day ago", status: "replied" },
  { name: "Ananya Pillai", grade: "Grade 8", time: "3 days ago", status: "replied" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--brand-dark)" }}>
          Welcome back 👋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Here&apos;s what&apos;s happening on Knowlix today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color }}>
                <Icon className="w-5 h-5" style={{ color: s.iconColor }} />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading" style={{ color: "var(--brand-dark)" }}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Quick navigation */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>
              Manage Content
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-0">
            {sections.map((s, i) => (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-r border-gray-100 last:border-b-0"
                style={{ borderRight: i % 2 === 1 ? "none" : undefined }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "var(--brand-green)" }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent enquiries */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>
              Recent Enquiries
            </h2>
            <Link href="/admin/enquiries" className="text-xs font-medium hover:underline" style={{ color: "var(--brand-green)" }}>
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEnquiries.map((e, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{e.name}</p>
                  <p className="text-xs text-gray-400">{e.grade}</p>
                </div>
                <div className="text-right">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={e.status === "new"
                      ? { background: "#dbeafe", color: "#1d4ed8" }
                      : { background: "#dcfce7", color: "#15803d" }}
                  >
                    {e.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />{e.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100">
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold w-full flex items-center justify-center py-1.5 rounded-lg transition-colors hover:bg-green-50"
              style={{ color: "var(--brand-green)" }}
            >
              Manage all enquiries →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
