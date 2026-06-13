"use client";

import { GraduationCap, BookOpen, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ITutor } from "@/types/admin/tutor";

interface TutorProfileCardProps {
  tutor: ITutor;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  return (
    <Card className="bg-white border-slate-150 shadow-sm">
      <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[var(--brand-green)]" />
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Profile Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 space-y-3.5">
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400">Subject Expertise</span>
          <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            {tutor.subjects && tutor.subjects.length > 0 ? tutor.subjects.join(", ") : "General"}
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400">Experience</span>
          <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{tutor.experience}</span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold text-slate-400">Availability</span>
          <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {Array.isArray(tutor.availability) ? tutor.availability.join(", ") : tutor.availability}
          </span>
        </div>
        {tutor.subjectEntries && tutor.subjectEntries.length > 0 && (
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Syllabus Coverage</span>
            <div className="flex flex-wrap gap-1.5">
              {tutor.subjectEntries.map((entry, i) => (
                <div key={i} className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md px-2 py-1">
                  {entry.name}: {entry.syllabi.join(", ")}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
