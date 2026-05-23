"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmployeeDossier from "./EmployeeDossier";
import EmployeeFormModal, { EmployeeFormData } from "./EmployeeFormModal";
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_STATUSES,
  getEmployeesServerSnapshot,
  loadEmployees,
  persistEmployees,
  subscribeToEmployees,
} from "./employeeData";
import { Employee } from "./types";

interface EmployeeDetailsPageProps {
  employeeId: string;
}

export default function EmployeeDetailsPage({
  employeeId,
}: EmployeeDetailsPageProps) {
  const router = useRouter();
  const [showFormModal, setShowFormModal] = useState(false);
  const employees = useSyncExternalStore(
    subscribeToEmployees,
    loadEmployees,
    getEmployeesServerSnapshot
  );

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

  const employee = employees.find((entry) => entry.id === employeeId) ?? null;

  const updateEmployee = (updater: (currentEmployee: Employee) => Employee) => {
    const updatedEmployees = employees.map((entry) =>
      entry.id === employeeId ? updater(entry) : entry
    );

    persistEmployees(updatedEmployees);
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    const ctc =
      (data.salaryDetails.base +
        data.salaryDetails.allowance +
        data.salaryDetails.pf) *
      12;

    updateEmployee((currentEmployee) => ({
      ...currentEmployee,
      ...data,
      salaryDetails: {
        ...data.salaryDetails,
        ctc,
      },
      joiningRecords: {
        ...currentEmployee.joiningRecords,
        ...data.joiningRecords,
      },
    }));

    setShowFormModal(false);
    toast.success("Employee profile updated successfully!");
  };

  const handleStatusChange = (newStatus: Employee["status"]) => {
    updateEmployee((currentEmployee) => ({
      ...currentEmployee,
      status: newStatus,
      exitRecords:
        newStatus === "Active" || newStatus === "On Probation"
          ? undefined
          : currentEmployee.exitRecords,
    }));

    toast.success(`Employee status updated to ${newStatus}.`);
  };

  const handleSaveExitRecord = (
    exitDate: string,
    exitReason: string,
    exitNotes: string
  ) => {
    updateEmployee((currentEmployee) => ({
      ...currentEmployee,
      exitRecords: {
        exitDate,
        reason: exitReason,
        exitNotes: exitNotes || undefined,
      },
    }));

    toast.success("Exit record saved successfully!");
  };

  const handleAddDocument = (
    docName: string,
    docType: Employee["documents"][0]["type"]
  ) => {
    updateEmployee((currentEmployee) => ({
      ...currentEmployee,
      documents: [
        {
          id: `DOC-${currentEmployee.id}-${Date.now()}`,
          name: docName,
          type: docType,
          uploadDate: new Date().toISOString().split("T")[0],
          fileSize: "Manual Upload",
        },
        ...currentEmployee.documents,
      ],
    }));

    toast.success("Document added to employee record.");
  };

  const handleDeleteDocument = (docId: string) => {
    updateEmployee((currentEmployee) => ({
      ...currentEmployee,
      documents: currentEmployee.documents.filter((doc) => doc.id !== docId),
    }));

    toast.success("Document removed from employee record.");
  };

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
