import { X, Star, AlertCircle, UserCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Tutor } from "@/app/admin/tutor/page";
import { Student } from "@/components/students/StudentStats";

interface TutorDrawerProps {
  selectedTutor: Tutor;
  students: Student[];
  onClose: () => void;
  onApproveTutor: (id: string) => void;
  onTogglePermission: (id: string, key: keyof Tutor["permissions"]) => void;
  onUpdateRating: (id: string, key: keyof Tutor["growthMetrics"], value: number) => void;
  onAssignStudent: (tutorName: string, studentId: string) => void;
  onUnassignStudent: (studentId: string) => void;
}

export default function TutorDrawer({
  selectedTutor,
  students,
  onClose,
  onApproveTutor,
  onTogglePermission,
  onUpdateRating,
  onAssignStudent,
  onUnassignStudent,
}: TutorDrawerProps) {
  const calculateTutorAverage = (tutor: Tutor) => {
    const m = tutor.growthMetrics;
    const sum =
      m.growthOfStudents +
      m.responsibility +
      m.ownership +
      m.workEthics +
      m.teamwork +
      m.honesty;
    return (sum / 6).toFixed(2);
  };

  const assignedStudents = students.filter((s) => s.subjectTutor === selectedTutor.name);
  const unassignedStudents = students.filter((s) => s.subjectTutor !== selectedTutor.name);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-150 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  {selectedTutor.name}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-inner",
                    selectedTutor.status === "Approved"
                      ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {selectedTutor.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-450 mt-1">
                {selectedTutor.id} • {selectedTutor.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6 divide-y divide-slate-100 flex-1">
            {/* 1. Core Profile */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                Tutor Profile Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Expertise Subject
                  </span>
                  <span className="text-sm font-semibold text-slate-750">
                    {selectedTutor.subject}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Experience
                  </span>
                  <span className="text-sm font-semibold text-slate-750">
                    {selectedTutor.experience}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Availability
                  </span>
                  <span className="text-sm font-semibold text-slate-750">
                    {selectedTutor.availability}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    Overall GROWTH
                  </span>
                  <span className="text-sm font-bold text-[var(--brand-green)] flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {calculateTutorAverage(selectedTutor)} / 5.0
                  </span>
                </div>
              </div>

              {selectedTutor.status === "Pending HR Approval" && (
                <div className="bg-amber-50/50 border border-amber-250/30 p-3.5 rounded-xl flex flex-col gap-2.5 mt-2">
                  <div className="flex gap-2 text-amber-800">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold">Pending HR Recruitment Approval</p>
                      <p className="text-[10px] text-amber-700/80 mt-0.5">
                        This profile cannot be assigned to students or configure notes access
                        until admitted.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onApproveTutor(selectedTutor.id)}
                    className="w-full py-2 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5 mr-1" />
                    Approve & Admit Tutor
                  </Button>
                </div>
              )}
            </div>

            {/* 2. Access Control Permissions */}
            <div className="pt-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                  Access Control
                </h4>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase"
                >
                  Permissions
                </Badge>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: "uploadNotes" as const,
                    label: "Upload Notes & Documents",
                    desc: "Allow tutor to post educational files",
                  },
                  {
                    key: "editNotes" as const,
                    label: "Edit/Delete Study Notes",
                    desc: "Allows modification of workspace material",
                  },
                  {
                    key: "shareMaterials" as const,
                    label: "Share Study Materials",
                    desc: "Grant ability to share resource links",
                  },
                ].map((perm) => (
                  <div
                    key={perm.key}
                    className={cn(
                      "flex items-start justify-between p-3 rounded-xl border transition-all",
                      selectedTutor.permissions[perm.key]
                        ? "border-[var(--brand-green)]/35 bg-[var(--brand-light-green)]/10"
                        : "border-slate-200 bg-slate-50/30"
                    )}
                  >
                    <div className="flex items-start gap-2.5 mr-2">
                      <div className="pt-0.5">
                        <Switch
                          disabled={selectedTutor.status !== "Approved"}
                          checked={selectedTutor.permissions[perm.key]}
                          onCheckedChange={() => onTogglePermission(selectedTutor.id, perm.key)}
                        />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-700">
                          {perm.label}
                        </span>
                        <span className="block text-[10px] text-slate-405 mt-0.5">
                          {perm.desc}
                        </span>
                      </div>
                    </div>
                    {selectedTutor.permissions[perm.key] ? (
                      <span className="text-[10px] text-[var(--brand-green)] font-bold uppercase mt-0.5">
                        Enabled
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                        Disabled
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. GROWTH Performance Star Rating */}
            <div className="pt-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                  Performance Rating (G-R-O-W-T-H)
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Award ratings from 1 to 5 stars. Values calculate to live average score.
                </p>
              </div>

              <div className="space-y-3.5 bg-slate-50/50 p-4 border border-slate-150 rounded-xl">
                {[
                  {
                    key: "growthOfStudents" as const,
                    label: "Growth (G)",
                    desc: "Performance/Progress of assigned students",
                  },
                  {
                    key: "responsibility" as const,
                    label: "Responsibility (R)",
                    desc: "Engagement and follow-ups",
                  },
                  {
                    key: "ownership" as const,
                    label: "Ownership (O)",
                    desc: "Accountability and task leadership",
                  },
                  {
                    key: "workEthics" as const,
                    label: "Work Ethics (W)",
                    desc: "Punctuality, class preparation, and behavior",
                  },
                  {
                    key: "teamwork" as const,
                    label: "Teamwork (T)",
                    desc: "Cooperation with administrative coordinators",
                  },
                  {
                    key: "honesty" as const,
                    label: "Honesty (H)",
                    desc: "Transparency and class logging accuracy",
                  },
                ].map((metric) => (
                  <div key={metric.key} className="flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-xs font-bold text-slate-750">
                        {metric.label}
                      </span>
                      <span className="block text-[9px] text-slate-400">{metric.desc}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          disabled={selectedTutor.status !== "Approved"}
                          onClick={() => onUpdateRating(selectedTutor.id, metric.key, val)}
                          className="text-amber-400 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={cn(
                              "w-4 h-4",
                              val <= selectedTutor.growthMetrics[metric.key]
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Student Assignment */}
            <div className="pt-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                Student Assignments
              </h4>

              {selectedTutor.status === "Approved" ? (
                <div className="space-y-3">
                  {/* Assign Form */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Assign Student to Tutor
                    </label>
                    <Select
                      onValueChange={(val) => {
                        if (val) {
                          onAssignStudent(selectedTutor.name, val);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl">
                        <SelectValue placeholder="Select Student..." />
                      </SelectTrigger>
                      <SelectContent>
                        {unassignedStudents.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} ({s.courseName || "General"} • {s.grade})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currently Assigned List */}
                  <div className="space-y-2">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Assigned Student Workload
                    </span>
                    {assignedStudents.length > 0 ? (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                        {assignedStudents.map((s) => (
                          <div
                            key={s.id}
                            className="p-3 flex items-center justify-between text-xs hover:bg-slate-50/50"
                          >
                            <div>
                              <p className="font-bold text-slate-700">{s.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">
                                {s.courseName || "General"} • {s.grade}
                              </p>
                            </div>
                            <button
                              onClick={() => onUnassignStudent(s.id)}
                              className="text-[10px] text-red-500 hover:text-red-700 font-bold hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No students currently assigned to this tutor.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Assigning students is only available for HR approved tutors.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
