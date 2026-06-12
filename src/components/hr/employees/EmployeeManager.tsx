"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useConfirmation } from "@/context/ConfirmationContext";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

import EmployeeStats from "./EmployeeStats";
import EmployeeTable from "./EmployeeTable";
import EmployeeFormModal from "./EmployeeFormModal";
import { EmployeeFormData } from "./EmployeeFormModal";
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_STATUSES,
} from "./employeeData";
import { Employee } from "./types";
import { useGetTutorsHR, useCreateTutorByHR } from "@/querys/admin/hrQuery";

const mapTutorToEmployee = (tutor: any): Employee => {
  const tutorId = tutor.id || tutor._id || "";
  let mappedStatus: Employee["status"] = "Active";
  if (tutor.status === "pending") {
    mappedStatus = "On Probation";
  } else if (tutor.status === "rejected") {
    mappedStatus = "Terminated";
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
    address: tutor.availability || "Online / Remote",
    dob: "1990-01-01",
    emergencyContact: {
      name: "Emergency Contact",
      relationship: "Family",
      phone: tutor.phone || "",
    },
    designation: mappedRole,
    department: mappedDept,
    dateOfJoining: tutor.createdAt ? tutor.createdAt.slice(0, 10) : new Date().toISOString().split("T")[0],
    status: mappedStatus,
    manager: "HR Manager",
    salaryDetails: {
      base: 40000,
      allowance: 10000,
      pf: 4800,
      ctc: 600000,
    },
    documents: [],
    joiningRecords: {
      probationEnd: "",
      joiningNotes: `Experience: ${tutor.experience || "Not specified"}. Availability: ${tutor.availability || "Not specified"}.`,
    },
  };
};

export default function EmployeeManager() {
  const router = useRouter();
  const { confirm } = useConfirmation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  const { data: tutorsRes, isLoading } = useGetTutorsHR({ limit: 1000 });
  const createTutorMutation = useCreateTutorByHR();

  const employees = tutorsRes?.data ? (tutorsRes.data as any[]).map(mapTutorToEmployee) : [];

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

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      if (editEmployee) {
        toast.error("Tutor editing is not supported on the backend yet.");
        setShowFormModal(false);
      } else {
        if (data.profileImage instanceof File) {
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("email", data.email);
          formData.append("phone", data.phone);
          formData.append("role", data.role || "subject_tutor");
          formData.append("password", data.password || "");
          formData.append("experience", data.experience || "");
          formData.append("availability", JSON.stringify(data.availability ? [data.availability] : []));
          formData.append("subjects", JSON.stringify(data.subjects || []));
          formData.append("status", "approved");
          formData.append("permissions", JSON.stringify(data.permissions || {
            canUploadNotes: true,
            canEditNotes: true,
            canShareMaterial: false,
          }));
          formData.append("profileImage", data.profileImage);
          await createTutorMutation.mutateAsync(formData);
        } else {
          await createTutorMutation.mutateAsync({
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role || "subject_tutor",
            password: data.password || "",
            experience: data.experience || "",
            availability: data.availability ? [data.availability] : [],
            subjects: data.subjects || [],
            status: "approved",
            profileImage: data.profileImage || "",
            permissions: data.permissions || {
              canUploadNotes: true,
              canEditNotes: true,
              canShareMaterial: false,
            },
          });
        }
        setShowFormModal(false);
      }
    } catch (error) {
      console.error("Failed to create employee", error);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    confirm({
      title: "Delete Employee Record",
      message:
        "Are you sure you want to permanently delete this employee? This action is irreversible.",
      confirmText: "Delete Record",
      variant: "danger",
      onConfirm: () => {
        toast.error("Tutor deletion is not supported on the backend yet.");
      },
    });
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Employee Directory"
        description="Comprehensive employee database management, HR file storage, salary structures, and exit registers."
      />

      {isLoading ? (
        <div className="flex h-96 items-center justify-center bg-white rounded-2xl border border-slate-150 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" />
        </div>
      ) : (
        <>
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
        </>
      )}

      <EmployeeFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        employee={editEmployee}
        departments={EMPLOYEE_DEPARTMENTS}
        statuses={EMPLOYEE_STATUSES}
        isSubmitting={createTutorMutation.isPending}
      />  
    </div>
  );
}
