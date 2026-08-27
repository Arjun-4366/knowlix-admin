import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ITimetableEntry } from "@/types/admin/timetable";

interface TimetableListProps {
  entries: ITimetableEntry[];
  onEdit: (entry: ITimetableEntry) => void;
  onDelete: (id: string) => void;
}

export default function TimetableList({ entries, onEdit, onDelete }: TimetableListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <Table className="table-fixed">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="w-[18%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
              Tutor
            </TableHead>
            <TableHead className="w-[26%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
              Students
            </TableHead>
            <TableHead className="w-[16%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
              Subject
            </TableHead>
            <TableHead className="w-[14%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
              Date
            </TableHead>
            <TableHead className="w-[16%] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
              Time
            </TableHead>
            <TableHead className="w-[10%] px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <TableRow key={entry.id} className="transition-colors hover:bg-slate-50/60">
                <TableCell className="px-6 py-4">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {entry.tutorName ?? entry.tutorId}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="truncate text-sm text-slate-700">
                    {entry.studentNames?.length ? entry.studentNames.join(", ") : `${entry.studentIds.length} student(s)`}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="truncate text-sm text-slate-700">
                    {entry.subjectName ?? entry.subjectId}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm text-slate-700">
                    {(() => {
                      try {
                        return format(new Date(entry.date), "MMM d, yyyy");
                      } catch {
                        return entry.date;
                      }
                    })()}
                  </p>
                  {entry.day && <p className="mt-0.5 truncate text-xs text-slate-600">{entry.day}</p>}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm text-slate-700">
                    {entry.startTime} - {entry.endTime}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(entry)}
                      title="Edit slot"
                      className="rounded-lg text-slate-600 hover:bg-slate-50 hover:text-[var(--brand-green)]">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(entry.id)}
                      title="Delete slot"
                      className="rounded-lg text-slate-600 hover:bg-red-50/50 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="px-6 py-16 text-center text-sm text-slate-600">
                No timetable slots found. Add your first slot to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
