"use client";

import { MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TutorRemarksCardProps {
  positiveRemarks?: string | null;
  negativeRemarks?: string | null;
}

export function TutorRemarksCard({ positiveRemarks, negativeRemarks }: TutorRemarksCardProps) {
  return (
    <Card className="bg-white border-slate-150 shadow-sm">
      <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--brand-green)]" />
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Admin Remarks
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 space-y-4">
        <div>
          <p className="text-[10px] font-bold text-slate-700 uppercase mb-2">Positive Remarks</p>
          {positiveRemarks ? (
            <div className="p-3 bg-green-50 text-green-800 text-sm rounded-xl border border-green-100 whitespace-pre-wrap">
              {positiveRemarks}
            </div>
          ) : (
            <p className="text-sm text-slate-600 italic">No positive remarks recorded.</p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-700 uppercase mb-2">Areas of Improvement</p>
          {negativeRemarks ? (
            <div className="p-3 bg-red-50 text-red-800 text-sm rounded-xl border border-red-100 whitespace-pre-wrap">
              {negativeRemarks}
            </div>
          ) : (
            <p className="text-sm text-slate-600 italic">No areas of improvement recorded.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
