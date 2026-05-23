"use client";

import { useState, useEffect } from "react";
import { Award, BookOpen, TrendingUp, Calendar, AlertCircle, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

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

export default function StudentResults() {
  const [subjects, setSubjects] = useState(mockSubjectGrades);
  const [results, setResults] = useState(mockTestResults);

  // Load submissions and evaluations if available to sync
  useEffect(() => {
    const storedEval = localStorage.getItem("knowlix_evaluations");
    if (storedEval) {
      try {
        const evals = JSON.parse(storedEval);
        // Map evaluations to results if they are for STU-101
        const studentEvals = evals.filter((e: any) => e.studentId === "STU-101");
        if (studentEvals.length > 0) {
          const mappedEvals = studentEvals.map((e: any) => {
            const pct = Math.round((e.obtainedMarks / e.maxMarks) * 100);
            return {
              id: e.id,
              testName: e.assessmentTitle,
              subject: e.subject || "Mathematics",
              date: e.evaluatedAt,
              score: `${e.obtainedMarks} / ${e.maxMarks}`,
              percentage: pct,
              grade: e.grade,
              remarks: e.remarks || "Evaluated by tutor."
            };
          });
          setResults((prev) => [...mappedEvals, ...prev]);
        }
      } catch (e) {}
    }
  }, []);

  // Performance chart coordinates simulation (SVG sparklines)
  // We plot percentage scores over time
  const points = results
    .slice()
    .reverse()
    .map((r, i) => ({ x: i * 80 + 30, y: 150 - (r.percentage - 50) * 2 }));

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--brand-light-green)] border border-[var(--brand-light)]/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-[var(--brand-green)]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cumulative GPA</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">A+ (93.6%)</p>
          </div>
        </Card>

        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 border border-blue-150 rounded-2xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Tests Taken</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">{results.length} Assessments</p>
          </div>
        </Card>

        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 border border-amber-150 rounded-2xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Class Standings</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">Rank 3rd of 24</p>
          </div>
        </Card>

        <Card className="bg-white border-slate-150 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 border border-purple-150 rounded-2xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Course Progress</span>
            <p className="text-xl font-black text-slate-800 mt-0.5">85% Completed</p>
          </div>
        </Card>
      </div>

      {/* Analytics chart and Subject Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sparkline Score progression chart */}
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden lg:col-span-2">
          <CardHeader className="p-6 pb-2 border-b border-slate-50 bg-slate-50/20">
            <CardTitle className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assessment Score Analytics (Trends)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full flex items-center justify-center bg-slate-50/50 rounded-2xl border border-slate-100 p-4 relative h-64 overflow-hidden">
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
                {results.slice().reverse().map((r, idx) => (
                  <text
                    key={idx}
                    x={idx * 80 + 30}
                    y="170"
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-slate-400 font-heading"
                  >
                    {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </text>
                ))}
              </svg>
              <div className="absolute top-4 left-6 flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--brand-green)]" /> Scores Obtained (%)
                </span>
              </div>
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
            {subjects.map((sub, i) => (
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
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Table: Detailed Test Scores Transcript */}
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
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">Test ID</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[25%]">Test Name</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[18%]">Subject</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Date Taken</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[12%]">Score</TableHead>
                  <TableHead className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right w-[18%]">Grade & Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {results.map((res) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
