"use client";

import { useState } from "react";
import {
  X,
  User,
  Briefcase,
  IndianRupee,
  FileText,
  Download,
  Trash2,
  Upload,
  Calendar,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Employee } from "./types";

interface EmployeeDossierProps {
  employee: Employee | null;
  onClose: () => void;
  onStatusChange: (newStatus: Employee["status"]) => void;
  onSaveExitRecord: (exitDate: string, exitReason: string, exitNotes: string) => void;
  onAddDocument: (docName: string, docType: Employee["documents"][0]["type"]) => void;
  onDeleteDocument: (docId: string) => void;
  showCloseButton?: boolean;
  contentScrollable?: boolean;
}

const DOCUMENT_TYPES = ["ID Proof", "Certificate", "Agreement", "Other"] as const;

export default function EmployeeDossier({
  employee,
  onClose,
  onStatusChange,
  onSaveExitRecord,
  onAddDocument,
  onDeleteDocument,
  showCloseButton = true,
  contentScrollable = true,
}: EmployeeDossierProps) {
  if (!employee) {
    return (
      <div className="p-10 border border-dashed border-slate-200 rounded-2xl bg-white text-center text-slate-450 text-xs font-medium space-y-2">
        <Eye className="w-6 h-6 text-slate-350 mx-auto" />
        <p>No employee selected.</p>
        <p className="text-[10px] font-semibold text-slate-400">
          Click on any employee in the directory to inspect records, pay slips, and upload onboarding files.
        </p>
      </div>
    );
  }

  const resetKey = [
    employee.id,
    employee.status,
    employee.exitRecords?.exitDate || "",
    employee.exitRecords?.reason || "",
    employee.exitRecords?.exitNotes || "",
  ].join(":");

  return (
    <EmployeeDossierPanel
      key={resetKey}
      employee={employee}
      onClose={onClose}
      onStatusChange={onStatusChange}
      onSaveExitRecord={onSaveExitRecord}
      onAddDocument={onAddDocument}
      onDeleteDocument={onDeleteDocument}
      showCloseButton={showCloseButton}
      contentScrollable={contentScrollable}
    />
  );
}

type EmployeeDossierPanelProps = Omit<EmployeeDossierProps, "employee"> & {
  employee: Employee;
};

function EmployeeDossierPanel({
  employee,
  onClose,
  onStatusChange,
  onSaveExitRecord,
  onAddDocument,
  onDeleteDocument,
  showCloseButton,
  contentScrollable,
}: EmployeeDossierPanelProps) {
  const [dossierTab, setDossierTab] = useState<"profile" | "documents" | "joining-exit">("profile");

  // Exit record form state
  const [exitDate, setExitDate] = useState(employee.exitRecords?.exitDate || "");
  const [exitReason, setExitReason] = useState(employee.exitRecords?.reason || "");
  const [exitNotes, setExitNotes] = useState(employee.exitRecords?.exitNotes || "");

  // Document upload state
  const [docNameInput, setDocNameInput] = useState("");
  const [docTypeInput, setDocTypeInput] = useState<Employee["documents"][0]["type"]>("ID Proof");

  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNameInput.trim()) {
      toast.error("Document name cannot be empty.");
      return;
    }
    onAddDocument(docNameInput.trim(), docTypeInput);
    setDocNameInput("");
  };

  const handleSaveExitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exitDate || !exitReason) {
      toast.error("Exit date and reason are required.");
      return;
    }
    onSaveExitRecord(exitDate, exitReason, exitNotes.trim());
  };

  return (
    <Card className="bg-white border-slate-150 shadow-sm rounded-2xl overflow-hidden animate-slide-in">
      <CardHeader className="p-5 pb-3 border-b border-slate-100 bg-slate-50/30">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-green)] text-white flex items-center justify-center font-bold text-sm">
              {employee.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <CardTitle className="text-xs font-bold text-slate-800 leading-none">
                {employee.name}
              </CardTitle>
              <p className="text-[10px] font-semibold text-slate-450 mt-1">
                {employee.id} &bull; {employee.designation}
              </p>
            </div>
          </div>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-slate-100 mt-4 -mx-5 px-5">
          <button
            onClick={() => setDossierTab("profile")}
            className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              dossierTab === "profile"
                ? "border-b-2 border-[var(--brand-green)] text-[var(--brand-green)]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setDossierTab("documents")}
            className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              dossierTab === "documents"
                ? "border-b-2 border-[var(--brand-green)] text-[var(--brand-green)]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Docs ({employee.documents.length})
          </button>
          <button
            onClick={() => setDossierTab("joining-exit")}
            className={`flex-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              dossierTab === "joining-exit"
                ? "border-b-2 border-[var(--brand-green)] text-[var(--brand-green)]"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Logs
          </button>
        </div>
      </CardHeader>

      <CardContent
        className={`p-5 ${contentScrollable ? "max-h-[500px] overflow-y-auto" : ""}`}
      >
        {/* 1. PROFILE TAB */}
        {dossierTab === "profile" && (
          <div className="space-y-4">
            {/* Personal Details */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b pb-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-1 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Email</p>
                  <p className="font-semibold text-slate-800 break-all">{employee.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Phone</p>
                  <p className="font-semibold text-slate-800">{employee.phone || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Address</p>
                  <p className="font-semibold text-slate-700 leading-normal">{employee.address || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">DOB</p>
                  <p className="font-semibold text-slate-800">{employee.dob || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Emerg. Contact</p>
                  <p className="font-semibold text-slate-800 leading-tight">
                    {employee.emergencyContact?.name} ({employee.emergencyContact?.relationship})
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{employee.emergencyContact?.phone}</p>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b pb-0.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Job & Alignment
              </h4>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-1 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Department</p>
                  <p className="font-semibold text-slate-800">{employee.department}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Manager</p>
                  <p className="font-semibold text-slate-800">{employee.manager || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">D.O.J.</p>
                  <p className="font-semibold text-slate-800">{employee.dateOfJoining}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Employment Status</p>
                  <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${employee.status === "Active" ? "bg-emerald-500" : employee.status === "On Probation" ? "bg-amber-500" : "bg-red-500"}`} />
                    {employee.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Salary Package */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b pb-0.5 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" /> Payroll Details
              </h4>
              <div className="grid grid-cols-3 gap-y-2 gap-x-1 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Base Salary</p>
                  <p className="font-semibold text-slate-850">₹{employee.salaryDetails?.base?.toLocaleString("en-IN")}/mo</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">Allowances</p>
                  <p className="font-semibold text-slate-850">₹{employee.salaryDetails?.allowance?.toLocaleString("en-IN")}/mo</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-450 uppercase">PF</p>
                  <p className="font-semibold text-slate-850">₹{employee.salaryDetails?.pf?.toLocaleString("en-IN")}/mo</p>
                </div>
                <div className="col-span-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex justify-between items-center mt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Gross Annual CTC</span>
                  <span className="text-xs font-bold text-[var(--brand-green)]">
                    ₹{employee.salaryDetails?.ctc?.toLocaleString("en-IN")} PA
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. DOCUMENTS TAB */}
        {dossierTab === "documents" && (
          <div className="space-y-4">
            {/* List Attached Documents */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b pb-1">
                Attached HR Documents
              </h4>
              {employee.documents.length > 0 ? (
                employee.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 border border-slate-150 rounded-xl flex items-center justify-between text-xs hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate" title={doc.name}>
                          {doc.name}
                        </p>
                        <p className="text-[9px] font-semibold text-slate-450 mt-0.5">
                          {doc.type} &bull; {doc.fileSize} &bull; {doc.uploadDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={() => toast.success(`Simulating download of "${doc.name}"`)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded transition-colors"
                        title="Remove Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs italic text-center py-4">
                  No folders or documents uploaded yet.
                </p>
              )}
            </div>

            {/* Simulate Attachment Upload */}
            <form onSubmit={handleAddDocSubmit} className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-660 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Add New Document
              </h4>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Document Title
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Pancard_Verify, DegreeCert"
                  value={docNameInput}
                  onChange={(e) => setDocNameInput(e.target.value)}
                  className="h-8 text-xs rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Document Category
                </label>
                <Select
                  value={docTypeInput}
                  onValueChange={(value: Employee["documents"][0]["type"]) =>
                    setDocTypeInput(value)
                  }
                >
                  <SelectTrigger className="h-8 text-xs rounded-lg font-medium">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="text-xs">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-[10px] h-8 rounded-lg mt-1"
              >
                Upload Document
              </Button>
            </form>
          </div>
        )}

        {/* 3. LOGS (JOINING & EXIT RECORDS) */}
        {dossierTab === "joining-exit" && (
          <div className="space-y-4">
            {/* Joining Records */}
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-650 flex items-center gap-1.5 border-b pb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Onboarding & Joining
              </h4>
              <div className="text-xs space-y-1.5">
                <p className="text-slate-600">
                  <strong className="text-[10px] text-slate-450 uppercase">Date of Joining:</strong>{" "}
                  {employee.dateOfJoining}
                </p>
                {employee.joiningRecords?.probationEnd && (
                  <p className="text-slate-600">
                    <strong className="text-[10px] text-slate-450 uppercase">Probation End:</strong>{" "}
                    {employee.joiningRecords.probationEnd}
                  </p>
                )}
                {employee.joiningRecords?.joiningNotes && (
                  <p className="text-slate-600 leading-normal italic text-slate-500">
                    &ldquo;{employee.joiningRecords.joiningNotes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Exit Records Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-655 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> Status & Exit Operations
                </h4>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onStatusChange("Active")}
                    className={`h-7 px-2 text-[9px] font-bold rounded-md ${
                      employee.status === "Active"
                        ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-emerald-250"
                        : ""
                    }`}
                    title="Set Active"
                  >
                    Active
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onStatusChange("On Probation")}
                    className={`h-7 px-2 text-[9px] font-bold rounded-md ${
                      employee.status === "On Probation"
                        ? "bg-amber-50 text-amber-700 border-amber-250"
                        : ""
                    }`}
                    title="Set Probation"
                  >
                    Probation
                  </Button>
                </div>
              </div>

              {/* Display exit log if status is Resigned / Terminated */}
              {(employee.status === "Resigned" || employee.status === "Terminated") && (
                <form onSubmit={handleSaveExitSubmit} className="p-3 border border-red-150 bg-red-50/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-red-100 pb-1">
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                      {employee.status} Exit File
                    </span>
                    <Badge className="bg-red-100 text-red-800 border-red-200 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full">
                      Exit Logged
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                      Last Working Date
                    </label>
                    <Input
                      type="date"
                      value={exitDate}
                      onChange={(e) => setExitDate(e.target.value)}
                      className="h-8 text-xs bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                      Exit Reason
                    </label>
                    <Select value={exitReason} onValueChange={setExitReason}>
                      <SelectTrigger className="h-8 text-xs bg-white">
                        <SelectValue placeholder="Select Reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Relocation" className="text-xs">Relocation</SelectItem>
                        <SelectItem value="Better Opportunity" className="text-xs">Better Opportunity</SelectItem>
                        <SelectItem value="Performance Issue" className="text-xs">Performance Issue</SelectItem>
                        <SelectItem value="Personal Reasons" className="text-xs">Personal Reasons</SelectItem>
                        <SelectItem value="Other" className="text-xs">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                      Exit Notes / Remarks
                    </label>
                    <Textarea
                      placeholder="Describe notice period status, handover notes, clearance status..."
                      value={exitNotes}
                      onChange={(e) => setExitNotes(e.target.value)}
                      className="min-h-16 text-xs bg-white"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-650 hover:bg-red-700 text-white font-bold text-[10px] h-8 rounded-lg"
                  >
                    Save Exit Records
                  </Button>
                </form>
              )}

              {employee.status !== "Resigned" && employee.status !== "Terminated" && (
                <div className="p-3 border border-slate-150 bg-slate-50/50 rounded-xl text-center space-y-2">
                  <p className="text-xs font-semibold text-slate-655">Mark Exit Record</p>
                  <p className="text-[10px] text-slate-450">
                    To log exit documents and clear this employee, toggle their status to Resigned or Terminated.
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      onClick={() => onStatusChange("Resigned")}
                      className="h-7 text-[9px] font-bold text-slate-600 border-slate-200"
                    >
                      Resigned
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onStatusChange("Terminated")}
                      className="h-7 text-[9px] font-bold text-red-650 hover:text-red-700 hover:bg-red-50 border-slate-200"
                    >
                      Terminated
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
