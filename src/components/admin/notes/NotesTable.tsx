import { FileText, FileImage, File, Pencil, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INote, NoteStatus } from "@/types/admin/notes";

interface NotesTableProps {
  notes: INote[];
  onEdit: (note: INote) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: NoteStatus) => void;
}

const attachmentIcon = (type: string) => {
  if (type === "image") return <FileImage className="h-3.5 w-3.5" />;
  if (type === "pdf") return <FileText className="h-3.5 w-3.5" />;
  return <File className="h-3.5 w-3.5" />;
};

const statusClass = (status: string) =>
  status === "published"
    ? "bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20"
    : "bg-amber-50 text-amber-700 border-amber-200";

const attachmentClass = (type: string) => {
  if (type === "pdf") return "bg-red-50 text-red-600 border-red-200";
  if (type === "image") return "bg-purple-50 text-purple-600 border-purple-200";
  return "bg-blue-50 text-blue-600 border-blue-200";
};

export default function NotesTable({ notes, onEdit, onDelete, onUpdateStatus }: NotesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <Table className="table-fixed">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[28%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Title
            </TableHead>
            <TableHead className="w-[16%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Subject / Chapter
            </TableHead>
            <TableHead className="w-[14%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Standard / Syllabus
            </TableHead>
            <TableHead className="w-[12%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Type
            </TableHead>
            <TableHead className="w-[12%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Status
            </TableHead>
            <TableHead className="w-[14%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              Tags
            </TableHead>
            <TableHead className="w-[10%] px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {notes.length > 0 ? (
            notes.map((note) => (
              <TableRow key={note.id} className="transition-colors hover:bg-slate-50/60">
                <TableCell className="px-6 py-4">
                  <p className="truncate text-sm font-semibold text-slate-800">{note.title}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-450">{note.description}</p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="truncate text-sm font-semibold text-slate-700">{note.subject}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-450">{note.chapter}</p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm font-semibold text-slate-700">Class {note.standard}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-450">{note.syllabus}</p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex w-fit items-center gap-1 text-xs font-semibold capitalize",
                      attachmentClass(note.attachmentType)
                    )}
                  >
                    {attachmentIcon(note.attachmentType)}
                    {note.attachmentType}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <button
                    onClick={() =>
                      onUpdateStatus(note.id, note.status === "published" ? "draft" : "published")
                    }
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-semibold capitalize transition-opacity hover:opacity-75",
                      statusClass(note.status)
                    )}
                  >
                    {note.status}
                  </button>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-550"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-550">
                        +{note.tags.length - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View file"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-[var(--brand-green)]"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(note)}
                      title="Edit note"
                      className="rounded-lg text-slate-400 hover:bg-slate-50 hover:text-[var(--brand-green)]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(note.id)}
                      title="Delete note"
                      className="rounded-lg text-slate-400 hover:bg-red-50/50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">
                No notes found. Add your first note to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
