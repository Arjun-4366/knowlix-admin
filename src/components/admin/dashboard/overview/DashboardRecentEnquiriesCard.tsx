import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { recentEnquiries } from "./dashboardOverviewData";

export default function DashboardRecentEnquiriesCard() {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div>
        <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/20 px-6 py-5">
          <div>
            <h2 className="text-md font-bold text-slate-800">Recent Enquiries</h2>
            <p className="mt-0.5 text-xs text-slate-600">
              Submissions from contact forms
            </p>
          </div>
          <Link
            href="/admin/website/enquiries"
            className="text-xs font-bold text-[var(--brand-green)] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentEnquiries.map((enquiry) => (
            <div
              key={`${enquiry.name}-${enquiry.time}`}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-55/30"
            >
              <div>
                <p className="text-sm font-semibold text-slate-850">{enquiry.name}</p>
                <p className="mt-0.5 text-xs text-slate-600">{enquiry.grade}</p>
              </div>

              <div className="text-right">
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                    enquiry.status === "new"
                      ? "border-slate-200 bg-slate-100 text-slate-700"
                      : "border-[var(--brand-light)]/20 bg-[var(--brand-light-green)] text-[var(--brand-mid)]"
                  )}
                >
                  {enquiry.status}
                </Badge>
                <p className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-slate-600">
                  <Clock className="h-3 w-3 text-slate-600" />
                  {enquiry.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/10 p-4">
        <Link
          href="/admin/website/enquiries"
          className="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:border-[var(--brand-green)]/40 hover:bg-slate-50 hover:text-[var(--brand-green)]"
        >
          Manage all enquiries
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
