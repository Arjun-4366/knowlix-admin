"use client";

import { useState, useEffect } from "react";
import { X, User, Briefcase, Key, Shield, Image, Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Employee } from "./types";

export type EmployeeFormData = {
  name: string;
  email: string;
  phone: string;
  password?: string;
  subjects?: string[];
  experience?: string;
  availability?: string;
  role?: string;
  profileImage?: File | string;
  permissions?: {
    canUploadNotes: boolean;
    canEditNotes: boolean;
    canShareMaterial: boolean;
  };
};

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: Employee | null;
  departments?: string[];
  statuses?: string[];
  isSubmitting?: boolean;
}

export default function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  employee,
  isSubmitting = false,
}: EmployeeFormModalProps) {
  // Form states matching payload ONLY
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subjects, setSubjects] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [role, setRole] = useState("subject_tutor");
  const [profileImage, setProfileImage] = useState<File | string>("");
  const [canUploadNotes, setCanUploadNotes] = useState(true);
  const [canEditNotes, setCanEditNotes] = useState(true);
  const [canShareMaterial, setCanShareMaterial] = useState(false);

  // Sync state with edit mode or reset on new
  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setPhone(employee.phone || "");
      setPassword("password123");
      setSubjects("Maths, Science");
      setExperience(employee.joiningRecords?.joiningNotes?.match(/Experience:\s*([^.]+)/)?.[1] || "6 Years");
      setAvailability(employee.joiningRecords?.joiningNotes?.match(/Availability:\s*([^.]+)/)?.[1] || "Evening");
      setRole(
        employee.designation === "Mentor/Sales Rep"
          ? "mentor_sales_bro"
          : employee.designation === "Academic Coordinator"
          ? "academic_coordinator"
          : "subject_tutor"
      );
      setProfileImage("https://cdn.example.com/profile.png");
      setCanUploadNotes(true);
      setCanEditNotes(true);
      setCanShareMaterial(false);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSubjects("");
      setExperience("");
      setAvailability("");
      setRole("subject_tutor");
      setProfileImage("");
      setCanUploadNotes(true);
      setCanEditNotes(true);
      setCanShareMaterial(false);
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Name, Email, and Password are required.");
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim(),
      subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
      experience: experience.trim(),
      availability: availability.trim(),
      role,
      profileImage,
      permissions: {
        canUploadNotes,
        canEditNotes,
        canShareMaterial,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-150 rounded-2xl max-w-lg w-full shadow-xl overflow-hidden my-8 animate-scale-in">
        <header className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {employee ? `Edit Tutor: ${employee.id}` : "Register New Tutor"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* SECTION 1: Personal Details */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Tutor Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MHD"
                  className="h-10 bg-white"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mhd@gmail.com"
                  className="h-10 bg-white"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543010"
                  className="h-10 bg-white"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Password *
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password123"
                    className="h-10 bg-white pl-9 pr-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Professional & Assignment details */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" /> 2. Professional Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Role *
                </label>
                <Select
                  value={role}
                  onValueChange={(val) => setRole(val)}
                >
                  <SelectTrigger className="h-10 bg-white">
                    <SelectValue placeholder="Select Tutor Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subject_tutor">Subject Tutor</SelectItem>
                    <SelectItem value="mentor_sales_bro">Mentor / Sales Rep</SelectItem>
                    <SelectItem value="academic_coordinator">Academic Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subjects */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Subjects (comma separated)
                </label>
                <Input
                  type="text"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="e.g. Maths, Science"
                  className="h-10 bg-white"
                />
              </div>

              {/* Experience */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Experience
                </label>
                <Input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 6 Years"
                  className="h-10 bg-white"
                />
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Availability
                </label>
                <Select
                  value={availability}
                  onValueChange={(val) => setAvailability(val)}
                >
                  <SelectTrigger className="h-10 bg-white">
                    <SelectValue placeholder="Select Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Profile Image */}
              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Profile Image
                </label>
                <div className="relative">
                  <Image className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 pointer-events-none" />
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setProfileImage(e.target.files[0]);
                      }
                    }}
                    className="h-10 bg-white pr-9 cursor-pointer file:cursor-pointer file:border-0 file:bg-[var(--brand-green)] file:text-white file:px-3 file:py-1 file:rounded-md file:text-xs file:font-semibold hover:file:bg-[var(--brand-green)]/90"
                  />
                </div>
                {typeof profileImage === "string" && profileImage && (
                  <p className="text-xs text-slate-600 mt-1">Current: {profileImage}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Permissions */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> 3. Tutor Permissions
            </h4>

            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-150 space-y-3">
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canUploadNotes}
                    onChange={(e) => setCanUploadNotes(e.target.checked)}
                    className="rounded border-slate-350 text-[var(--brand-green)] focus:ring-[var(--brand-green)] h-4 w-4"
                  />
                  Can Upload Notes
                </label>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canEditNotes}
                    onChange={(e) => setCanEditNotes(e.target.checked)}
                    className="rounded border-slate-350 text-[var(--brand-green)] focus:ring-[var(--brand-green)] h-4 w-4"
                  />
                  Can Edit Notes
                </label>
                <label className="flex items-center gap-2.5 text-xs text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canShareMaterial}
                    onChange={(e) => setCanShareMaterial(e.target.checked)}
                    className="rounded border-slate-350 text-[var(--brand-green)] focus:ring-[var(--brand-green)] h-4 w-4"
                  />
                  Can Share Material
                </label>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Record"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
