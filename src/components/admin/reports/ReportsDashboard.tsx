"use client";

import { useState, useEffect } from "react";
import {
  ReportFiltersState,
  TutorPerformanceReport,
} from "./types";
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
  const [filteredTutors, setFilteredTutors] = useState<TutorPerformanceReport[]>([]);

  // Generate Report execution
  const handleGenerate = () => {
    setIsGenerating(true);
    setHasGenerated(false);

    setTimeout(() => {
      // Set active filters to trigger query hook
      setActiveFilters(filters);

      // Perform filtering
      const { type, tutorTier } = filters;

      if (type === "tutor") {
        // Since we are using react-query for real data, the filtering is handled by the hook
        // We could apply local filtering on `realReportsResponse` if needed,
        // but for now the hook fetches based on `activeFilters.tutorId`.
      }

      setIsGenerating(false);
      setHasGenerated(true);
      toast.success(`${getReportLabel(type)} generated successfully!`);
    }, 900);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setActiveFilters(initialFilters);
    setFilteredTutors([]);
    toast.success("Filters reset to default.");
  };

  // Helper to fetch report names
  const getReportLabel = (type: string) => {
    return "Tutor Performance Report";
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

          {/* Render Custom SVG Visualizations */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Visual Highlights & Summary
            </h3>
            {filters.type === "tutor" && <RealTutorVisuals data={realReportsResponse?.data ?? []} />}
          </div>

          {/* Detail Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Detailed Dataset</h3>
              <p className="text-xs text-slate-400 mt-1">Tabular breakdown of the generated report parameters.</p>
            </div>
            {filters.type === "tutor" && <RealTutorTable data={realReportsResponse?.data ?? []} />}
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

