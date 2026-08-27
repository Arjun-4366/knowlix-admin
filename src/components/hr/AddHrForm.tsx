import { useState } from "react";
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
import { ICreateHrPayload, IUpdateHrPayload } from "@/types/admin/hr";
import type { IHr } from "@/types/admin/hr";

interface AddHrFormProps {
  onClose: () => void;
  onSubmit: (data: ICreateHrPayload | IUpdateHrPayload) => void;
  isSubmitting?: boolean;
  hrToEdit?: IHr;
}

export default function AddHrForm({
  onClose,
  onSubmit,
  isSubmitting = false,
  hrToEdit,
}: AddHrFormProps) {
  const isEdit = !!hrToEdit;

  const [name, setName] = useState(hrToEdit?.name ?? "");
  const [email, setEmail] = useState(hrToEdit?.email ?? "");
  const [phone, setPhone] = useState(hrToEdit?.phone ?? "");
  const [department, setDepartment] = useState(hrToEdit?.department ?? "");
  const [role, setRole] = useState(hrToEdit?.role ?? "hr_manager");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (isEdit) {
      const payload: IUpdateHrPayload = { name, email, phone, department, role };
      if (password) payload.password = password;
      onSubmit(payload);
    } else {
      if (!password) {
        alert("Please provide an initial password.");
        return;
      }
      onSubmit({ name, email, phone, department, role, password });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">
            {isEdit ? "Edit HR Member" : "Register New HR Member"}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {isEdit
              ? "Update contact details, department, and role."
              : "Configure contact details, department, and roles."}
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">Full Name *</Label>
          <Input
            type="text"
            required
            disabled={isSubmitting}
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Email Address *</Label>
            <Input
              type="email"
              required
              disabled={isSubmitting}
              placeholder="e.g. jane.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Phone Number *</Label>
            <Input
              type="tel"
              required
              disabled={isSubmitting}
              placeholder="e.g. +1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Department *</Label>
            <Input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Human Resources"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Role *</Label>
            <Select disabled={isSubmitting} value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hr_manager">HR Manager</SelectItem>
                <SelectItem value="hr_executive">HR Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">
            {isEdit ? "New Password" : "Initial Password *"}
            {isEdit && (
              <span className="ml-1.5 font-normal text-slate-400">(leave blank to keep current)</span>
            )}
          </Label>
          <Input
            type="password"
            required={!isEdit}
            disabled={isSubmitting}
            placeholder={isEdit ? "Enter new password (optional)" : "Secure password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white border-slate-200 rounded-xl"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] rounded-xl shadow-md shadow-green-600/10 flex items-center gap-1.5"
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isEdit ? "Save Changes" : "Register HR"}
          </Button>
        </div>
      </form>
    </div>
  );
}
