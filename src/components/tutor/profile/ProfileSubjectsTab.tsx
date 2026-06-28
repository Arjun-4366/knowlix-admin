"use client";

import { BookOpen, Check, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ISubjectEntry } from "@/types/tutor/profile";

interface Props {
  syllabus: string[];
  toggleSyllabus: (syl: string) => void;
  subjectEntries: ISubjectEntry[];
  removeSubjectEntry: (i: number) => void;
  newSubjectName: string;
  setNewSubjectName: (v: string) => void;
  newSubjectSyllabi: string[];
  toggleSyllabusForNewSubject: (syl: string) => void;
  addSubjectEntry: () => void;
  curriculumSubjects: string[];
  curriculumSyllabuses: string[];
}

export default function ProfileSubjectsTab({
  syllabus,
  toggleSyllabus,
  subjectEntries,
  removeSubjectEntry,
  newSubjectName,
  setNewSubjectName,
  newSubjectSyllabi,
  toggleSyllabusForNewSubject,
  addSubjectEntry,
  curriculumSubjects,
  curriculumSyllabuses,
}: Props) {
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
          <p className="text-xs text-slate-600 leading-normal">Select curriculum boards you are authorized to teach.</p>
          <div className="space-y-2.5 pt-2">
            {curriculumSyllabuses.length === 0 && (
              <p className="text-xs text-slate-600 italic">No syllabuses found in curriculum.</p>
            )}
            {curriculumSyllabuses.map((option) => {
              const isChecked = syllabus.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => toggleSyllabus(option)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? "bg-[var(--brand-light-green)]/10 border-[var(--brand-green)]/40 text-[var(--brand-green)]"
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <span className="text-xs font-bold">{option}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isChecked ? "bg-[var(--brand-green)] border-transparent" : "border-slate-300"
                  }`}>
                    {isChecked && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                </div>
              );
            })}
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
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Configured Subjects</Label>
            {subjectEntries.length === 0 ? (
              <p className="text-xs text-slate-600 py-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                No subjects configured. Add one below!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjectEntries.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3.5 border border-slate-200 rounded-xl hover:shadow-sm transition-all">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{entry.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.syllabi.map((syl) => (
                          <Badge key={syl} variant="secondary" className="text-[9px] font-semibold py-0 px-1.5 rounded-md bg-slate-200/60 text-slate-700">
                            {syl}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubjectEntry(index)}
                      className="p-1.5 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <Label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Add Subject</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="sm:col-span-1 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Subject Name</Label>
                <Select value={newSubjectName} onValueChange={setNewSubjectName}>
                  <SelectTrigger className="bg-white border-slate-200">
                    <SelectValue placeholder="Select subject…" />
                  </SelectTrigger>
                  <SelectContent>
                    {curriculumSubjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-1 space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600 block mb-1">Target Syllabi</Label>
                <div className="flex flex-wrap gap-1">
                  {curriculumSyllabuses.map((syl) => {
                    const isNewSelected = newSubjectSyllabi.includes(syl);
                    return (
                      <button
                        key={syl}
                        type="button"
                        onClick={() => toggleSyllabusForNewSubject(syl)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-all ${
                          isNewSelected
                            ? "bg-[var(--brand-green)] border-transparent text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {syl}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="sm:col-span-1">
                <button
                  type="button"
                  onClick={addSubjectEntry}
                  className="w-full flex items-center justify-center gap-1.5 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Subject
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
