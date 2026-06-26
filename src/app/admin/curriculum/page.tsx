"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus, Search, Pencil, Trash2, GraduationCap, Layers, BookOpen, X,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useConfirmation } from "@/context/ConfirmationContext";
import {
  useGetStandards, useCreateStandard, useUpdateStandard, useDeleteStandard,
  useGetSyllabuses, useCreateSyllabus, useUpdateSyllabus, useDeleteSyllabus,
  useGetSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject,
} from "@/querys/admin/curriculumQuery";
import { ICurriculumItem } from "@/types/admin/curriculum";

// ── Add / Edit modal ──────────────────────────────────────────────────────────
interface ItemModalProps {
  title: string;
  placeholder: string;
  defaultValue?: string;
  isPending: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
}

function ItemModal({ title, placeholder, defaultValue = "", isPending, onSave, onClose }: ItemModalProps) {
  const [name, setName] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Name *</label>
            <Input
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              className="h-10"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4 text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !name.trim()}
              className="h-9 bg-[var(--brand-green)] px-5 text-sm font-bold text-white hover:bg-[var(--brand-mid)] disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Tab content panel (table + search + add) ──────────────────────────────────
interface TabPanelProps {
  label: string;
  singularLabel: string;
  placeholder: string;
  items: ICurriculumItem[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  onCreate: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (item: ICurriculumItem) => void;
}

function TabPanel({
  label, singularLabel, placeholder, items, isLoading,
  isCreating, isUpdating, onCreate, onUpdate, onDelete,
}: TabPanelProps) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<ICurriculumItem | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items;
  }, [items, search]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      {/* Filter bar — same pattern as coordinators/mentors pages */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <Input
            placeholder={`Search ${label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 h-10 bg-white border border-slate-200 focus:border-green-500 rounded-xl"
          />
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="h-10 px-4 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm shadow-md shadow-green-600/10 hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add {singularLabel}
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden w-full">
          <Table className="w-full table-fixed">
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[8%]">
                  Sl.
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[52%]">
                  Name
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">
                  Created
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[15%]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="px-6 py-4 text-sm font-semibold text-slate-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-light-green)] text-sm font-bold text-[var(--brand-green)] flex-shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditItem(item)}
                          title={`Edit ${item.name}`}
                          className="rounded-lg text-slate-400 hover:text-[var(--brand-green)] hover:bg-slate-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(item)}
                          title={`Delete ${item.name}`}
                          className="rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">
                    {search
                      ? `No ${label.toLowerCase()} found matching "${search}".`
                      : `No ${label.toLowerCase()} added yet.`}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <ItemModal
          title={`Add ${singularLabel}`}
          placeholder={placeholder}
          isPending={isCreating}
          onSave={(name) => { onCreate(name); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}
      {editItem && (
        <ItemModal
          title={`Edit ${singularLabel}`}
          placeholder={placeholder}
          defaultValue={editItem.name}
          isPending={isUpdating}
          onSave={(name) => { onUpdate(editItem._id, name); setEditItem(null); }}
          onClose={() => setEditItem(null)}
        />
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CurriculumPage() {
  const { confirm } = useConfirmation();

  // Standards
  const { data: stdRes, isLoading: stdLoading } = useGetStandards();
  const { mutateAsync: createStd, isPending: creatingStd } = useCreateStandard();
  const { mutateAsync: updateStd, isPending: updatingStd } = useUpdateStandard();
  const { mutateAsync: deleteStd } = useDeleteStandard();

  // Syllabuses
  const { data: sylRes, isLoading: sylLoading } = useGetSyllabuses();
  const { mutateAsync: createSyl, isPending: creatingSyl } = useCreateSyllabus();
  const { mutateAsync: updateSyl, isPending: updatingSyl } = useUpdateSyllabus();
  const { mutateAsync: deleteSyl } = useDeleteSyllabus();

  // Subjects
  const { data: subRes, isLoading: subLoading } = useGetSubjects();
  const { mutateAsync: createSub, isPending: creatingSub } = useCreateSubject();
  const { mutateAsync: updateSub, isPending: updatingSub } = useUpdateSubject();
  const { mutateAsync: deleteSub } = useDeleteSubject();

  const stdList = stdRes?.data ?? [];
  const sylList = sylRes?.data ?? [];
  const subList = subRes?.data ?? [];

  const handleDelete = (item: ICurriculumItem, mutate: (id: string) => void, entity: string) => {
    confirm({
      title: `Delete ${entity}`,
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => { mutate(item._id); },
    });
  };

  return (
    <div className="space-y-8 w-full relative pb-10">
      <DashboardHeader
        title="Curriculum Management"
        description="Manage the standards, syllabuses, and subjects used across the Knowlix platform."
      />

      {/* Stats cards — same pattern as coordinators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stdLoading || sylLoading || subLoading ? (
          <>
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </>
        ) : (
          <>
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[var(--brand-green)]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stdList.length}</p>
                <p className="text-xs font-semibold text-slate-500">Total Standards</p>
              </div>
            </div>
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{sylList.length}</p>
                <p className="text-xs font-semibold text-slate-500">Total Syllabuses</p>
              </div>
            </div>
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{subList.length}</p>
                <p className="text-xs font-semibold text-slate-500">Total Subjects</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs — exact same pattern as tutors page */}
      <Tabs defaultValue="standards">
        <TabsList className="mb-4 flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          <TabsTrigger
            value="standards"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Standards ({stdList.length})
          </TabsTrigger>
          <TabsTrigger
            value="syllabuses"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Syllabuses ({sylList.length})
          </TabsTrigger>
          <TabsTrigger
            value="subjects"
            className="rounded-lg text-sm px-3 py-1.5 data-[state=active]:shadow-none data-[state=active]:text-white"
          >
            Subjects ({subList.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standards">
          <TabPanel
            label="Standards"
            singularLabel="Standard"
            placeholder='e.g. "Class 10", "Grade 11"'
            items={stdList}
            isLoading={stdLoading}
            isCreating={creatingStd}
            isUpdating={updatingStd}
            onCreate={(name) => createStd({ name })}
            onUpdate={(id, name) => updateStd({ id, data: { name } })}
            onDelete={(item) => handleDelete(item, (id) => deleteStd(id), "Standard")}
          />
        </TabsContent>

        <TabsContent value="syllabuses">
          <TabPanel
            label="Syllabuses"
            singularLabel="Syllabus"
            placeholder='e.g. "CBSE", "IGCSE", "Kerala State"'
            items={sylList}
            isLoading={sylLoading}
            isCreating={creatingSyl}
            isUpdating={updatingSyl}
            onCreate={(name) => createSyl({ name })}
            onUpdate={(id, name) => updateSyl({ id, data: { name } })}
            onDelete={(item) => handleDelete(item, (id) => deleteSyl(id), "Syllabus")}
          />
        </TabsContent>

        <TabsContent value="subjects">
          <TabPanel
            label="Subjects"
            singularLabel="Subject"
            placeholder='e.g. "Mathematics", "Physics"'
            items={subList}
            isLoading={subLoading}
            isCreating={creatingSub}
            isUpdating={updatingSub}
            onCreate={(name) => createSub({ name })}
            onUpdate={(id, name) => updateSub({ id, data: { name } })}
            onDelete={(item) => handleDelete(item, (id) => deleteSub(id), "Subject")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
