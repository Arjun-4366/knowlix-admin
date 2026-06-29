"use client";

import { useRef, useState } from "react";
import { ExternalLink, Upload, X, PenLine, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonLoader } from "@/components/shared/Loader";
import { useGetNotesFilters } from "@/querys/admin/notesQuery";
import { useGetStandards, useGetSyllabuses, useGetSubjects } from "@/querys/admin/curriculumQuery";
import { ICreateNotePayload, INote, IUpdateNotePayload, NoteStatus } from "@/types/admin/notes";

interface NoteFormProps {
  noteToEdit?: INote;
  isSubmitting: boolean;
  onSubmit: (data: ICreateNotePayload | IUpdateNotePayload) => void;
  onClose: () => void;
}

export default function NoteForm({ noteToEdit, isSubmitting, onSubmit, onClose }: NoteFormProps) {
  const isEdit = !!noteToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(noteToEdit?.title ?? "");
  const [description, setDescription] = useState(noteToEdit?.description ?? "");
  const [content, setContent] = useState(noteToEdit?.content ?? "");
  const [standardId, setStandardId] = useState(noteToEdit?.standardId ?? "");
  const [syllabusId, setSyllabusId] = useState(noteToEdit?.syllabusId ?? "");
  const [subjectId, setSubjectId] = useState(noteToEdit?.subjectId ?? "");
  const [chapter, setChapter] = useState(noteToEdit?.chapter ?? "");
  const [chapterMode, setChapterMode] = useState<"select" | "manual">("select");
  const [status, setStatus] = useState<NoteStatus>(noteToEdit?.status ?? "published");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const existingFileUrls = noteToEdit?.fileUrls ?? [];
  const [tags, setTags] = useState<string[]>(() => {
    const raw = noteToEdit?.tags;
    if (!raw) return [];
    if (Array.isArray(raw)) {
      // Detect comma-split JSON: server stored JSON.stringify(array) then split by ","
      // First element would start with '["' in that case
      if (raw.length > 0 && typeof raw[0] === "string" && raw[0].startsWith('["')) {
        try {
          const parsed = JSON.parse(raw.join(","));
          return Array.isArray(parsed) ? parsed : raw;
        } catch { return raw; }
      }
      return raw;
    }
    if (typeof raw === "string") {
      try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
    }
    return [];
  });
  const [tagInput, setTagInput] = useState("");

  const { data: standardsResponse, isLoading: loadingStandards } = useGetStandards();
  const { data: syllabusesResponse, isLoading: loadingSyllabuses } = useGetSyllabuses();
  const { data: subjectsResponse, isLoading: loadingSubjects } = useGetSubjects();

  const standardOptions = standardsResponse?.data ?? [];
  const syllabusOptions = syllabusesResponse?.data ?? [];
  const subjectOptions = subjectsResponse?.data ?? [];

  const isCurriculumLoading = loadingStandards || loadingSyllabuses || loadingSubjects;

  const { data: chapterFiltersResponse, isLoading: loadingChapters } = useGetNotesFilters(
    subjectId ? { subjectId } : undefined,
  );
  const availableChapters = chapterFiltersResponse?.data?.chapters ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setSelectedFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubjectChange = (value: string) => {
    setSubjectId(value);
    setChapter("");
  };

  const handleChapterModeChange = (mode: "select" | "manual") => {
    setChapterMode(mode);
    setChapter("");
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit && selectedFiles.length === 0) return;
    onSubmit({ title, description, content, standardId, syllabusId, subjectId, chapter, status, tags, files: selectedFiles });
  };

  return (
    <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? "Edit Note" : "Add New Note"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            {isEdit ? "Update the note details below" : "Fill in the details to publish a new note"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">

          {/* Skeleton while curriculum data loads */}
          {isCurriculumLoading ? (
            <div className="space-y-5 animate-pulse">
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-20 rounded-xl bg-slate-100" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 rounded-xl bg-slate-100" />
                <div className="h-10 rounded-xl bg-slate-100" />
              </div>
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
              <div className="h-10 rounded-xl bg-slate-100" />
            </div>
          ) : (
            <>
              {/* Title */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Title *</Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Quadratic Equations"
                  className="h-10"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of this note"
                  rows={4}
                  className="resize"
                />
              </div>

              {/* Standard + Syllabus */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">Standard *</Label>
                  <Select required value={standardId} onValueChange={setStandardId}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardOptions.length > 0 ? (
                        standardOptions.map((s) => (
                          <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-xs text-slate-600">No standards found</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">Syllabus *</Label>
                  <Select required value={syllabusId} onValueChange={setSyllabusId}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select syllabus" />
                    </SelectTrigger>
                    <SelectContent>
                      {syllabusOptions.length > 0 ? (
                        syllabusOptions.map((s) => (
                          <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-xs text-slate-600">No syllabuses found</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Subject *</Label>
                <Select required value={subjectId} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.length > 0 ? (
                      subjectOptions.map((s) => (
                        <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-center text-xs text-slate-600">No subjects found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Chapter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-600">Chapter *</Label>
                  <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => handleChapterModeChange("select")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        chapterMode === "select"
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-600 hover:text-slate-700"
                      }`}
                    >
                      <List className="h-3 w-3" />
                      Select existing
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChapterModeChange("manual")}
                      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        chapterMode === "manual"
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-600 hover:text-slate-700"
                      }`}
                    >
                      <PenLine className="h-3 w-3" />
                      Add new
                    </button>
                  </div>
                </div>

                {chapterMode === "select" ? (
                  <>
                    {loadingChapters && subjectId ? (
                      <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--brand-green)]" />
                        <span className="text-xs text-slate-600">Loading chapters...</span>
                      </div>
                    ) : (
                      <>
                        <Select
                          value={chapter}
                          onValueChange={setChapter}
                          disabled={!subjectId || availableChapters.length === 0}
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue
                              placeholder={
                                !subjectId
                                  ? "Select a subject first"
                                  : availableChapters.length === 0
                                    ? "No chapters available"
                                    : "Select chapter"
                              }
                            />
                          </SelectTrigger>
                          {availableChapters.length > 0 && (
                            <SelectContent>
                              {availableChapters.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          )}
                        </Select>
                        {subjectId && !loadingChapters && availableChapters.length === 0 && (
                          <p className="text-xs text-amber-500 font-medium">
                            No chapters found for this subject. Switch to &quot;Add new&quot; to create one.
                          </p>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <Input
                    required
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. Polynomials, Organic Chemistry..."
                    className="h-10"
                  />
                )}
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as NoteStatus)}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">
                  Files {!isEdit && "*"}
                </Label>

                {isEdit && existingFileUrls.length > 0 && selectedFiles.length === 0 && (
                  <div className="space-y-1.5">
                    {existingFileUrls.map((url) => {
                      const name = (() => { try { return decodeURIComponent(url).split("/").pop() || "File"; } catch { return "File"; } })();
                      return (
                        <div key={url} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5">
                          <p className="truncate text-xs font-medium text-slate-600">{name}</p>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 flex-shrink-0 text-[var(--brand-green)] transition-opacity hover:opacity-70"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      );
                    })}
                    <p className="text-xs text-slate-400">Choose new files below to replace all</p>
                  </div>
                )}

                {selectedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-[var(--brand-light)]/30 bg-[var(--brand-light-green)] px-3.5 py-2.5">
                        <p className="truncate text-xs font-semibold text-[var(--brand-mid)]">{file.name}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(i)}
                          className="ml-3 flex-shrink-0 text-slate-600 transition-colors hover:text-red-500"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="note-file-upload"
                />
                <label
                  htmlFor="note-file-upload"
                  className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 transition-colors hover:border-[var(--brand-green)] hover:text-[var(--brand-green)]"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {isEdit ? "Replace all files" : "Choose files"}
                </label>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Tags</Label>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-[var(--brand-light-green)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-mid)]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-0.5 rounded-full text-[var(--brand-mid)] opacity-60 hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder="Type a tag and press Enter"
                    className="h-10 flex-1"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    className="h-10 rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-600 transition-colors hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Full content or notes body..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4 text-sm">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || (!isEdit && selectedFiles.length === 0)}
            className="h-9 bg-[var(--brand-green)] px-5 text-sm font-bold text-white shadow-md shadow-green-600/10 hover:bg-[var(--brand-mid)] disabled:opacity-50"
          >
            {isSubmitting ? <ButtonLoader /> : isEdit ? "Save Changes" : "Create Note"}
          </Button>
        </div>
      </form>
    </div>
  );
}
