import { Calculator, FileCheck2, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EnrichedTaxRecord, Form16Status, TaxRegime } from "./types";
import { formatCurrency, formatDateLabel } from "./utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TaxRecordsPanelProps {
  records: EnrichedTaxRecord[];
  projectedTaxTotal: number;
  tdsYtdTotal: number;
  reviewCount: number;
}

const regimeClassMap: Record<TaxRegime, string> = {
  "Old Regime": "bg-amber-50 text-amber-700 border-amber-200",
  "New Regime": "bg-sky-50 text-sky-700 border-sky-200",
};

const form16ClassMap: Record<Form16Status, string> = {
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Shared: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function TaxRecordsPanel({
  records,
  projectedTaxTotal,
  tdsYtdTotal,
  reviewCount,
}: TaxRecordsPanelProps) {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-850">Tax Calculation & Records</h2>
        <p className="text-xs text-slate-600 mt-1">
          Annual tax projection, TDS trail, and Form 16 readiness for active
          payroll staff.
        </p>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Projected Tax
            </p>
            <p className="text-lg font-bold text-slate-800 mt-2">
              {formatCurrency(projectedTaxTotal)}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 inline-flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              Current annual estimate across filtered employees
            </p>
          </div>
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              TDS Recovered YTD
            </p>
            <p className="text-lg font-bold text-slate-800 mt-2">
              {formatCurrency(tdsYtdTotal)}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Deposits aligned to the payroll filing calendar
            </p>
          </div>
          <div className="rounded-2xl border border-slate-150 bg-slate-50/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Compliance Review
            </p>
            <p className="text-lg font-bold text-slate-800 mt-2">{reviewCount}</p>
            <p className="text-[11px] text-slate-600 mt-1 inline-flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5" />
              Records still moving through declaration or Form 16 review
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-150 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Tax Ledger
            </h3>
          </div>

          <Table>
            <TableHeader className="bg-white">
              <TableRow className="border-slate-100 hover:bg-white">
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Employee
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Regime
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Taxable Income
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Projected Tax
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  TDS YTD
                </TableHead>
                <TableHead className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Form 16
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length > 0 ? (
                records.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-slate-100 hover:bg-slate-50/60"
                  >
                    <TableCell className="px-4 py-3 align-top whitespace-normal">
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {record.employeeName}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1">
                          {record.designation}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1">
                          PAN {record.pan}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top whitespace-normal">
                      <div className="space-y-1">
                        <span
                          className={cn(
                            "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold",
                            regimeClassMap[record.regime]
                          )}
                        >
                          {record.regime}
                        </span>
                        <p className="text-[10px] text-slate-600">
                          Exemptions {formatCurrency(record.exemptions)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                      {formatCurrency(record.taxableIncome)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs font-semibold text-slate-700">
                      {formatCurrency(record.projectedTax)}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top whitespace-normal">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          {formatCurrency(record.tdsYtd)}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1">
                          Last deposit {formatDateLabel(record.lastDepositDate)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-top whitespace-normal">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold",
                          form16ClassMap[record.form16Status]
                        )}
                      >
                        {record.form16Status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-slate-100 hover:bg-white">
                  <TableCell
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-slate-600 whitespace-normal"
                  >
                    No tax records match the selected payroll filter.
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
