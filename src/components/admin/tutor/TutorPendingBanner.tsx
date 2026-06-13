"use client";

import { AlertCircle, UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TutorPendingBannerProps {
  onApprove: () => void;
  isApproving: boolean;
}

export function TutorPendingBanner({ onApprove, isApproving }: TutorPendingBannerProps) {
  return (
    <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex gap-2 text-amber-800">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold">Pending HR Recruitment Approval</p>
          <p className="text-xs text-amber-700/80 mt-0.5">
            This tutor is in the recruitment pool. Permissions and student assignment are locked until approved.
          </p>
        </div>
      </div>
      <Button
        onClick={onApprove}
        disabled={isApproving}
        className="bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm flex-shrink-0 flex items-center gap-1.5"
      >
        {isApproving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        <UserCheck className="w-4 h-4 mr-1.5" />
        Approve & Admit
      </Button>
    </div>
  );
}
