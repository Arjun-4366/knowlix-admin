"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { IAssignedStudent } from "@/types/tutor/profile";

interface Props {
  assignedStudents: IAssignedStudent[];
  admissionStatusColor: (s?: string) => string;
}

export default function ProfileStudentsTab({ assignedStudents, admissionStatusColor }: Props) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader className="p-6 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--brand-green)]" /> Assigned Students
          </CardTitle>
          <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] font-bold text-[10px] px-2 py-0.5 rounded-full">
            {assignedStudents.length} Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {assignedStudents.length === 0 ? (
          <div className="py-10 text-center">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No students assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  {["Student", "Admission No", "Program / Course", "Class", "Syllabus", "Package"].map((h) => (
                    <TableHead key={h} className="px-5 py-3 text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50">
                {assignedStudents.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50/40 transition-colors">
                    <TableCell className="px-5 py-3.5">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{s.studentName}</p>
                        <p className="text-[10px] text-slate-600 font-medium">{s.email}</p>
                        {s.parentName && <p className="text-[10px] text-slate-600">Parent: {s.parentName}</p>}
                        {s.place && <p className="text-[10px] text-slate-600">{s.place}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span className="text-[10px] font-semibold text-slate-700 font-mono">{s.admissionNumber || "—"}</span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{s.programName || "—"}</p>
                        {s.courseName && <p className="text-[10px] text-slate-600 mt-0.5">{s.courseName}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span className="text-xs font-semibold text-slate-700">
                        {s.class ? `${s.class}` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span className="text-[10px] font-semibold text-slate-700">{s.syllabus || "—"}</span>
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <span className="text-[10px] font-semibold text-slate-700 capitalize">
                        {s.package?.replace(/_/g, " ") || "—"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
