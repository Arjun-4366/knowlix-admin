"use client";

import {
  X,
  User,
  Briefcase,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee } from "./types";

interface EmployeeDossierProps {
  employee: Employee | null;
  onClose: () => void;
  onStatusChange: (newStatus: Employee["status"]) => void;
  onSaveExitRecord: (exitDate: string, exitReason: string, exitNotes: string) => void;
  onAddDocument: (docName: string, docType: string) => void;
  onDeleteDocument: (docId: string) => void;
  showCloseButton?: boolean;
  contentScrollable?: boolean;
}

export default function EmployeeDossier({
  employee,
  onClose,
  showCloseButton = true,
  contentScrollable = true,
}: EmployeeDossierProps) {
  if (!employee) {
    return (
      <div className="p-10 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-slate-600 text-xs font-medium space-y-2">
        <Eye className="w-6 h-6 text-slate-600 mx-auto" />
        <p>No employee selected.</p>
        <p className="text-[10px] font-semibold text-slate-600">
          Click on any employee in the directory to inspect records.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-white border-slate-150 shadow-sm rounded-2xl overflow-hidden animate-slide-in">
      <CardHeader className="p-5 pb-3 border-b border-slate-100 bg-slate-50/30">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--brand-green)] text-white flex items-center justify-center font-bold text-sm">
              {employee.profileImage ? (
                <img src={employee.profileImage} alt={employee.name} className="w-full h-full object-cover" />
              ) : (
                employee.name.split(" ").map((n) => n[0]).join("")
              )}
            </div>
            <div>
              <CardTitle className="text-xs font-bold text-slate-800 leading-none">
                {employee.name}
              </CardTitle>
              <p className="text-[10px] font-semibold text-slate-600 mt-1">
                {employee.designation}
              </p>
            </div>
          </div>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-slate-600 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent
        className={`p-5 ${contentScrollable ? "max-h-[500px] overflow-y-auto" : ""}`}
      >
        <div className="space-y-4">
          {/* Personal Details */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2 border-b pb-0.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-1 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Email</p>
                <p className="font-semibold text-slate-800 break-all">{employee.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Phone</p>
                <p className="font-semibold text-slate-800">{employee.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2 border-b pb-0.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Job & Alignment
            </h4>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-1 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Role</p>
                <p className="font-semibold text-slate-800">{employee.role}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Department</p>
                <p className="font-semibold text-slate-800">{employee.department}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">D.O.J.</p>
                <p className="font-semibold text-slate-800">{employee.dateOfJoining}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Status</p>
                <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${employee.status === "Active" ? "bg-emerald-500" : employee.status === "Pending" ? "bg-amber-500" : "bg-red-500"}`} />
                  {employee.status}
                </p>
              </div>
            </div>
          </div>

          {/* Tutor specific details */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2 border-b pb-0.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Profile Information
            </h4>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-1 text-xs">
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Experience</p>
                <p className="font-semibold text-slate-800">{employee.experience ? `${employee.experience} Years` : "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-600 uppercase">Availability</p>
                <p className="font-semibold text-slate-800">{employee.availability?.length ? employee.availability.join(", ") : "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-600 uppercase">Subjects</p>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {employee.subjects?.length ? employee.subjects.map(s => (
                    <span key={s} className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {s}
                    </span>
                  )) : "N/A"}
                </div>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
