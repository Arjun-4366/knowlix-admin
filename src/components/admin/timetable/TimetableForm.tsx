"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { ButtonLoader } from "@/components/shared/Loader";
import { useGetSubjects } from "@/querys/admin/curriculumQuery";
import { ICreateTimetablePayload, ITimetableEntry, IUpdateTimetablePayload } from "@/types/admin/timetable";
import { to12Hour, to24Hour } from "./timetableHelpers";
import TutorSearchSelect from "./TutorSearchSelect";
import StudentMultiSearchSelect from "./StudentMultiSearchSelect";

interface TimetableFormProps {
  entryToEdit?: ITimetableEntry;
  isSubmitting: boolean;
  onSubmit: (data: ICreateTimetablePayload | IUpdateTimetablePayload) => void;
  onClose: () => void;
}

export default function TimetableForm({
  entryToEdit,
  isSubmitting,
  onSubmit,
  onClose,
}: TimetableFormProps) {
  const isEdit = !!entryToEdit;

  const [tutorId, setTutorId] = useState(entryToEdit?.tutorId ?? "");
  const [tutorName, setTutorName] = useState(entryToEdit?.tutorName ?? "");
  const [studentIds, setStudentIds] = useState<string[]>(entryToEdit?.studentIds ?? []);
  const [studentNames, setStudentNames] = useState<string[]>(entryToEdit?.studentNames ?? []);
  const [subjectId, setSubjectId] = useState(entryToEdit?.subjectId ?? "");
  const [date, setDate] = useState(entryToEdit?.date ? entryToEdit.date.slice(0, 10) : "");
  const [startTime, setStartTime] = useState(to24Hour(entryToEdit?.startTime ?? ""));
  const [endTime, setEndTime] = useState(to24Hour(entryToEdit?.endTime ?? ""));

  const { data: subjectsResponse, isLoading: loadingSubjects } = useGetSubjects();
  const subjectOptions = subjectsResponse?.data ?? [];

  const handleTutorChange = (id: string, name: string) => {
    setTutorId(id);
    setTutorName(name);
  };

  const handleStudentsChange = (ids: string[], names: string[]) => {
    setStudentIds(ids);
    setStudentNames(names);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      tutorId,
      studentIds,
      subjectId,
      date,
      startTime: to12Hour(startTime),
      endTime: to12Hour(endTime),
    });
  };

  return (
    <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? "Edit Timetable Slot" : "Add New Timetable Slot"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            {isEdit ? "Update the session details below" : "Schedule a new tutoring session"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {loadingSubjects ? (
            <div className="space-y-5 animate-pulse">
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 rounded-xl bg-slate-100" />
                <div className="h-10 rounded-xl bg-slate-100" />
                <div className="h-10 rounded-xl bg-slate-100" />
              </div>
            </div>
          ) : (
            <>
              {/* Tutor */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Tutor *</Label>
                <TutorSearchSelect value={tutorId} label={tutorName} onChange={handleTutorChange} />
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Subject *</Label>
                <Select required value={subjectId} onValueChange={setSubjectId}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.length > 0 ? (
                      subjectOptions.map((s) => (
                        <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-xs text-slate-600">No subjects found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Students */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Students *</Label>
                <StudentMultiSearchSelect
                  value={studentIds}
                  labels={studentNames}
                  onChange={handleStudentsChange}
                />
              </div>

              {/* Date + Times */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">Date *</Label>
                  <DatePicker value={date} onChange={setDate} className="h-10 w-full" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">Start Time *</Label>
                  <input
                    required
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 focus:border-[var(--brand-green)] focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">End Time *</Label>
                  <input
                    required
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 focus:border-[var(--brand-green)] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4 text-sm">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || studentIds.length === 0 || !tutorId || !subjectId}
            className="h-9 bg-[var(--brand-green)] px-5 text-sm font-bold text-white shadow-md shadow-green-600/10 hover:bg-[var(--brand-mid)] disabled:opacity-50"
          >
            {isSubmitting ? <ButtonLoader /> : isEdit ? "Save Changes" : "Create Slot"}
          </Button>
        </div>
      </form>
    </div>
  );
}
