"use client";

import { useState, useEffect } from "react";
import { ReportFiltersState } from "./types";
import ReportsFilters from "./ReportsFilters";
import {
  useGetTutorPerformanceReport,
  useGetStudentPerformanceReport,
  useGetAttendanceReport,
  useGetSessionReport,
} from "@/querys/admin/reportsQuery";
import { ITutorPerformanceReportItem, IStudentPerformanceReportItem, IAttendanceReportResponse, IAttendanceReportItem, ISessionReportResponse, ISessionReportItem } from "@/types/admin/reports";
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
import { Skeleton } from "@/components/ui/skeleton";
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

  const isTutor = activeFilters.type === "tutor";
  const isStudent = activeFilters.type === "student_performance";
  const isAttendance = activeFilters.type === "attendance";
  const isSession = activeFilters.type === "session";

  const { data: realReportsResponse, refetch: refetchTutor, isFetching: tutorFetching } =
    useGetTutorPerformanceReport(
      isTutor ? activeFilters.tutorId : undefined,
      activeFilters.dateRange.startDate,
      activeFilters.dateRange.endDate,
      isTutor
    );

  const { data: studentReportsResponse, refetch: refetchStudent, isFetching: studentFetching } =
    useGetStudentPerformanceReport(
      activeFilters.dateRange.startDate,
      activeFilters.dateRange.endDate,
      isStudent
    );

  const { data: attendanceResponse, refetch: refetchAttendance, isFetching: attendanceFetching } =
    useGetAttendanceReport(
      activeFilters.dateRange.startDate,
      activeFilters.dateRange.endDate,
      isAttendance
    );

  const { data: sessionResponse, refetch: refetchSession, isFetching: sessionFetching } =
    useGetSessionReport(
      activeFilters.dateRange.startDate,
      activeFilters.dateRange.endDate,
      isSession
    );

  const isCurrentFetching =
    (isTutor && tutorFetching) ||
    (isStudent && studentFetching) ||
    (isAttendance && attendanceFetching) ||
    (isSession && sessionFetching);

  // Generate Report execution
  const handleGenerate = () => {
    setIsGenerating(true);
    setHasGenerated(false);

    const refetchMap: Record<string, () => Promise<any>> = {
      tutor: refetchTutor,
      student_performance: refetchStudent,
      attendance: refetchAttendance,
      session: refetchSession,
    };

    if (JSON.stringify(filters) === JSON.stringify(activeFilters)) {
      const fetchFn = refetchMap[filters.type] ?? (() => Promise.resolve());
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
      const refetchMap: Record<string, () => Promise<any>> = {
        tutor: refetchTutor,
        student_performance: refetchStudent,
        attendance: refetchAttendance,
        session: refetchSession,
      };
      const fetchFn = refetchMap[filters.type] ?? (() => Promise.resolve());
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

  // Switching tabs immediately updates the active type so the right API fires
  useEffect(() => {
    if (filters.type !== activeFilters.type) {
      setActiveFilters((prev) => ({ ...prev, type: filters.type }));
      setHasGenerated(true);
      setIsGenerating(false);
    }
  }, [filters.type]);

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
        type: filters.type as "tutor" | "student_performance" | "attendance" | "session",
        dateRange: filters.dateRange,
        tutorData: realReportsResponse?.data ?? [],
        studentData: studentReportsResponse?.data ?? [],
        attendanceData: attendanceResponse ?? undefined,
        sessionData: sessionResponse ?? undefined,
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

      {/* Loading skeleton — shown while any active tab query is fetching */}
      {(isGenerating || isCurrentFetching) && (
        <div className="space-y-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <Skeleton className="h-4 w-40 rounded" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-56 rounded" />
            </div>
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      )}

      {hasGenerated && !isGenerating && !isCurrentFetching && (
        <div className="space-y-6 admin-fade-up">
          {/* Header Actions for export */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50 p-4 border border-slate-150 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-slate-800 font-heading">
                {getReportLabel(activeFilters.type)}
              </h2>
              <p className="text-[11px] text-slate-450 mt-1">
                Issued on {new Date().toLocaleDateString("en-IN")} • Active Filter: {activeFilters.dateRange.preset.toUpperCase()}
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

          {/* Visuals */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Visual Highlights & Summary
            </h3>
            {activeFilters.type === "tutor" && <RealTutorVisuals data={realReportsResponse?.data ?? []} />}
            {activeFilters.type === "student_performance" && <StudentPerformanceVisuals data={studentReportsResponse?.data ?? []} />}
            {activeFilters.type === "attendance" && <AttendanceVisuals data={attendanceResponse} />}
            {activeFilters.type === "session" && <SessionVisuals response={sessionResponse} />}
          </div>

          {/* Detail Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Detailed Dataset</h3>
              <p className="text-xs text-slate-400 mt-1">Tabular breakdown of the generated report parameters.</p>
            </div>
            {activeFilters.type === "tutor" && <RealTutorTable data={realReportsResponse?.data ?? []} />}
            {activeFilters.type === "student_performance" && <StudentPerformanceTable data={studentReportsResponse?.data ?? []} />}
            {activeFilters.type === "attendance" && <AttendanceTable data={attendanceResponse?.data ?? []} />}
            {activeFilters.type === "session" && <SessionTable data={sessionResponse?.data ?? []} />}
          </div>
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
  const totalWorkHours = data.reduce((acc, t) => acc + t.totalWorkHours, 0);
  const totalAssigned = data.reduce((acc, t) => acc + t.assignedStudentCount, 0);
  const avgAttendance = data.length
    ? Math.round(data.reduce((acc, t) => acc + t.attendanceRate, 0) / data.length)
    : 0;
  const avgPerfScore = data.length
    ? (data.reduce((acc, t) => acc + t.performanceScore, 0) / data.length).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard label="Total Tutors" value={data.length} icon={<Users className="w-5 h-5 text-blue-500" />} />
      <KPICard label="Avg Growth Points" value={`${avgGrowthPoints} pts`} icon={<Award className="w-5 h-5 text-[var(--brand-green)]" />} />
      <KPICard label="Sessions Conducted" value={totalConducted} icon={<Calendar className="w-5 h-5 text-blue-500" />} />
      <KPICard label="Total Work Hours" value={`${totalWorkHours}h`} icon={<Clock className="w-5 h-5 text-purple-500" />} />
      <KPICard label="Students Assigned" value={totalAssigned} icon={<Star className="w-5 h-5 text-amber-500" />} />
      <KPICard label="Avg Attendance" value={`${avgAttendance}%`} icon={<Percent className="w-5 h-5 text-emerald-500" />} />
    </div>
  );
}

function RealTutorVisuals({ data }: { data: ITutorPerformanceReportItem[] }) {
  if (data.length === 0) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold text-slate-500">Tutors growth points and sessions conduction rates:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Growth Points */}
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tutors by Growth Points</span>
          </div>
          <div className="divide-y divide-slate-50">
            {data.slice(0, 4).map((t) => (
              <div key={t.tutorId} className="flex items-center justify-between px-4 py-3.5 gap-4">
                <span className="text-xs font-semibold text-slate-700 truncate">{t.name}</span>
                <span className="flex-shrink-0 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1">
                  {t.growthPoints} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sessions Conducted</span>
          </div>
          <div className="divide-y divide-slate-50">
            {data.slice(0, 4).map((t) => {
              const ratio = t.totalSessions > 0 ? Math.round((t.conductedSessions / t.totalSessions) * 100) : 0;
              return (
                <div key={t.tutorId} className="flex items-center justify-between px-4 py-3.5 gap-4">
                  <span className="text-xs font-semibold text-slate-700 truncate">{t.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1">
                      {t.conductedSessions}/{t.totalSessions}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 w-9 text-right">{ratio}%</span>
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
  return (
    <Table className="table-fixed w-full">
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[22%]">Tutor</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">Subjects</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[12%]">Students</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[14%]">Growth Pts</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[18%]">Sessions</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[10%]">Work Hrs</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[6%]">Attend.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-100">
        {data.length > 0 ? (
          data.map((tutor) => (
            <TableRow key={tutor.tutorId} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-800 leading-none">{tutor.name}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{tutor.experience}</span>
              </TableCell>
              <TableCell className="px-5 py-4">
                <div className="flex flex-wrap gap-1">
                  {tutor.subjects.slice(0, 3).map((s) => (
                    <Badge key={s} variant="outline" className="text-[9px] font-bold px-1.5 bg-slate-50 text-slate-600 border-slate-200">
                      {s}
                    </Badge>
                  ))}
                  {tutor.subjects.length > 3 && (
                    <Badge variant="outline" className="text-[9px] font-bold px-1.5 bg-slate-50 text-slate-400 border-slate-200">
                      +{tutor.subjects.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-slate-700">
                {tutor.assignedStudentCount}
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-[var(--brand-green)]">
                {tutor.growthPoints} pts
              </TableCell>
              <TableCell className="px-5 py-4 text-center">
                <p className="text-xs font-bold text-blue-600">{tutor.conductedSessions}/{tutor.totalSessions}</p>
                <span className="text-[10px] text-slate-400">{tutor.notConductedSessions} not done</span>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-purple-600">
                {tutor.totalWorkHours}h
              </TableCell>
              <TableCell className="px-5 py-4 text-xs font-bold text-right" style={{ color: tutor.attendanceRate >= 75 ? "rgb(22,163,74)" : "rgb(239,68,68)" }}>
                {tutor.attendanceRate.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="px-5 py-12 text-center text-slate-400 text-xs">
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
  const totalCollected = data.reduce((s, d) => s + d.paidAmount, 0);
  const totalBalance = data.reduce((s, d) => s + d.balanceFee, 0);

  const fmt = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Student admissions & fee overview:</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard label="Total Students" value={totalStudents} icon={<Users className="w-5 h-5 text-blue-500" />} />
        <KPICard label="Completed" value={completed} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} />
        <KPICard label="Admitted" value={admitted} icon={<Star className="w-5 h-5 text-[var(--brand-green)]" />} />
        <KPICard label="Pending" value={pending} icon={<AlertCircle className="w-5 h-5 text-orange-500" />} />
        <KPICard label="Fee Collected" value={fmt(totalCollected)} icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} />
        <KPICard label="Balance Due" value={fmt(totalBalance)} icon={<Clock className="w-5 h-5 text-red-500" />} />
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

  const fmtFee = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mentor</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Sessions</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Attendance</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Fee Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map((student) => (
              <TableRow key={student.studentId} className="hover:bg-slate-50/60 transition-colors">
                <TableCell className="px-5 py-4">
                  <p className="text-xs font-bold text-slate-800 leading-none">{student.studentName}</p>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                    {student.admissionNumber || "No Admission No."}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Class {student.class}{student.syllabus ? ` · ${student.syllabus}` : ""}</span>
                </TableCell>
                <TableCell className="px-5 py-4">
                  <p className="text-xs font-semibold text-slate-700 leading-none truncate max-w-[140px]">
                    {student.courseName || student.programName || "—"}
                  </p>
                  {student.programName && student.courseName && (
                    <span className="text-[10px] text-slate-400 mt-0.5 block truncate max-w-[140px]">{student.programName}</span>
                  )}
                </TableCell>
                <TableCell className="px-5 py-4">
                  <p className="text-xs font-semibold text-slate-700">{student.mentorName || "—"}</p>
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  {formatStatus(student.admissionStatus)}
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  <p className="text-xs font-bold text-blue-600">{student.conducted}/{student.totalSessions}</p>
                  <span className="text-[10px] text-slate-400">done/total</span>
                </TableCell>
                <TableCell className="px-5 py-4 text-center">
                  <p className="text-xs font-bold text-emerald-600">{student.attendanceRate.toFixed(0)}%</p>
                  <span className="text-[10px] text-slate-400">{student.attendancePresent}P · {student.attendanceAbsent}A · {student.attendanceLate}L</span>
                </TableCell>
                <TableCell className="px-5 py-4 text-right">
                  <p className="text-xs font-bold text-emerald-600">{fmtFee(student.paidAmount)} paid</p>
                  {student.balanceFee > 0 && (
                    <span className="text-[10px] text-red-500 font-semibold">{fmtFee(student.balanceFee)} due</span>
                  )}
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

  const avgHoursPerTutor = data.totalTutors > 0
    ? (data.totalWorkHours / data.totalTutors).toFixed(1)
    : "0";

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Tutor attendance & work hours summary:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Tutors" value={data.totalTutors} icon={<Users className="w-5 h-5 text-blue-500" />} />
        <KPICard label="Total Sessions" value={data.totalSessions} icon={<Calendar className="w-5 h-5 text-purple-500" />} />
        <KPICard label="Total Work Hours" value={`${data.totalWorkHours}h`} icon={<Clock className="w-5 h-5 text-emerald-500" />} />
        <KPICard label="Avg Hours / Tutor" value={`${avgHoursPerTutor}h`} icon={<TrendingUp className="w-5 h-5 text-amber-500" />} />
      </div>
    </div>
  );
}

function AttendanceTable({ data }: { data: IAttendanceReportItem[] }) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-slate-500 font-semibold mb-2">No Records</p>
        <p className="text-xs text-slate-400">No attendance data found for the selected period.</p>
      </div>
    );
  }

  const fmtMins = (m: number) => {
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return h > 0 ? `${h}h ${rem}m` : `${rem}m`;
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tutor</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Days Present</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Total Minutes</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Work Hours</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Sessions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {data.map((row) => (
            <TableRow key={row.tutorId} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {row.tutorName || "Unknown Tutor"}
                </p>
                {row.tutorEmail && (
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{row.tutorEmail}</span>
                )}
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-slate-700">
                {row.totalDays}
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-semibold text-slate-600">
                {fmtMins(row.totalMinutes)}
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-purple-600">
                {row.totalWorkHours}h
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-right font-bold text-blue-600">
                {row.totalSessions}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SessionVisuals({ response }: { response: ISessionReportResponse | undefined }) {
  if (!response || !response.total) return <div className="text-xs text-slate-400 text-center py-6">No session data to display.</div>;

  const completed = response.data?.filter((d) => d.status === "completed").length ?? 0;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Session overview across the selected period:</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard label="Total Sessions" value={response.total} icon={<Calendar className="w-5 h-5 text-blue-500" />} />
        <KPICard label="Conducted" value={response.conducted} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} />
        <KPICard label="Completed" value={completed} icon={<Award className="w-5 h-5 text-[var(--brand-green)]" />} />
        <KPICard label="Not Conducted" value={response.notConducted} icon={<AlertCircle className="w-5 h-5 text-red-500" />} />
        <KPICard label="Scheduled" value={response.scheduled} icon={<Clock className="w-5 h-5 text-blue-400" />} />
      </div>
    </div>
  );
}

function SessionTable({ data }: { data: ISessionReportItem[] }) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-slate-500 font-semibold mb-2">No Session Records</p>
        <p className="text-xs text-slate-400">No session data found for the selected period.</p>
      </div>
    );
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const statusBadge = (status: string) => {
    switch (status) {
      case "conducted":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent text-[10px]">Conducted</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-transparent text-[10px]">Completed</Badge>;
      case "not_conducted":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-transparent text-[10px]">Not Conducted</Badge>;
      case "scheduled":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-transparent text-[10px]">Scheduled</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] text-slate-500">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="w-full">
        <TableHeader className="bg-slate-50/50">
          <TableRow>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[26%]">Session</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">Tutor</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[10%]">Type</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[22%]">Students</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[16%]">Scheduled At</TableHead>
            <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[8%]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {data.map((row) => (
            <TableRow key={row.id} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[180px]">{row.title}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{row.subject} · {row.durationMinutes}m</span>
              </TableCell>
              <TableCell className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-700">{row.tutorName || "—"}</p>
              </TableCell>
              <TableCell className="px-5 py-4 text-center">
                <Badge variant="outline" className={`text-[10px] font-bold border-transparent ${row.type === "group" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                  {row.type}
                </Badge>
              </TableCell>
              <TableCell className="px-5 py-4">
                {row.students.length === 0 ? (
                  <span className="text-[10px] text-slate-400">No students</span>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 leading-none">
                      {row.students.slice(0, 2).map((s) => s.studentName).join(", ")}
                      {row.students.length > 2 && ` +${row.students.length - 2}`}
                    </p>
                    <span className="text-[10px] text-slate-400">{row.students.length} student{row.students.length > 1 ? "s" : ""}</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-slate-600">{fmtDate(row.scheduledAt)}</TableCell>
              <TableCell className="px-5 py-4 text-center">{statusBadge(row.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
