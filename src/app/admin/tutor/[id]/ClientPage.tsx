"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Star,
  AlertCircle,
  UserCheck,
  GraduationCap,
  BookOpen,
  Clock,
  Mail,
  Users,
  ShieldCheck,
} from "lucide-react";
import { Tutor } from "@/app/admin/tutor/page";
import { Student } from "@/components/students/StudentStats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

const GROWTH_METRICS = [
  {
    key: "growthOfStudents" as const,
    label: "Growth (G)",
    desc: "Performance & progress of assigned students",
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
];

export default function TutorDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedTutors = localStorage.getItem("knowlix_tutors");
    const storedStudents = localStorage.getItem("knowlix_students");

    if (storedTutors) {
      try {
        const parsed: Tutor[] = JSON.parse(storedTutors);
        const match = parsed.find((t) => t.id === id);
        if (match) setTutor(match);
      } catch (e) {
        console.error("Error loading tutor:", e);
      }
    }

    if (storedStudents) {
      try {
        setStudents(JSON.parse(storedStudents));
      } catch (e) {
        console.error("Error loading students:", e);
      }
    }
  }, [id]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePermission = (key: keyof Tutor["permissions"]) => {
    if (!tutor) return;
    const updated = {
      ...tutor,
      permissions: { ...tutor.permissions, [key]: !tutor.permissions[key] },
    };
    setTutor(updated);
    // Persist only permissions to localStorage
    const storedTutors = localStorage.getItem("knowlix_tutors");
    if (storedTutors) {
      const all: Tutor[] = JSON.parse(storedTutors);
      const updatedAll = all.map((t) => (t.id === id ? updated : t));
      localStorage.setItem("knowlix_tutors", JSON.stringify(updatedAll));
    }
    triggerToast(`Permission updated`);
  };

  const handleUpdateRating = (
    key: keyof Tutor["growthMetrics"],
    value: number
  ) => {
    if (!tutor) return;
    const updated = {
      ...tutor,
      growthMetrics: { ...tutor.growthMetrics, [key]: value },
    };
    setTutor(updated);
    // Persist rating to localStorage
    const storedTutors = localStorage.getItem("knowlix_tutors");
    if (storedTutors) {
      const all: Tutor[] = JSON.parse(storedTutors);
      const updatedAll = all.map((t) => (t.id === id ? updated : t));
      localStorage.setItem("knowlix_tutors", JSON.stringify(updatedAll));
    }
    triggerToast(`Rating updated`);
  };

  const handleApprove = () => {
    if (!tutor) return;
    const updated = { ...tutor, status: "Approved" as const };
    setTutor(updated);
    const storedTutors = localStorage.getItem("knowlix_tutors");
    if (storedTutors) {
      const all: Tutor[] = JSON.parse(storedTutors);
      const updatedAll = all.map((t) => (t.id === id ? updated : t));
      localStorage.setItem("knowlix_tutors", JSON.stringify(updatedAll));
    }
    triggerToast(`${tutor.name} has been approved and admitted.`);
  };

  if (!tutor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-slate-800 text-lg">Tutor Not Found</h3>
          <p className="text-sm text-slate-500 mt-1">
            No tutor matching ID &quot;{id}&quot; was found.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/tutor")}
          className="flex items-center gap-1.5 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tutors
        </Button>
      </div>
    );
  }

  const calculateAverage = () => {
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

  const assignedStudents = students.filter(
    (s) => s.subjectTutor === tutor.name
  );
  const isApproved = tutor.status === "Approved";

  return (
    <div className="space-y-6 pb-12 relative max-w-5xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--brand-dark)] text-white border border-slate-700/30 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-5 h-5 rounded-full bg-[var(--brand-green)] flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Back Link */}
      <div>
        <button
          onClick={() => router.push("/admin/tutor")}
          className="flex items-center gap-2 text-slate-500 hover:text-[var(--brand-green)] font-semibold text-sm transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tutors Directory
        </button>
      </div>

      {/* Profile Header Card */}
      <Card className="bg-white border-slate-150 shadow-sm">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-2xl border border-[var(--brand-light)]/20 shadow-inner flex-shrink-0">
              {tutor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {tutor.name}
                </h1>
                <Badge
                  variant="outline"
                  className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200"
                >
                  {tutor.id}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-bold px-2.5 py-0.5 rounded-full border",
                    isApproved
                      ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  {tutor.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {tutor.email}
              </p>
            </div>
          </div>

          {/* Overall GROWTH Score */}
          <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-800">{calculateAverage()}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">GROWTH Score / 5.0</p>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "w-3.5 h-3.5",
                      s <= Math.round(parseFloat(calculateAverage()))
                        ? "fill-[var(--brand-green)] text-[var(--brand-green)]"
                        : "text-slate-200"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending HR Banner */}
      {!isApproved && (
        <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold">Pending HR Recruitment Approval</p>
              <p className="text-xs text-amber-700/80 mt-0.5">
                This tutor is in the recruitment pool. Permissions and student assignment are locked until admitted.
              </p>
            </div>
          </div>
          <Button
            onClick={handleApprove}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm flex-shrink-0"
          >
            <UserCheck className="w-4 h-4 mr-1.5" />
            Approve & Admit
          </Button>
        </div>
      )}

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Details */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Profile Details
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-3.5">
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Subject Expertise</span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {tutor.subject}
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Experience</span>
              <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{tutor.experience}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Availability</span>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {tutor.availability}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Access Permissions */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Access Control
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-3">
            {[
              { key: "uploadNotes" as const, label: "Upload Notes & Documents" },
              { key: "editNotes" as const, label: "Edit / Delete Study Notes" },
              { key: "shareMaterials" as const, label: "Share Study Materials" },
            ].map((perm) => (
              <div
                key={perm.key}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border transition-all",
                  tutor.permissions[perm.key]
                    ? "border-[var(--brand-green)]/35 bg-[var(--brand-light-green)]/10"
                    : "border-slate-200 bg-slate-50/30"
                )}
              >
                <span className="text-xs font-bold text-slate-700">{perm.label}</span>
                <Switch
                  disabled={!isApproved}
                  checked={tutor.permissions[perm.key]}
                  onCheckedChange={() => handleTogglePermission(perm.key)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Assigned Students */}
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Assigned Students
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            {assignedStudents.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {assignedStudents.map((s) => (
                  <div key={s.id} className="p-3 flex items-center gap-2.5 hover:bg-slate-50/50">
                    <div className="w-7 h-7 rounded-full bg-[var(--brand-light-green)] flex items-center justify-center font-bold text-[var(--brand-green)] text-xs flex-shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {s.courseName || "General"} • {s.grade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No students currently assigned to this tutor.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* G-R-O-W-T-H Performance Ratings */}
      <Card className="bg-white border-slate-150 shadow-sm">
        <CardHeader className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[var(--brand-green)]" />
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                Performance Rating — G-R-O-W-T-H
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] bg-[var(--brand-light-green)] border-[var(--brand-light)]/20 text-[var(--brand-mid)] px-2 py-0.5 rounded-md font-bold"
            >
              Avg: {calculateAverage()} / 5.0
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click stars to update ratings. Each criterion is scored from 1 to 5.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GROWTH_METRICS.map((metric) => (
              <div
                key={metric.key}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/40 gap-4"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-750">
                    {metric.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">
                    {metric.desc}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      disabled={!isApproved}
                      onClick={() => handleUpdateRating(metric.key, val)}
                      className="disabled:opacity-40 disabled:cursor-not-allowed hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "w-5 h-5",
                          val <= tutor.growthMetrics[metric.key]
                            ? "fill-[var(--brand-green)] text-[var(--brand-green)]"
                            : "text-slate-200"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
