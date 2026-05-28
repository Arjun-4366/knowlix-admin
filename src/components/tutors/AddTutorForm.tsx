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
import { ICreateTutorPayload, ITutor, TutorStatus } from "@/types/admin/tutor";

interface AddTutorFormProps {
  onClose: () => void;
  onSubmit: (data: ICreateTutorPayload) => void;
  isSubmitting?: boolean;
  tutorToEdit?: ITutor;
}

export default function AddTutorForm({
  onClose,
  onSubmit,
  isSubmitting = false,
  tutorToEdit,
}: AddTutorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subjectsText, setSubjectsText] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("Full-time");
  const [role, setRole] = useState("subject_tutor");
  const [status, setStatus] = useState<TutorStatus>("pending");
  
  // Permissions state
  const [canUploadNotes, setCanUploadNotes] = useState(false);
  const [canEditNotes, setCanEditNotes] = useState(false);
  const [canShareMaterial, setCanShareMaterial] = useState(false);

  useEffect(() => {
    if (tutorToEdit) {
      setName(tutorToEdit.name || "");
      setEmail(tutorToEdit.email || "");
      setPhone(tutorToEdit.phone || "");
      setSubjectsText(tutorToEdit.subjects ? tutorToEdit.subjects.join(", ") : "");
      setExperience(tutorToEdit.experience || "");
      setAvailability(tutorToEdit.availability || "Full-time");
      setRole(tutorToEdit.role || "subject_tutor");
      setStatus(tutorToEdit.status || "pending");
      setCanUploadNotes(tutorToEdit.permissions?.canUploadNotes || false);
      setCanEditNotes(tutorToEdit.permissions?.canEditNotes || false);
      setCanShareMaterial(tutorToEdit.permissions?.canShareMaterial || false);
    }
  }, [tutorToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subjectsText || !experience || !phone) {
      alert("Please fill in all required fields.");
      return;
    }

    const parsedSubjects = subjectsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: ICreateTutorPayload = {
      name,
      email,
      phone,
      subjects: parsedSubjects,
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
    };

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
            Configure subjects, workloads, role classifications, and workspace access.
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
              placeholder="e.g. Arjun Nair"
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
              placeholder="e.g. arjun@gmail.com"
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
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Experience (Years) *</Label>
            <Input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. 6 Years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500">Subjects Expertise *</Label>
          <Input
            type="text"
            required
            disabled={isSubmitting}
            placeholder="e.g. Maths, Science (comma separated)"
            value={subjectsText}
            onChange={(e) => setSubjectsText(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Availability *</Label>
            <Select disabled={isSubmitting} value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Weekends Only">Weekends Only</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
