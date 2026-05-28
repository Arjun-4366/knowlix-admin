export interface DashboardSectionLink {
  label: string;
  desc: string;
  href: string;
}

export interface DashboardEnquiryItem {
  name: string;
  grade: string;
  time: string;
  status: "new" | "replied";
}

export const dashboardSectionLinks: DashboardSectionLink[] = [
  { label: "Home Page", desc: "Hero, stats, why parents, testimonials, FAQ, CTA", href: "/admin/website/home" },
  { label: "About", desc: "Story, vision & mission, core values, founder message", href: "/admin/website/about" },
  { label: "Courses", desc: "Online school program and online tuition subjects", href: "/admin/website/courses" },
  { label: "Blog", desc: "Create and manage blog posts and categories", href: "/admin/website/blog" },
  { label: "Team", desc: "Leadership profiles and mentor directory", href: "/admin/website/team" },
  { label: "Gallery", desc: "Photos and videos from classes and events", href: "/admin/website/gallery" },
  { label: "Careers", desc: "Open positions and job applications", href: "/admin/website/careers" },
  { label: "Settings", desc: "Contact info, social links, and site settings", href: "/admin/website/settings" },
];

export const recentEnquiries: DashboardEnquiryItem[] = [
  { name: "Sunita Rao", grade: "Grade 9", time: "2 hours ago", status: "new" },
  { name: "Shalini Krishnan", grade: "Grade 12", time: "5 hours ago", status: "new" },
  { name: "Rahul Mehta", grade: "Grade 4", time: "1 day ago", status: "new" },
  { name: "Manoj Verma", grade: "Grade 6", time: "1 day ago", status: "replied" },
  { name: "Ananya Pillai", grade: "Grade 8", time: "3 days ago", status: "replied" },
];
