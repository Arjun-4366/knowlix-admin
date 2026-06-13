"use client";

import { ArrowLeft, Mail, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ITutor } from "@/types/admin/tutor";

interface TutorProfileHeaderProps {
  tutor: ITutor;
  totalGrowthPoints: number;
  onBack: () => void;
}

export function TutorProfileHeader({ tutor, totalGrowthPoints, onBack }: TutorProfileHeaderProps) {
  const isApproved = tutor.status === "approved";

  return (
    <>
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-[var(--brand-green)] font-semibold text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tutors Directory
        </button>
      </div>

      <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-2xl border border-[var(--brand-light)]/20 shadow-inner flex-shrink-0">
              {tutor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{tutor.name}</h1>
                <Badge
                  variant="outline"
                  className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200"
                >
                  ID: {tutor.id.substring(tutor.id.length - 8)}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                    isApproved
                      ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {tutor.status === "pending"
                    ? "Awaiting HR"
                    : tutor.status.charAt(0).toUpperCase() + tutor.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {tutor.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="text-center md:text-right">
              <p className="text-3xl font-bold text-slate-800">{totalGrowthPoints}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[var(--brand-green)]" />
                Total Growth Points
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
