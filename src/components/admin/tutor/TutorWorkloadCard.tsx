"use client";

import { useMemo, useState } from "react";
import { Users, X, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStudents } from "@/querys/admin/studentQuery";
import { useAssignStudentsToTutor } from "@/querys/admin/tutorQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import { IAssignedStudent } from "@/types/tutor/profile";

interface TutorWorkloadCardProps {
  tutorId: string;
  isApproved: boolean;
  assignedStudents: IAssignedStudent[];
}

export function TutorWorkloadCard({ tutorId, isApproved, assignedStudents }: TutorWorkloadCardProps) {
  const { confirm } = useConfirmation();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const { data: studentsResponse, isLoading: isStudentsLoading } = useGetStudents();

  const { mutateAsync: assignStudents, isPending: isAssigning } = useAssignStudentsToTutor();

  console.log("students", studentsResponse);

  const unassignedStudents = useMemo(() => {
    if (!studentsResponse?.data) return [];
    const assignedIds = new Set(assignedStudents.map((s) => s.id));
    return studentsResponse.data.filter((s) => !assignedIds.has(s.id) && s.admissionStatus === "admission_taken");
  }, [studentsResponse, assignedStudents]);

  const availableToSelect = unassignedStudents.filter((s) => !selectedStudentIds.includes(s.id));

  const handleAddStudents = async () => {
    if (selectedStudentIds.length === 0) return;
    try {
      await assignStudents({ id: tutorId, payload: { add: selectedStudentIds } });
      setSelectedStudentIds([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveStudent = (studentId: string) => {
    confirm({
      title: "Remove Student",
      message: "Are you sure you want to remove this student from the tutor's workload?",
      confirmText: "Remove",
      variant: "danger",
      onConfirm: async () => {
        try {
          await assignStudents({ id: tutorId, payload: { remove: [studentId] } });
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  return (
    <Card className="bg-white border-slate-150 shadow-sm">
      <CardHeader className="p-6 pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--brand-green)]" />
          <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
            Assigned Workload
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex flex-col gap-4">
        {isStudentsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : assignedStudents.length > 0 ? (
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden max-h-[160px] overflow-y-auto">
            {assignedStudents.map((s) => (
              <div key={s.id} className="p-3 flex items-center justify-between hover:bg-slate-50/50 group">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs flex-shrink-0">
                    {s.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{s.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Grade {s.class}{s.courseType ? ` • ${s.courseType}` : s.package ? ` • ${s.package.replace("_", " ")}` : ""}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all rounded-full w-6 h-6"
                  onClick={() => handleRemoveStudent(s.id)}
                  disabled={isAssigning}
                  title="Remove Student"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No students currently assigned to this tutor.</p>
        )}

        {isApproved && (
          <div className="pt-2 mt-auto border-t border-slate-100 flex flex-col gap-2">
            {selectedStudentIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedStudentIds.map((sid) => {
                  const student = unassignedStudents.find((s) => s.id === sid);
                  if (!student) return null;
                  return (
                    <Badge
                      key={sid}
                      variant="secondary"
                      className="flex items-center gap-1 bg-slate-100 text-slate-700 hover:bg-slate-200 pr-1 border border-slate-200 text-[10px]"
                    >
                      {student.studentName}
                      <button
                        onClick={() => setSelectedStudentIds((prev) => prev.filter((s) => s !== sid))}
                        className="text-slate-400 hover:text-red-500 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Select
                value=""
                onValueChange={(val) => {
                  if (val && !selectedStudentIds.includes(val)) {
                    setSelectedStudentIds((prev) => [...prev, val]);
                  }
                }}
                disabled={isAssigning || availableToSelect.length === 0}
              >
                <SelectTrigger className="h-8 text-xs font-semibold bg-slate-50/50 border-slate-200 rounded-lg flex-1">
                  <SelectValue
                    placeholder={availableToSelect.length > 0 ? "Select students to assign..." : "No available students"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableToSelect.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.studentName} (Grade {s.class})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="h-8 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white px-4 rounded-lg flex-shrink-0 font-bold"
                disabled={selectedStudentIds.length === 0 || isAssigning}
                onClick={handleAddStudents}
              >
                {isAssigning && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                Assign
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
