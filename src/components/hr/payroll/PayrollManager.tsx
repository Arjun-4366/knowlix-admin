"use client";

import { useState, useSyncExternalStore } from "react";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import {
  getEmployeesServerSnapshot,
  loadEmployees,
  subscribeToEmployees,
} from "../employees/employeeData";
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
import { PayslipRecord, TaxRecord } from "./types";
import { formatPayrollMonth } from "./utils";

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
  const employees = useSyncExternalStore(
    subscribeToEmployees,
    loadEmployees,
    getEmployeesServerSnapshot
  );
  const [selectedCycleId, setSelectedCycleId] = useState(DEFAULT_PAYROLL_CYCLE_ID);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [payslipRecords, setPayslipRecords] = useState(initialPayslipRecords);
  const [payrollAdjustments, setPayrollAdjustments] = useState(
    initialPayrollAdjustments
  );

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

  const resolvedSelectedEmployeeId = visiblePayslips.some(
    (payslip) => payslip.employeeId === selectedEmployeeId
  )
    ? selectedEmployeeId
    : visiblePayslips[0]?.employeeId ?? null;

  const generatedCount = visiblePayslips.filter(
    (payslip) => payslip.status === "Generated" || payslip.status === "Sent"
  ).length;
  const pendingCount = visiblePayslips.filter(
    (payslip) => payslip.status === "Draft" || payslip.status === "Ready"
  ).length;
  const grossPayTotal = filteredEmployees.reduce(
    (total, employee) =>
      total + employee.salaryDetails.base + employee.salaryDetails.allowance,
    0
  );
  const netPayTotal = visiblePayslips.reduce(
    (total, payslip) => total + payslip.netPay,
    0
  );
  const bonusTotal = visibleAdjustments
    .filter((adjustment) => adjustment.type === "Bonus")
    .reduce((total, adjustment) => total + adjustment.amount, 0);
  const deductionTotal = visibleAdjustments
    .filter((adjustment) => adjustment.type === "Deduction")
    .reduce((total, adjustment) => total + adjustment.amount, 0);
  const approvedAdjustmentCount = visibleAdjustments.filter(
    (adjustment) => adjustment.status === "Approved"
  ).length;
  const pendingAdjustmentCount = visibleAdjustments.filter(
    (adjustment) => adjustment.status === "Pending"
  ).length;
  const projectedTaxTotal = visibleTaxRecords.reduce(
    (total, record) => total + record.projectedTax,
    0
  );
  const tdsYtdTotal = visibleTaxRecords.reduce(
    (total, record) => total + record.tdsYtd,
    0
  );
  const taxReviewCount = visibleTaxRecords.filter(
    (record) => record.form16Status === "In Progress" || record.exemptions > 0
  ).length;

  const handleGeneratePendingPayslips = () => {
    if (filteredEmployees.length === 0) {
      return;
    }

    setPayslipRecords((currentRecords) => {
      const nextRecords = [...currentRecords];

      filteredEmployees.forEach((employee) => {
        const existingRecordIndex = nextRecords.findIndex(
          (record) =>
            record.cycleId === selectedCycleId && record.employeeId === employee.id
        );

        if (existingRecordIndex === -1) {
          nextRecords.push({
            ...buildDraftPayslip(employee, selectedCycleId, initialTaxRecords),
            status: "Generated",
            note: "Generated from salary structure and payroll policy defaults.",
          });
          return;
        }

        const existingRecord = nextRecords[existingRecordIndex];

        if (
          existingRecord.status === "Draft" ||
          existingRecord.status === "Ready"
        ) {
          nextRecords[existingRecordIndex] = {
            ...existingRecord,
            status: "Generated",
          };
        }
      });

      return nextRecords;
    });

    toast.success("Pending payslips generated for the current payroll filter.");
  };

  const handleApplyApprovedAdjustments = () => {
    if (approvedAdjustmentCount === 0) {
      return;
    }

    setPayrollAdjustments((currentAdjustments) =>
      currentAdjustments.map((adjustment) =>
        adjustment.cycleId === selectedCycleId &&
        visibleEmployeeIds.has(adjustment.employeeId) &&
        adjustment.status === "Approved"
          ? { ...adjustment, status: "Applied" }
          : adjustment
      )
    );

    toast.success("Approved payroll adjustments marked as applied.");
  };

  if (activeEmployees.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <DashboardHeader
          title="Payroll Management"
          description="Salary structure setup, payslip generation, and tax records will appear after active employees are available."
        />

        <Card className="rounded-2xl border-slate-150 p-8 text-center bg-white shadow-sm space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            No active employees are available for payroll processing yet.
          </p>
          <p className="text-xs text-slate-500">
            Add or reactivate employees in the directory before opening payroll
            cycles.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader
        title="Payroll Management"
        description={`Payroll control room for ${formatPayrollMonth(
          selectedCycle.month
        )}: salary structures, payslip generation, adjustment governance, and tax compliance.`}
      />

      <PayrollOverview
        grossPayTotal={grossPayTotal}
        netPayTotal={netPayTotal}
        generatedCount={generatedCount}
        totalPayslips={visiblePayslips.length}
        bonusTotal={bonusTotal}
        deductionTotal={deductionTotal}
        tdsYtdTotal={tdsYtdTotal}
        projectedTaxTotal={projectedTaxTotal}
        declarationReviewCount={taxReviewCount}
      />

      <div className="grid grid-cols-1 2xl:grid-cols-[1.55fr_1fr] gap-6">
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
          onGeneratePending={handleGeneratePendingPayslips}
          pendingCount={pendingCount}
        />
        <TaxRecordsPanel
          records={visibleTaxRecords}
          projectedTaxTotal={projectedTaxTotal}
          tdsYtdTotal={tdsYtdTotal}
          reviewCount={taxReviewCount}
        />
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-[1.45fr_1fr] gap-6">
        <SalaryStructurePanel
          employees={filteredEmployees}
          templates={salaryStructureTemplates}
        />
        <CompensationAdjustmentsPanel
          cycleLabel={formatPayrollMonth(selectedCycle.month)}
          adjustments={visibleAdjustments}
          bonusTotal={bonusTotal}
          deductionTotal={deductionTotal}
          pendingCount={pendingAdjustmentCount}
          approvedCount={approvedAdjustmentCount}
          onApplyApproved={handleApplyApprovedAdjustments}
        />
      </div>
    </div>
  );
}
