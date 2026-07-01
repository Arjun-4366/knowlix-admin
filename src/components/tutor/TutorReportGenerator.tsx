"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Download, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import { GradeCardReport, SubjectMark, ReportStudent, calcGrade } from "./TutorReportStats";
import GradeCardPreview from "./GradeCardPreview";
import { useCreateProgressReport } from "@/querys/tutor/progressQuery";
import { useGetSubjects } from "@/querys/admin/curriculumQuery";
import { IProgressSubject } from "@/types/tutor/progress";

interface TutorReportGeneratorProps {
  students: ReportStudent[];
  activeTemplateId: "monthly" | "five-month" | "annual";
  setActiveTemplateId: (id: "monthly" | "five-month" | "annual") => void;
  onGenerateReport: (report: GradeCardReport) => void;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function emptySubject(): SubjectMark {
  return { subject: "", faMax: 0, faScored: 0, saMax: 0, saScored: 0 };
}

function gradeColor(g: string) {
  if (g === "A1" || g === "A2") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (g === "B1" || g === "B2") return "bg-blue-50 text-blue-700 border-blue-200";
  if (g === "C1" || g === "C2") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export default function TutorReportGenerator({
  students,
  activeTemplateId,
  setActiveTemplateId,
  onGenerateReport,
}: TutorReportGeneratorProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const createReport = useCreateProgressReport();
  const { data: subjectsData } = useGetSubjects();
  const curriculumSubjects = (subjectsData?.data ?? []).map((s) => s.name);

  const now = new Date();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id ?? "");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[now.getMonth()]);
  const [academicYear, setAcademicYear] = useState(`${now.getFullYear() - 1}-${now.getFullYear()}`);
  const [period, setPeriod] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [issueDate, setIssueDate] = useState(now.toISOString().split("T")[0]);
  const [subjects, setSubjects] = useState<SubjectMark[]>([emptySubject()]);
  const [downloading, setDownloading] = useState(false);

  const isAnnual = activeTemplateId === "annual";
  const isSaving = createReport.isPending;

  // Auto-populate period and exam title when inputs change
  useEffect(() => {
    if (activeTemplateId === "monthly") {
      const p = `${selectedMonth} ${now.getFullYear()}`;
      setPeriod(p);
      setExamTitle(`Monthly Progress – ${p}`);
    } else if (activeTemplateId === "five-month") {
      setPeriod(academicYear);
      setExamTitle(`5-Month Progress – ${academicYear}`);
    } else {
      setPeriod(academicYear);
      setExamTitle(`Annual Examination – ${academicYear}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTemplateId, selectedMonth, academicYear]);

  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const liveReport: GradeCardReport = {
    id: "preview",
    studentId: selectedStudentId,
    studentName: selectedStudent?.name ?? "",
    programName: selectedStudent?.programName ?? "",
    admissionNo: selectedStudent?.admissionNo ?? "",
    reportType: activeTemplateId,
    reportTypeName:
      activeTemplateId === "monthly"
        ? "Monthly Progress Report"
        : activeTemplateId === "five-month"
        ? "5-Month Progress Report"
        : "Annual / Yearly Report",
    period,
    academicYear,
    examTitle,
    subjects,
    issueDate,
    generatedAt: new Date().toISOString(),
  };

  function updateSubject(i: number, field: keyof SubjectMark, value: string | number) {
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  function removeSubject(i: number) {
    if (subjects.length === 1) return;
    setSubjects((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleDownloadPDF() {
    if (!previewRef.current) return;
    if (!selectedStudentId) { toast.error("Please select a student."); return; }
    setDownloading(true);
    try {
      // Render at a fixed narrow width so text fills more of the A4 page.
      // The UI preview may be 800–1000px wide; at 520px the same content
      // scales up ~1.5× when stretched to A4's 190mm content area.
      const PDF_RENDER_WIDTH = 520;
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: PDF_RENDER_WIDTH,
        onclone: (clonedDoc, element) => {
          // Strip external CSS — grade card is 100% inline styles so this is safe.
          // Prevents html2canvas choking on modern color functions (lab, oklch, etc.).
          clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach((el) => el.remove());
          clonedDoc.documentElement.style.background = "#ffffff";
          clonedDoc.body.style.background = "#ffffff";
          // Force narrow width so text is proportionally larger in the PDF output.
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
        `GradeCard_${selectedStudent?.name ?? "Student"}_${period}.pdf`
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

  async function handleSave() {
    if (!selectedStudentId) { toast.error("Please select a student."); return; }

    // Map UI SubjectMark[] → API IProgressSubject[]
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
      await createReport.mutateAsync({
        studentId: selectedStudentId,
        reportType: activeTemplateId,
        academicYear,
        examTitle,
        subjects: apiSubjects,
      });
      onGenerateReport({ ...liveReport, id: `REP-${Date.now()}` });
      toast.success(`Report saved for ${selectedStudent?.name}!`);
    } catch {
      toast.error("Failed to save report. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      {/* ── TOP ROW: Config (left) + Preview (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">

        {/* LEFT: Config Panel */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[var(--brand-green)]" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Report Configuration
              </span>
            </div>
            <div className="p-5 space-y-4">

              {/* Report Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Report Type</label>
                <Select
                  value={activeTemplateId}
                  onValueChange={(v) => setActiveTemplateId(v as "monthly" | "five-month" | "annual")}
                >
                  <SelectTrigger className="h-9 bg-white border-slate-200 rounded-lg text-sm font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly" className="text-sm">Monthly Progress</SelectItem>
                    <SelectItem value="five-month" className="text-sm">5-Month Progress</SelectItem>
                    <SelectItem value="annual" className="text-sm">Annual Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Month (only for Monthly) */}
              {activeTemplateId === "monthly" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Month</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="h-9 bg-white border-slate-200 rounded-lg text-sm font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m} value={m} className="text-sm">{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Academic Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Academic Year</label>
                <Input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2025-2026"
                  className="h-9 border-slate-200 rounded-lg text-sm"
                />
              </div>

              {/* Student */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Student</label>
                {students.length > 0 ? (
                  <>
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                      <SelectTrigger className="h-9 bg-white border-slate-200 rounded-lg text-sm font-medium">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((s) => (
                          <SelectItem key={s.id} value={s.id} className="text-sm">
                            {s.name} ({s.admissionNo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedStudent && (
                      <p className="text-[10px] text-slate-600 font-medium px-1">
                        Program: <span className="font-semibold text-slate-600">{selectedStudent.programName || "—"}</span>
                        {" "}· Adm: <span className="font-semibold text-slate-600">{selectedStudent.admissionNo}</span>
                      </p>
                    )}
                  </>
                ) : (
                  <div className="h-9 flex items-center px-3 border border-dashed border-amber-200 bg-amber-50 text-xs text-amber-600 rounded-lg font-semibold">
                    No students found
                  </div>
                )}
              </div>

              {/* Exam Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Exam Title</label>
                <Input
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="Monthly Progress – June 2026"
                  className="h-9 border-slate-200 rounded-lg text-sm"
                />
              </div>

              {/* Issue Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Issue Date</label>
                <Input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="h-9 border-slate-200 rounded-lg text-sm"
                />
              </div>

              {/* Save button */}
              <Button
                onClick={handleSave}
                disabled={!selectedStudentId || isSaving}
                className="w-full bg-slate-900 hover:bg-slate-700 text-white font-bold h-9 rounded-xl cursor-pointer disabled:opacity-50 text-sm"
              >
                {isSaving ? "Saving…" : "Save Report"}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--brand-green)] animate-pulse" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live Preview</span>
            </div>
            <Button
              onClick={handleDownloadPDF}
              disabled={!selectedStudentId || downloading}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold h-9 px-4 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? "Generating…" : "Download PDF"}
            </Button>
          </div>

          <div className="rounded-2xl shadow-sm">
            <div ref={previewRef}>
              <GradeCardPreview report={liveReport} />
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Subjects & Marks Entry ── */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Subjects &amp; Marks Entry
          </span>
          <button
            type="button"
            onClick={() => setSubjects((prev) => [...prev, emptySubject()])}
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--brand-green)] hover:text-[var(--brand-green)]/80 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Subject
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider w-[28%]">
                  Subject
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  FA Max
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  FA Scored
                </th>
                {isAnnual && (
                  <>
                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      SA Max
                    </th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      SA Scored
                    </th>
                  </>
                )}
                <th className="px-4 py-3 text-center text-[10px] font-bold text-teal-500 uppercase tracking-wider">
                  Total Max
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-teal-500 uppercase tracking-wider">
                  Total Scored
                </th>
                <th className="px-4 py-3 text-center text-[10px] font-bold text-[var(--brand-green)] uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-3 py-3 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subjects.map((s, i) => {
                const tMax = isAnnual ? s.faMax + s.saMax : s.faMax;
                const tScored = isAnnual ? s.faScored + s.saScored : s.faScored;
                const grade = tMax > 0 ? calcGrade(tScored, tMax) : "—";
                return (
                  <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 py-2.5">
                      <Select
                        value={s.subject}
                        onValueChange={(val) => updateSubject(i, "subject", val)}
                      >
                        <SelectTrigger className="h-8 border-slate-200 rounded-lg text-sm font-semibold bg-white">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {curriculumSubjects.map((sub) => (
                            <SelectItem key={sub} value={sub} className="text-sm font-medium">
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2.5">
                      <Input
                        type="number"
                        min={0}
                        value={s.faMax || ""}
                        onChange={(e) => updateSubject(i, "faMax", parseInt(e.target.value) || 0)}
                        placeholder="40"
                        className="h-8 border-slate-200 rounded-lg text-sm text-center bg-white w-20 mx-auto block"
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <Input
                        type="number"
                        min={0}
                        value={s.faScored || ""}
                        onChange={(e) => updateSubject(i, "faScored", parseInt(e.target.value) || 0)}
                        placeholder="35"
                        className="h-8 border-slate-200 rounded-lg text-sm text-center bg-white w-20 mx-auto block"
                      />
                    </td>
                    {isAnnual && (
                      <>
                        <td className="px-4 py-2.5">
                          <Input
                            type="number"
                            min={0}
                            value={s.saMax || ""}
                            onChange={(e) => updateSubject(i, "saMax", parseInt(e.target.value) || 0)}
                            placeholder="60"
                            className="h-8 border-slate-200 rounded-lg text-sm text-center bg-white w-20 mx-auto block"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <Input
                            type="number"
                            min={0}
                            value={s.saScored || ""}
                            onChange={(e) => updateSubject(i, "saScored", parseInt(e.target.value) || 0)}
                            placeholder="50"
                            className="h-8 border-slate-200 rounded-lg text-sm text-center bg-white w-20 mx-auto block"
                          />
                        </td>
                      </>
                    )}
                    {/* Auto-calculated columns */}
                    <td className="px-4 py-2.5 text-center">
                      <span className="text-sm font-bold text-teal-600">{tMax || 0}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="text-sm font-bold text-teal-600">{tScored || 0}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge
                        variant="outline"
                        className={`text-xs font-bold px-2 py-0.5 border ${gradeColor(grade)}`}
                      >
                        {grade}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => removeSubject(i)}
                        disabled={subjects.length === 1}
                        className="p-1 rounded text-slate-600 hover:text-red-500 transition-colors disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
