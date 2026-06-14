"use client";

import { useState, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Search, Eye, Trash2, Calendar, X, Download, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";
import { GradeCardReport, ReportStudent, calcGrade } from "./TutorReportStats";
import GradeCardPreview from "./GradeCardPreview";
import { IProgressReport, IProgressSubject } from "@/types/tutor/progress";
import { useDeleteProgressReport, useUpdateProgressReport } from "@/querys/tutor/progressQuery";

interface TutorReportHistoryProps {
  apiReports: IProgressReport[];
  students: ReportStudent[];
  isLoading: boolean;
}

function mapToGradeCard(report: IProgressReport, student: ReportStudent | undefined): GradeCardReport {
  const typeName =
    report.reportType === "annual"
      ? "Annual"
      : report.reportType === "five-month"
      ? "5-Month Progress"
      : "Monthly";
  return {
    id: report.id,
    studentId: report.studentId,
    studentName: student?.name ?? "Unknown Student",
    programName: student?.programName ?? "",
    admissionNo: student?.admissionNo ?? "",
    reportType: report.reportType,
    reportTypeName: typeName,
    period: report.academicYear,
    academicYear: report.academicYear,
    examTitle: report.examTitle,
    subjects: report.subjects.map((s) => ({
      subject: s.subjectName,
      faMax: s.fa.maxMarks,
      faScored: s.fa.scoredMarks,
      saMax: s.sa?.maxMarks ?? 0,
      saScored: s.sa?.scoredMarks ?? 0,
    })),
    issueDate: report.createdAt,
    generatedAt: report.createdAt,
  };
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps {
  report: IProgressReport;
  student: ReportStudent | undefined;
  onClose: () => void;
}

interface EditableSubject {
  subject: string;
  faMax: number;
  faScored: number;
  saMax: number;
  saScored: number;
}

function EditReportModal({ report, student, onClose }: EditModalProps) {
  const isAnnual = report.reportType === "annual";
  const updateReport = useUpdateProgressReport();

  const [examTitle, setExamTitle] = useState(report.examTitle);
  const [subjects, setSubjects] = useState<EditableSubject[]>(
    report.subjects.map((s) => ({
      subject: s.subjectName,
      faMax: s.fa.maxMarks,
      faScored: s.fa.scoredMarks,
      saMax: s.sa?.maxMarks ?? 0,
      saScored: s.sa?.scoredMarks ?? 0,
    }))
  );

  function updateSubject(i: number, field: keyof EditableSubject, value: string | number) {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  function addSubject() {
    setSubjects((prev) => [
      ...prev,
      { subject: "", faMax: 0, faScored: 0, saMax: 0, saScored: 0 },
    ]);
  }

  function removeSubject(i: number) {
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    if (!examTitle.trim()) {
      toast.error("Exam title is required.");
      return;
    }
    if (subjects.some((s) => !s.subject.trim())) {
      toast.error("All subject names are required.");
      return;
    }

    const apiSubjects: IProgressSubject[] = subjects.map((s) => {
      const tMax = isAnnual ? s.faMax + s.saMax : s.faMax;
      const tScored = isAnnual ? s.faScored + s.saScored : s.faScored;
      const grade = tMax > 0 ? calcGrade(tScored, tMax) : "E";
      const sub: IProgressSubject = {
        subjectName: s.subject,
        fa: { maxMarks: s.faMax, scoredMarks: s.faScored },
        totalMax: tMax,
        totalScored: tScored,
        grade,
      };
      if (isAnnual) sub.sa = { maxMarks: s.saMax, scoredMarks: s.saScored };
      return sub;
    });

    try {
      await updateReport.mutateAsync({ id: report.id, data: { examTitle, subjects: apiSubjects } });
      toast.success("Report updated successfully.");
      onClose();
    } catch {
      toast.error("Failed to update report.");
    }
  }

  const numFields: { field: keyof EditableSubject; label: string }[] = isAnnual
    ? [
        { field: "faMax", label: "FA Max" },
        { field: "faScored", label: "FA Scored" },
        { field: "saMax", label: "SA Max" },
        { field: "saScored", label: "SA Scored" },
      ]
    : [
        { field: "faMax", label: "FA Max" },
        { field: "faScored", label: "FA Scored" },
      ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <p className="text-sm font-bold text-slate-800">Edit Report</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {student?.name ?? "Unknown Student"} — {report.academicYear}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Exam Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Exam Title
            </label>
            <Input
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="e.g. Annual Examination – 2025-2026"
              className="h-9 border-slate-200 rounded-lg text-sm"
            />
          </div>

          {/* Subjects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Subjects &amp; Marks
              </label>
              <button
                onClick={addSubject}
                className="flex items-center gap-1 text-xs font-semibold text-[var(--brand-green)] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Subject
              </button>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-3 py-2.5 font-bold text-slate-500">Subject</th>
                    {numFields.map((f) => (
                      <th key={f.field} className="text-center px-3 py-2.5 font-bold text-slate-500">
                        {f.label}
                      </th>
                    ))}
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="px-2 py-1.5">
                        <Input
                          value={s.subject}
                          onChange={(e) => updateSubject(i, "subject", e.target.value)}
                          placeholder="Subject name"
                          className="h-8 border-slate-200 rounded-lg text-xs"
                        />
                      </td>
                      {numFields.map((f) => (
                        <td key={f.field} className="px-2 py-1.5">
                          <Input
                            type="number"
                            min={0}
                            value={s[f.field] || ""}
                            onChange={(e) =>
                              updateSubject(i, f.field, parseInt(e.target.value) || 0)
                            }
                            className="h-8 border-slate-200 rounded-lg text-xs text-center"
                          />
                        </td>
                      ))}
                      <td className="px-2 py-1.5 text-center">
                        <button
                          onClick={() => removeSubject(i)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 flex-shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 px-5 rounded-xl text-sm cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateReport.isPending}
            className="h-9 px-5 rounded-xl text-sm bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white cursor-pointer"
          >
            {updateReport.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  monthly: "Monthly",
  "five-month": "5-Month",
  annual: "Annual",
};

const TYPE_BADGE: Record<string, string> = {
  monthly: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "five-month": "bg-indigo-50 text-indigo-700 border-indigo-200",
  annual: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function TutorReportHistory({
  apiReports,
  students,
  isLoading,
}: TutorReportHistoryProps) {
  const { confirm } = useConfirmation();
  const deleteReport = useDeleteProgressReport();
  const previewRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewReport, setViewReport] = useState<GradeCardReport | null>(null);
  const [editReport, setEditReport] = useState<IProgressReport | null>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadPDF() {
    if (!previewRef.current || !viewReport) return;
    setDownloading(true);
    try {
      const PDF_RENDER_WIDTH = 520;
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: PDF_RENDER_WIDTH,
        onclone: (clonedDoc, element) => {
          clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => el.remove());
          clonedDoc.documentElement.style.background = "#ffffff";
          clonedDoc.body.style.background = "#ffffff";
          (element as HTMLElement).style.width = `${PDF_RENDER_WIDTH}px`;
          (element as HTMLElement).style.minWidth = `${PDF_RENDER_WIDTH}px`;
          (element as HTMLElement).style.maxWidth = `${PDF_RENDER_WIDTH}px`;
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const iw = pw - 20;
      const ih = (canvas.height / canvas.width) * iw;
      pdf.addImage(imgData, "PNG", 10, 10, iw, Math.min(ih, ph - 20));
      pdf.save(
        `GradeCard_${viewReport.studentName}_${viewReport.period}.pdf`
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_.-]/g, "")
      );
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF.");
    } finally {
      setDownloading(false);
    }
  }

  const studentMap = new Map(students.map((s) => [s.id, s]));

  const filtered = apiReports.filter((r) => {
    const student = studentMap.get(r.studentId);
    const name = student?.name ?? "";
    const matchSearch =
      name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      r.examTitle.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchType = typeFilter === "all" || r.reportType === typeFilter;
    return matchSearch && matchType;
  });

  function handleDelete(report: IProgressReport) {
    const student = studentMap.get(report.studentId);
    confirm({
      title: "Delete Progress Report",
      message: `Delete ${student?.name ?? "this student"}'s "${report.examTitle}" report? This cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteReport.mutateAsync(report.id);
          toast.success("Report deleted.");
        } catch {
          toast.error("Failed to delete report.");
        }
      },
    });
  }

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <Input
              type="text"
              placeholder="Search by student name or exam title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 h-10 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="w-full md:w-[220px]">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-xs font-semibold">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Report Types</SelectItem>
                <SelectItem value="monthly" className="text-xs">Monthly</SelectItem>
                <SelectItem value="five-month" className="text-xs">5-Month</SelectItem>
                <SelectItem value="annual" className="text-xs">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Table className="table-fixed w-full">
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[26%]">
                    Student
                  </TableHead>
                  <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[13%]">
                    Type
                  </TableHead>
                  <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[28%]">
                    Exam Title
                  </TableHead>
                  <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">
                    Year
                  </TableHead>
                  <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[8%]">
                    Subjects
                  </TableHead>
                  <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((report) => {
                    const student = studentMap.get(report.studentId);
                    return (
                      <TableRow
                        key={report.id}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <TableCell className="px-5 py-3.5">
                          <p className="text-sm font-bold text-slate-750 truncate">
                            {student?.name ?? "Unknown Student"}
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {student?.admissionNo ?? report.studentId}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3.5">
                          <Badge
                            variant="outline"
                            className={`text-xs font-bold border ${TYPE_BADGE[report.reportType] ?? ""}`}
                          >
                            {TYPE_LABEL[report.reportType] ?? report.reportType}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-3.5">
                          <span className="text-xs text-slate-700 font-medium truncate block">
                            {report.examTitle}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3.5">
                          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {report.academicYear}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3.5">
                          <span className="text-sm font-bold text-slate-700">
                            {report.subjects.length}
                          </span>
                        </TableCell>
                        <TableCell className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewReport(mapToGradeCard(report, student))}
                              className="p-1.5 rounded-lg text-[var(--brand-green)] hover:bg-emerald-50 transition-all cursor-pointer"
                              title="View Grade Card"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditReport(report)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                              title="Edit Report"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(report)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete Report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-400 text-sm"
                    >
                      No reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* View Grade Card Modal */}
      {viewReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
              <span className="text-sm font-bold text-slate-800">Grade Card Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloading}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  {downloading ? "Generating…" : "Download PDF"}
                </button>
                <button
                  onClick={() => setViewReport(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-6">
              <div ref={previewRef}>
                <GradeCardPreview report={viewReport} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editReport && (
        <EditReportModal
          report={editReport}
          student={studentMap.get(editReport.studentId)}
          onClose={() => setEditReport(null)}
        />
      )}
    </>
  );
}
