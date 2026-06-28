"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Loader2, ThumbsUp, ThumbsDown, MessageSquarePlus } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import EmployeeDossier from "./EmployeeDossier";
import EmployeeFormModal, { EmployeeFormData } from "./EmployeeFormModal";
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_STATUSES,
} from "./employeeData";
import { Employee } from "./types";
import { useGetTutorHR, useAddRemarkHR } from "@/querys/admin/hrQuery";

const mapTutorToEmployee = (tutor: any): Employee => {
  const tutorId = tutor.id || tutor._id || "";
  let mappedStatus: Employee["status"] = "Pending";
  if (tutor.status === "approved") {
    mappedStatus = "Active";
  } else if (tutor.status === "rejected") {
    mappedStatus = "Terminated";
  } else if (tutor.status === "pending") {
    mappedStatus = "Pending";
  }

  let mappedDept: Employee["department"] = "Tutor";
  let mappedRole = "Tutor";
  if (tutor.role === "mentor_sales_bro") {
    mappedDept = "Sales";
    mappedRole = "Mentor/Sales Rep";
  } else if (tutor.role === "academic_coordinator") {
    mappedDept = "Academics";
    mappedRole = "Academic Coordinator";
  }

  return {
    id: tutorId,
    name: tutor.name || "Unnamed Tutor",
    email: tutor.email || "",
    phone: tutor.phone || "",
    role: tutor.role || "subject_tutor",
    department: mappedDept,
    designation: mappedRole,
    dateOfJoining: tutor.createdAt ? tutor.createdAt.slice(0, 10) : new Date().toISOString().split("T")[0],
    status: mappedStatus,
    subjects: tutor.subjects || [],
    experience: tutor.experience || "",
    availability: tutor.availability || [],
    profileImage: tutor.profileImage || "",
    // Empty mock fields to satisfy TypeScript
    address: "",
    dob: "",
    emergencyContact: { name: "", relationship: "", phone: "" },
    salaryDetails: { base: 0, allowance: 0, pf: 0, ctc: 0 },
    documents: [],
    joiningRecords: {},
  };
};

interface EmployeeDetailsPageProps {
  employeeId: string;
}

export default function EmployeeDetailsPage({
  employeeId,
}: EmployeeDetailsPageProps) {
  const router = useRouter();
  const [showFormModal, setShowFormModal] = useState(false);
  const [showRemarkDialog, setShowRemarkDialog] = useState(false);

  const { data: tutorRes, isLoading } = useGetTutorHR(employeeId);
  const { mutateAsync: addRemark, isPending: isAddingRemark } = useAddRemarkHR();
  const employee = tutorRes?.data ? mapTutorToEmployee(tutorRes.data) : null;
  const positiveRemarks = ((tutorRes?.data as any)?.positiveRemarks ?? []) as { text: string; addedBy: string; addedAt: string }[];
  const negativeRemarks = ((tutorRes?.data as any)?.negativeRemarks ?? []) as { text: string; addedBy: string; addedAt: string }[];

  if (!employeeId) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader
          title="Employee Detail"
          description="The requested employee record could not be found."
          onBack={() => router.push("/hr/employees")}
          backText="Back to Employee Directory"
        />

        <Card className="rounded-2xl border-slate-150 p-8 text-center bg-white shadow-sm space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            No employee ID was provided for this route.
          </p>
          <div>
            <Button
              onClick={() => router.push("/hr/employees")}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white"
            >
              Return to Directory
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader
          title="Employee Detail"
          description="The requested employee record could not be found."
          onBack={() => router.push("/hr/employees")}
          backText="Back to Employee Directory"
        />

        <Card className="rounded-2xl border-slate-150 p-8 text-center bg-white shadow-sm space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            No employee exists for ID `{employeeId}`.
          </p>
          <p className="text-xs text-slate-600">
            The record may have been deleted or the URL may be incorrect.
          </p>
          <div>
            <Button
              onClick={() => router.push("/hr/employees")}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white"
            >
              Return to Directory
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleFormSubmit = (data: EmployeeFormData) => {
    toast.error("Tutor editing is not supported on the backend yet.");
    setShowFormModal(false);
  };

  const handleStatusChange = (newStatus: Employee["status"]) => {
    toast.error("Tutor status updates must go through admin approval flow.");
  };

  const handleSaveExitRecord = (
    exitDate: string,
    exitReason: string,
    exitNotes: string
  ) => {
    toast.error("Exit records are not supported on the backend yet.");
  };

  const handleAddDocument = (
    docName: string,
    docType: Employee["documents"][0]["type"]
  ) => {
    toast.error("Document uploads are not supported on the backend yet.");
  };

  const handleDeleteDocument = (docId: string) => {
    toast.error("Document removal is not supported on the backend yet.");
  };

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader
        title="Employee Detail"
        description={`${employee.name} | ${employee.id} | ${employee.department}`}
        onBack={() => router.push("/hr/employees")}
        backText="Back to Employee Directory"
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowRemarkDialog(true)}
              variant="outline"
              className="border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" /> Add Remark
            </Button>
            <Button
              onClick={() => setShowFormModal(true)}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Edit2 className="w-4 h-4" /> Edit Employee
            </Button>
          </div>
        }
      />

      <EmployeeDossier
        employee={employee}
        onClose={() => router.push("/hr/employees")}
        onStatusChange={handleStatusChange}
        onSaveExitRecord={handleSaveExitRecord}
        onAddDocument={handleAddDocument}
        onDeleteDocument={handleDeleteDocument}
        showCloseButton={false}
        contentScrollable={false}
      />

      {/* Remarks */}
      {(positiveRemarks.length > 0 || negativeRemarks.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive */}
          <Card className="bg-white border-slate-150 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-emerald-50/50">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Positive Remarks
              </h3>
              <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                {positiveRemarks.length}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {positiveRemarks.length === 0 ? (
                <p className="px-5 py-6 text-xs text-slate-600 text-center">No positive remarks yet.</p>
              ) : (
                positiveRemarks.map((r, i) => (
                  <div key={i} className="px-5 py-4 space-y-1">
                    <p className="text-xs text-slate-700 leading-relaxed">{r.text}</p>
                    <p className="text-[10px] text-slate-600 font-semibold">
                      — {r.addedBy} &middot;{" "}
                      {new Date(r.addedAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Negative */}
          <Card className="bg-white border-slate-150 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-red-50/50">
              <ThumbsDown className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Negative Remarks
              </h3>
              <span className="ml-auto text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {negativeRemarks.length}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {negativeRemarks.length === 0 ? (
                <p className="px-5 py-6 text-xs text-slate-600 text-center">No negative remarks yet.</p>
              ) : (
                negativeRemarks.map((r, i) => (
                  <div key={i} className="px-5 py-4 space-y-1">
                    <p className="text-xs text-slate-700 leading-relaxed">{r.text}</p>
                    <p className="text-[10px] text-slate-600 font-semibold">
                      — {r.addedBy} &middot;{" "}
                      {new Date(r.addedAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      <EmployeeFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        employee={employee}
        departments={EMPLOYEE_DEPARTMENTS}
        statuses={EMPLOYEE_STATUSES}
      />

      {showRemarkDialog && (
        <AddRemarkDialog
          tutorName={employee.name}
          isSubmitting={isAddingRemark}
          onClose={() => setShowRemarkDialog(false)}
          onSubmit={async (type, text) => {
            await addRemark({ id: employeeId, data: { type, text } });
            setShowRemarkDialog(false);
          }}
        />
      )}
    </div>
  );
}

interface AddRemarkDialogProps {
  tutorName: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (type: "positive" | "negative", text: string) => Promise<void>;
}

function AddRemarkDialog({ tutorName, isSubmitting, onClose, onSubmit }: AddRemarkDialogProps) {
  const [type, setType] = useState<"positive" | "negative">("positive");
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onSubmit(type, text.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Add Remark</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">{tutorName}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Remark Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("positive")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  type === "positive"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Positive
              </button>
              <button
                type="button"
                onClick={() => setType("negative")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  type === "negative"
                    ? "bg-red-50 text-red-600 border-red-300"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" /> Negative
              </button>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Remark *</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                type === "positive"
                  ? "e.g. Tutor handled the demo class very well..."
                  : "e.g. Tutor needs improvement in communication skills..."
              }
              rows={4}
              className="resize-none bg-slate-50 focus:bg-white border-slate-200 rounded-xl text-xs"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 text-xs font-bold border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className={`px-5 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 ${
                type === "positive"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquarePlus className="w-3.5 h-3.5" />}
              {isSubmitting ? "Saving..." : "Save Remark"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
