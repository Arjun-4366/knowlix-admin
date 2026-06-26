"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Plus, Search, RotateCcw } from "lucide-react";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import NoteForm from "@/components/admin/notes/NoteForm";
import NotesTable from "@/components/admin/notes/NotesTable";
import NotesTableSkeleton from "@/components/admin/notes/NotesTableSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirmation } from "@/context/ConfirmationContext";
import {
  useCreateNote,
  useDeleteNote,
  useGetNotes,
  useGetNotesFilters,
  useUpdateNote,
} from "@/querys/admin/notesQuery";
import { ICreateNotePayload, INote, NoteStatus } from "@/types/admin/notes";

function NotesContent() {
  const { confirm } = useConfirmation();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterStandard, setFilterStandard] = useState("all");
  const [filterSyllabus, setFilterSyllabus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterChapter, setFilterChapter] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAttachmentType, setFilterAttachmentType] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<INote | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (filterStandard !== "all") params.standard = filterStandard;
    if (filterSyllabus !== "all") params.syllabus = filterSyllabus;
    if (filterSubject !== "all") params.subject = filterSubject;
    if (filterChapter !== "all") params.chapter = filterChapter;
    if (filterStatus !== "all") params.status = filterStatus;
    if (filterAttachmentType !== "all")
      params.attachmentType = filterAttachmentType;
    return params;
  }, [
    debouncedSearch,
    filterStandard,
    filterSyllabus,
    filterSubject,
    filterChapter,
    filterStatus,
    filterAttachmentType,
  ]);

  const { data: filtersResponse } = useGetNotesFilters();
  const { data: chapterFiltersResponse } = useGetNotesFilters(
    filterSubject !== "all" ? { subject: filterSubject } : undefined,
  );
  const { data: notesResponse, isLoading } = useGetNotes(queryParams);
  const { mutateAsync: createNote, isPending: isCreating } = useCreateNote();
  const { mutateAsync: updateNote, isPending: isUpdating } = useUpdateNote();
  const { mutateAsync: deleteNote } = useDeleteNote();

  const filters = filtersResponse?.data;
  const notes = notesResponse?.data ?? [];
  const total = notesResponse?.pagination?.total ?? notes.length;

  const handleFormSubmit = async (payload: ICreateNotePayload) => {
    try {
      if (noteToEdit) {
        await updateNote({ id: noteToEdit.id, data: payload });
      } else {
        await createNote(payload);
      }
      setIsModalOpen(false);
      setNoteToEdit(null);
    } catch {
      // toast handled in query
    }
  };

  const handleEdit = (note: INote) => {
    setNoteToEdit(note);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const note = notes.find((n) => n.id === id);
    confirm({
      title: "Delete Note",
      message: `Are you sure you want to delete "${note?.title ?? "this note"}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteNote(id);
        } catch {
          // toast handled in query
        }
      },
    });
  };

  const handleUpdateStatus = async (id: string, status: NoteStatus) => {
    try {
      await updateNote({ id, data: { status } });
    } catch {
      // toast handled in query
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNoteToEdit(null);
  };

  // Reset chapter when subject changes
  const handleSubjectChange = (value: string) => {
    setFilterSubject(value);
    setFilterChapter("all");
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setFilterStandard("all");
    setFilterSyllabus("all");
    setFilterSubject("all");
    setFilterChapter("all");
    setFilterStatus("all");
    setFilterAttachmentType("all");
  };

  const actions = (
    <Button
      onClick={() => setIsModalOpen(true)}
      className="h-10 bg-[var(--brand-green)] px-4 text-sm font-bold text-white shadow-md shadow-green-600/10 transition-all hover:bg-[var(--brand-mid)] hover:shadow-lg">
      <Plus className="mr-1.5 h-4 w-4" />
      Add Note
    </Button>
  );

  return (
    <div className="relative w-full space-y-8 pb-10">
      <DashboardHeader
        title="Notes Library"
        description={`Manage study notes and resources across all standards and subjects. Total: ${isLoading ? "..." : total}`}
        actions={actions}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title, subject, chapter..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={filterStandard} onValueChange={setFilterStandard}>
            <SelectTrigger className="h-10 w-[140px] bg-white">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {filters?.standards.map((s) => (
                <SelectItem key={s} value={s}>
                  Class {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSyllabus} onValueChange={setFilterSyllabus}>
            <SelectTrigger className="h-10 w-[150px] bg-white">
              <SelectValue placeholder="Syllabus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Syllabi</SelectItem>
              {filters?.syllabuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterSubject} onValueChange={handleSubjectChange}>
            <SelectTrigger className="h-10 w-[150px] bg-white">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {filters?.subjects.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterChapter} onValueChange={setFilterChapter}>
            <SelectTrigger className="h-10 w-[170px] bg-white">
              <SelectValue placeholder="Chapter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chapters</SelectItem>
              {(
                chapterFiltersResponse?.data?.chapters ??
                filters?.chapters ??
                []
              ).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterAttachmentType}
            onValueChange={setFilterAttachmentType}>
            <SelectTrigger className="h-10 w-[130px] bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-10 w-[130px] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            disabled={
              searchInput === "" &&
              filterStandard === "all" &&
              filterSyllabus === "all" &&
              filterSubject === "all" &&
              filterChapter === "all" &&
              filterStatus === "all" &&
              filterAttachmentType === "all"
            }
            className="h-8 px-3 bg-white border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl disabled:opacity-40"
            title="Reset filters">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <NotesTableSkeleton />
      ) : (
        <NotesTable
          notes={notes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <NoteForm
            noteToEdit={noteToEdit ?? undefined}
            isSubmitting={isCreating || isUpdating}
            onSubmit={handleFormSubmit}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-green)] border-t-transparent" />
        </div>
      }>
      <NotesContent />
    </Suspense>
  );
}
