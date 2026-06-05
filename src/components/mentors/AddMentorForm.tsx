import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICreateMentorPayload, IMentor } from "@/types/admin/mentor";

interface AddMentorFormProps {
  onClose: () => void;
  onSubmit: (data: ICreateMentorPayload & { status?: string }) => void;
  isSubmitting?: boolean;
  mentorToEdit?: IMentor;
}

export default function AddMentorForm({
  onClose,
  onSubmit,
  isSubmitting = false,
  mentorToEdit,
}: AddMentorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (mentorToEdit) {
      setName(mentorToEdit.name || "");
      setEmail(mentorToEdit.email || "");
      setPhone(mentorToEdit.phone || "");
      setDepartment(mentorToEdit.department || "");
      setDesignation(mentorToEdit.designation || "");
      setStatus(mentorToEdit.status || "active");
    }
  }, [mentorToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !department || !designation) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      name,
      email,
      phone,
      department,
      designation,
      status,
    };

    onSubmit(payload);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">
            {mentorToEdit ? "Edit Mentor Details" : "Register New Mentor"}
          </h3>
          <p className="text-xs text-slate-455 mt-0.5">
            Configure contact details, department, and roles.
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
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500">Full Name *</Label>
          <Input
            type="text"
            required
            disabled={isSubmitting}
            placeholder="e.g. Anna"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-55 focus:bg-white border-slate-200 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-550">Email Address *</Label>
            <Input
              type="email"
              required
              disabled={isSubmitting}
              placeholder="e.g. anna@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-55 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-555">Phone Number *</Label>
            <Input
              type="tel"
              required
              disabled={isSubmitting}
              placeholder="e.g. 9999999991"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-55 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-550">Department *</Label>
            <Input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Sales"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-55 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-550">Designation *</Label>
            <Input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Lead Mentor"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full bg-slate-55 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
        </div>

        {mentorToEdit && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Status *</Label>
            <Select disabled={isSubmitting} value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-55"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl shadow-md shadow-green-600/10 flex items-center gap-1.5"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {mentorToEdit ? "Update Mentor" : "Save Mentor"}
          </Button>
        </div>
      </form>
    </div>
  );
}
