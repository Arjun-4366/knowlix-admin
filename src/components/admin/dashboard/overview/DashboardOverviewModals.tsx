import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { BarChart3, ClipboardCheck, UserPlus, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ITopTutor } from "@/types/admin/dashboard";

export type DashboardOverviewModalType =
  | "add-tutor"
  | "assign-tutor"
  | "tutor-report"
  | null;

interface DashboardOverviewModalsProps {
  activeModal: DashboardOverviewModalType;
  selectedTutor: ITopTutor | null;
  onClose: () => void;
  onToast: (message: string) => void;
}

const defaultStudents = [
  "Rahul Sharma",
  "Sneha Reddy",
  "Kabir Malhotra",
  "Aria Fernandes",
  "Vikram Sen",
];

const defaultTutors = [
  "Arjun Nair",
  "Safvan",
  "Amit Shah",
  "Sarah Jenkins",
  "David Miller",
];

const formatTutorRole = (role: string) =>
  role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function DashboardOverviewModals({
  activeModal,
  selectedTutor,
  onClose,
  onToast,
}: DashboardOverviewModalsProps) {
  const [tutorName, setTutorName] = useState("");
  const [tutorSubject, setTutorSubject] = useState("");
  const [tutorExperience, setTutorExperience] = useState("");
  const [studentSelect, setStudentSelect] = useState(defaultStudents[0]);
  const [tutorSelect, setTutorSelect] = useState(defaultTutors[0]);

  if (!activeModal) {
    return null;
  }

  const handleAddTutorSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!tutorName.trim()) {
      return;
    }

    onToast(`Tutor "${tutorName}" registered successfully.`);
    onClose();
  };

  const handleAssignTutorSubmit = (event: FormEvent) => {
    event.preventDefault();
    onToast(`Assigned ${tutorSelect} to ${studentSelect} successfully.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-150 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-2">
            {activeModal === "add-tutor" && <UserPlus className="h-4 w-4 text-[var(--brand-green)]" />}
            {activeModal === "assign-tutor" && <Users className="h-4 w-4 text-[var(--brand-green)]" />}
            {activeModal === "tutor-report" && <BarChart3 className="h-4 w-4 text-[var(--brand-green)]" />}
            <h3 className="text-base font-bold text-slate-800">
              {activeModal === "add-tutor" && "Add New Tutor"}
              {activeModal === "assign-tutor" && "Assign Tutor to Student"}
              {activeModal === "tutor-report" && "Tutor Performance Report"}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {activeModal === "add-tutor" && (
          <form onSubmit={handleAddTutorSubmit} className="space-y-4 p-6">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Tutor Name
              </Label>
              <Input
                type="text"
                required
                placeholder="Enter tutor name"
                value={tutorName}
                onChange={(event) => setTutorName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Subject Expertise
              </Label>
              <Input
                type="text"
                required
                placeholder="e.g. Mathematics, Chemistry"
                value={tutorSubject}
                onChange={(event) => setTutorSubject(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Experience
              </Label>
              <Input
                type="text"
                required
                placeholder="e.g. 5 years"
                value={tutorExperience}
                onChange={(event) => setTutorExperience(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-555"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[var(--brand-green)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--brand-mid)]"
              >
                Register Tutor
              </Button>
            </div>
          </form>
        )}

        {activeModal === "assign-tutor" && (
          <form onSubmit={handleAssignTutorSubmit} className="space-y-4 p-6">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Select Student
              </Label>
              <select
                value={studentSelect}
                onChange={(event) => setStudentSelect(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-55 px-3.5 py-2 text-sm font-medium outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              >
                {defaultStudents.map((student) => (
                  <option key={student} value={student}>
                    {student}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Select Tutor
              </Label>
              <select
                value={tutorSelect}
                onChange={(event) => setTutorSelect(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-55 px-3.5 py-2 text-sm font-medium outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              >
                {defaultTutors.map((tutor) => (
                  <option key={tutor} value={tutor}>
                    {tutor}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-555"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-[var(--brand-green)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--brand-mid)]"
              >
                Confirm Assignment
              </Button>
            </div>
          </form>
        )}

        {activeModal === "tutor-report" && selectedTutor && (
          <div className="space-y-5 p-6">
            <div className="flex items-center gap-3">
              {selectedTutor.profileImage ? (
                <Image
                  src={selectedTutor.profileImage}
                  alt={selectedTutor.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-light-green)] text-lg font-bold text-[var(--brand-green)]">
                  {selectedTutor.name.charAt(0)}
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold leading-none text-slate-800">
                  {selectedTutor.name}
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  {formatTutorRole(selectedTutor.role)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Rank
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-lg font-bold text-slate-850">
                  <ClipboardCheck className="h-4 w-4 text-[var(--brand-green)]" />
                  #{selectedTutor.rank}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Performance Score
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-lg font-bold text-[var(--brand-green)]">
                  <BarChart3 className="h-4 w-4 text-[var(--brand-green)]" />
                  {selectedTutor.performanceScore}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Growth Points
                </span>
                <span className="mt-0.5 text-lg font-bold text-slate-850">
                  {selectedTutor.growthPoints}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  Tutor ID
                </span>
                <span className="mt-0.5 block truncate font-mono text-xs text-slate-600">
                  {selectedTutor.id}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Dashboard Note
              </p>
              <p className="mt-2 text-sm text-slate-600">
                This report is powered by the dashboard payload, so it currently shows rank, role, growth points, and performance score from the latest API response.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Link
                href={`/admin/tutor/${selectedTutor.id}`}
                className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-[var(--brand-green)]/40 hover:text-[var(--brand-green)]"
              >
                Open Profile
              </Link>
              <Button
                onClick={onClose}
                className="rounded-xl bg-[var(--brand-green)] px-5 py-2 text-xs font-bold text-white hover:bg-[var(--brand-mid)]"
              >
                Close Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
