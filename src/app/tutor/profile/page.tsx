"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useGetTutorProfile, useUpdateTutorProfile } from "@/querys/tutor/profileQuery";
import { useGetSubjects, useGetSyllabuses } from "@/querys/admin/curriculumQuery";
import { ISubjectEntry, ISlotEntry, IAssignedStudent } from "@/types/tutor/profile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import toast from "react-hot-toast";

import ProfileBanner from "@/components/tutor/profile/ProfileBanner";
import ProfileOverviewTab from "@/components/tutor/profile/ProfileOverviewTab";
import ProfileSubjectsTab from "@/components/tutor/profile/ProfileSubjectsTab";
import ProfileSlotsTab from "@/components/tutor/profile/ProfileSlotsTab";
import ProfileStudentsTab from "@/components/tutor/profile/ProfileStudentsTab";

export default function TutorProfilePage() {
  const { data: profile, isLoading } = useGetTutorProfile();
  const updateProfile = useUpdateTutorProfile();
  const { data: subjectsData } = useGetSubjects();
  const { data: syllabusesData } = useGetSyllabuses();

  const curriculumSubjects = (subjectsData?.data || []).map((s) => s.name);
  const curriculumSyllabuses = (syllabusesData?.data || []).map((s) => s.name);

  const [activeTab, setActiveTab] = useState("overview");
  const [availability, setAvailability] = useState<string[]>([]);
  const [subjectEntries, setSubjectEntries] = useState<ISubjectEntry[]>([]);
  const [syllabus, setSyllabus] = useState<string[]>([]);
  const [slots, setSlots] = useState<ISlotEntry[]>([]);

  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectSyllabi, setNewSubjectSyllabi] = useState<string[]>([]);

  const [newSlotDay, setNewSlotDay] = useState("Monday");
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("10:00");

  useEffect(() => {
    if (profile) {
      setAvailability(profile.availability || []);
      setSubjectEntries(profile.subjectEntries || []);
      setSyllabus(profile.syllabus || []);
      setSlots(profile.slots || []);
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-600 text-sm">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  const roleLabel = profile.role ? profile.role.replace(/_/g, " ").toUpperCase() : "TUTOR";

  const assignedStudents = (profile.assignedStudentIds || []).filter(
    (s): s is IAssignedStudent => typeof s === "object"
  );

  const attendanceLogs = profile.attendance || [];

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const statusColor = (status: string) => {
    if (status === "pending_approval") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "approved") return "bg-green-50 text-green-700 border-green-200";
    if (status === "rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const admissionStatusColor = (status?: string) => {
    if (status === "admission_taken") return "bg-blue-50 text-blue-700 border-blue-200";
    if (status === "course_completed") return "bg-green-50 text-green-700 border-green-200";
    if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const handleSave = () => {
    updateProfile.mutate(
      { availability, subjectEntries, syllabus, slots },
      {
        onSuccess: () => toast.success("Profile updated successfully!"),
        onError: (err: any) => {
          toast.error(err.response?.data?.message || err.message || "Failed to update profile");
        },
      }
    );
  };

  const toggleSyllabus = (syl: string) =>
    setSyllabus((prev) => (prev.includes(syl) ? prev.filter((i) => i !== syl) : [...prev, syl]));

  const addSubjectEntry = () => {
    if (!newSubjectName.trim()) { toast.error("Please enter a subject name."); return; }
    if (subjectEntries.some((s) => s.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
      toast.error("Subject already added."); return;
    }
    setSubjectEntries((prev) => [...prev, { name: newSubjectName.trim(), syllabi: newSubjectSyllabi }]);
    setNewSubjectName("");
    setNewSubjectSyllabi([]);
  };

  const removeSubjectEntry = (index: number) =>
    setSubjectEntries((prev) => prev.filter((_, i) => i !== index));

  const toggleSyllabusForNewSubject = (syl: string) =>
    setNewSubjectSyllabi((prev) => (prev.includes(syl) ? prev.filter((i) => i !== syl) : [...prev, syl]));

  const addSlot = () => {
    if (!newSlotStart || !newSlotEnd) { toast.error("Please enter valid start and end times."); return; }
    setSlots((prev) => [...prev, { day: newSlotDay, startTime: newSlotStart, endTime: newSlotEnd, filled: false }]);
    toast.success("Slot added to draft!");
  };

  const removeSlot = (index: number) =>
    setSlots((prev) => prev.filter((_, i) => i !== index));

  const toggleSlotFilled = (index: number) =>
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, filled: !slot.filled } : slot)));

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <ProfileBanner profile={profile} roleLabel={roleLabel} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
            <TabsTrigger value="overview" className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="subjects" className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:text-white">
              Subjects & Syllabi
            </TabsTrigger>
            <TabsTrigger value="slots" className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:text-white">
              Availability & Slots
            </TabsTrigger>
            <TabsTrigger value="students" className="rounded-lg text-xs px-4 py-2 font-bold data-[state=active]:text-white">
              Students
              {assignedStudents.length > 0 && (
                <span className="ml-1.5 bg-[var(--brand-green)] text-white text-[12px] font-black rounded-full px-1 py-0.5 leading-none">
                  {assignedStudents.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-70 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            {updateProfile.isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <TabsContent value="overview" className="mt-0">
          <ProfileOverviewTab
            profile={profile}
            roleLabel={roleLabel}
            availability={availability}
            assignedStudents={assignedStudents}
            attendanceLogs={attendanceLogs}
            formatDate={formatDate}
            statusColor={statusColor}
          />
        </TabsContent>

        <TabsContent value="subjects" className="mt-0">
          <ProfileSubjectsTab
            syllabus={syllabus}
            toggleSyllabus={toggleSyllabus}
            subjectEntries={subjectEntries}
            removeSubjectEntry={removeSubjectEntry}
            newSubjectName={newSubjectName}
            setNewSubjectName={setNewSubjectName}
            newSubjectSyllabi={newSubjectSyllabi}
            toggleSyllabusForNewSubject={toggleSyllabusForNewSubject}
            addSubjectEntry={addSubjectEntry}
            curriculumSubjects={curriculumSubjects}
            curriculumSyllabuses={curriculumSyllabuses}
          />
        </TabsContent>

        <TabsContent value="slots" className="mt-0">
          <ProfileSlotsTab
            availability={availability}
            setAvailability={setAvailability}
            slots={slots}
            toggleSlotFilled={toggleSlotFilled}
            removeSlot={removeSlot}
            newSlotDay={newSlotDay}
            setNewSlotDay={setNewSlotDay}
            newSlotStart={newSlotStart}
            setNewSlotStart={setNewSlotStart}
            newSlotEnd={newSlotEnd}
            setNewSlotEnd={setNewSlotEnd}
            addSlot={addSlot}
            attendanceLogs={attendanceLogs}
            formatDate={formatDate}
            statusColor={statusColor}
          />
        </TabsContent>

        <TabsContent value="students" className="mt-0">
          <ProfileStudentsTab
            assignedStudents={assignedStudents}
            admissionStatusColor={admissionStatusColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
