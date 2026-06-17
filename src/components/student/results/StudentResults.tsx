"use client";

import { Award, BookOpen, TrendingUp, BarChart2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import {
  useGetStudentResults,
  useGetStudentResultsGrades,
  useGetStudentResultsAnalytics,
} from "@/querys/student/studentQuery";

const GRADE_COLORS: Record<string, string> = {
  "A+": "bg-emerald-50 text-emerald-700 border-emerald-100",
  A: "bg-emerald-50 text-emerald-700 border-emerald-100",
  "B+": "bg-blue-50 text-blue-700 border-blue-100",
  B: "bg-blue-50 text-blue-700 border-blue-100",
  C: "bg-amber-50 text-amber-700 border-amber-100",
  D: "bg-orange-50 text-orange-700 border-orange-100",
  F: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function StudentResults() {
  const { data: resultsData, isLoading: resultsLoading } = useGetStudentResults();
  const { data: gradesData, isLoading: gradesLoading } = useGetStudentResultsGrades();
  const { data: analyticsData } = useGetStudentResultsAnalytics();

  const results = Array.isArray(resultsData) ? resultsData : [];
  const grades = Array.isArray(gradesData) ? gradesData : [];
  const analytics = Array.isArray(analyticsData) ? analyticsData : [];

  const totalTests = results.length;
  const overallAvg = analytics.length > 0
    ? Math.round(analytics.reduce((s, a) => s + a.percentage, 0) / analytics.length)
    : results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0;

  const topGrade = grades.reduce<string | null>((best, g) => {
    if (!best) return g.letterGrade;
    const order = ["A+", "A", "B+", "B", "C", "D", "F"];
    return order.indexOf(g.letterGrade) < order.indexOf(best) ? g.letterGrade : best;
  }, null);

  // SVG chart from analytics
  const chartPoints = analytics.map((item, i) => {
    const pct = Math.round(item.percentage);
    const x = analytics.length === 1 ? 225 : i * (380 / (analytics.length - 1)) + 40;
    const y = 150 - (pct - 40) * 1.5;
    let label = item.month;
    try {
      const [year, month] = item.month.split("-");
      label = new Date(parseInt(year), parseInt(month) - 1, 1)
        .toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    } catch {}
    return { x, y: Math.max(20, Math.min(150, y)), pct, label };
  });

  const svgPath = chartPoints.reduce((path, p, i) =>
    i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, "");

  if (resultsLoading || gradesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Results & Grades"
        description="Review your academic marks, subject performance, and progress trends."
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardStatCard
          label="Overall Average"
          value={`${overallAvg}%`}
          icon={<Award className="w-6 h-6" />}
          badgeText={topGrade || "N/A"}
          footerText="Across all assessments"
        />
        <DashboardStatCard
          label="Total Tests Taken"
          value={totalTests}
          icon={<BookOpen className="w-6 h-6" />}
          badgeText="Assessments"
          footerText="Evaluated tutor exams"
        />
        <DashboardStatCard
          label="Subjects Covered"
          value={grades.length}
          icon={<TrendingUp className="w-6 h-6" />}
          badgeText="Subjects"
          footerText="With published grades"
        />
        <DashboardStatCard
          label="Best Subject Grade"
          value={topGrade || "N/A"}
          icon={<BarChart2 className="w-6 h-6" />}
          badgeText="Top Grade"
          footerText="Highest letter grade earned"
        />
      </div>

      {/* Chart + Subject Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Trend Chart */}
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden lg:col-span-2">
          <CardHeader className="p-6 pb-2 border-b border-slate-50 bg-slate-50/20">
            <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Score Trend (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 p-4 relative h-64 overflow-hidden">
              {chartPoints.length >= 2 ? (
                <>
                  <svg viewBox="0 0 450 180" className="w-full h-full">
                    <line x1="30" y1="30" x2="420" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    <line x1="30" y1="80" x2="420" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    <line x1="30" y1="130" x2="420" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                    <path
                      d={svgPath}
                      fill="none"
                      stroke="var(--brand-green)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {chartPoints.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="5.5" fill="white" stroke="var(--brand-green)" strokeWidth="3" />
                        <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="bold">
                          {p.pct}%
                        </text>
                        <text x={p.x} y="170" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="bold">
                          {p.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                  <div className="absolute top-4 left-6 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[var(--brand-green)]" />
                    <span className="text-[10px] font-bold text-slate-450 uppercase">Average Score (%)</span>
                  </div>
                </>
              ) : chartPoints.length === 1 ? (
                <div className="flex flex-col items-center justify-center gap-3 h-full">
                  <div className="w-20 h-20 rounded-full border-4 border-[var(--brand-green)] flex items-center justify-center bg-white shadow-sm">
                    <span className="text-2xl font-black text-[var(--brand-green)]">{chartPoints[0].pct}%</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">Average Score</p>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{chartPoints[0].label}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">More months will appear as data accumulates</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-semibold">No trend data available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Subject Grades */}
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Subject Grades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {grades.length > 0 ? (
              grades.map((g, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-800">{g.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--brand-green)]">{Math.round(g.percentage)}%</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold rounded-md px-1.5 py-0 shadow-none ${GRADE_COLORS[g.letterGrade] || GRADE_COLORS.C}`}
                      >
                        {g.letterGrade}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand-green)] rounded-full transition-all"
                      style={{ width: `${Math.round(g.percentage)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold block">
                    {g.totalExams} exam{g.totalExams !== 1 ? "s" : ""} · Avg {Math.round(g.averageScore)}/{g.maxMarks / g.totalExams} marks
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-xs text-slate-400 font-medium">No subject grades available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Detailed Test Transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-slate-50/20">
                <TableRow>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[28%]">Exam Title</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Subject</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">Tutor</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[14%]">Date</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">Score</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[15%]">Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {results.length > 0 ? (
                  results.map((res) => (
                    <TableRow key={res.id} className="hover:bg-slate-50/40 transition-colors font-semibold text-slate-650 text-xs">
                      <TableCell className="px-6 py-4 text-slate-800 font-bold">
                        {res.examId.title}
                      </TableCell>
                      <TableCell className="px-6 py-4">{res.examId.subject}</TableCell>
                      <TableCell className="px-6 py-4 text-slate-600">{res.examId.tutorId.name}</TableCell>
                      <TableCell className="px-6 py-4">
                        {new Date(res.examId.examDate).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="px-6 py-4 font-bold text-slate-800">
                        {res.marksObtained}/{res.examId.maxMarks}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-none ${GRADE_COLORS[res.grade || "C"] || GRADE_COLORS.C}`}
                          >
                            {res.grade} · {Math.round(res.percentage)}%
                          </Badge>
                          {res.remarks && (
                            <span className="text-[9px] text-slate-400 italic max-w-[140px] truncate" title={res.remarks}>
                              "{res.remarks}"
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="px-6 py-12 text-center text-slate-450 text-xs font-medium">
                      No results published yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
