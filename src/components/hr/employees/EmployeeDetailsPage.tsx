"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmployeeDossier from "./EmployeeDossier";
import EmployeeFormModal, { EmployeeFormData } from "./EmployeeFormModal";
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_STATUSES,
} from "./employeeData";
import { Employee } from "./types";
import { useGetTutorHR } from "@/querys/admin/hrQuery";

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

  const { data: tutorRes, isLoading } = useGetTutorHR(employeeId);
  const employee = tutorRes?.data ? mapTutorToEmployee(tutorRes.data) : null;

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
          <p className="text-xs text-slate-500">
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
          <Button
            onClick={() => setShowFormModal(true)}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Edit2 className="w-4 h-4" /> Edit Employee
          </Button>
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

      <EmployeeFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        employee={employee}
        departments={EMPLOYEE_DEPARTMENTS}
        statuses={EMPLOYEE_STATUSES}
      />
    </div>
  );
}
