"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Employee } from "../employees/types";
import CompensationAdjustmentsPanel from "./CompensationAdjustmentsPanel";
import PayrollCyclePanel from "./PayrollCyclePanel";
import PayrollOverview from "./PayrollOverview";
import SalaryStructurePanel from "./SalaryStructurePanel";
import TaxRecordsPanel from "./TaxRecordsPanel";
import {
  DEFAULT_PAYROLL_CYCLE_ID,
  initialPayrollAdjustments,
  initialPayslipRecords,
  initialTaxRecords,
  payrollCycles,
  payrollPolicies,
  salaryStructureTemplates,
} from "./payrollData";
import { PayslipRecord, TaxRecord, PayrollAdjustment } from "./types";
import { formatPayrollMonth } from "./utils";
import { useGetTutorsHR, useGetSalaryReport } from "@/querys/admin/hrQuery";

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

function buildDraftPayslip(
  employee: Employee,
  cycleId: string,
  taxRecords: TaxRecord[]
): PayslipRecord {
  const taxProfile = taxRecords.find((record) => record.employeeId === employee.id);
  const monthlyTax =
    taxProfile?.projectedTax != null
      ? Math.round(taxProfile.projectedTax / 12)
      : Math.round((employee.salaryDetails.base + employee.salaryDetails.allowance) * 0.04);
  const grossPay = employee.salaryDetails.base + employee.salaryDetails.allowance;

  return {
    id: `PS-${cycleId}-${employee.id}`,
    cycleId,
    employeeId: employee.id,
    workingDays: 26,
    payableDays: 26,
    bonus: 0,
    deductions: 0,
    reimbursements: 0,
    taxDeducted: monthlyTax,
    netPay: grossPay - employee.salaryDetails.pf - monthlyTax,
    status: "Draft",
    note: "Auto-created from the mapped salary structure for the selected cycle.",
  };
}

export default function PayrollManager() {
  const [selectedCycleId, setSelectedCycleId] = useState(DEFAULT_PAYROLL_CYCLE_ID);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [payslipRecords, setPayslipRecords] = useState(initialPayslipRecords);
  const [payrollAdjustments, setPayrollAdjustments] = useState(
    initialPayrollAdjustments
  );

  const { data: tutorsRes, isLoading: tutorsLoading } = useGetTutorsHR();
  const { data: salaryReportRes, isLoading: salaryReportLoading } = useGetSalaryReport();

  const employees = tutorsRes?.data ? (tutorsRes.data as any[]).map(mapTutorToEmployee) : [];
  const livePayrollTotal = salaryReportRes?.data?.totalMonthlyPayroll ?? null;
  const liveEmployeeCount = salaryReportRes?.data?.employeeCount ?? null;

  const activeEmployees = employees.filter(
    (employee) =>
      employee.status === "Active" || employee.status === "On Probation"
  );
  const filteredEmployees = activeEmployees.filter((employee) =>
    selectedDepartment === "all"
      ? true
      : employee.department === selectedDepartment
  );
  const selectedCycle =
    payrollCycles.find((cycle) => cycle.id === selectedCycleId) ?? payrollCycles[0];
  const departments = Array.from(
    new Set(activeEmployees.map((employee) => employee.department))
  );
  const visibleEmployeeIds = new Set(filteredEmployees.map((employee) => employee.id));

  const visiblePayslips = filteredEmployees.map((employee) => {
    const mappedPayslip =
      payslipRecords.find(
        (record) =>
          record.cycleId === selectedCycleId && record.employeeId === employee.id
      ) ?? buildDraftPayslip(employee, selectedCycleId, initialTaxRecords);

    return {
      ...mappedPayslip,
      employeeName: employee.name,
      designation: employee.designation,
      department: employee.department,
      monthlyBase: employee.salaryDetails.base,
      monthlyAllowance: employee.salaryDetails.allowance,
      providentFund: employee.salaryDetails.pf,
      grossPay: employee.salaryDetails.base + employee.salaryDetails.allowance,
    };
  });

  const visibleAdjustments = payrollAdjustments
    .filter(
      (adjustment) =>
        adjustment.cycleId === selectedCycleId &&
        visibleEmployeeIds.has(adjustment.employeeId)
    )
    .map((adjustment) => {
      const employee = employees.find((item) => item.id === adjustment.employeeId);

      return {
        ...adjustment,
        employeeName: employee?.name || "Unknown Employee",
        designation: employee?.designation || "Profile missing",
        department: employee?.department || "Unmapped",
      };
    });

  const visibleTaxRecords = initialTaxRecords
    .filter((record) => visibleEmployeeIds.has(record.employeeId))
    .map((record) => {
      const employee = employees.find((item) => item.id === record.employeeId);

      return {
        ...record,
        employeeName: employee?.name || "Unknown Employee",
        designation: employee?.designation || "Profile missing",
        department: employee?.department || "Unmapped",
      };
    });

  const resolvedSelectedEmployeeId = filteredEmployees.some(
    (employee) => employee.id === selectedEmployeeId
  )
    ? selectedEmployeeId
    : filteredEmployees[0]?.id ?? null;

  const selectedEmployee =
    filteredEmployees.find((employee) => employee.id === resolvedSelectedEmployeeId) ??
    null;
  const selectedPayslip =
    visiblePayslips.find((payslip) => payslip.employeeId === resolvedSelectedEmployeeId) ??
    null;
  const selectedAdjustments = visibleAdjustments.filter(
    (adjustment) => adjustment.employeeId === resolvedSelectedEmployeeId
  );
  const selectedTaxRecord =
    visibleTaxRecords.find((record) => record.employeeId === resolvedSelectedEmployeeId) ??
    null;

  const totalCalculatedGrossPay = visiblePayslips.reduce(
    (total, payslip) => total + payslip.grossPay,
    0
  );
  const totalCalculatedNetPay = visiblePayslips.reduce(
    (total, payslip) => total + payslip.netPay,
    0
  );

  const grossPayTotal = livePayrollTotal ?? totalCalculatedGrossPay;
  const netPayTotal = livePayrollTotal ? Math.round(livePayrollTotal * 0.85) : totalCalculatedNetPay;

  const totalPayslips = filteredEmployees.length;
  const generatedCount = payslipRecords.filter(
    (record) =>
      record.cycleId === selectedCycleId &&
      visibleEmployeeIds.has(record.employeeId) &&
      record.status !== "Draft"
  ).length;

  const pendingCount = Math.max(totalPayslips - generatedCount, 0);

  const bonusTotal = visibleAdjustments
    .filter((adj) => adj.type === "Bonus" && adj.status === "Approved")
    .reduce((sum, adj) => sum + adj.amount, 0);

  const deductionTotal = visibleAdjustments
    .filter((adj) => adj.type === "Deduction" && adj.status === "Approved")
    .reduce((sum, adj) => sum + adj.amount, 0);

  const tdsYtdTotal = visibleTaxRecords.reduce((sum, rec) => sum + rec.tdsYtd, 0);
  const projectedTaxTotal = visibleTaxRecords.reduce((sum, rec) => sum + rec.projectedTax, 0);
  const declarationReviewCount = visibleTaxRecords.filter(
    (rec) => rec.form16Status === "In Progress"
  ).length;

  const pendingCountAdjustments = visibleAdjustments.filter(
    (adj) => adj.status === "Pending"
  ).length;

  const approvedCountAdjustments = visibleAdjustments.filter(
    (adj) => adj.status === "Approved"
  ).length;

  const handleGeneratePending = () => {
    setPayslipRecords((currentRecords) => {
      const existingEmployeeIds = new Set(
        currentRecords
          .filter((r) => r.cycleId === selectedCycleId)
          .map((r) => r.employeeId)
      );

      const newDrafts = filteredEmployees
        .filter((emp) => !existingEmployeeIds.has(emp.id))
        .map((emp) => buildDraftPayslip(emp, selectedCycleId, initialTaxRecords));

      if (newDrafts.length === 0) return currentRecords;
      toast.success(`Generated ${newDrafts.length} pending payslips.`);
      return [...currentRecords, ...newDrafts];
    });
  };

  const handleApplyApproved = () => {
    setPayrollAdjustments((currentAdjustments) =>
      currentAdjustments.map((adj) =>
        adj.cycleId === selectedCycleId && adj.status === "Approved"
          ? { ...adj, status: "Applied" as const }
          : adj
      )
    );
    toast.success("Applied all approved adjustments to this cycle.");
  };

  const handleAddAdjustment = (
    employeeId: string,
    type: "Bonus" | "Deduction",
    amount: number,
    label: string,
    note?: string
  ) => {
    const newAdjustment: PayrollAdjustment = {
      id: `ADJ-${Date.now()}`,
      cycleId: selectedCycleId,
      employeeId,
      type,
      label,
      amount,
      status: "Approved",
      owner: "HR Manager",
      note,
    };

    setPayrollAdjustments((currentAdjustments) => [...currentAdjustments, newAdjustment]);
    toast.success("Compensation adjustment added.");
  };

  const handleDeleteAdjustment = (adjustmentId: string) => {
    setPayrollAdjustments((currentAdjustments) =>
      currentAdjustments.filter((adjustment) => adjustment.id !== adjustmentId)
    );
    toast.success("Compensation adjustment removed.");
  };

  if (tutorsLoading || salaryReportLoading) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader
          title="Payroll & Compensation Governance"
          description="Manage base salaries, allowance structures, tax deductions, and monthly cycles."
        />
        <div className="flex h-96 items-center justify-center bg-white rounded-2xl border border-slate-150 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 w-full">
      <DashboardHeader
        title="Payroll & Compensation Governance"
        description={`Operational sheet for ${formatPayrollMonth(
          selectedCycle.month
        )}: Monthly structure alignment, tax computations, and cycle settlement.`}
      />

      <PayrollOverview
        grossPayTotal={grossPayTotal}
        netPayTotal={netPayTotal}
        generatedCount={generatedCount}
        totalPayslips={totalPayslips}
        bonusTotal={bonusTotal}
        deductionTotal={deductionTotal}
        tdsYtdTotal={tdsYtdTotal}
        projectedTaxTotal={projectedTaxTotal}
        declarationReviewCount={declarationReviewCount}
      />

      <PayrollCyclePanel
        cycles={payrollCycles}
        policies={payrollPolicies}
        selectedCycleId={selectedCycleId}
        onCycleChange={setSelectedCycleId}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        departments={departments}
        payslips={visiblePayslips}
        selectedEmployeeId={resolvedSelectedEmployeeId}
        onEmployeeSelect={setSelectedEmployeeId}
        onGeneratePending={handleGeneratePending}
        pendingCount={pendingCount}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-6">
        <SalaryStructurePanel
          employees={filteredEmployees}
          templates={salaryStructureTemplates}
        />

        <div className="space-y-6">
          <CompensationAdjustmentsPanel
            cycleLabel={formatPayrollMonth(selectedCycle.month)}
            adjustments={visibleAdjustments}
            bonusTotal={bonusTotal}
            deductionTotal={deductionTotal}
            pendingCount={pendingCountAdjustments}
            approvedCount={approvedCountAdjustments}
            onApplyApproved={handleApplyApproved}
          />

          <TaxRecordsPanel
            records={visibleTaxRecords}
            projectedTaxTotal={projectedTaxTotal}
            tdsYtdTotal={tdsYtdTotal}
            reviewCount={declarationReviewCount}
          />
        </div>
      </div>
    </div>
  );
}
