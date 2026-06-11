import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ICreateTutorPayload, ITutor, TutorStatus } from "@/types/admin/tutor";

interface AddTutorFormProps {
  onClose: () => void;
  onSubmit: (data: ICreateTutorPayload) => void;
  isSubmitting?: boolean;
  tutorToEdit?: ITutor;
}

const AVAILABILITY_OPTIONS = ["Morning", "Afternoon", "Evening"];
const SUBJECT_OPTIONS = [
  "ENGLISH", "MALAYALAM", "ARABIC", "HINDI", "FRENCH", "GERMAN", "SPANISH",
  "MATHS", "SCIENCE", "Physics", "Chemistry", "Bio", "IT", "AI",
  "Drawing", "Handwriting", "Communicative English", "Madarasa subject", "QURAN"
];
const SYLLABUS_OPTIONS = ["CBSE", "IGCSE", "ICSE", "IB", "KERALA STATE."];

export default function AddTutorForm({
  onClose,
  onSubmit,
  isSubmitting = false,
  tutorToEdit,
}: AddTutorFormProps) {
  const [name, setName] = useState(() => tutorToEdit?.name || "");
  const [email, setEmail] = useState(() => tutorToEdit?.email || "");
  const [phone, setPhone] = useState(() => tutorToEdit?.phone || "");
  const [password, setPassword] = useState("");

  const [experience, setExperience] = useState(() => {
    const expStr = tutorToEdit?.experience || "";
    const expMatch = expStr.match(/\d+/);
    if (expMatch) {
      const num = parseInt(expMatch[0]);
      return `${num} Year${num > 1 ? "s" : ""}`;
    }
    return expStr;
  });

  const [availability, setAvailability] = useState<string[]>(() => {
    if (Array.isArray(tutorToEdit?.availability)) return tutorToEdit!.availability as string[];
    if (typeof tutorToEdit?.availability === "string") {
      return tutorToEdit.availability.split(",").map(a => a.trim()).filter(Boolean);
    }
    return [];
  });

  const [status, setStatus] = useState<TutorStatus>(() => {
    const st = tutorToEdit?.status?.toLowerCase() || "pending";
    return (st === "approved" || st === "pending" ? st : "pending") as TutorStatus;
  });

  const [subjectEntries, setSubjectEntries] = useState<Array<{ name: string; syllabi: string[] }>>([]);

  useEffect(() => {
    if (tutorToEdit) {
      setName(tutorToEdit.name || "");
      setEmail(tutorToEdit.email || "");
      setPhone(tutorToEdit.phone || "");

      // Normalize experience
      const expStr = tutorToEdit.experience || "";
      const expMatch = expStr.match(/\d+/);
      if (expMatch) {
        const num = parseInt(expMatch[0]);
        setExperience(`${num} Year${num > 1 ? "s" : ""}`);
      } else {
        setExperience(expStr);
      }

      // Normalize status
      const st = tutorToEdit.status?.toLowerCase() || "pending";
      setStatus((st === "approved" || st === "pending" ? st : "pending") as TutorStatus);

      // Load availability
      if (Array.isArray(tutorToEdit.availability)) {
        setAvailability(tutorToEdit.availability as string[]);
      } else if (typeof tutorToEdit.availability === "string") {
        setAvailability(tutorToEdit.availability.split(",").map(a => a.trim()).filter(Boolean));
      } else {
        setAvailability([]);
      }

      // Load subject entries
      let parsedEntries: Array<{ name: string; syllabi: string[] }> = [];
      if (tutorToEdit.subjectEntries) {
        parsedEntries = tutorToEdit.subjectEntries;
      } else if (tutorToEdit.subjects) {
        parsedEntries = tutorToEdit.subjects.map(s => ({
          name: s,
          syllabi: tutorToEdit.syllabus || []
        }));
      }

      setSubjectEntries(parsedEntries.map(e => {
        const normalizedName = e.name.toLowerCase() === "math" ? "MATHS" : SUBJECT_OPTIONS.find(s => s.toLowerCase() === e.name.toLowerCase()) || e.name;
        return { ...e, name: normalizedName };
      }));
    }
  }, [tutorToEdit]);

  const toggleAvailability = (option: string) => {
    setAvailability((prev) =>
      prev.includes(option) ? prev.filter((a) => a !== option) : [...prev, option]
    );
  };

  const handleSubjectToggle = (subj: string) => {
    setSubjectEntries((prev) => {
      const exists = prev.find((e) => e.name === subj);
      if (exists) {
        return prev.filter((e) => e.name !== subj);
      } else {
        return [...prev, { name: subj, syllabi: [] }];
      }
    });
  };

  const handleSyllabusToggleForSubject = (subj: string, syl: string) => {
    setSubjectEntries((prev) =>
      prev.map((e) => {
        if (e.name === subj) {
          const syllabi = e.syllabi.includes(syl)
            ? e.syllabi.filter((s) => s !== syl)
            : [...e.syllabi, syl];
          return { ...e, syllabi };
        }
        return e;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !experience || !phone || availability.length === 0 || subjectEntries.length === 0) {
      alert("Please fill in all required fields and select at least one availability and subject entry.");
      return;
    }

    const payload: ICreateTutorPayload = {
      name,
      email,
      phone,
      subjects: subjectEntries.map((e) => e.name),
      experience: experience.toLowerCase().includes("year") ? experience : `${experience} Years`,
      availability,
      role: tutorToEdit?.role || "subject_tutor",
      status,
      profileImage: tutorToEdit?.profileImage || "",
      permissions: tutorToEdit?.permissions || {
        canUploadNotes: false,
        canEditNotes: false,
        canShareMaterial: false,
      },
      syllabus: Array.from(new Set(subjectEntries.flatMap((e) => e.syllabi))),
      subjectEntries,
    };

    if (password) {
      payload.password = password;
    }

    onSubmit(payload);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">
            {tutorToEdit ? "Edit Tutor Details" : "Register New Tutor"}
          </h3>
          <p className="text-xs text-slate-450 mt-0.5">
            Configure subjects, availability slots, workloads, and workspace permissions.
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Full Name *</Label>
            <Input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. John Mathew"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Email Address *</Label>
            <Input
              type="email"
              required
              disabled={isSubmitting}
              placeholder="e.g. john.tutor@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Phone Number *</Label>
            <Input
              type="tel"
              required
              disabled={isSubmitting}
              placeholder="e.g. 9876543200"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Experience *</Label>
            <Select
              key={`exp-${tutorToEdit?.id || "new"}`}
              disabled={isSubmitting}
              value={experience}
              onValueChange={setExperience}
            >
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Select Experience" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 30 }, (_, i) => i + 1).map((year) => (
                  <SelectItem key={year} value={`${year} Year${year > 1 ? "s" : ""}`}>
                    {year} Year{year > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!tutorToEdit && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Password *</Label>
            <Input
              type="password"
              required
              disabled={isSubmitting}
              placeholder="e.g. StrongPassword@123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
        )}

        {/* Availability */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 block">Availability *</Label>
          <div className="flex gap-2">
            {AVAILABILITY_OPTIONS.map((option) => {
              const isSelected = availability.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleAvailability(option)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold border rounded-xl transition-all cursor-pointer",
                    isSelected
                      ? "bg-[var(--brand-light-green)] text-[var(--brand-green)] border-[var(--brand-green)]"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subjects & Syllabi */}
        <div className="space-y-3 pt-2">
          <Label className="text-xs font-semibold text-slate-500 block">Subjects & Syllabi *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SUBJECT_OPTIONS.map((subj) => {
              const entry = subjectEntries.find((e) => e.name === subj);
              const isSelected = !!entry;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => handleSubjectToggle(subj)}
                  className={cn(
                    "px-3 py-2 text-xs font-bold border rounded-xl transition-all cursor-pointer text-left flex justify-between items-center",
                    isSelected
                      ? "bg-[var(--brand-light-green)] text-[var(--brand-green)] border-[var(--brand-green)]"
                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  <span>{subj}</span>
                  {isSelected && (
                    <span className="text-[10px] bg-[var(--brand-green)] text-white px-1.5 py-0.5 rounded-full">
                      {entry.syllabi.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {subjectEntries.length > 0 && (
            <div className="space-y-3 bg-slate-50/50 p-4 border border-slate-150 rounded-2xl mt-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Assign Syllabi for Selected Subjects
              </Label>
              <div className="space-y-3">
                {subjectEntries.map((entry) => (
                  <div key={entry.name} className="space-y-1.5 pb-2.5 border-b border-slate-100 last:border-b-0 last:pb-0">
                    <span className="text-xs font-bold text-slate-700">{entry.name} Syllabi:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {SYLLABUS_OPTIONS.map((syl) => {
                        const isSylChecked = entry.syllabi.includes(syl);
                        return (
                          <button
                            key={syl}
                            type="button"
                            onClick={() => handleSyllabusToggleForSubject(entry.name, syl)}
                            className={cn(
                              "px-2.5 py-1 text-[10px] font-bold border rounded-lg transition-all cursor-pointer",
                              isSylChecked
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                            )}
                          >
                            {syl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">HR Status *</Label>
            <Select
              key={`status-${tutorToEdit?.id || "new"}`}
              disabled={isSubmitting}
              value={status}
              onValueChange={(val) => setStatus(val as TutorStatus)}
            >
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending HR</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl shadow-md shadow-green-600/10 flex items-center gap-1.5"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {tutorToEdit ? "Update Tutor" : "Save Tutor"}
          </Button>
        </div>
      </form>
    </div>
  );
}
