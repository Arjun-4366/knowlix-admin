"use client";

import { useState } from "react";
import { Search, Eye, Trash2, Calendar, FileText, X, Printer, GraduationCap, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ProgressReport } from "./TutorReportStats";
import { toast } from "react-hot-toast";

interface TutorReportHistoryProps {
  reports: ProgressReport[];
  onDeleteReport: (id: string) => void;
}

export default function TutorReportHistory({ reports, onDeleteReport }: TutorReportHistoryProps) {
  const { confirm } = useConfirmation();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState<string>("all");

  // Selected report for the detailed overlay modal
  const [selectedReport, setSelectedReport] = useState<ProgressReport | null>(null);

  const handleDelete = (id: string, studentName: string, period: string) => {
    confirm({
      title: "Delete Progress Report",
      message: `Are you sure you want to delete the progress report of ${studentName} for the period "${period}"? This action cannot be undone.`,
      confirmText: "Delete Report",
      variant: "danger",
      onConfirm: async () => {
        onDeleteReport(id);
        toast.success("Progress report deleted successfully.");
      },
    });
  };

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (grade === "B") return "bg-blue-50 text-blue-750 border-blue-200";
    if (grade === "C") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getBehaviorBadge = (rating: "Excellent" | "Good" | "Needs Improvement") => {
    if (rating === "Excellent") {
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">Excellent</Badge>;
    }
    if (rating === "Good") {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold">Good</Badge>;
    }
    return <Badge variant="outline" className="bg-amber-50 text-amber-750 border-amber-250 text-[10px] font-bold">Needs Improvement</Badge>;
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTemplate = templateFilter === "all" || r.templateId === templateFilter;
    return matchesSearch && matchesTemplate;
  });

  const handlePrint = () => {
    // Print styling helper or normal window print
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Filters header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <Input
            type="text"
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-10 bg-white border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div className="w-full md:w-[220px]">
          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-xs font-semibold">
              <SelectValue placeholder="Filter by layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Layout Templates</SelectItem>
              <SelectItem value="monthly" className="text-xs">Monthly Academic Check</SelectItem>
              <SelectItem value="term-end" className="text-xs">Term-End Summary</SelectItem>
              <SelectItem value="weekly" className="text-xs">Weekly Performance Slip</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Student</TableHead>
              <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Template & Period</TableHead>
              <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Grade</TableHead>
              <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Attendance</TableHead>
              <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-slate-100">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-slate-50/60 transition-colors">
                  <TableCell className="px-5 py-3.5">
                    <p className="text-sm font-bold text-slate-750 truncate leading-none">{report.studentName}</p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1.5 block">ID: {report.studentId}</span>
                  </TableCell>

                  <TableCell className="px-5 py-3.5">
                    <p className="text-sm font-medium text-slate-700 truncate leading-none">{report.templateName}</p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1.5 block flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-450" /> {report.period}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-3.5">
                    <Badge variant="outline" className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-sm ${getGradeColor(report.overallGrade)}`}>
                      Grade {report.overallGrade}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-3.5">
                    <span className="text-sm font-bold text-slate-650">{report.attendanceRate}%</span>
                  </TableCell>

                  <TableCell className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setSelectedReport(report)}
                        title="View & Print Report"
                        className="rounded-lg text-[var(--brand-green)] hover:bg-[var(--brand-light-green)] hover:text-[var(--brand-mid)] transition-all cursor-pointer"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(report.id, report.studentName, report.period)}
                        title="Delete Report"
                        className="rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="px-5 py-12 text-center text-slate-450 text-sm">
                  No generated progress reports found matching search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Premium Print Modal Overlay ── */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
              <span className="text-sm font-bold text-slate-800 font-heading">Progress Report Document Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green)]/90 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-450 hover:text-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Report Body */}
            <div className="p-8 overflow-y-auto print:p-0" id="print-area">
              {/* Premium Certificate Border styling */}
              <div className="border-[6px] border-[var(--brand-dark)] p-6 md:p-8 rounded-2xl relative bg-slate-50/50 shadow-inner">
                {/* Accent corner brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--brand-green)]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--brand-green)]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--brand-green)]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--brand-green)]" />

                {/* Academy Header */}
                <div className="text-center space-y-2 pb-6 border-b border-slate-200">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brand-green)] flex items-center justify-center shadow-md">
                      <GraduationCap className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-lg font-black text-slate-800 font-heading tracking-wide">KNOWLIX LEARNING ACADEMY</span>
                  </div>
                  <h1 className="text-xl font-extrabold text-[var(--brand-dark)] tracking-wider">OFFICIAL ACADEMIC REPORT</h1>
                  <span className="text-xs font-bold text-slate-400 bg-white border border-slate-150 px-3 py-1 rounded-full uppercase tracking-wider block mx-auto w-fit">
                    {selectedReport.templateName}
                  </span>
                </div>

                {/* Student Credentials Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 text-xs font-medium text-slate-600">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Name</span>
                    <span className="text-sm font-extrabold text-slate-850">{selectedReport.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Admission ID</span>
                    <span className="text-sm font-extrabold text-slate-850">{selectedReport.studentId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Term / Period</span>
                    <span className="text-sm font-extrabold text-slate-850">{selectedReport.period}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Date Issued</span>
                    <span className="text-sm font-extrabold text-slate-850">
                      {new Date(selectedReport.generatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Scores Matrix */}
                <div className="py-6 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[var(--brand-green)]" />
                    Academic Performance Matrix
                  </h3>
                  <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="px-4 py-2.5 text-[10px] font-bold uppercase text-slate-450">Assessment Node / Subject</TableHead>
                          <TableHead className="px-4 py-2.5 text-[10px] font-bold uppercase text-slate-450 text-center w-[20%]">Score</TableHead>
                          <TableHead className="px-4 py-2.5 text-[10px] font-bold uppercase text-slate-450 text-center w-[20%]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-slate-100">
                        {selectedReport.academicScores.map((scoreNode, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="px-4 py-2.5 text-xs font-semibold text-slate-750">{scoreNode.subject}</TableCell>
                            <TableCell className="px-4 py-2.5 text-xs font-bold text-center text-slate-800">{scoreNode.score}%</TableCell>
                            <TableCell className="px-4 py-2.5 text-center">
                              <Badge
                                className={`text-[10px] font-bold py-0 px-2 border ${
                                  scoreNode.score >= 70
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                }`}
                              >
                                {scoreNode.score >= 50 ? "Clear" : "Unsatisfactory"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Grid for Behavioral Ratings and Attendance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-b border-slate-200">
                  {/* Behavioral */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Soft Skill & Behavioral Ratings</h3>
                    <div className="space-y-2 bg-white p-3.5 border border-slate-150 rounded-xl text-xs font-semibold text-slate-650 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span>Attentiveness</span>
                        {getBehaviorBadge(selectedReport.behavioralRatings.attentiveness)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Class Participation</span>
                        {getBehaviorBadge(selectedReport.behavioralRatings.participation)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Homework Punctuality</span>
                        {getBehaviorBadge(selectedReport.behavioralRatings.homeworkPunctuality)}
                      </div>
                    </div>
                  </div>

                  {/* Attendance & Summary metrics */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Attendance & General Grade</h3>
                    <div className="grid grid-cols-2 gap-4 h-[106px]">
                      {/* Attendance Card */}
                      <div className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col justify-center items-center shadow-sm text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Attendance</span>
                        <p className="text-2xl font-black text-[var(--brand-green)] mt-1">{selectedReport.attendanceRate}%</p>
                      </div>

                      {/* Final Grade Card */}
                      <div className="bg-white border border-slate-150 rounded-xl p-4 flex flex-col justify-center items-center shadow-sm text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Grade</span>
                        <p className="text-2xl font-black text-slate-850 mt-1">{selectedReport.overallGrade}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Qualitative Comments */}
                <div className="py-6 space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tutor Remarks & Feedback</h3>
                  <div className="bg-white border border-slate-150 rounded-xl p-4 shadow-sm text-xs text-slate-650 leading-relaxed min-h-[60px] italic">
                    "{selectedReport.tutorFeedback}"
                  </div>
                </div>

                {/* Verification/Signatures Footer */}
                <div className="pt-8 flex items-center justify-between text-center mt-4">
                  <div className="w-[180px]">
                    <div className="border-b border-slate-350 pb-1.5">
                      <p className="font-heading font-bold text-slate-700 text-xs italic">Dr. Ramesh Prasad</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Lead Academic Tutor</span>
                  </div>

                  <div className="w-[180px]">
                    <div className="border-b border-slate-350 pb-1.5">
                      <p className="font-heading font-black text-slate-800 text-xs uppercase tracking-widest text-emerald-700/70">VERIFIED & SECURED</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Academy Board</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
