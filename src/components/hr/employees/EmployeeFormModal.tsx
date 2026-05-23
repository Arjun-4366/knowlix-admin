"use client";

import { useState, useEffect } from "react";
import { X, User, HeartHandshake, Briefcase, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Employee } from "./types";

export type EmployeeFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  emergencyContact: { name: string; relationship: string; phone: string };
  designation: string;
  department: Employee["department"];
  dateOfJoining: string;
  status: Employee["status"];
  manager: string;
  salaryDetails: { base: number; allowance: number; pf: number };
  joiningRecords: { probationEnd?: string; joiningNotes?: string };
};

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: Employee | null;
  departments: string[];
  statuses: string[];
}

export default function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  employee,
  departments,
  statuses,
}: EmployeeFormModalProps) {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [ecName, setEcName] = useState("");
  const [ecRelation, setEcRelation] = useState("");
  const [ecPhone, setEcPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState<Employee["department"]>("HR");
  const [doj, setDoj] = useState("");
  const [status, setStatus] = useState<Employee["status"]>("Active");
  const [manager, setManager] = useState("");
  const [baseSalary, setBaseSalary] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [pf, setPf] = useState(0);
  const [probationEnd, setProbationEnd] = useState("");
  const [joiningNotes, setJoiningNotes] = useState("");

  // Sync state with edit mode or reset on new
  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setEmail(employee.email);
      setPhone(employee.phone || "");
      setAddress(employee.address || "");
      setDob(employee.dob || "");
      setEcName(employee.emergencyContact?.name || "");
      setEcRelation(employee.emergencyContact?.relationship || "");
      setEcPhone(employee.emergencyContact?.phone || "");
      setDesignation(employee.designation);
      setDepartment(employee.department);
      setDoj(employee.dateOfJoining);
      setStatus(employee.status);
      setManager(employee.manager || "");
      setBaseSalary(employee.salaryDetails?.base || 0);
      setAllowance(employee.salaryDetails?.allowance || 0);
      setPf(employee.salaryDetails?.pf || 0);
      setProbationEnd(employee.joiningRecords?.probationEnd || "");
      setJoiningNotes(employee.joiningRecords?.joiningNotes || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setDob("");
      setEcName("");
      setEcRelation("");
      setEcPhone("");
      setDesignation("");
      setDepartment("HR");
      setDoj(new Date().toISOString().split("T")[0]);
      setStatus("Active");
      setManager("");
      setBaseSalary(0);
      setAllowance(0);
      setPf(0);
      setProbationEnd("");
      setJoiningNotes("");
    }
  }, [employee, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !designation.trim()) {
      toast.error("Name, Email, and Designation are required.");
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      dob,
      emergencyContact: {
        name: ecName.trim(),
        relationship: ecRelation.trim(),
        phone: ecPhone.trim(),
      },
      designation: designation.trim(),
      department,
      dateOfJoining: doj,
      status,
      manager: manager.trim(),
      salaryDetails: {
        base: Number(baseSalary),
        allowance: Number(allowance),
        pf: Number(pf),
      },
      joiningRecords: {
        probationEnd: probationEnd || undefined,
        joiningNotes: joiningNotes.trim() || undefined,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-150 rounded-2xl max-w-2xl w-full shadow-xl overflow-hidden my-8 animate-scale-in">
        <header className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {employee ? `Edit Profile: ${employee.id}` : "Register New Employee"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* SECTION A: Personal Details */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Personal Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ritesh Deshmukh"
                  className="h-10 bg-white"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@knowlix.in"
                  className="h-10 bg-white"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="h-10 bg-white"
                />
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="h-10 bg-white"
                />
              </div>

              {/* Address */}
              <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Residential Address
                </label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No, Street, Landmark, City, State"
                  className="h-10 bg-white"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-150 space-y-3 mt-2">
              <span className="text-[10px] font-bold text-slate-650 uppercase tracking-wider flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-slate-400" /> Emergency Contact
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-440 uppercase">Contact Name</label>
                  <Input
                    type="text"
                    value={ecName}
                    onChange={(e) => setEcName(e.target.value)}
                    placeholder="e.g. Asha Deshmukh"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-440 uppercase">Relationship</label>
                  <Input
                    type="text"
                    value={ecRelation}
                    onChange={(e) => setEcRelation(e.target.value)}
                    placeholder="e.g. Mother / Spouse"
                    className="h-8 text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-440 uppercase">Contact Phone</label>
                  <Input
                    type="tel"
                    value={ecPhone}
                    onChange={(e) => setEcPhone(e.target.value)}
                    placeholder="+91 99999 88888"
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: Job Alignment */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" /> 2. Job & Position Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Designation */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Designation
                </label>
                <Input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Counsellor"
                  className="h-10 bg-white"
                  required
                />
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Department
                </label>
                <Select
                  value={department}
                  onValueChange={(val: any) => setDepartment(val)}
                >
                  <SelectTrigger className="h-10 bg-white">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Manager */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Manager / Supervisor
                </label>
                <Input
                  type="text"
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="Supervisor Name"
                  className="h-10 bg-white"
                />
              </div>

              {/* Date of Joining */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Date of Joining
                </label>
                <Input
                  type="date"
                  value={doj}
                  onChange={(e) => setDoj(e.target.value)}
                  className="h-10 bg-white"
                  required
                />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Employment Status
                </label>
                <Select
                  value={status}
                  onValueChange={(val: any) => setStatus(val)}
                >
                  <SelectTrigger className="h-10 bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((stat) => (
                      <SelectItem key={stat} value={stat}>
                        {stat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Probation end date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Probation End Date
                </label>
                <Input
                  type="date"
                  value={probationEnd}
                  onChange={(e) => setProbationEnd(e.target.value)}
                  className="h-10 bg-white"
                />
              </div>

              {/* Joining notes */}
              <div className="col-span-1 md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Onboarding Notes
                </label>
                <Textarea
                  value={joiningNotes}
                  onChange={(e) => setJoiningNotes(e.target.value)}
                  placeholder="Notes regarding academic verification, candidate background, references..."
                  className="min-h-16 bg-white"
                />
              </div>
            </div>
          </div>

          {/* SECTION C: Salary Details */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4" /> 3. Salary & Compensation Structures
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Base */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Base Salary (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <Input
                    type="number"
                    value={baseSalary || ""}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    placeholder="0"
                    className="h-10 pl-7 bg-white"
                  />
                </div>
              </div>

              {/* Allowance */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Allowances (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <Input
                    type="number"
                    value={allowance || ""}
                    onChange={(e) => setAllowance(Number(e.target.value))}
                    placeholder="0"
                    className="h-10 pl-7 bg-white"
                  />
                </div>
              </div>

              {/* PF */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  PF Contribution (Monthly)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                  <Input
                    type="number"
                    value={pf || ""}
                    onChange={(e) => setPf(Number(e.target.value))}
                    placeholder="0"
                    className="h-10 pl-7 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-550 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              Save Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
