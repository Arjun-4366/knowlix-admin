"use client";

import { Plus, Search, Filter, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Employee } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeeTableProps {
  employees: Employee[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDept: string;
  onDeptChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  departments: string[];
  statuses: string[];
  activeEmployeeId?: string | null;
  onSelectEmployee: (employee: Employee) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onAddEmployee: () => void;
}

export default function EmployeeTable({
  employees,
  searchTerm,
  onSearchChange,
  selectedDept,
  onDeptChange,
  selectedStatus,
  onStatusChange,
  departments,
  statuses,
  activeEmployeeId,
  onSelectEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onAddEmployee,
}: EmployeeTableProps) {
  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 md:flex-initial min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by ID, name, designation..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
            />
          </div>

          {/* Department Filter */}
          <Select value={selectedDept} onValueChange={onDeptChange}>
            <SelectTrigger className="h-10 w-[150px] bg-white border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="Department" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-semibold text-xs text-slate-700">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept} className="font-semibold text-xs text-slate-700">
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-semibold text-xs text-slate-700">All Statuses</SelectItem>
              {statuses.map((stat) => (
                <SelectItem key={stat} value={stat} className="font-semibold text-xs text-slate-700">
                  {stat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Employee Button */}
        <Button
          onClick={onAddEmployee}
          className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </Button>
      </div>

      {/* Main Employee Grid List */}
      <Card className="bg-white border-slate-150 shadow-sm rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-slate-50/50">
                {/* <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID</TableHead> */}
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date of Join</TableHead>
                <TableHead className="px-5 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {employees.length > 0 ? (
                employees.map((emp) => {
                  let statusColor = "bg-slate-100 text-slate-700 border-slate-200";
                  if (emp.status === "Active") {
                    statusColor = "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20";
                  } else if (emp.status === "On Probation") {
                    statusColor = "bg-amber-50 text-amber-700 border-amber-150";
                  } else if (emp.status === "Terminated") {
                    statusColor = "bg-red-50 text-red-700 border-red-150";
                  } else if (emp.status === "Resigned") {
                    statusColor = "bg-slate-100 text-slate-500 border-slate-200";
                  }

                  return (
                    <TableRow
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp)}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                        activeEmployeeId === emp.id ? "bg-slate-50/90 font-medium" : ""
                      }`}
                    >
                      {/* ID */}
                      {/* <TableCell className="px-5 py-4 text-xs font-semibold text-slate-500">{emp.id}</TableCell> */}

                      {/* Profile */}
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--brand-light-green)] text-[var(--brand-mid)] flex items-center justify-center font-bold text-xs">
                            {emp.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-none">{emp.name}</p>
                            <p className="text-[10px] font-semibold text-slate-450 mt-1">{emp.designation}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Department */}
                      <TableCell className="px-5 py-4 text-xs text-slate-600 font-semibold">{emp.department}</TableCell>

                      {/* Status */}
                      <TableCell className="px-5 py-4">
                        <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                          {emp.status}
                        </Badge>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="px-5 py-4 text-xs text-slate-500">
                        {new Date(emp.dateOfJoining).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onEditEmployee(emp)}
                            className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Edit Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => onDeleteEmployee(emp.id)}
                            className="text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-slate-400 text-xs font-medium bg-white">
                    No employees found matching constraints.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
