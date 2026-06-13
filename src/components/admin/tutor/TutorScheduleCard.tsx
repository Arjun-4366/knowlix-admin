"use client";

import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ITutorSlot } from "@/types/admin/tutor";

interface TutorScheduleCardProps {
  slots?: ITutorSlot[] | null;
}

export function TutorScheduleCard({ slots }: TutorScheduleCardProps) {
  return (
    <Card className="bg-white border-slate-150 shadow-sm">
      <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--brand-green)]" />
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Weekly Schedule Slots
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        {slots && slots.length > 0 ? (
          <div className="space-y-3">
            {slots.map((slot, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/30"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shadow-sm">
                    {slot.day.substring(0, 3)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{slot.day}</p>
                    <p className="text-xs text-slate-500">{slot.startTime} - {slot.endTime}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5",
                    slot.filled
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-green)]/20"
                  )}
                >
                  {slot.filled ? "Filled" : "Available"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No slots assigned yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
