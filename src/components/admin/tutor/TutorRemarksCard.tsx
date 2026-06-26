"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Remark = { text: string; addedBy: string; addedAt: string };

interface TutorRemarksCardProps {
  positiveRemarks?: Remark[] | string | null;
  negativeRemarks?: Remark[] | string | null;
}

function normalise(val: Remark[] | string | null | undefined): Remark[] {
  if (!val) return [];
  if (typeof val === "string") return val.trim() ? [{ text: val, addedBy: "", addedAt: "" }] : [];
  return val;
}

export function TutorRemarksCard({ positiveRemarks, negativeRemarks }: TutorRemarksCardProps) {
  const positive = normalise(positiveRemarks);
  const negative = normalise(negativeRemarks);

  const fmtDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "";

  return (
    <Card className="bg-white border-slate-150 shadow-sm">
      <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-[var(--brand-green)]" />
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Admin Remarks
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 space-y-5">
        {/* Positive */}
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase mb-2 flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" /> Positive Remarks
          </p>
          {positive.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No positive remarks recorded.</p>
          ) : (
            <ul className="space-y-2">
              {positive.map((r, i) => (
                <li key={i} className="p-3 bg-green-50 border border-green-100 rounded-xl space-y-0.5">
                  <p className="text-xs text-green-800">{r.text}</p>
                  {r.addedAt && (
                    <p className="text-[10px] text-green-500 font-semibold">{fmtDate(r.addedAt)}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Negative */}
        <div>
          <p className="text-[10px] font-bold text-red-500 uppercase mb-2 flex items-center gap-1">
            <ThumbsDown className="w-3 h-3" /> Areas of Improvement
          </p>
          {negative.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No areas of improvement recorded.</p>
          ) : (
            <ul className="space-y-2">
              {negative.map((r, i) => (
                <li key={i} className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-0.5">
                  <p className="text-xs text-red-800">{r.text}</p>
                  {r.addedAt && (
                    <p className="text-[10px] text-red-400 font-semibold">{fmtDate(r.addedAt)}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
