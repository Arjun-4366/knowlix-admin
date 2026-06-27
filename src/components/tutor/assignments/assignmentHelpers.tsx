"use client";

import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { TutorAssignmentStatus } from "@/types/tutor/assignments";

export const STATUS_CONFIG: Record<
  TutorAssignmentStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  assigned: {
    label: "Assigned",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <FileText className="w-3 h-3 mr-1" />,
  },
  submitted: {
    label: "Submitted",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="w-3 h-3 mr-1" />,
  },
  evaluated: {
    label: "Evaluated",
    className:
      "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20",
    icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
  },
  expired: {
    label: "Expired",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="w-3 h-3 mr-1" />,
  },
  pending: {
    label: "Pending",
    className: "bg-slate-50 text-slate-600 border-slate-200",
    icon: <Clock className="w-3 h-3 mr-1" />,
  },
};

export function StatusBadge({ status }: { status: TutorAssignmentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.assigned;
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center w-fit ${cfg.className}`}>
      {cfg.icon}
      {cfg.label}
    </Badge>
  );
}

export function formatDueDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isDueSoon(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
}

export function isOverdue(dateStr: string) {
  return new Date(dateStr) < new Date();
}
