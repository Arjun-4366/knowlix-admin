import { useState } from "react";
import { X } from "lucide-react";
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

interface AddTutorFormProps {
  onClose: () => void;
  onSubmit: (tutorData: {
    name: string;
    email: string;
    subject: string;
    experienceNum: string;
    availability: string;
    status: "Pending HR Approval" | "Approved";
  }) => void;
}

export default function AddTutorForm({ onClose, onSubmit }: AddTutorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [experienceNum, setExperienceNum] = useState("");
  const [availability, setAvailability] = useState("Full-time");
  const [status, setStatus] = useState<"Pending HR Approval" | "Approved">("Pending HR Approval");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !experienceNum) {
      alert("Please fill in all fields.");
      return;
    }
    onSubmit({
      name,
      email,
      subject,
      experienceNum,
      availability,
      status,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Add New Tutor</h3>
          <p className="text-xs text-slate-450 mt-0.5">
            Register a tutor and select recruitment screening status.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500">Full Name *</Label>
          <Input
            type="text"
            required
            placeholder="Enter tutor's full name"
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
            placeholder="e.g. name@knowlix.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Subject expertise *</Label>
            <Input
              type="text"
              required
              placeholder="e.g. Physics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Experience (Years) *</Label>
            <Input
              type="number"
              required
              min="0"
              placeholder="e.g. 5"
              value={experienceNum}
              onChange={(e) => setExperienceNum(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">Availability *</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Weekends Only">Weekends Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500">HR Admission Status *</Label>
            <Select value={status} onValueChange={(val) => setStatus(val as any)}>
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Admission Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending HR Approval">Pending HR Approval</SelectItem>
                <SelectItem value="Approved">Approved Immediately</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl shadow-md shadow-green-600/10"
          >
            Save Tutor
          </Button>
        </div>
      </form>
    </div>
  );
}
