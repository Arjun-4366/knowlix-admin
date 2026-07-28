"use client";

import { BookOpen, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ISubjectEntry } from "@/types/tutor/profile";

interface Props {
  syllabus: string[];
  subjectEntries: ISubjectEntry[];
}

export default function ProfileSubjectsTab({ syllabus, subjectEntries }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* General Syllabi */}
      <Card className="bg-white border-slate-200 shadow-sm md:col-span-1">
        <CardHeader className="p-6 pb-3 border-b border-slate-100">
          <CardTitle className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--brand-green)]" /> General Syllabi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-normal">Curriculum boards you are authorized to teach.</p>
          <div className="space-y-2.5 pt-2">
            {syllabus.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No syllabuses assigned.</p>
            ) : (
              syllabus.map((option) => (
                <div
                  key={option}
                  className="flex items-center justify-between p-3 rounded-xl border bg-[var(--brand-light-green)]/10 border-[var(--brand-green)]/40 text-[var(--brand-green)]"
                >
                  <span className="text-xs font-bold">{option}</span>
                  <div className="w-4 h-4 rounded-full border flex items-center justify-center bg-[var(--brand-green)] border-transparent">
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subject Entries */}
      <Card className="bg-white border-slate-200 shadow-sm md:col-span-2">
        <CardHeader className="p-6 pb-3 border-b border-slate-100">
          <CardTitle className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--brand-green)]" /> Subject Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {subjectEntries.length === 0 ? (
            <p className="text-xs text-slate-600 py-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              No subjects configured.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjectEntries.map((entry, index) => (
                <div key={index} className="p-3.5 border border-slate-200 rounded-xl">
                  <p className="text-sm font-bold text-slate-900 truncate">{entry.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.syllabi.map((syl) => (
                      <Badge key={syl} variant="secondary" className="text-[9px] font-semibold py-0 px-1.5 rounded-md bg-slate-200/60 text-slate-700">
                        {syl}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
