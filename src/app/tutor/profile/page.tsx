"use client";

import { useState, useEffect } from "react";
import { useGetTutorProfile, useUpdateTutorProfile } from "@/querys/tutor/profileQuery";
import { ISubjectEntry, ISlotEntry } from "@/types/tutor/profile";
import {
  User, Mail, Phone, Calendar, Award, Star, BookOpen, Clock,
  Plus, Trash2, Save, Sparkles, Check, CheckCircle2, ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SYLLABUS_OPTIONS = ["CBSE", "ICSE", "IGCSE", "IB", "State"];
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TutorProfilePage() {
  const { data: profile, isLoading } = useGetTutorProfile();
  const updateProfile = useUpdateTutorProfile();

  // Form states
  const [activeTab, setActiveTab] = useState("overview");
  const [availability, setAvailability] = useState("");
  const [subjectEntries, setSubjectEntries] = useState<ISubjectEntry[]>([]);
  const [syllabus, setSyllabus] = useState<string[]>([]);
  const [slots, setSlots] = useState<ISlotEntry[]>([]);

  // Subject Entries edit helper states
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectSyllabi, setNewSubjectSyllabi] = useState<string[]>([]);

  // Slots edit helper states
  const [newSlotDay, setNewSlotDay] = useState("Monday");
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("10:00");
  const [newSlotFilled, setNewSlotFilled] = useState(false);

  // Sync profile data to local state once loaded
  useEffect(() => {
    if (profile) {
      setAvailability(profile.availability || "");
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
        <p className="text-gray-500 text-sm">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  // Handle Save
  const handleSave = () => {
    updateProfile.mutate(
      {
        availability,
        subjectEntries,
        syllabus,
        slots,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || err.message || "Failed to update profile");
        },
      }
    );
  };

  // Syllabus list toggler
  const toggleSyllabus = (syl: string) => {
    setSyllabus((prev) =>
      prev.includes(syl) ? prev.filter((item) => item !== syl) : [...prev, syl]
    );
  };

  // Subject Entry additions/removals
  const addSubjectEntry = () => {
    if (!newSubjectName.trim()) {
      toast.error("Please enter a subject name.");
      return;
    }
    if (subjectEntries.some((s) => s.name.toLowerCase() === newSubjectName.trim().toLowerCase())) {
      toast.error("Subject already added.");
      return;
    }
    setSubjectEntries((prev) => [
      ...prev,
      { name: newSubjectName.trim(), syllabi: newSubjectSyllabi },
    ]);
    setNewSubjectName("");
    setNewSubjectSyllabi([]);
  };

  const removeSubjectEntry = (index: number) => {
    setSubjectEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSyllabusForNewSubject = (syl: string) => {
    setNewSubjectSyllabi((prev) =>
      prev.includes(syl) ? prev.filter((item) => item !== syl) : [...prev, syl]
    );
  };

  // Slots additions/removals
  const addSlot = () => {
    if (!newSlotStart || !newSlotEnd) {
      toast.error("Please enter valid start and end times.");
      return;
    }
    setSlots((prev) => [
      ...prev,
      {
        day: newSlotDay,
        startTime: newSlotStart,
        endTime: newSlotEnd,
        filled: newSlotFilled,
      },
    ]);
    // reset slot form helper
    setNewSlotFilled(false);
    toast.success("Slot added to draft!");
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSlotFilled = (index: number) => {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, filled: !slot.filled } : slot))
    );
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      
      {/* ── Tutor Banner Card ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        {/* <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 pointer-events-none bg-[var(--brand-green)] -mr-8 -mt-8" /> */}
        
        {/* Profile Avatar placeholder */}
        <div className="w-20 h-20 rounded-full bg-[var(--brand-light-green)]/15 border-2 border-[var(--brand-green)]/20 flex items-center justify-center font-black text-[var(--brand-green)] text-3xl flex-shrink-0">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 text-center md:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-xl font-bold text-slate-800">{profile.name}</h1>
            <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 font-bold capitalize text-[10px] py-0.5 px-2 rounded-full">
              {profile.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-semibold flex items-center justify-center md:justify-start gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand-green)]" />
            {profile.role.replace("_", " ").toUpperCase()}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 font-medium pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {profile.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> {profile.phone}
            </span>
          </div>
        </div>

        {/* Sidebar right stats */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-xl self-stretch justify-around md:self-auto flex-shrink-0 min-w-[200px]">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Star className="w-4 h-4 fill-[var(--brand-green)] text-[var(--brand-green)]" />
              <span className="text-lg font-extrabold text-slate-800">{profile.growthPoints}</span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Growth Points</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-lg font-extrabold text-slate-800">{profile.performanceScore}</span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Performance</p>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
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
          </TabsList>

          {/* Save Action */}
          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-70 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            {updateProfile.isPending ? "Saving Draft…" : "Save Changes"}
          </button>
        </div>

        {/* ── TAB CONTENT: OVERVIEW ── */}
        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-slate-150 shadow-sm md:col-span-2">
              <CardHeader className="p-6 pb-3 border-b border-slate-100">
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--brand-green)]" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Full Name</Label>
                    <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.name}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Email Address</Label>
                    <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.email}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Phone Number</Label>
                    <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.phone || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Teaching Experience</Label>
                    <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{profile.experience || "N/A"}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Availability Description</Label>
                  <p className="text-sm font-semibold text-slate-700 mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{availability || "No availability configured yet."}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-150 shadow-sm">
              <CardHeader className="p-6 pb-3 border-b border-slate-100">
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--brand-green)]" /> System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</Label>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-green)]" />
                    {profile.role.replace("_", " ").toUpperCase()}
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member Since</Label>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Assigned Permissions</Label>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Upload Study Notes</span>
                      <Badge variant="outline" className={profile.permissions.canUploadNotes ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"}>
                        {profile.permissions.canUploadNotes ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Edit Notes & Resources</span>
                      <Badge variant="outline" className={profile.permissions.canEditNotes ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"}>
                        {profile.permissions.canEditNotes ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Share Material with Students</span>
                      <Badge variant="outline" className={profile.permissions.canShareMaterial ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-400 border-slate-200"}>
                        {profile.permissions.canShareMaterial ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── TAB CONTENT: SUBJECTS & SYLLABI ── */}
        <TabsContent value="subjects" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* General Syllabus selection */}
            <Card className="bg-white border-slate-150 shadow-sm md:col-span-1">
              <CardHeader className="p-6 pb-3 border-b border-slate-100">
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--brand-green)]" /> General Syllabi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-xs text-slate-400 leading-normal">Select curriculum boards you are authorized to teach.</p>
                <div className="space-y-2.5 pt-2">
                  {SYLLABUS_OPTIONS.map((option) => {
                    const isChecked = syllabus.includes(option);
                    return (
                      <div
                        key={option}
                        onClick={() => toggleSyllabus(option)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "bg-[var(--brand-light-green)]/10 border-[var(--brand-green)]/40 text-[var(--brand-green)]"
                            : "bg-white border-slate-200 hover:border-slate-350 text-slate-600"
                        }`}
                      >
                        <span className="text-xs font-bold">{option} Curriculum</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isChecked ? "bg-[var(--brand-green)] border-transparent" : "border-slate-300"
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Subject Entries selection */}
            <Card className="bg-white border-slate-150 shadow-sm md:col-span-2">
              <CardHeader className="p-6 pb-3 border-b border-slate-100">
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--brand-green)]" /> Subject Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Current Subject list */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configured Subjects</Label>
                  {subjectEntries.length === 0 ? (
                    <p className="text-xs text-gray-500 py-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">No subjects configured. Add one below!</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subjectEntries.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3.5 bg-slate-55/40 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-800 truncate">{entry.name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {entry.syllabi.map((syl) => (
                                <Badge key={syl} variant="secondary" className="text-[9px] font-semibold py-0 px-1.5 rounded-md bg-slate-200/60 text-slate-600">
                                  {syl}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSubjectEntry(index)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                            title="Remove subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add new subject entry */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <Label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Add Subject</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="sm:col-span-1 space-y-1.5">
                      <Label htmlFor="subjectName" className="text-xs font-semibold text-slate-500">Subject Name</Label>
                      <Input
                        id="subjectName"
                        placeholder="e.g. Mathematics"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="sm:col-span-1 space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-500 block mb-1">Target Syllabi</Label>
                      <div className="flex flex-wrap gap-1">
                        {SYLLABUS_OPTIONS.map((syl) => {
                          const isNewSelected = newSubjectSyllabi.includes(syl);
                          return (
                            <button
                              key={syl}
                              type="button"
                              onClick={() => toggleSyllabusForNewSubject(syl)}
                              className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-all ${
                                isNewSelected
                                  ? "bg-[var(--brand-green)] border-transparent text-white"
                                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-350"
                              }`}
                            >
                              {syl}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <button
                        type="button"
                        onClick={addSubjectEntry}
                        className="w-full flex items-center justify-center gap-1.5 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add Subject
                      </button>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* ── TAB CONTENT: AVAILABILITY & SLOTS ── */}
        <TabsContent value="slots" className="mt-0 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Availability card */}
            <Card className="bg-white border-slate-150 shadow-sm md:col-span-1">
              <CardHeader className="p-6 pb-3 border-b border-slate-100">
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--brand-green)]" /> Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="availabilityInput" className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Availability Statement</Label>
                  <Input
                    id="availabilityInput"
                    placeholder="e.g. Weekdays 9 AM - 6 PM"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="border-slate-200"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    This displays on your public tutor profile cards so coordinators and parents know your general time slots at a glance.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Slots card */}
            <Card className="bg-white border-slate-150 shadow-sm md:col-span-2">
              <CardHeader className="p-6 pb-3 border-b border-slate-100">
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--brand-green)]" /> Schedule Slots
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Current slots list */}
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Draft Slots</Label>
                  {slots.length === 0 ? (
                    <p className="text-xs text-gray-500 py-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">No slot schedule set. Create one below!</p>
                  ) : (
                    <div className="overflow-x-auto border border-slate-100 rounded-xl bg-slate-50/30">
                      <Table className="min-w-full divide-y divide-slate-100">
                        <TableHeader className="bg-slate-50">
                          <TableRow>
                            <TableHead className="px-4 py-2.5 text-left text-[9px] font-bold text-slate-500 uppercase tracking-wider">Day</TableHead>
                            <TableHead className="px-4 py-2.5 text-left text-[9px] font-bold text-slate-500 uppercase tracking-wider">Timings</TableHead>
                            <TableHead className="px-4 py-2.5 text-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
                            <TableHead className="px-4 py-2.5 text-right text-[9px] font-bold text-slate-500 uppercase tracking-wider">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-slate-100 bg-white">
                          {slots.map((slot, index) => (
                            <TableRow key={index} className="hover:bg-slate-50/35 transition-colors">
                              <TableCell className="px-4 py-3 whitespace-nowrap text-xs font-bold text-slate-700">{slot.day}</TableCell>
                              <TableCell className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 font-medium">
                                <span className="font-bold text-[var(--brand-green)]">{slot.startTime}</span> - <span className="font-bold text-[var(--brand-green)]">{slot.endTime}</span>
                              </TableCell>
                              <TableCell className="px-4 py-3 whitespace-nowrap text-center">
                                <Badge
                                  onClick={() => toggleSlotFilled(index)}
                                  variant="outline"
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer capitalize select-none ${
                                    slot.filled
                                      ? "bg-slate-100 text-slate-550 border-slate-250 hover:bg-slate-200"
                                      : "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 hover:bg-[var(--brand-light-green)]/30"
                                  }`}
                                >
                                  {slot.filled ? "Filled / Booked" : "Available"}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-4 py-3 whitespace-nowrap text-right text-xs">
                                <button
                                  type="button"
                                  onClick={() => removeSlot(index)}
                                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"
                                  title="Remove slot"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {/* Add new slots form */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <Label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Add Slot Time</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="space-y-1.5">
                      <Label htmlFor="slotDay" className="text-xs font-semibold text-slate-500">Day</Label>
                      <Select value={newSlotDay} onValueChange={setNewSlotDay}>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue placeholder="Select Day" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-slate-150 rounded-xl shadow-lg">
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="startTime" className="text-xs font-semibold text-slate-500">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newSlotStart}
                        onChange={(e) => setNewSlotStart(e.target.value)}
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="endTime" className="text-xs font-semibold text-slate-500">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newSlotEnd}
                        onChange={(e) => setNewSlotEnd(e.target.value)}
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5 flex items-center justify-between sm:justify-start gap-4">
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="slotFilled" className="text-xs font-semibold text-slate-500">Is Booked?</Label>
                        <p className="text-[9px] text-slate-400">Mark as booked</p>
                      </div>
                      <Switch
                        id="slotFilled"
                        checked={newSlotFilled}
                        onCheckedChange={setNewSlotFilled}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addSlot}
                      className="flex items-center gap-1.5 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Slot to Schedule
                    </button>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

        </TabsContent>
      </Tabs>

    </div>
  );
}
