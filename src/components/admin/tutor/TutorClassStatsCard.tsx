"use client";

import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TutorClassStatsCardProps {
  totalSessions: number;
  conducted: number;
  notConducted: number;
  postponed: number;
  attendanceRate: number;
}

export function TutorClassStatsCard({
  totalSessions,
  conducted,
  notConducted,
  postponed,
  attendanceRate,
}: TutorClassStatsCardProps) {
  return (
    <Card className="bg-white border-slate-150 shadow-sm">
      <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-[var(--brand-green)]" />
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Class Statistics
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 space-y-3.5">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700">Total Sessions</span>
          <span className="text-sm font-bold text-slate-900">{totalSessions}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700">Conducted</span>
          <span className="text-sm font-bold text-green-600">{conducted}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700">Not Conducted</span>
          <span className="text-sm font-bold text-red-600">{notConducted}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700">Postponed</span>
          <span className="text-sm font-bold text-amber-600">{postponed}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700">Attendance Rate</span>
          <span className="text-sm font-bold text-blue-600">{attendanceRate}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
