import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Users, DollarSign, Clock, Check, X, Star, BarChart3, MessageSquare } from "lucide-react";
import DashboardStatCard from "../shared/DashboardStatCard";
import { cn } from "@/lib/utils";

// Dummy data inside component
const sections = [
  { label: "Home Page", desc: "Hero, stats, why parents, testimonials, FAQ, CTA", href: "/admin/website/home" },
  { label: "About", desc: "Story, vision & mission, core values, founder message", href: "/admin/website/about" },
  { label: "Courses", desc: "Online school program and online tuition subjects", href: "/admin/website/courses" },
  { label: "Blog", desc: "Create and manage blog posts and categories", href: "/admin/website/blog" },
  { label: "Team", desc: "Leadership profiles and mentor directory", href: "/admin/website/team" },
  { label: "Gallery", desc: "Photos and videos from classes and events", href: "/admin/website/gallery" },
  { label: "Careers", desc: "Open positions and job applications", href: "/admin/website/careers" },
  { label: "Settings", desc: "Contact info, social links, and site settings", href: "/admin/website/settings" },
];

const recentEnquiries = [
  { name: "Sunita Rao", grade: "Grade 9", time: "2 hours ago", status: "new" },
  { name: "Shalini Krishnan", grade: "Grade 12", time: "5 hours ago", status: "new" },
  { name: "Rahul Mehta", grade: "Grade 4", time: "1 day ago", status: "new" },
  { name: "Manoj Verma", grade: "Grade 6", time: "1 day ago", status: "replied" },
  { name: "Ananya Pillai", grade: "Grade 8", time: "3 days ago", status: "replied" },
];

const topTutors = [
  { rank: 1, name: "Dr. Ramesh Prasad", subject: "Advanced Physics", rating: "4.95/5.0", classes: 42, performance: "Outstanding", feedback: "Dr. Ramesh is exceptionally patient and clears up hard physics concepts easily." },
  { rank: 2, name: "Amit Shah", subject: "Mathematics (JEE)", rating: "4.90/5.0", classes: 38, performance: "Outstanding", feedback: "Amit's JEE shortcuts helped our child improve speed in mocks significantly." },
  { rank: 3, name: "Sarah Jenkins", subject: "English Literature", rating: "4.85/5.0", classes: 35, performance: "Excellent", feedback: "Sarah makes literature classes fun and interactive. Highly recommended." },
  { rank: 4, name: "David Miller", subject: "Computer Science", rating: "4.82/5.0", classes: 30, performance: "Excellent", feedback: "David's coding challenges keep kids hooked. Very structured lessons." },
  { rank: 5, name: "Ananya Roy", subject: "Biology", rating: "4.80/5.0", classes: 28, performance: "Very Good", feedback: "Detailed explanations and good slides. Very helpful notes." },
];

interface AdminDashboardOverviewProps {
  onViewChange: (view: "tutors" | "students" | "sessions") => void;
}

export default function AdminDashboardOverview({ onViewChange }: AdminDashboardOverviewProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"add-student" | "add-tutor" | "assign-tutor" | "tutor-report" | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<typeof topTutors[0] | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [studentName, setStudentName] = useState("");
  const [studentGrade, setStudentGrade] = useState("Grade 10");
  const [studentCourse, setStudentCourse] = useState("");

  const [tutorName, setTutorName] = useState("");
  const [tutorSubject, setTutorSubject] = useState("");
  const [tutorExperience, setTutorExperience] = useState("");

  const [studentSelect, setStudentSelect] = useState("Rahul Sharma");
  const [tutorSelect, setTutorSelect] = useState("Dr. Ramesh Prasad");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName) return;
    triggerToast(`Student "${studentName}" added successfully!`);
    setActiveModal(null);
    setStudentName("");
    setStudentCourse("");
  };

  const handleAddTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorName) return;
    triggerToast(`Tutor "${tutorName}" registered successfully!`);
    setActiveModal(null);
    setTutorName("");
    setTutorSubject("");
    setTutorExperience("");
  };

  const handleAssignTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Assigned ${tutorSelect} to student ${studentSelect} successfully!`);
    setActiveModal(null);
  };

  const openTutorReport = (tutor: typeof topTutors[0]) => {
    setSelectedTutor(tutor);
    setActiveModal("tutor-report");
  };

  return (
    <div className="space-y-8 max-w-6xl relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--brand-dark)] text-white border border-[var(--brand-light)] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-5 h-5 rounded-full bg-[var(--brand-green)] flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-800 tracking-tight flex items-center gap-2">
          Welcome back 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here&apos;s a quick overview of today&apos;s key tutoring operations.</p>
      </div>

      {/* Metrics/Stats Grid using reusable DashboardStatCard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard
          label="Total Tutors"
          value="48"
          icon={<GraduationCap className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="Active"
          badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
          gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
          iconBgClass="bg-[var(--brand-light-green)]"
          footerText="View complete list"
          footerLink={true}
          footerClassName="text-[var(--brand-green)] font-semibold"
          onClick={() => onViewChange("tutors")}
        />

        <DashboardStatCard
          label="Total Students"
          value="350"
          icon={<Users className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="Enrolled"
          badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
          gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
          iconBgClass="bg-[var(--brand-light-green)]"
          footerText="View complete list"
          footerLink={true}
          footerClassName="text-[var(--brand-green)] font-semibold"
          onClick={() => router.push("/admin/students")}
        />

        <DashboardStatCard
          label="Monthly Revenue"
          value="₹12,45,000"
          icon={<DollarSign className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="This Month"
          badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
          gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
          iconBgClass="bg-[var(--brand-light-green)]"
          footerText="Updated 2h ago"
          footerClassName="text-slate-400"
        />

        <DashboardStatCard
          label="Active Sessions"
          value="18"
          icon={<Clock className="w-6 h-6 text-[var(--brand-green)]" />}
          badgeText="Today"
          badgeClassName="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
          gradientClass="from-[var(--brand-green)] to-[var(--brand-light)]"
          iconBgClass="bg-[var(--brand-light-green)]"
          footerText="View today's details"
          footerLink={true}
          footerClassName="text-[var(--brand-green)] font-semibold"
          onClick={() => onViewChange("sessions")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Manage Content & Leaderboard */}
        <div className="lg:col-span-2 space-y-8">
          {/* Manage Website Content */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/20">
              <h2 className="text-md font-bold text-slate-800">
                Manage Website Content
              </h2>
              <p className="text-xs text-slate-455 mt-0.5">Quick access to admin editors for public pages</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="divide-y divide-slate-100">
                {sections.slice(0, 4).map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className="flex items-start gap-3 p-5 hover:bg-slate-55/30 transition-colors group/link"
                  >
                    <div className="w-2 h-2 rounded-full mt-2 bg-[var(--brand-green)] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-750 group-hover/link:text-[var(--brand-green)] transition-colors">{s.label}</p>
                      <p className="text-xs text-slate-450 mt-1">{s.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="divide-y divide-slate-100">
                {sections.slice(4).map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className="flex items-start gap-3 p-5 hover:bg-slate-55/30 transition-colors group/link"
                  >
                    <div className="w-2 h-2 rounded-full mt-2 bg-[var(--brand-green)] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-755 group-hover/link:text-[var(--brand-green)] transition-colors">{s.label}</p>
                      <p className="text-xs text-slate-455 mt-1">{s.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Top 5 Tutors Leaderboard */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div>
                <h2 className="text-md font-bold text-slate-800">Top 5 Tutors</h2>
                <p className="text-xs text-slate-455 mt-0.5">Based on ratings & sessions conducted this month</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20">
                Leaderboard
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-16 text-center">Rank</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Expertise</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Classes</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topTutors.map((tutor) => (
                    <tr
                      key={tutor.rank}
                      onClick={() => openTutorReport(tutor)}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer group/tr"
                    >
                      <td className="px-6 py-4 text-sm text-center font-bold text-slate-500">
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border",
                          tutor.rank === 1 && "bg-amber-50 text-amber-800 border-amber-200",
                          tutor.rank === 2 && "bg-slate-100 text-slate-800 border-slate-200",
                          tutor.rank === 3 && "bg-orange-50 text-orange-800 border-orange-200",
                          tutor.rank > 3 && "text-slate-400 font-semibold"
                        )}>
                          {tutor.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800 group-hover/tr:text-[var(--brand-green)] transition-colors">{tutor.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{tutor.subject}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 text-center font-semibold">{tutor.classes}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[var(--brand-green)] flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current text-[var(--brand-green)]" />
                        {tutor.rating.split("/")[0]}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--brand-light-green)] text-[var(--brand-mid)] border border-[var(--brand-light)]/20">
                          {tutor.performance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Recent Enquiries */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/20">
              <h2 className="text-md font-bold text-slate-800">Quick Actions</h2>
              <p className="text-xs text-slate-455 mt-0.5">Frequent administrative shortcuts</p>
            </div>
            <div className="p-5 space-y-3">
              <button
                onClick={() => router.push("/admin/students?add=true")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-150 text-slate-700 hover:text-[var(--brand-green)] hover:border-[var(--brand-green)]/40 hover:bg-slate-50/30 transition-all font-semibold text-sm cursor-pointer group"
              >
                <span>Add New Student</span>
                <span className="text-slate-400 group-hover:text-[var(--brand-green)] group-hover:translate-x-0.5 transition-all">→</span>
              </button>
              <button
                onClick={() => setActiveModal("add-tutor")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-150 text-slate-700 hover:text-[var(--brand-green)] hover:border-[var(--brand-green)]/40 hover:bg-slate-50/30 transition-all font-semibold text-sm cursor-pointer group"
              >
                <span>Add New Tutor</span>
                <span className="text-slate-400 group-hover:text-[var(--brand-green)] group-hover:translate-x-0.5 transition-all">→</span>
              </button>
              <button
                onClick={() => setActiveModal("assign-tutor")}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-150 text-slate-700 hover:text-[var(--brand-green)] hover:border-[var(--brand-green)]/40 hover:bg-slate-50/30 transition-all font-semibold text-sm cursor-pointer group"
              >
                <span>Assign Tutor to Student</span>
                <span className="text-slate-400 group-hover:text-[var(--brand-green)] group-hover:translate-x-0.5 transition-all">→</span>
              </button>
            </div>
          </div>

          {/* Recent Enquiries panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                <div>
                  <h2 className="text-md font-bold text-slate-800">Recent Enquiries</h2>
                  <p className="text-xs text-slate-455 mt-0.5">Submissions from contact forms</p>
                </div>
                <Link href="/admin/website/enquiries" className="text-xs font-bold hover:underline text-[var(--brand-green)]">
                  View all
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentEnquiries.map((e, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/30 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-850">{e.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{e.grade}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border",
                        e.status === "new"
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                      )}>
                        {e.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-slate-350" />{e.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/10">
              <Link
                href="/admin/website/enquiries"
                className="text-xs font-bold w-full flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[var(--brand-green)] hover:border-[var(--brand-green)]/40 transition-colors"
              >
                Manage all enquiries →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal Dialogs */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base">
                {activeModal === "add-student" && "Add New Student"}
                {activeModal === "add-tutor" && "Add New Tutor"}
                {activeModal === "assign-tutor" && "Assign Tutor to Student"}
                {activeModal === "tutor-report" && "Tutor Performance Report"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            {activeModal === "add-student" && (
              <form onSubmit={handleAddStudentSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Student Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter student full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Grade Level</label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  >
                    {["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Courses</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics, Physics"
                    value={studentCourse}
                    onChange={(e) => setStudentCourse(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-550 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl transition-colors cursor-pointer"
                  >
                    Save Student
                  </button>
                </div>
              </form>
            )}

            {activeModal === "add-tutor" && (
              <form onSubmit={handleAddTutorSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tutor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter tutor's name"
                    value={tutorName}
                    onChange={(e) => setTutorName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Subject Expertise</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Chemistry, Calculus"
                    value={tutorSubject}
                    onChange={(e) => setTutorSubject(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Experience (Years)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 years"
                    value={tutorExperience}
                    onChange={(e) => setTutorExperience(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-555 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl transition-colors cursor-pointer"
                  >
                    Register Tutor
                  </button>
                </div>
              </form>
            )}

            {activeModal === "assign-tutor" && (
              <form onSubmit={handleAssignTutorSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Select Student</label>
                  <select
                    value={studentSelect}
                    onChange={(e) => setStudentSelect(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-55 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                  >
                    {["Rahul Sharma", "Sneha Reddy", "Kabir Malhotra", "Aria Fernandes", "Vikram Sen"].map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Select Tutor</label>
                  <select
                    value={tutorSelect}
                    onChange={(e) => setTutorSelect(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-55 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all font-medium"
                  >
                    {["Dr. Ramesh Prasad", "Amit Shah", "Sarah Jenkins", "David Miller", "Ananya Roy"].map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-555 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl transition-colors cursor-pointer"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </form>
            )}

            {activeModal === "tutor-report" && selectedTutor && (
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-lg">
                    {selectedTutor.name.split(" ").pop()?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-none">{selectedTutor.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{selectedTutor.subject}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Total Classes</span>
                    <span className="text-lg font-bold text-slate-850 flex items-center gap-1.5 mt-0.5">
                      <BarChart3 className="w-4 h-4 text-[var(--brand-green)]" />
                      {selectedTutor.classes} sessions
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Average Rating</span>
                    <span className="text-lg font-bold text-[var(--brand-green)] flex items-center gap-1 mt-0.5">
                      <Star className="w-4 h-4 fill-current text-[var(--brand-green)]" />
                      {selectedTutor.rating.split("/")[0]} / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                    Latest Parent Feedback
                  </h5>
                  <p className="text-xs text-slate-600 bg-[var(--brand-light-green)]/15 border border-[var(--brand-light)]/10 p-3.5 rounded-xl italic">
                    &ldquo;{selectedTutor.feedback}&rdquo;
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2 text-xs font-bold text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl transition-colors cursor-pointer"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
