"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionCard from "@/components/shared/SectionCard";
import MediaUpload from "@/components/shared/MediaUpload";
import Loader from "@/components/shared/Loader";
import Image from "next/image";
import { ICourse } from "@/types/admin/program";
import { useGetPrograms } from "@/querys/admin/programQuery";
import { useGetCoursesByProgram, useAddCourse, useUpdateCourse, useDeleteCourse } from "@/querys/admin/programQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EMPTY: ICourse = { programId: "", title: "", description: "", grade: "", totalStudentsEnrolled: "", image: "" };

export default function CoursesManager() {
  const { data: progData, isLoading: progsLoading } = useGetPrograms();
  const programs = Array.isArray(progData?.programs) ? progData.programs : [];

  const [filterProgramId, setFilterProgramId] = useState<string>("");
  const activeProgramId = filterProgramId || (programs[0]?.id ?? "");

  const { data, isLoading, isError, error } = useGetCoursesByProgram(activeProgramId);
  const { mutateAsync: doAdd } = useAddCourse();
  const { mutateAsync: doUpdate } = useUpdateCourse();
  const { mutateAsync: doDelete } = useDeleteCourse();
  const { confirm } = useConfirmation();

  const [selected, setSelected] = useState<ICourse | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (progsLoading) return <Loader text="Loading programs…" />;

  const courses = Array.isArray(data?.courses) ? data.courses : [];

  const openModal = (c: ICourse | null = null) => {
    setSelected(c ?? { ...EMPTY, programId: activeProgramId });
    setOpen(true);
  };
  const closeModal = () => { setSelected(null); setOpen(false); };

  const handleSave = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      if (selected.id) await doUpdate({ id: selected.id, data: selected });
      else await doAdd(selected);
      closeModal();
    } finally { setBusy(false); }
  };

  const handleDelete = (id: string) =>
    confirm({
      title: "Delete Course", confirmText: "Delete", variant: "danger",
      message: "This will permanently remove the course.",
      onConfirm: async () => { try { await doDelete(id); } catch { } },
    });

  const set = <K extends keyof ICourse>(k: K, v: ICourse[K]) =>
    setSelected((c) => c ? { ...c, [k]: v } : c);

  return (
    <SectionCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Courses ({isLoading ? "…" : courses.length})
          </h3>
          {/* Program filter */}
          {programs.length > 0 && (
            <Select value={activeProgramId} onValueChange={setFilterProgramId}>
              <SelectTrigger className="h-8 text-xs w-52 border-gray-200">
                <SelectValue placeholder="Select program…" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.id} value={p.id!}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-xs font-bold rounded-xl hover:bg-[#15803d] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Loading / Error / Empty */}
      {isLoading && <Loader text="Fetching courses…" />}
      {isError && (
        <div className="py-10 text-center text-red-500 text-sm">
          Failed to load courses: {(error as any)?.message}
        </div>
      )}
      {!isLoading && !isError && programs.length === 0 && (
        <p className="py-10 text-center text-gray-400 italic text-sm">
          Create a program first before adding courses.
        </p>
      )}

      {/* Table */}
      {!isLoading && !isError && programs.length > 0 && (
        <div className="overflow-x-auto -mx-6">
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              <TableRow className="bg-gray-50 border-y border-gray-100">
                {["Course", "Grade", "Students", "Actions"].map((h) => (
                  <TableHead key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {courses.map((c) => (
                <TableRow key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                        {typeof c.image === "string" && c.image
                          ? <Image src={c.image} alt={c.title} fill className="object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-gray-300" /></div>
                        }
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{c.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{c.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500">{c.grade}</TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500">{c.totalStudentsEnrolled}</TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openModal(c)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => c.id && handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    No courses for this program yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal */}
      {open && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">{selected.id ? "Edit Course" : "Add Course"}</h3>
              <button onClick={closeModal} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">Parent Program</Label>
                <Select value={selected.programId} onValueChange={(v) => set("programId", v)}>
                  <SelectTrigger><SelectValue placeholder="Select a program…" /></SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.id!}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">Title</Label>
                  <Input value={selected.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Coding" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">Grade</Label>
                  <Input value={selected.grade} onChange={(e) => set("grade", e.target.value)} placeholder="e.g. 10-12 Students" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">Description</Label>
                <Textarea rows={3} className="resize-none" value={selected.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief course description…" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">Total Students Enrolled</Label>
                <Input value={selected.totalStudentsEnrolled} onChange={(e) => set("totalStudentsEnrolled", e.target.value)} placeholder="e.g. 100+" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-600">Course Image</Label>
                <MediaUpload value={selected.image} onChange={(v) => set("image", v)} ratio="video" accept="image/*" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={busy} className="px-6 py-2 bg-[#16a34a] text-white text-sm font-semibold rounded-lg hover:bg-[#15803d] transition-colors disabled:opacity-50">
                {busy ? "Saving…" : "Save Course"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
