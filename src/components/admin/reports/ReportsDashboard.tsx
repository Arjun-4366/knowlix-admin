"use client";

import { useState, useEffect } from "react";
import {
  ReportFiltersState,
  TutorPerformanceReport,
  StudentPerformanceReport,
  AttendanceReport,
  SessionReport,
  RevenueReport,
} from "./types";
import {
  mockTutors,
  mockStudents,
  mockAttendance,
  mockSessions,
  mockRevenue,
} from "./mockData";
import ReportsFilters from "./ReportsFilters";
import { useGetTutorPerformanceReport } from "@/querys/admin/reportsQuery";
import { ITutorPerformanceReportItem } from "@/types/admin/reports";
import {
  TrendingUp,
  Users,
  CheckCircle,
  Calendar,
  DollarSign,
  Award,
  Download,
  Printer,
  Star,
  Clock,
  Briefcase,
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

const initialFilters: ReportFiltersState = {
  type: "tutor",
  dateRange: {
    preset: "thismonth",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
  },
  tutorTier: "all",
  studentGrade: "all",
  attendanceStatus: "all",
  sessionStatus: "all",
  revenuePackage: "all",
};

export default function ReportsDashboard() {
  const [filters, setFilters] = useState<ReportFiltersState>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<ReportFiltersState>(initialFilters);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(true);

  // React Query hook call to get real tutor reports
  const { data: realReportsResponse } = useGetTutorPerformanceReport(
    activeFilters.type === "tutor" ? activeFilters.tutorId : undefined
  );

  // Filtered lists
  const [filteredTutors, setFilteredTutors] = useState<TutorPerformanceReport[]>(mockTutors);
  const [filteredStudents, setFilteredStudents] = useState<StudentPerformanceReport[]>(mockStudents);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceReport[]>(mockAttendance);
  const [filteredSessions, setFilteredSessions] = useState<SessionReport[]>(mockSessions);
  const [filteredRevenue, setFilteredRevenue] = useState<RevenueReport[]>(mockRevenue);

  // Generate Report execution
  const handleGenerate = () => {
    setIsGenerating(true);
    setHasGenerated(false);

    setTimeout(() => {
      // Set active filters to trigger query hook
      setActiveFilters(filters);

      // Perform filtering
      const { type, tutorTier, studentGrade, attendanceStatus, sessionStatus, revenuePackage } = filters;

      if (type === "tutor") {
        let data = [...mockTutors];
        if (tutorTier !== "all") {
          data = data.filter((t) => t.performanceTier === tutorTier);
        }
        setFilteredTutors(data);
      } else if (type === "student") {
        let data = [...mockStudents];
        if (studentGrade !== "all") {
          data = data.filter((s) => s.grade === studentGrade);
        }
        setFilteredStudents(data);
      } else if (type === "attendance") {
        let data = [...mockAttendance];
        if (studentGrade !== "all") {
          data = data.filter((a) => a.grade === studentGrade);
        }
        if (attendanceStatus !== "all") {
          if (attendanceStatus === "high") {
            data = data.filter((a) => a.attendanceRate >= 90);
          } else if (attendanceStatus === "average") {
            data = data.filter((a) => a.attendanceRate >= 80 && a.attendanceRate < 90);
          } else if (attendanceStatus === "low") {
            data = data.filter((a) => a.attendanceRate < 80);
          }
        }
        setFilteredAttendance(data);
      } else if (type === "session") {
        let data = [...mockSessions];
        if (sessionStatus !== "all") {
          data = data.filter((s) => s.status === sessionStatus);
        }
        setFilteredSessions(data);
      } else if (type === "revenue") {
        let data = [...mockRevenue];
        if (revenuePackage !== "all") {
          data = data.filter((r) => r.packageName === revenuePackage);
        }
        setFilteredRevenue(data);
      }

      setIsGenerating(false);
      setHasGenerated(true);
      toast.success(`${getReportLabel(type)} generated successfully!`);
    }, 900);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setActiveFilters(initialFilters);
    setFilteredTutors(mockTutors);
    setFilteredStudents(mockStudents);
    setFilteredAttendance(mockAttendance);
    setFilteredSessions(mockSessions);
    setFilteredRevenue(mockRevenue);
    toast.success("Filters reset to default.");
  };

  // Helper to fetch report names
  const getReportLabel = (type: string) => {
    switch (type) {
      case "tutor":
        return "Tutor Performance Report";
      case "student":
        return "Student Performance Report";
      case "attendance":
        return "Attendance Log Report";
      case "session":
        return "Session Tracker Report";
      case "revenue":
        return "Revenue & Finance Report";
      default:
        return "Report";
    }
  };

  // CSV Export utility
  const handleExportCSV = () => {
    const { type } = filters;
    let csvContent = "";
    let fileName = "";

    if (type === "tutor") {
      fileName = "tutor_performance_report.csv";
      csvContent += "Tutor ID,Tutor Name,Role,Growth Points,Performance Score,G,H,O,R,T,W,Total Sessions,Conducted Sessions,Attendance Rate (%)\n";
      const realData = realReportsResponse?.data ?? [];
      realData.forEach((t) => {
        csvContent += `"${t.tutorId}","${t.name}","${t.role}",${t.growthPoints},${t.performanceScore},${t.growthBreakdown.G},${t.growthBreakdown.H},${t.growthBreakdown.O},${t.growthBreakdown.R},${t.growthBreakdown.T},${t.growthBreakdown.W},${t.totalSessions},${t.conductedSessions},${t.attendanceRate}\n`;
      });
    } else if (type === "student") {
      fileName = "student_performance_report.csv";
      csvContent += "Student ID,Student Name,Grade Level,Course Type,Course Name,Avg Academic Score (%),Attendance Rate (%),Assignments Submitted,Assignments Total,Assigned Tutor,Performance Tier\n";
      filteredStudents.forEach((s) => {
        csvContent += `"${s.id}","${s.name}","${s.grade}","${s.courseType}","${s.courseName}",${s.avgAcademicScore},${s.attendanceRate},${s.assignmentsSubmitted},${s.assignmentsTotal},"${s.tutorName}","${s.performanceTier}"\n`;
      });
    } else if (type === "attendance") {
      fileName = "attendance_report.csv";
      csvContent += "Student ID,Student Name,Grade Level,Course Name,Sessions Scheduled,Sessions Present,Sessions Absent,Sessions Excused,Attendance Rate (%)\n";
      filteredAttendance.forEach((a) => {
        csvContent += `"${a.studentId}","${a.studentName}","${a.grade}","${a.courseName}",${a.sessionsScheduled},${a.sessionsPresent},${a.sessionsAbsent},${a.sessionsExcused},${a.attendanceRate}\n`;
      });
    } else if (type === "session") {
      fileName = "session_tracker_report.csv";
      csvContent += "Session ID,Date,Time Slot,Student Name,Tutor Name,Subject,Duration (mins),Status,Remarks\n";
      filteredSessions.forEach((s) => {
        csvContent += `"${s.id}","${s.date}","${s.timeSlot}","${s.studentName}","${s.tutorName}","${s.subject}",${s.duration},"${s.status}","${s.remarks || ""}"\n`;
      });
    } else if (type === "revenue") {
      fileName = "revenue_report.csv";
      csvContent += "Invoice ID,Date,Student Name,Course Type,Course Name,Package Name,Amount (INR),Payment Status,Payment Method\n";
      filteredRevenue.forEach((r) => {
        csvContent += `"${r.invoiceId}","${r.date}","${r.studentName}","${r.courseType}","${r.courseName}","${r.packageName}",${r.amount},"${r.paymentStatus}","${r.paymentMethod}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export download started.");
  };

  const handlePrint = () => {
    window.print();
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
                onClick={handlePrint}
                className="bg-white border-slate-200 text-slate-650 hover:text-slate-900 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Print / Save PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="bg-white border-slate-200 text-slate-650 hover:text-slate-900 rounded-xl text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Render KPI Cards based on report type */}
          {filters.type === "tutor" && <RealTutorKPI data={realReportsResponse?.data ?? []} />}
          {filters.type === "student" && <StudentKPI data={filteredStudents} />}
          {filters.type === "attendance" && <AttendanceKPI data={filteredAttendance} />}
          {filters.type === "session" && <SessionKPI data={filteredSessions} />}
          {filters.type === "revenue" && <RevenueKPI data={filteredRevenue} />}

          {/* Render Custom SVG Visualizations */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Visual Highlights & Summary
            </h3>
            {filters.type === "tutor" && <RealTutorVisuals data={realReportsResponse?.data ?? []} />}
            {filters.type === "student" && <StudentVisuals data={filteredStudents} />}
            {filters.type === "attendance" && <AttendanceVisuals data={filteredAttendance} />}
            {filters.type === "session" && <SessionVisuals data={filteredSessions} />}
            {filters.type === "revenue" && <RevenueVisuals data={filteredRevenue} />}
          </div>

          {/* Detail Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Detailed Dataset</h3>
              <p className="text-xs text-slate-400 mt-1">Tabular breakdown of the generated report parameters.</p>
            </div>
            
            {filters.type === "tutor" && <RealTutorTable data={realReportsResponse?.data ?? []} />}
            {filters.type === "student" && <StudentTable data={filteredStudents} />}
            {filters.type === "attendance" && <AttendanceTable data={filteredAttendance} />}
            {filters.type === "session" && <SessionTable data={filteredSessions} />}
            {filters.type === "revenue" && <RevenueTable data={filteredRevenue} />}
          </div>
        </div>
      )}

      {/* Signature & Audit section visible only during standard print */}
      <div className="hidden print:block pt-12 text-center mt-12 border-t border-slate-200 text-xs text-slate-500">
        <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
          <div>
            <div className="border-b border-slate-300 pb-8 mb-2"></div>
            <p className="font-bold text-slate-700">Lead Academic Coordinator</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Knowlix Administration Board</p>
          </div>
          <div>
            <div className="border-b border-slate-300 pb-8 mb-2"></div>
            <p className="font-bold text-slate-700">System Auditor Signature</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Verified & Secured Stamp</p>
          </div>
        </div>
        <p className="text-[9px] text-slate-400 mt-10">This report has been automatically compiled by the Knowlix Analytics engine. Date generated: {new Date().toLocaleString("en-IN")}.</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   KPI CARDS FOR REPORT TYPES
   ────────────────────────────────────────────────────────────────────────── */

function TutorKPI({ data }: { data: TutorPerformanceReport[] }) {
  const avgRating = data.length ? (data.reduce((acc, t) => acc + t.rating, 0) / data.length).toFixed(2) : "0.00";
  const totalClasses = data.reduce((acc, t) => acc + t.classesConducted, 0);
  const avgSatisfaction = data.length ? Math.round(data.reduce((acc, t) => acc + t.satisfactionRate, 0) / data.length) : 0;
  const activeStudents = data.reduce((acc, t) => acc + t.activeStudents, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <KPICard label="Avg Tutor Rating" value={`${avgRating} / 5.0`} icon={<Star className="w-5 h-5 text-amber-500" />} />
      <KPICard label="Total Classes Conducted" value={totalClasses} icon={<Award className="w-5 h-5 text-[var(--brand-green)]" />} />
      <KPICard label="Avg Parent Satisfaction" value={`${avgSatisfaction}%`} icon={<Percent className="w-5 h-5 text-blue-500" />} />
      <KPICard label="Active Students Coordinated" value={activeStudents} icon={<Users className="w-5 h-5 text-purple-500" />} />
    </div>
  );
}

function StudentKPI({ data }: { data: StudentPerformanceReport[] }) {
  const avgScore = data.length ? Math.round(data.reduce((acc, s) => acc + s.avgAcademicScore, 0) / data.length) : 0;
  const avgAttendance = data.length ? Math.round(data.reduce((acc, s) => acc + s.attendanceRate, 0) / data.length) : 0;
  const submissionRate = data.length 
    ? Math.round((data.reduce((acc, s) => acc + s.assignmentsSubmitted, 0) / data.reduce((acc, s) => acc + s.assignmentsTotal, 0)) * 100) 
    : 0;
  const totalStudents = data.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <KPICard label="Average Academic Grade" value={`${avgScore}%`} icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} />
      <KPICard label="Average Attendance Rate" value={`${avgAttendance}%`} icon={<CheckCircle className="w-5 h-5 text-[var(--brand-green)]" />} />
      <KPICard label="Assignment Submission Rate" value={`${submissionRate}%`} icon={<Clock className="w-5 h-5 text-blue-500" />} />
      <KPICard label="Students Sampled" value={totalStudents} icon={<Users className="w-5 h-5 text-indigo-500" />} />
    </div>
  );
}

function AttendanceKPI({ data }: { data: AttendanceReport[] }) {
  const avgAttendance = data.length ? Math.round(data.reduce((acc, a) => acc + a.attendanceRate, 0) / data.length) : 0;
  const totalPresent = data.reduce((acc, a) => acc + a.sessionsPresent, 0);
  const totalAbsent = data.reduce((acc, a) => acc + a.sessionsAbsent, 0);
  const totalExcused = data.reduce((acc, a) => acc + a.sessionsExcused, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <KPICard label="Avg Attendance Rate" value={`${avgAttendance}%`} icon={<Percent className="w-5 h-5 text-[var(--brand-green)]" />} />
      <KPICard label="Total Present Sessions" value={totalPresent} icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} />
      <KPICard label="Total Absent Sessions" value={totalAbsent} icon={<AlertCircle className="w-5 h-5 text-red-500" />} />
      <KPICard label="Total Excused Leaves" value={totalExcused} icon={<Clock className="w-5 h-5 text-slate-500" />} />
    </div>
  );
}

function SessionKPI({ data }: { data: SessionReport[] }) {
  const total = data.length;
  const completed = data.filter((s) => s.status === "Completed").length;
  const scheduled = data.filter((s) => s.status === "Scheduled").length;
  const cancelled = data.filter((s) => s.status === "Cancelled").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <KPICard label="Total Tracked Sessions" value={total} icon={<Calendar className="w-5 h-5 text-indigo-500" />} />
      <KPICard label="Completed Classes" value={completed} icon={<CheckCircle className="w-5 h-5 text-[var(--brand-green)]" />} />
      <KPICard label="Scheduled/Upcoming" value={scheduled} icon={<Clock className="w-5 h-5 text-blue-500" />} />
      <KPICard label="Cancelled Sessions" value={cancelled} icon={<AlertCircle className="w-5 h-5 text-red-500" />} />
    </div>
  );
}

function RevenueKPI({ data }: { data: RevenueReport[] }) {
  const total = data.reduce((acc, r) => acc + (r.paymentStatus === "Paid" ? r.amount : 0), 0);
  const outstanding = data.reduce((acc, r) => acc + (r.paymentStatus === "Pending" ? r.amount : 0), 0);
  const refunded = data.reduce((acc, r) => acc + (r.paymentStatus === "Refunded" ? r.amount : 0), 0);
  const paidCount = data.filter((r) => r.paymentStatus === "Paid").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <KPICard label="Paid Net Revenue" value={`₹${total.toLocaleString("en-IN")}`} icon={<DollarSign className="w-5 h-5 text-[var(--brand-green)]" />} />
      <KPICard label="Outstanding Payments" value={`₹${outstanding.toLocaleString("en-IN")}`} icon={<AlertCircle className="w-5 h-5 text-amber-500" />} />
      <KPICard label="Refunded Fees" value={`₹${refunded.toLocaleString("en-IN")}`} icon={<Clock className="w-5 h-5 text-red-500" />} />
      <KPICard label="Settled Invoices" value={paidCount} icon={<Briefcase className="w-5 h-5 text-blue-500" />} />
    </div>
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

/* ──────────────────────────────────────────────────────────────────────────
   VISUAL HIGHLIGHTS / CUSTOM SVG CHARTS
   ────────────────────────────────────────────────────────────────────────── */

function TutorVisuals({ data }: { data: TutorPerformanceReport[] }) {
  if (data.length === 0) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Tutors conduct and satisfaction performance indices:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classes comparison list */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Top Tutors by Classes Conducted</span>
          <div className="space-y-2">
            {data.slice(0, 4).map((t) => {
              const percentage = Math.min((t.classesConducted / 50) * 100, 100);
              return (
                <div key={t.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{t.name}</span>
                    <span className="text-slate-500">{t.classesConducted} classes</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[var(--brand-green)] h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Satisfaction rates list */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Parent Satisfaction Score (%)</span>
          <div className="space-y-2">
            {data.slice(0, 4).map((t) => {
              return (
                <div key={t.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{t.name}</span>
                    <span className="text-[var(--brand-green)]">{t.satisfactionRate}% Satisfaction</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${t.satisfactionRate}%` }} />
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

function StudentVisuals({ data }: { data: StudentPerformanceReport[] }) {
  if (data.length === 0) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Student performance ratings relative indicators:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scores list */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Average Academic Marks Breakdown</span>
          <div className="space-y-2">
            {data.slice(0, 4).map((s) => {
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{s.name} ({s.courseName})</span>
                    <span className="text-slate-500">{s.avgAcademicScore}% Grade</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${s.avgAcademicScore}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignments submitted list */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Assignments Submission Compliance</span>
          <div className="space-y-2">
            {data.slice(0, 4).map((s) => {
              const compliance = Math.round((s.assignmentsSubmitted / s.assignmentsTotal) * 100);
              return (
                <div key={s.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{s.name}</span>
                    <span className="text-blue-500">{s.assignmentsSubmitted}/{s.assignmentsTotal} files ({compliance}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${compliance}%` }} />
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

function AttendanceVisuals({ data }: { data: AttendanceReport[] }) {
  if (data.length === 0) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Student session attendance records visual overview:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Individual Attendance Rate</span>
          <div className="space-y-2">
            {data.slice(0, 4).map((a) => {
              return (
                <div key={a.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{a.studentName}</span>
                    <span className={a.attendanceRate >= 90 ? "text-[var(--brand-green)]" : "text-amber-500"}>{a.attendanceRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[var(--brand-green)] h-full rounded-full transition-all duration-500" style={{ width: `${a.attendanceRate}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aggregated SVG Pie chart mock */}
        <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Sessions Presence Ratio</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              <span>Present: 85%</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span>Absent: 10%</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3 h-3 bg-slate-400 rounded-full"></span>
              <span>Excused: 5%</span>
            </div>
          </div>
          {/* Simple gorgeous SVG Chart */}
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ddd" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f87171" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5 95" strokeDashoffset="-15" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="80 20" strokeDashoffset="-20" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionVisuals({ data }: { data: SessionReport[] }) {
  if (data.length === 0) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  const total = data.length;
  const completed = data.filter((s) => s.status === "Completed").length;
  const cancelled = data.filter((s) => s.status === "Cancelled").length;
  const scheduled = data.filter((s) => s.status === "Scheduled").length;

  const compPct = Math.round((completed / total) * 100) || 0;
  const cancPct = Math.round((cancelled / total) * 100) || 0;
  const schePct = Math.round((scheduled / total) * 100) || 0;

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Session scheduling statuses and cancellation insights:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress breakdown */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-650">Completed Classes ({compPct}%)</span>
              <span className="text-emerald-500 font-bold">{completed} sessions</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${compPct}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-650">Scheduled / Upcoming ({schePct}%)</span>
              <span className="text-blue-500 font-bold">{scheduled} sessions</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${schePct}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-650">Cancelled / Postponed ({cancPct}%)</span>
              <span className="text-red-500 font-bold">{cancelled} sessions</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full transition-all" style={{ width: `${cancPct}%` }} />
            </div>
          </div>
        </div>

        {/* Informative notification block */}
        <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl space-y-2 flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-700">Cancellation Root-Cause Audit</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            The core cancellation reasons this week are due to student conflicts (80%) and tutor reschedule requests (20%). The overall class completion rating is healthy at <strong>{compPct}%</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

function RevenueVisuals({ data }: { data: RevenueReport[] }) {
  if (data.length === 0) return <div className="text-xs text-slate-400 text-center py-6">No data to display.</div>;

  const onlineSchool = data.filter((r) => r.courseType === "Online School" && r.paymentStatus === "Paid").reduce((acc, r) => acc + r.amount, 0);
  const onlineTuition = data.filter((r) => r.courseType === "Online Tuition" && r.paymentStatus === "Paid").reduce((acc, r) => acc + r.amount, 0);
  const hybridLearning = data.filter((r) => r.courseType === "Hybrid Learning" && r.paymentStatus === "Paid").reduce((acc, r) => acc + r.amount, 0);

  const total = onlineSchool + onlineTuition + hybridLearning || 1;

  const osPct = Math.round((onlineSchool / total) * 100);
  const otPct = Math.round((onlineTuition / total) * 100);
  const hlPct = Math.round((hybridLearning / total) * 100);

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">Course program contribution breakdown to settled revenue:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial distribution charts */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Paid Subscriptions Share (%)</span>
          <div className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Online School Program</span>
                <span className="text-[var(--brand-green)]">₹{onlineSchool.toLocaleString("en-IN")} ({osPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[var(--brand-green)] h-full rounded-full transition-all" style={{ width: `${osPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Online Tuitions Program</span>
                <span className="text-indigo-500 font-bold">₹{onlineTuition.toLocaleString("en-IN")} ({otPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${otPct}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Hybrid Learning Program</span>
                <span className="text-amber-500 font-bold">₹{hybridLearning.toLocaleString("en-IN")} ({hlPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${hlPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Method share visualization */}
        <div className="bg-slate-50 p-4 border border-slate-150 rounded-xl flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Methods Share</span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3.5 h-3.5 rounded bg-[var(--brand-green)]"></span>
              <span>UPI: 40%</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3.5 h-3.5 rounded bg-indigo-500"></span>
              <span>Credit Card: 30%</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3.5 h-3.5 rounded bg-amber-500"></span>
              <span>Net Banking: 20%</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="w-3.5 h-3.5 rounded bg-slate-400"></span>
              <span>Debit Card: 10%</span>
            </div>
          </div>
          <div className="w-24 h-24 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ddd" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="0" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-10" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-30" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="40 60" strokeDashoffset="-60" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   DETAILED TABULAR VIEWS FOR REPORT TYPES
   ────────────────────────────────────────────────────────────────────────── */

function TutorTable({ data }: { data: TutorPerformanceReport[] }) {
  return (
    <Table className="table-fixed w-full">
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Tutor Name</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Expertise</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Classes</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Rating</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[20%]">Performance Tier</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-100">
        {data.length > 0 ? (
          data.map((tutor) => (
            <TableRow key={tutor.id} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-800 leading-none">{tutor.name}</p>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">ID: {tutor.id}</span>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-slate-600 truncate">{tutor.subject}</TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-slate-700">{tutor.classesConducted}</TableCell>
              <TableCell className="px-5 py-4 text-xs text-center text-[var(--brand-green)] font-bold">
                ★ {tutor.rating.toFixed(2)}
              </TableCell>
              <TableCell className="px-5 py-4 text-right">
                <Badge
                  className={`text-[10px] font-bold py-0.5 px-2 border ${
                    tutor.performanceTier === "Outstanding"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : tutor.performanceTier === "Excellent"
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : tutor.performanceTier === "Very Good"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}
                >
                  {tutor.performanceTier}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="px-5 py-12 text-center text-slate-400 text-xs">
              No tutor performance records match the selected filter presets.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function StudentTable({ data }: { data: StudentPerformanceReport[] }) {
  return (
    <Table className="table-fixed w-full">
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Student</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Grade & Course</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Academic Score</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[15%]">Attendance</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[25%]">Assigned Tutor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-100">
        {data.length > 0 ? (
          data.map((student) => (
            <TableRow key={student.id} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-800 leading-none">{student.name}</p>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">ID: {student.id}</span>
              </TableCell>
              <TableCell className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-700 leading-none">{student.grade}</p>
                <span className="text-[9px] text-slate-450 mt-1 block">{student.courseName} • {student.courseType}</span>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-slate-750">{student.avgAcademicScore}%</TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-slate-750">{student.attendanceRate}%</TableCell>
              <TableCell className="px-5 py-4 text-right text-xs text-slate-600 font-medium">
                {student.tutorName}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="px-5 py-12 text-center text-slate-400 text-xs">
              No student performance logs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function AttendanceTable({ data }: { data: AttendanceReport[] }) {
  return (
    <Table className="table-fixed w-full">
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Student</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Subject</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[12%]">Scheduled</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[12%]">Present</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[12%]">Absent</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[19%]">Attendance Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-100">
        {data.length > 0 ? (
          data.map((att) => (
            <TableRow key={att.id} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-800 leading-none">{att.studentName}</p>
                <span className="text-[9px] text-slate-400 font-semibold mt-1 block">{att.grade} • ID: {att.studentId}</span>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-slate-600 truncate">{att.courseName}</TableCell>
              <TableCell className="px-5 py-4 text-xs text-center text-slate-700 font-medium">{att.sessionsScheduled}</TableCell>
              <TableCell className="px-5 py-4 text-xs text-center text-emerald-600 font-bold">{att.sessionsPresent}</TableCell>
              <TableCell className="px-5 py-4 text-xs text-center text-red-650 font-bold">{att.sessionsAbsent}</TableCell>
              <TableCell className="px-5 py-4 text-right">
                <span className={`text-xs font-bold ${att.attendanceRate >= 90 ? "text-[var(--brand-green)]" : "text-amber-600"}`}>
                  {att.attendanceRate}%
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="px-5 py-12 text-center text-slate-400 text-xs">
              No attendance records found matching filters.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function SessionTable({ data }: { data: SessionReport[] }) {
  return (
    <Table className="table-fixed w-full">
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Date</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Student / Tutor</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Subject / Slot</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[12%]">Duration</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[28%]">Status & Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-100">
        {data.length > 0 ? (
          data.map((session) => (
            <TableRow key={session.id} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4 text-xs text-slate-650 font-semibold">
                {session.date}
              </TableCell>
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-805 leading-none">Stu: {session.studentName}</p>
                <span className="text-[10px] text-slate-450 mt-1 block">Tut: {session.tutorName}</span>
              </TableCell>
              <TableCell className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-700 leading-none">{session.subject}</p>
                <span className="text-[9px] text-slate-400 mt-1 block">{session.timeSlot}</span>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-medium text-slate-650">{session.duration}m</TableCell>
              <TableCell className="px-5 py-4 text-right">
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    className={`text-[9px] font-bold py-0 px-2 border ${
                      session.status === "Completed"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : session.status === "Scheduled"
                        ? "bg-blue-50 text-blue-750 border-blue-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {session.status}
                  </Badge>
                  {session.remarks && (
                    <span className="text-[9px] text-slate-400 italic font-medium max-w-[200px] truncate block">
                      &ldquo;{session.remarks}&rdquo;
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="px-5 py-12 text-center text-slate-400 text-xs">
              No session records found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function RevenueTable({ data }: { data: RevenueReport[] }) {
  return (
    <Table className="table-fixed w-full">
      <TableHeader className="bg-slate-50/50">
        <TableRow>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Invoice ID</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Student & Course</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[20%]">Package & Method</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[18%]">Amount</TableHead>
          <TableHead className="px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[22%]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-100">
        {data.length > 0 ? (
          data.map((rev) => (
            <TableRow key={rev.invoiceId} className="hover:bg-slate-50/60 transition-colors">
              <TableCell className="px-5 py-4 text-xs text-slate-650 font-semibold">
                {rev.invoiceId}
                <span className="text-[9px] text-slate-400 font-semibold mt-1 block">Date: {rev.date}</span>
              </TableCell>
              <TableCell className="px-5 py-4">
                <p className="text-xs font-bold text-slate-805 leading-none">{rev.studentName}</p>
                <span className="text-[9px] text-slate-450 mt-1 block">{rev.courseName} ({rev.courseType})</span>
              </TableCell>
              <TableCell className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-700 leading-none">{rev.packageName}</p>
                <span className="text-[9px] text-slate-400 mt-1 block">Via {rev.paymentMethod}</span>
              </TableCell>
              <TableCell className="px-5 py-4 text-xs text-center font-bold text-slate-800">
                ₹{rev.amount.toLocaleString("en-IN")}
              </TableCell>
              <TableCell className="px-5 py-4 text-right">
                <Badge
                  className={`text-[9px] font-bold py-0 px-2 border ${
                    rev.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : rev.paymentStatus === "Pending"
                      ? "bg-amber-50 text-amber-700 border-amber-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}
                >
                  {rev.paymentStatus}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="px-5 py-12 text-center text-slate-400 text-xs">
              No financial invoice entries found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   REAL TUTOR PERFORMANCE REPORT COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

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
