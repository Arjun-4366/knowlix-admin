"use client";

import { useState, useEffect } from "react";
import { ReportFiltersState } from "./types";
import ReportsFilters from "./ReportsFilters";
import { useGetTutorPerformanceReport, useGetStudentPerformanceReport, useGetAttendanceReport } from "@/querys/admin/reportsQuery";
import { ITutorPerformanceReportItem, IStudentPerformanceReportItem, IAttendanceReportResponse } from "@/types/admin/reports";
import {
  TrendingUp,
  Users,
  CheckCircle,
  Calendar,
  Award,
  Download,
  Star,
  Clock,
  AlertCircle,
  Percent,
} from "lucide-react";
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
import { toast } from "react-hot-toast";
import { generateReportPDF } from "./generateReportPDF";

const initialFilters: ReportFiltersState = {
  type: "tutor",
  dateRange: {
    preset: "thismonth",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
  },
};

export default function ReportsDashboard() {
  const [filters, setFilters] = useState<ReportFiltersState>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<ReportFiltersState>(initialFilters);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(true);

  // React Query hook call to get real tutor reports
  const { data: realReportsResponse, refetch: refetchTutor } = useGetTutorPerformanceReport(
    activeFilters.type === "tutor" ? activeFilters.tutorId : undefined,
    activeFilters.dateRange.startDate,
    activeFilters.dateRange.endDate
  );

  const { data: studentReportsResponse, refetch: refetchStudent } = useGetStudentPerformanceReport(
    activeFilters.dateRange.startDate,
    activeFilters.dateRange.endDate
  );

  const { data: attendanceResponse, refetch: refetchAttendance } = useGetAttendanceReport(
    activeFilters.dateRange.startDate,
    activeFilters.dateRange.endDate
  );

  // Generate Report execution
  const handleGenerate = () => {
    setIsGenerating(true);
    setHasGenerated(false);

    if (JSON.stringify(filters) === JSON.stringify(activeFilters)) {
      let fetchFn: any = async () => {};
      if (filters.type === "tutor") fetchFn = refetchTutor;
      if (filters.type === "student_performance") fetchFn = refetchStudent;
      if (filters.type === "attendance") fetchFn = refetchAttendance;
      
      fetchFn().finally(() => {
        setIsGenerating(false);
        setHasGenerated(true);
        toast.success(`${getReportLabel(filters.type)} generated successfully!`);
      });
    } else {
      setActiveFilters(filters);
    }
  };

  useEffect(() => {
    if (isGenerating && JSON.stringify(filters) === JSON.stringify(activeFilters)) {
      let fetchFn: any = async () => {};
      if (filters.type === "tutor") fetchFn = refetchTutor;
      if (filters.type === "student_performance") fetchFn = refetchStudent;
      if (filters.type === "attendance") fetchFn = refetchAttendance;

      fetchFn().finally(() => {
        setIsGenerating(false);
        setHasGenerated(true);
        toast.success(`${getReportLabel(filters.type)} generated successfully!`);
      });
    }
  }, [activeFilters]);

  const handleReset = () => {
    setFilters(initialFilters);
    setActiveFilters(initialFilters);
    toast.success("Filters reset to default.");
  };

  // Helper to fetch report names
  const getReportLabel = (type: string) => {
    switch (type) {
      case "tutor":
        return "Tutor Performance Report";
      case "student_performance":
        return "Student Performance Report";
      case "attendance":
        return "Attendance Report";
      case "session":
        return "Session Report";
      default:
        return "Report";
    }
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      await generateReportPDF({
        type: filters.type as "tutor" | "student_performance" | "attendance",
        dateRange: filters.dateRange,
        tutorData: realReportsResponse?.data ?? [],
        studentData: studentReportsResponse?.data ?? [],
        attendanceData: attendanceResponse ?? undefined,
      });
      toast.success("PDF downloaded successfully.");
    } catch {
      toast.error("Failed to generate PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters interface */}
      <ReportsFilters
        filters={filters}
        setFilters={setFilters}
        onGenerate={handleGenerate}
        onReset={handleReset}
        isGenerating={isGenerating}
      />

      {/* Generated Report Output */}
      {isGenerating && (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Aggregating and compiling analytics...</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">Please wait while the system cross-references active records and processes the requested calculations.</p>
        </div>
      )}

      {hasGenerated && !isGenerating && (
        <div className="space-y-6 admin-fade-up">
          {/* Header Actions for export */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 p-4 border border-slate-150 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-slate-800 font-heading">
                {getReportLabel(filters.type)}
              </h2>
              <p className="text-[11px] text-slate-450 mt-1">
                Issued on {new Date().toLocaleDateString("en-IN")} • Active Filter: {filters.dateRange.preset.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="bg-white border-slate-200 text-slate-650 hover:text-slate-900 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                {isExporting ? "Generating…" : "Download PDF"}
              </Button>
            </div>
          </div>

          {/* Render Custom SVG Visualizations */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Visual Highlights & Summary
            </h3>
            {filters.type === "tutor" && <RealTutorVisuals data={realReportsResponse?.data ?? []} />}
            {filters.type === "student_performance" && <StudentPerformanceVisuals data={studentReportsResponse?.data ?? []} />}
            {filters.type === "attendance" && <AttendanceVisuals data={attendanceResponse} />}
          </div>

          {/* Detail Table */}
          {filters.type === "tutor" || filters.type === "student_performance" || filters.type === "attendance" ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Detailed Dataset</h3>
                <p className="text-xs text-slate-400 mt-1">Tabular breakdown of the generated report parameters.</p>
              </div>
              {filters.type === "tutor" && <RealTutorTable data={realReportsResponse?.data ?? []} />}
              {filters.type === "student_performance" && <StudentPerformanceTable data={studentReportsResponse?.data ?? []} />}
              {filters.type === "attendance" && <AttendanceTable data={attendanceResponse?.data ?? []} />}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-sm text-slate-500 font-semibold">
                {getReportLabel(filters.type)} data structure is pending. Output will be rendered here.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

interface RealTutorKPIProps {
  data: ITutorPerformanceReportItem[];
}

function RealTutorKPI({ data }: RealTutorKPIProps) {
  const avgGrowthPoints = data.length 
    ? (data.reduce((acc, t) => acc + t.growthPoints, 0) / data.length).toFixed(1) 
    : "0.0";
  const totalConducted = data.reduce((acc, t) => acc + t.conductedSessions, 0);
  const avgPerfScore = data.length 
    ? (data.reduce((acc, t) => acc + t.performanceScore, 0) / data.length).toFixed(1) 
    : "0.0";
  const avgAttendance = data.length 
    ? Math.round(data.reduce((acc, t) => acc + t.attendanceRate, 0) / data.length) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <KPICard label="Avg Growth Points" value={`${avgGrowthPoints} pts`} icon={<Award className="w-5 h-5 text-[var(--brand-green)]" />} />
      <KPICard label="Total Conducted Sessions" value={totalConducted} icon={<Calendar className="w-5 h-5 text-blue-500" />} />
      <KPICard label="Avg Performance Score" value={`${avgPerfScore} / 100`} icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} />
      <KPICard label="Avg Attendance Rate" value={`${avgAttendance}%`} icon={<Percent className="w-5 h-5 text-purple-500" />} />
    </div>
  );
}

function RealTutorVisuals({ data }: { data: ITutorPerformanceReportItem[] }) {
  if (data.length === 0) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Tutors growth points and sessions conduction rates:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Growth points list */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Tutors by Growth Points</span>
          <div className="space-y-2">
            {data.slice(0, 4).map((t) => {
              const maxPoints = Math.max(...data.map(x => x.growthPoints), 10);
              const percentage = Math.min((t.growthPoints / maxPoints) * 100, 100);
              return (
                <div key={t.tutorId} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{t.name}</span>
                    <span className="text-[var(--brand-green)] font-bold">{t.growthPoints} points</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[var(--brand-green)] h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sessions list */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Conducted out of Total Sessions</span>
          <div className="space-y-2">
            {data.slice(0, 4).map((t) => {
              const ratio = t.totalSessions > 0 ? Math.round((t.conductedSessions / t.totalSessions) * 100) : 0;
              return (
                <div key={t.tutorId} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{t.name}</span>
                    <span className="text-blue-500 font-bold">{t.conductedSessions} / {t.totalSessions} sessions ({ratio}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${ratio}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RealTutorTable({ data }: { data: ITutorPerformanceReportItem[] }) {
  const formatTutorRole = (role: string) =>
    role
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  return (
    <Table className="table-fixed w-full">
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Tutor Name</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Role</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Growth Points</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[25%]">G-R-O-W-T-H Breakdown</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Sessions (Cond/Tot)</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[10%]">Attendance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-100">
        {data.length > 0 ? (
          data.map((tutor) => (
            <TableRow key={tutor.tutorId} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-800 leading-none">{tutor.name}</p>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block truncate">ID: {tutor.tutorId}</span>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-slate-600 truncate">{formatTutorRole(tutor.role)}</TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-[var(--brand-green)]">
                ★ {tutor.growthPoints} pts
              </TableCell>
              <TableCell className="px-5 py-4 text-center">
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {Object.entries(tutor.growthBreakdown).map(([k, v]) => (
                    <Badge
                      key={k}
                      variant="outline"
                      className="text-[9px] font-bold px-1.5 py-0.25 bg-slate-50 text-slate-600 border-slate-200"
                    >
                      {k}: {v}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-slate-700">
                {tutor.conductedSessions} / {tutor.totalSessions}
              </TableCell>
              <TableCell className="px-5 py-4 text-xs font-bold text-right text-slate-700">
                {tutor.attendanceRate}%
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="px-5 py-12 text-center text-slate-400 text-xs">
              No tutor performance records match the selected filter presets.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function KPICard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-slate-400 text-xs font-semibold">{label}</p>
        <p className="text-xl font-bold font-heading text-slate-800">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

function StudentPerformanceVisuals({ data }: { data: IStudentPerformanceReportItem[] }) {
  if (data.length === 0) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  const totalStudents = data.length;
  const completed = data.filter(d => d.admissionStatus === "course_completed").length;
  const admitted = data.filter(d => d.admissionStatus === "admission_taken").length;
  const pending = data.filter(d => d.admissionStatus === "pending").length;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Student admissions overview:</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <KPICard label="Total Students" value={totalStudents} icon={<Users className="w-5 h-5 text-blue-500" />} />
        <KPICard label="Course Completed" value={completed} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} />
        <KPICard label="Active Admissions" value={admitted} icon={<Star className="w-5 h-5 text-[var(--brand-green)]" />} />
        <KPICard label="Pending Admissions" value={pending} icon={<AlertCircle className="w-5 h-5 text-orange-500" />} />
      </div>
    </div>
  );
}

function StudentPerformanceTable({ data }: { data: IStudentPerformanceReportItem[] }) {
  const formatStatus = (status: string) => {
    switch (status) {
      case "course_completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent text-[10px]">Completed</Badge>;
      case "admission_taken":
        return <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-green)] hover:bg-[var(--brand-light-green)] border-transparent text-[10px]">Admitted</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-transparent text-[10px]">Pending</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] text-slate-500">{status}</Badge>;
    }
  };

  const formatPackage = (pkg: string) => {
    return pkg.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class & Package</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Total Sessions</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Conducted</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Not Conducted</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Postponed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map((student) => (
              <TableRow key={student.studentId} className="hover:bg-slate-50/60 transition-colors">
                <TableCell className="px-5 py-4">
                  <p className="text-xs font-bold text-slate-800 leading-none">{student.studentName}</p>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block truncate">Parent: {student.parentName}</span>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <p className="text-xs font-bold text-slate-700 leading-none">Class {student.class}</p>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 block truncate">{formatPackage(student.package)}</span>
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  {formatStatus(student.admissionStatus)}
                </TableCell>
                <TableCell className="px-5 py-4 text-xs text-center font-bold text-slate-700">
                  {student.totalSessions}
                </TableCell>
                <TableCell className="px-5 py-4 text-xs text-center font-bold text-blue-600">
                  {student.conducted}
                </TableCell>
                <TableCell className="px-5 py-4 text-xs text-center font-bold text-red-500">
                  {student.notConducted}
                </TableCell>
                <TableCell className="px-5 py-4 text-xs font-bold text-right text-orange-500">
                  {student.postponed}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="px-5 py-12 text-center text-slate-400 text-xs">
                No student performance records match the selected filter presets.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function AttendanceVisuals({ data }: { data: IAttendanceReportResponse | undefined }) {
  if (!data) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Attendance and session summary:</p>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <KPICard label="Attendance Rate" value={`${data.attendanceRate}%`} icon={<Percent className="w-5 h-5 text-purple-500" />} />
        <KPICard label="Total Sessions" value={data.total} icon={<Calendar className="w-5 h-5 text-slate-500" />} />
        <KPICard label="Conducted" value={data.conducted} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} />
        <KPICard label="Not Conducted" value={data.notConducted} icon={<AlertCircle className="w-5 h-5 text-red-500" />} />
        <KPICard label="Postponed" value={data.postponed} icon={<Clock className="w-5 h-5 text-orange-500" />} />
      </div>
    </div>
  );
}

function AttendanceTable({ data }: { data: any[] }) {
  // Currently the JSON payload provides data: null for the array.
  // We will display a placeholder indicating that detailed table records are pending.
  return (
    <div className="p-12 text-center">
      <p className="text-sm text-slate-500 font-semibold mb-2">Detailed Records Unavailable</p>
      <p className="text-xs text-slate-400">The attendance report currently aggregates top-level metrics. Detailed row-by-row data structure is pending.</p>
    </div>
  );
}
