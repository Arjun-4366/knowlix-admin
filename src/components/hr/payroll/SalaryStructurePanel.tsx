import { Building2, CircleDollarSign, Shield } from "lucide-react";
import { Employee } from "../employees/types";
import { SalaryStructureTemplate } from "./types";
import { formatCurrency } from "./utils";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalaryStructurePanelProps {
  employees: Employee[];
  templates: SalaryStructureTemplate[];
}

export default function SalaryStructurePanel({
  employees,
  templates,
}: SalaryStructurePanelProps) {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-850">Salary Structure Setup</h2>
        <p className="text-xs text-slate-500 mt-1">
          Standard payroll templates and live employee mapping for monthly fixed,
          allowance, and statutory components.
        </p>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl border border-slate-150 bg-slate-50/45 p-4 space-y-3"
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">{template.title}</p>
                <p className="text-[11px] text-slate-500">{template.targetGroup}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-xl bg-white border border-slate-150 p-2.5 space-y-1">
                  <div className="inline-flex items-center gap-1 text-slate-500">
                    <Building2 className="w-3.5 h-3.5" />
                    Fixed
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {template.fixedShare}%
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-slate-150 p-2.5 space-y-1">
                  <div className="inline-flex items-center gap-1 text-slate-500">
                    <CircleDollarSign className="w-3.5 h-3.5" />
                    Allow
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {template.allowanceShare}%
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-slate-150 p-2.5 space-y-1">
                  <div className="inline-flex items-center gap-1 text-slate-500">
                    <Shield className="w-3.5 h-3.5" />
                    PF
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {template.statutoryShare}%
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <p>
                  <span className="font-semibold text-slate-700">Revision:</span>{" "}
                  {template.reviewWindow}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Payout:</span>{" "}
                  {template.payoutMode}
                </p>
                <p>{template.note}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-150 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Structure Mapping
            </h3>
          </div>

          <Table>
            <TableHeader className="bg-white">
              <TableRow className="border-slate-100 hover:bg-white">
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Employee
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Basic
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Allowance
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  PF
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Gross / Month
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  CTC / Year
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((employee) => {
                  const grossMonthly =
                    employee.salaryDetails.base + employee.salaryDetails.allowance;

                  return (
                    <TableRow
                      key={employee.id}
                      className="border-slate-100 hover:bg-slate-50/60"
                    >
                      <TableCell className="px-4 py-3 align-top whitespace-normal">
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {employee.name}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {employee.designation}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs font-semibold text-slate-600">
                        {employee.department}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {formatCurrency(employee.salaryDetails.base)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {formatCurrency(employee.salaryDetails.allowance)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {formatCurrency(employee.salaryDetails.pf)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {formatCurrency(grossMonthly)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                        {formatCurrency(employee.salaryDetails.ctc)}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-slate-100 hover:bg-white">
                  <TableCell
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-slate-500 whitespace-normal"
                  >
                    No employees match the selected payroll filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
