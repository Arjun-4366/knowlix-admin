"use client";

import { useState, useEffect } from "react";
import { Award, BookOpen, TrendingUp, Calendar, AlertCircle, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";

interface SubjectGrade {
  subject: string;
  grade: string;
  obtainedScore: number; // Percent
  tutorName: string;
  totalTests: number;
}

interface TestResult {
  id: string;
  testName: string;
  subject: string;
  date: string;
  score: string;
  percentage: number;
  grade: string;
  remarks: string;
}

const mockSubjectGrades: SubjectGrade[] = [
  { subject: "Mathematics", grade: "A+", obtainedScore: 95, tutorName: "Dr. Ramesh Prasad", totalTests: 4 },
  { subject: "Physics", grade: "A", obtainedScore: 92, tutorName: "Dr. Ramesh Prasad", totalTests: 3 },
  { subject: "Chemistry", grade: "A-", obtainedScore: 88, tutorName: "Vikram Malhotra", totalTests: 2 },
  { subject: "English Literature", grade: "A+", obtainedScore: 94, tutorName: "Sarah Jenkins", totalTests: 2 },
  { subject: "Computer Science", grade: "A+", obtainedScore: 96, tutorName: "David Miller", totalTests: 2 },
];

const mockTestResults: TestResult[] = [
  { id: "TST-101", testName: "Differentiation Rules Test", subject: "Mathematics", date: "2026-05-15", score: "48 / 50", percentage: 96, grade: "A+", remarks: "Excellent grasp of calculus concepts. Keep it up!" },
  { id: "TST-102", testName: "Kinematics Mechanics Quiz", subject: "Physics", date: "2026-05-10", score: "38 / 50", percentage: 76, grade: "B", remarks: "Solid overall, but review circular motion formulas." },
  { id: "TST-103", testName: "Organic Chemistry Basics", subject: "Chemistry", date: "2026-05-02", score: "44 / 50", percentage: 88, grade: "A-", remarks: "Great improvement in nomenclature. Good study ethics." },
  { id: "TST-104", testName: "Trigonometry Mid-term Exam", subject: "Mathematics", date: "2026-04-28", score: "94 / 100", percentage: 94, grade: "A+", remarks: "Outstanding performance in proving identities." },
  { id: "TST-105", testName: "Newton's Laws Quiz", subject: "Physics", date: "2026-04-12", score: "46 / 50", percentage: 92, grade: "A", remarks: "Very structured free body diagrams." }
];

import {
  useGetStudentResults,
  useGetStudentResultsGrades,
  useGetStudentResultsAnalytics
} from "@/querys/student/studentQuery";
import { IMonthlyTrend } from "@/types/student/student";

const computeLetterGrade = (pct: number) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 35) return "D";
  return "F";
};

export default function StudentResults() {
  const [subjects, setSubjects] = useState<SubjectGrade[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [analytics, setAnalytics] = useState<IMonthlyTrend[]>([]);

  const { data: resultsData, isLoading: resultsLoading } = useGetStudentResults();
  const { data: gradesData, isLoading: gradesLoading } = useGetStudentResultsGrades();
  const { data: analyticsData } = useGetStudentResultsAnalytics();

  useEffect(() => {
    if (resultsData && Array.isArray(resultsData)) {
      const mappedResults = resultsData.map((res) => {
        const pct = Math.round(res.percentage || 0);
        return {
          id: res.id,
          testName: res.examTitle || "Subject Test",
          subject: res.subject,
          date: res.examDate || res.enteredAt,
          score: `${res.marksObtained} / ${res.maxMarks}`,
          percentage: pct,
          grade: res.grade || computeLetterGrade(pct),
          remarks: res.remarks || "No remarks provided.",
        };
      });
      setResults(mappedResults);
    } else {
      setResults([]);
    }
  }, [resultsData]);

  useEffect(() => {
    if (gradesData && Array.isArray(gradesData)) {
      const mappedSubjects = gradesData.map((g) => ({
        subject: g.subject,
        grade: g.letterGrade || computeLetterGrade(g.percentage),
        obtainedScore: Math.round(g.percentage),
        tutorName: "Dr. Ramesh Prasad", // fallback lead tutor
        totalTests: g.totalExams,
      }));
      setSubjects(mappedSubjects);
    } else {
      setSubjects([]);
    }
  }, [gradesData]);

  useEffect(() => {
    if (analyticsData && Array.isArray(analyticsData)) {
      setAnalytics(analyticsData);
    } else {
      setAnalytics([]);
    }
  }, [analyticsData]);

  const totalPercentageSum = results.reduce((acc, r) => acc + r.percentage, 0);
  const cumulativePercentage = results.length > 0 ? Math.round(totalPercentageSum / results.length) : 0;
  const cumulativeGrade = results.length > 0 ? computeLetterGrade(cumulativePercentage) : "N/A";

  // Performance chart coordinates using monthly analytics trends or fallback individual results
  const chartSource = analytics.length > 0 ? analytics : results.slice().reverse();
  const points = chartSource.map((item: any, i) => {
    const pct = Math.round(item.percentage || 0);
    let label = "";
    if (item.month) {
      try {
        const [year, month] = item.month.split("-");
        const d = new Date(parseInt(year), parseInt(month) - 1, 1);
        label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      } catch (e) {
        label = item.month;
      }
    } else if (item.date) {
      try {
        label = new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } catch (e) {
        label = "N/A";
      }
    }
    return {
      x: i * (chartSource.length > 4 ? 350 / (chartSource.length - 1) : 100) + 40,
      y: 150 - (pct - 50) * 2,
      percentage: pct,
      label: label
    };
  });

  const svgPath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Results & Grades"
        description="Review your academic marks transcripts, subject performance trackers, and progress reports."
      />

      {/* Top Cards: Overall Analytics */}
      {resultsLoading || gradesLoading ? (
        <div className="flex items-center justify-center min-h-[40vh] w-full">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashboardStatCard
              label="Cumulative GPA"
              value={cumulativeGrade}
              icon={<Award className="w-6 h-6" />}
              badgeText={`${cumulativePercentage}% Avg`}
              footerText="Weighted academic standing"
            />

            <DashboardStatCard
              label="Total Tests Taken"
              value={results.length}
              icon={<BookOpen className="w-6 h-6" />}
              badgeText="Assessments"
              footerText="Evaluated tutor exams"
            />

            <DashboardStatCard
              label="Class Standings"
              value="3rd Rank"
              icon={<TrendingUp className="w-6 h-6" />}
              badgeText="Top 5%"
              footerText="Ranked of 24 students"
            />

            <DashboardStatCard
              label="Course Progress"
              value="85%"
              icon={<CheckCircle2 className="w-6 h-6" />}
              badgeText="On Track"
              footerText="Syllabus segments cleared"
            />
          </div>

          {/* Analytics chart and Subject Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Sparkline Score progression chart */}
            <Card className="bg-white border-slate-150 shadow-sm overflow-hidden lg:col-span-2">
              <CardHeader className="p-6 pb-2 border-b border-slate-50 bg-slate-50/20">
                <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Assessment Score Analytics (Trends)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 p-4 relative h-64 overflow-hidden">
                  {points.length > 0 ? (
                    <>
                      <svg viewBox="0 0 450 180" className="w-full h-full">
                        {/* Gridlines */}
                        <line x1="30" y1="30" x2="420" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                        <line x1="30" y1="80" x2="420" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                        <line x1="30" y1="130" x2="420" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />

                        {/* Score line */}
                        {points.length > 1 && (
                          <>
                            <path
                              d={svgPath}
                              fill="none"
                              stroke="var(--brand-green)"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {points.map((p, idx) => (
                              <circle
                                key={idx}
                                cx={p.x}
                                cy={p.y}
                                r="5.5"
                                fill="white"
                                stroke="var(--brand-green)"
                                strokeWidth="3"
                              />
                            ))}
                          </>
                        )}

                        {/* Chart labels */}
                        {points.map((p, idx) => (
                          <text
                            key={idx}
                            x={p.x}
                            y="170"
                            textAnchor="middle"
                            className="text-[9px] font-bold fill-slate-400 font-heading"
                          >
                            {p.label}
                          </text>
                        ))}
                      </svg>
                      <div className="absolute top-4 left-6 flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[var(--brand-green)]" /> Scores Obtained (%)
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                      No assessment score analytics available at this time.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subject wise report cards */}
            <Card className="bg-white border-slate-150 shadow-sm overflow-hidden">
              <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Subject Grades Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {subjects.length > 0 ? (
                  subjects.map((sub, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-800">{sub.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--brand-green)]">{sub.obtainedScore}%</span>
                          <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 shadow-none text-[10px] font-bold rounded-md px-1.5 py-0">
                            {sub.grade}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--brand-green)] rounded-full transition-all"
                          style={{ width: `${sub.obtainedScore}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold block">
                        Tutor: {sub.tutorName} · {sub.totalTests} Tests Evaluated
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium">
                    No subject grades summary available.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Table: Detailed Test Scores Transcript */}
          <Card className="bg-white border-slate-150 shadow-sm overflow-hidden mt-6">
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
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">Test ID</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Test Name</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">Subject</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Date Taken</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">Score</TableHead>
                      <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[18%]">Grade & Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100">
                    {results.length > 0 ? (
                      results.map((res) => (
                        <TableRow key={res.id} className="hover:bg-slate-50/40 transition-colors font-semibold text-slate-650 text-xs">
                          <TableCell className="px-6 py-4 text-slate-400 font-bold">{res.id}</TableCell>
                          <TableCell className="px-6 py-4 text-slate-800 font-bold">{res.testName}</TableCell>
                          <TableCell className="px-6 py-4">{res.subject}</TableCell>
                          <TableCell className="px-6 py-4 font-semibold">
                            {new Date(res.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </TableCell>
                          <TableCell className="px-6 py-4 font-bold text-slate-750">{res.score}</TableCell>
                          <TableCell className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 shadow-none text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {res.grade} ({res.percentage}%)
                              </Badge>
                              <span className="text-[9px] text-slate-400 italic block mt-0.5 max-w-[150px] truncate" title={res.remarks}>
                                "{res.remarks}"
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="px-6 py-12 text-center text-slate-450 text-xs font-medium">
                          No assessment test results published at this time.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
