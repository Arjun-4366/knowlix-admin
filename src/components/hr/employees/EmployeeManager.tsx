"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useConfirmation } from "@/context/ConfirmationContext";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

import EmployeeStats from "./EmployeeStats";
import EmployeeTable from "./EmployeeTable";
import EmployeeFormModal from "./EmployeeFormModal";
import { EmployeeFormData } from "./EmployeeFormModal";
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_STATUSES,
  getEmployeesServerSnapshot,
  loadEmployees,
  persistEmployees,
  subscribeToEmployees,
} from "./employeeData";
import { Employee } from "./types";

export default function EmployeeManager() {
  const router = useRouter();
  const { confirm } = useConfirmation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const employees = useSyncExternalStore(
    subscribeToEmployees,
    loadEmployees,
    getEmployeesServerSnapshot
  );

  const syncEmployees = (updated: Employee[]) => {
    persistEmployees(updated);
  };

  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === "Active").length;
  const probationCount = employees.filter((e) => e.status === "On Probation").length;
  const departedCount = employees.filter(
    (e) => e.status === "Resigned" || e.status === "Terminated"
  ).length;

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "all" || emp.department === selectedDept;
    const matchesStatus = selectedStatus === "all" || emp.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const openForm = (emp?: Employee) => {
    setEditEmployee(emp ?? null);
    setShowFormModal(true);
  };

  const handleFormSubmit = (data: EmployeeFormData) => {
    const ctc = (data.salaryDetails.base + data.salaryDetails.allowance + data.salaryDetails.pf) * 12;
    const salaryDetails = { ...data.salaryDetails, ctc };

    if (editEmployee) {
      const updated = employees.map((emp) =>
        emp.id === editEmployee.id
          ? { ...emp, ...data, salaryDetails, joiningRecords: { ...emp.joiningRecords, ...data.joiningRecords } }
          : emp
      );
      syncEmployees(updated);
      toast.success("Employee profile updated successfully!");
    } else {
      const nextIdNum =
        employees.reduce((acc, emp) => {
          const n = parseInt(emp.id.replace("EMP-", ""), 10);
          return isNaN(n) ? acc : Math.max(acc, n);
        }, 100) + 1;
      const newEmp: Employee = {
        id: `EMP-${nextIdNum}`,
        ...data,
        salaryDetails,
        documents: [],
      };
      syncEmployees([newEmp, ...employees]);
      toast.success("New employee registered successfully!");
    }
    setShowFormModal(false);
  };

  const handleDeleteEmployee = (id: string) => {
    confirm({
      title: "Delete Employee Record",
      message:
        "Are you sure you want to permanently delete this employee? This action is irreversible.",
      confirmText: "Delete Record",
      variant: "danger",
      onConfirm: () => {
        syncEmployees(employees.filter((e) => e.id !== id));
        toast.success("Employee record deleted.");
      },
    });
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Employee Directory"
        description="Comprehensive employee database management, HR file storage, salary structures, and exit registers."
      />

      <EmployeeStats
        totalCount={totalCount}
        activeCount={activeCount}
        probationCount={probationCount}
        departedCount={departedCount}
      />

      <EmployeeTable
        employees={filteredEmployees}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDept={selectedDept}
        onDeptChange={setSelectedDept}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        departments={EMPLOYEE_DEPARTMENTS}
        statuses={EMPLOYEE_STATUSES}
        activeEmployeeId={null}
        onSelectEmployee={(emp) => router.push(`/hr/employees/${emp.id}`)}
        onEditEmployee={openForm}
        onDeleteEmployee={handleDeleteEmployee}
        onAddEmployee={() => openForm()}
      />

      <EmployeeFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        employee={editEmployee}
        departments={EMPLOYEE_DEPARTMENTS}
        statuses={EMPLOYEE_STATUSES}
      />  
    </div>
  );
}
