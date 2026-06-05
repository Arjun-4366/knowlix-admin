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
const SUBJECT_OPTIONS = ["Math", "Physics", "Chemistry", "Biology", "English", "Science", "Computer Science"];
const SYLLABUS_OPTIONS = ["CBSE", "ICSE", "State Board", "IB", "IGCSE"];

export default function AddTutorForm({
  onClose,
  onSubmit,
  isSubmitting = false,
  tutorToEdit,
}: AddTutorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [role, setRole] = useState("subject_tutor");
  const [status, setStatus] = useState<TutorStatus>("pending");

  const [subjectEntries, setSubjectEntries] = useState<Array<{ name: string; syllabi: string[] }>>([]);
  const [customSubjectInput, setCustomSubjectInput] = useState("");

  // Permissions state
  const [canUploadNotes, setCanUploadNotes] = useState(false);
  const [canEditNotes, setCanEditNotes] = useState(false);
  const [canShareMaterial, setCanShareMaterial] = useState(false);

  useEffect(() => {
    if (tutorToEdit) {
      setName(tutorToEdit.name || "");
      setEmail(tutorToEdit.email || "");
      setPhone(tutorToEdit.phone || "");
      setExperience(tutorToEdit.experience || "");
      setRole(tutorToEdit.role || "subject_tutor");
      setStatus(tutorToEdit.status || "pending");
      setCanUploadNotes(tutorToEdit.permissions?.canUploadNotes || false);
      setCanEditNotes(tutorToEdit.permissions?.canEditNotes || false);
      setCanShareMaterial(tutorToEdit.permissions?.canShareMaterial || false);

      // Load availability
      if (Array.isArray(tutorToEdit.availability)) {
        setAvailability(tutorToEdit.availability);
      } else if (typeof tutorToEdit.availability === "string") {
        setAvailability(tutorToEdit.availability.split(",").map(a => a.trim()).filter(Boolean));
      } else {
        setAvailability([]);
      }

      // Load subject entries
      if (tutorToEdit.subjectEntries) {
        setSubjectEntries(tutorToEdit.subjectEntries);
      } else if (tutorToEdit.subjects) {
        setSubjectEntries(tutorToEdit.subjects.map(s => ({
          name: s,
          syllabi: tutorToEdit.syllabus || []
        })));
      } else {
        setSubjectEntries([]);
      }
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

  const addCustomSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (trimmed && !subjectEntries.some((e) => e.name.toLowerCase() === trimmed.toLowerCase())) {
      setSubjectEntries((prev) => [...prev, { name: trimmed, syllabi: [] }]);
      setCustomSubjectInput("");
    }
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
      role,
      status,
      profileImage: tutorToEdit?.profileImage || "",
      permissions: {
        canUploadNotes,
        canEditNotes,
        canShareMaterial,
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
            <Label className="text-xs font-semibold text-slate-500">Experience (e.g. 5 Years) *</Label>
            <Input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. 5 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
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

          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Add custom subject..."
              value={customSubjectInput}
              onChange={(e) => setCustomSubjectInput(e.target.value)}
              className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
            />
            <Button
              type="button"
              onClick={addCustomSubject}
              className="h-9 px-3 text-xs bg-[var(--brand-green)] text-white rounded-xl"
            >
              Add
            </Button>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Staff Role *</Label>
            <Select disabled={isSubmitting} value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subject_tutor">Subject Tutor</SelectItem>
                <SelectItem value="mentor_sales_bro">Mentor / Sales</SelectItem>
                <SelectItem value="academic_coordinator">Academic Coordinator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">HR Status *</Label>
            <Select disabled={isSubmitting} value={status} onValueChange={(val) => setStatus(val as any)}>
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending HR</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Permissions Switches */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Workspace Permissions
          </Label>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-600">Upload Notes</span>
              <Switch
                disabled={isSubmitting}
                checked={canUploadNotes}
                onCheckedChange={setCanUploadNotes}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-600">Edit Notes</span>
              <Switch
                disabled={isSubmitting}
                checked={canEditNotes}
                onCheckedChange={setCanEditNotes}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] font-bold text-slate-600">Share Material</span>
              <Switch
                disabled={isSubmitting}
                checked={canShareMaterial}
                onCheckedChange={setCanShareMaterial}
              />
            </div>
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
