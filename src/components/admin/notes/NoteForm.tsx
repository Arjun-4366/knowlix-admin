"use client";

import { useRef, useState } from "react";
import { ExternalLink, Upload, X } from "lucide-react";
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
import { ICreateNotePayload, INote, NoteStatus } from "@/types/admin/notes";

interface NoteFormProps {
  noteToEdit?: INote;
  isSubmitting: boolean;
  onSubmit: (data: ICreateNotePayload) => void;
  onClose: () => void;
}

export default function NoteForm({ noteToEdit, isSubmitting, onSubmit, onClose }: NoteFormProps) {
  const isEdit = !!noteToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: filtersResponse } = useGetNotesFilters();
  const filters = filtersResponse?.data;

  const [title, setTitle] = useState(noteToEdit?.title ?? "");
  const [description, setDescription] = useState(noteToEdit?.description ?? "");
  const [content, setContent] = useState(noteToEdit?.content ?? "");
  const [standard, setStandard] = useState(noteToEdit?.standard ?? "");
  const [syllabus, setSyllabus] = useState(noteToEdit?.syllabus ?? "");
  const [subject, setSubject] = useState(noteToEdit?.subject ?? "");
  const [chapter, setChapter] = useState(noteToEdit?.chapter ?? "");
  const [status, setStatus] = useState<NoteStatus>(noteToEdit?.status ?? "draft");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(noteToEdit?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const existingFileUrl = noteToEdit?.fileUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    if (!isEdit && !selectedFile) return;

    onSubmit({
      title,
      description,
      content,
      standard,
      syllabus,
      subject,
      chapter,
      status,
      tags,
      file: selectedFile as File,
    });
  };

  const fileLabel = selectedFile
    ? selectedFile.name
    : existingFileUrl
      ? (() => {
          try {
            const parts = decodeURIComponent(existingFileUrl).split("/");
            return parts[parts.length - 1] || "Current file";
          } catch {
            return "Current file";
          }
        })()
      : null;

  return (
    <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? "Edit Note" : "Add New Note"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-450">
            {isEdit
              ? "Update the note details below"
              : "Fill in the details to publish a new note"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
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
              <Select required value={standard} onValueChange={setStandard}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {filters?.standards.map((s) => (
                    <SelectItem key={s} value={s}>
                      Class {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Syllabus *</Label>
              <Select required value={syllabus} onValueChange={setSyllabus}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select syllabus" />
                </SelectTrigger>
                <SelectContent>
                  {filters?.syllabuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject + Chapter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Subject *</Label>
              <Select required value={subject} onValueChange={setSubject}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {filters?.subjects.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Chapter *</Label>
              <Select required value={chapter} onValueChange={setChapter}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  {filters?.chapters.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              File {!isEdit && "*"}
              {isEdit && (
                <span className="ml-1 font-normal text-slate-400">(upload to replace)</span>
              )}
            </Label>

            {/* Show existing file in edit mode */}
            {isEdit && existingFileUrl && !selectedFile && (
              <div className="flex items-center justify-between rounded-xl border border-slate-150 bg-slate-50/60 px-3.5 py-2.5">
                <p className="truncate text-xs font-medium text-slate-600">{fileLabel}</p>
                <a
                  href={existingFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 flex-shrink-0 text-[var(--brand-green)] transition-opacity hover:opacity-70"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            {/* Selected new file preview */}
            {selectedFile && (
              <div className="flex items-center justify-between rounded-xl border border-[var(--brand-light)]/30 bg-[var(--brand-light-green)] px-3.5 py-2.5">
                <p className="truncate text-xs font-semibold text-[var(--brand-mid)]">
                  {selectedFile.name}
                </p>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-3 flex-shrink-0 text-slate-400 transition-colors hover:text-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="hidden"
              id="note-file-upload"
            />
            <label
              htmlFor="note-file-upload"
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-500 transition-colors hover:border-[var(--brand-green)] hover:text-[var(--brand-green)]"
            >
              <Upload className="h-3.5 w-3.5" />
              {selectedFile ? "Replace file" : "Choose file"}
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose} className="h-9 px-4 text-sm">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || (!isEdit && !selectedFile)}
            className="h-9 bg-[var(--brand-green)] px-5 text-sm font-bold text-white shadow-md shadow-green-600/10 hover:bg-[var(--brand-mid)] disabled:opacity-50"
          >
            {isSubmitting ? <ButtonLoader /> : isEdit ? "Save Changes" : "Create Note"}
          </Button>
        </div>
      </form>
    </div>
  );
}
