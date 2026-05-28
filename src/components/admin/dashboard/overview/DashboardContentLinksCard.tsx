import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { dashboardSectionLinks } from "./dashboardOverviewData";

export default function DashboardContentLinksCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-50 bg-slate-50/20 px-6 py-5">
        <h2 className="text-md font-bold text-slate-800">Manage Website Content</h2>
        <p className="mt-0.5 text-xs text-slate-455">
          Quick access to admin editors for public pages
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-slate-100 md:grid-cols-2 2xl:grid-cols-4">
        {dashboardSectionLinks.map((section) => (
          <Link
            key={section.label}
            href={section.href}
            className="group flex min-h-32 items-start justify-between gap-4 bg-white p-5 transition-colors hover:bg-slate-50/70"
          >
            <div className="flex items-start gap-3">
              <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--brand-green)]" />
              <div>
                <p className="text-sm font-bold text-slate-750 transition-colors group-hover:text-[var(--brand-green)]">
                  {section.label}
                </p>
                <p className="mt-1 text-xs text-slate-455">{section.desc}</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand-green)]" />
          </Link>
        ))}
      </div>
    </div>
  );
}
