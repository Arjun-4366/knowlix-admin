export type PayrollCycleStatus = "In Review" | "Processing" | "Completed";

export type BankAdviceStatus =
  | "Pending Upload"
  | "Queued"
  | "Uploaded"
  | "Reconciled";

export type PayslipStatus = "Draft" | "Ready" | "Generated" | "Sent";

export type AdjustmentType = "Bonus" | "Deduction";

export type AdjustmentStatus = "Pending" | "Approved" | "Applied";

export type TaxRegime = "Old Regime" | "New Regime";

export type Form16Status = "In Progress" | "Ready" | "Shared";

export interface PayrollCycle {
  id: string;
  month: string;
  payoutDate: string;
  lockDate: string;
  status: PayrollCycleStatus;
  bankAdviceStatus: BankAdviceStatus;
  note: string;
}

export interface PayslipRecord {
  id: string;
  cycleId: string;
  employeeId: string;
  workingDays: number;
  payableDays: number;
  bonus: number;
  deductions: number;
  reimbursements: number;
  taxDeducted: number;
  netPay: number;
  status: PayslipStatus;
  note?: string;
}

export interface PayrollAdjustment {
  id: string;
  cycleId: string;
  employeeId: string;
  type: AdjustmentType;
  label: string;
  amount: number;
  status: AdjustmentStatus;
  owner: string;
  note?: string;
}

export interface TaxRecord {
  id: string;
  employeeId: string;
  fiscalYear: string;
  regime: TaxRegime;
  taxableIncome: number;
  projectedTax: number;
  tdsYtd: number;
  exemptions: number;
  lastDepositDate: string;
  pan: string;
  form16Status: Form16Status;
}

export interface SalaryStructureTemplate {
  id: string;
  title: string;
  targetGroup: string;
  fixedShare: number;
  allowanceShare: number;
  statutoryShare: number;
  reviewWindow: string;
  payoutMode: string;
  note: string;
}

export interface PayrollPolicy {
  id: string;
  label: string;
  value: string;
  note: string;
}

export interface EnrichedPayslipRecord extends PayslipRecord {
  employeeName: string;
  designation: string;
  department: string;
  monthlyBase: number;
  monthlyAllowance: number;
  providentFund: number;
  grossPay: number;
}

export interface EnrichedPayrollAdjustment extends PayrollAdjustment {
  employeeName: string;
  designation: string;
  department: string;
}

export interface EnrichedTaxRecord extends TaxRecord {
  employeeName: string;
  designation: string;
  department: string;
}
