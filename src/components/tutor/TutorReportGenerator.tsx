"use client";

import { useState, useEffect } from "react";
import { Award, ClipboardCheck, Sparkles, Check, RefreshCw, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import { ProgressReport } from "./TutorReportStats";
import { Student } from "@/components/admin/students/StudentStats";
import { Evaluation } from "./TutorAssessmentStats";

interface AttendanceLog {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "Present" | "Absent" | "Late";
  tutorName: string;
}

interface TutorReportGeneratorProps {
  students: Student[];
  attendanceLogs: AttendanceLog[];
  evaluations: Evaluation[];
  activeTemplateId: "monthly" | "term-end" | "weekly";
  setActiveTemplateId: (id: "monthly" | "term-end" | "weekly") => void;
  onGenerateReport: (report: ProgressReport) => void;
}

const BEHAVIORAL_OPTIONS = ["Excellent", "Good", "Needs Improvement"] as const;
const GRADE_OPTIONS = ["A+", "A", "B", "C", "D", "F"] as const;

export default function TutorReportGenerator({
  students,
  attendanceLogs,
  evaluations,
  activeTemplateId,
  setActiveTemplateId,
  onGenerateReport,
}: TutorReportGeneratorProps) {
  // Filter approved students assigned to Dr. Ramesh Prasad
  const myStudents = students.filter(
    (s) => s.subjectTutor === "Dr. Ramesh Prasad" && s.admissionStatus === "Approved"
  );

  // Form states
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [period, setPeriod] = useState("");
  const [attendanceRate, setAttendanceRate] = useState<number>(95);
  const [behavioral, setBehavioral] = useState({
    attentiveness: "Excellent" as typeof BEHAVIORAL_OPTIONS[number],
    participation: "Good" as typeof BEHAVIORAL_OPTIONS[number],
    homeworkPunctuality: "Excellent" as typeof BEHAVIORAL_OPTIONS[number],
  });
  const [tutorFeedback, setTutorFeedback] = useState("");
  const [overallGrade, setOverallGrade] = useState<string>("A");
  const [customScores, setCustomScores] = useState<{ subject: string; score: number }[]>([]);

  // Derived state or calculations for selected student
  const [calculatedAttendance, setCalculatedAttendance] = useState<number | null>(null);
  const [calculatedAvgScore, setCalculatedAvgScore] = useState<number | null>(null);
  const [studentEvalList, setStudentEvalList] = useState<Evaluation[]>([]);

  // Set default student & period
  useEffect(() => {
    if (myStudents.length > 0 && !selectedStudentId) {
      setSelectedStudentId(myStudents[0].id);
    }
  }, [myStudents, selectedStudentId]);

  useEffect(() => {
    if (!period) {
      const now = new Date();
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      setPeriod(`${monthNames[now.getMonth()]} ${now.getFullYear()}`);
    }
  }, [period]);

  // Recalculate stats whenever student or database changes
  useEffect(() => {
    if (!selectedStudentId) return;

    // 1. Calculate Attendance
    const studentLogs = attendanceLogs.filter((l) => l.studentId === selectedStudentId);
    if (studentLogs.length > 0) {
      const presentCount = studentLogs.filter((l) => l.status === "Present" || l.status === "Late").length;
      const rate = Math.round((presentCount / studentLogs.length) * 100);
      setCalculatedAttendance(rate);
      setAttendanceRate(rate);
    } else {
      setCalculatedAttendance(null);
      setAttendanceRate(95); // fallback/realistic starting value
    }

    // 2. Fetch and Calculate Evaluation Averages
    const studentEvls = evaluations.filter((e) => e.studentId === selectedStudentId);
    setStudentEvalList(studentEvls);

    if (studentEvls.length > 0) {
      const totalPct = studentEvls.reduce((sum, e) => {
        const pct = e.maxMarks > 0 ? (e.obtainedMarks / e.maxMarks) * 100 : 0;
        return sum + pct;
      }, 0);
      const avgPct = Math.round(totalPct / studentEvls.length);
      setCalculatedAvgScore(avgPct);

      // Auto-assign overall grade based on average
      if (avgPct >= 90) setOverallGrade("A+");
      else if (avgPct >= 80) setOverallGrade("A");
      else if (avgPct >= 70) setOverallGrade("B");
      else if (avgPct >= 60) setOverallGrade("C");
      else if (avgPct >= 50) setOverallGrade("D");
      else setOverallGrade("F");

      // Extract subject scores
      const extracted = studentEvls.map((e) => ({
        subject: e.assessmentTitle,
        score: Math.round((e.obtainedMarks / e.maxMarks) * 100),
      }));
      setCustomScores(extracted);
    } else {
      setCalculatedAvgScore(null);
      setOverallGrade("A");
      // Pre-fill some default subject nodes for high-fidelity if student has no recorded evaluations
      const studentObj = myStudents.find((s) => s.id === selectedStudentId);
      const course = studentObj?.courseType || "Foundation Course";
      setCustomScores([
        { subject: `${course} Assessment 1`, score: 85 },
        { subject: `Classroom Quiz`, score: 90 },
      ]);
    }
  }, [selectedStudentId, attendanceLogs, evaluations]);

  // Quick feedback templates
  const FEEDBACK_PRESETS = [
    {
      label: "Excellent",
      text: "Demonstrates an exceptional understanding of course topics. Participates actively and completes all tasks with high accuracy.",
      grade: "A+",
    },
    {
      label: "Good Work",
      text: "Shows consistent effort and solid comprehension of theoretical details. Keep up the good work!",
      grade: "A",
    },
    {
      label: "Progressing",
      text: "Good engagement in sessions. Performance is steady, though additional practice in homework problems will help solidify understanding.",
      grade: "B",
    },
    {
      label: "Needs Focus",
      text: "Active in class, but needs to pay closer attention to assignment deadlines and review fundamental topics for better results.",
      grade: "C",
    },
  ];

  const applyPreset = (presetText: string, presetGrade: string) => {
    setTutorFeedback(presetText);
    setOverallGrade(presetGrade);
  };

  const handleScoreChange = (index: number, newScore: number) => {
    const updated = [...customScores];
    updated[index].score = Math.min(100, Math.max(0, newScore));
    setCustomScores(updated);
  };

  const addCustomSubject = () => {
    setCustomScores([...customScores, { subject: "New Assessment", score: 80 }]);
  };

  const removeCustomSubject = (index: number) => {
    const updated = customScores.filter((_, i) => i !== index);
    setCustomScores(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudentId) {
      toast.error("Please select a student.");
      return;
    }

    const studentObj = myStudents.find((s) => s.id === selectedStudentId);
    if (!studentObj) return;

    const templateNames = {
      "monthly": "Monthly Academic Check",
      "term-end": "Term-End Summary",
      "weekly": "Weekly Performance Slip",
    };

    const newReport: ProgressReport = {
      id: `REP-${Date.now()}`,
      studentId: studentObj.id,
      studentName: studentObj.name,
      templateId: activeTemplateId,
      templateName: templateNames[activeTemplateId],
      period,
      attendanceRate,
      academicScores: customScores,
      behavioralRatings: { ...behavioral },
      tutorFeedback: tutorFeedback.trim() || "No comments entered by tutor.",
      overallGrade,
      generatedAt: new Date().toISOString(),
      tutorName: "Dr. Ramesh Prasad",
    };

    onGenerateReport(newReport);
    toast.success(`Progress Report generated for ${studentObj.name}!`);

    // Clear feedback comments
    setTutorFeedback("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ── Configuration Form ── */}
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ClipboardCheck className="w-4.5 h-4.5 text-[var(--brand-green)]" />
              Configure Progress Report
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* Student and Template selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Student
                </label>
                {myStudents.length > 0 ? (
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                      <SelectValue placeholder="Select Student" />
                    </SelectTrigger>
                    <SelectContent>
                      {myStudents.map((s) => (
                        <SelectItem key={s.id} value={s.id} className="text-xs font-medium">
                          {s.name} ({s.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-10 flex items-center px-3 border border-dashed border-red-200 bg-red-50 text-xs text-red-500 rounded-xl font-semibold">
                    No approved students found
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Select Template Layout
                </label>
                <Select
                  value={activeTemplateId}
                  onValueChange={(val) => setActiveTemplateId(val as "monthly" | "term-end" | "weekly")}
                >
                  <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly" className="text-xs">Monthly Academic Check</SelectItem>
                    <SelectItem value="term-end" className="text-xs">Term-End Summary</SelectItem>
                    <SelectItem value="weekly" className="text-xs">Weekly Performance Slip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Period and Overall Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Reporting Period / Term
                </label>
                <Input
                  type="text"
                  placeholder="e.g. May 2026, Semester 1, Week 2"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Overall Performance Grade
                </label>
                <Select value={overallGrade} onValueChange={setOverallGrade}>
                  <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-semibold">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADE_OPTIONS.map((g) => (
                      <SelectItem key={g} value={g} className="text-xs font-bold">
                        Grade {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Attendance Rate Configurator */}
            <div className="bg-slate-50/60 border border-slate-150 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Attendance Summary
                  </span>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    {calculatedAttendance !== null ? (
                      <span className="text-[var(--brand-green)] font-bold flex items-center gap-0.5 mt-0.5">
                        <Sparkles className="w-3 h-3 fill-[var(--brand-green)]" />
                        Calculated attendance is {calculatedAttendance}%
                      </span>
                    ) : (
                      "No log history. Adjust sliding rate manually."
                    )}
                  </p>
                </div>
                <Badge className="bg-slate-900 text-white border-none rounded-lg h-7 px-3 text-sm font-bold">
                  {attendanceRate}%
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-450 font-bold">0%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={attendanceRate}
                  onChange={(e) => setAttendanceRate(parseInt(e.target.value))}
                  className="flex-1 accent-[var(--brand-green)] h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-slate-450 font-bold">100%</span>
              </div>
            </div>

            {/* Behavioral Aspect Ratings */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Behavioral Aspects
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Attentiveness */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">Attentiveness</span>
                  <Select
                    value={behavioral.attentiveness}
                    onValueChange={(val) =>
                      setBehavioral({
                        ...behavioral,
                        attentiveness: val as typeof BEHAVIORAL_OPTIONS[number],
                      })
                    }
                  >
                    <SelectTrigger className="h-9 bg-white text-xs border-slate-200 rounded-lg">
                      <SelectValue placeholder="Attentiveness" />
                    </SelectTrigger>
                    <SelectContent>
                      {BEHAVIORAL_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o} className="text-xs">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Participation */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">Class Participation</span>
                  <Select
                    value={behavioral.participation}
                    onValueChange={(val) =>
                      setBehavioral({
                        ...behavioral,
                        participation: val as typeof BEHAVIORAL_OPTIONS[number],
                      })
                    }
                  >
                    <SelectTrigger className="h-9 bg-white text-xs border-slate-200 rounded-lg">
                      <SelectValue placeholder="Participation" />
                    </SelectTrigger>
                    <SelectContent>
                      {BEHAVIORAL_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o} className="text-xs">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Punctuality */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block">Homework Punctuality</span>
                  <Select
                    value={behavioral.homeworkPunctuality}
                    onValueChange={(val) =>
                      setBehavioral({
                        ...behavioral,
                        homeworkPunctuality: val as typeof BEHAVIORAL_OPTIONS[number],
                      })
                    }
                  >
                    <SelectTrigger className="h-9 bg-white text-xs border-slate-200 rounded-lg">
                      <SelectValue placeholder="Punctuality" />
                    </SelectTrigger>
                    <SelectContent>
                      {BEHAVIORAL_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o} className="text-xs">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Qualitative Feedback Area & Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Tutor Remarks & Feedback
                </label>
                <span className="text-[10px] text-slate-400 font-bold">Quick Presets:</span>
              </div>

              {/* Presets Row */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {FEEDBACK_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset.text, preset.grade)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <Textarea
                placeholder="Write customized qualitative feedback for this student..."
                value={tutorFeedback}
                onChange={(e) => setTutorFeedback(e.target.value)}
                className="min-h-[100px] bg-white border border-slate-200 rounded-xl text-sm"
                required
              />
            </div>

            {/* Issue Button */}
            <Button
              type="submit"
              disabled={!selectedStudentId}
              className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <Check className="w-5 h-5" /> Generate & Save Progress Report
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* ── Academic scores calculation display column ── */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--brand-green)]" />
              Academic Scores Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Assessment Database
              </p>
              <p className="text-xs text-slate-500 leading-normal">
                {calculatedAvgScore !== null ? (
                  <span className="text-[var(--brand-green)] font-bold flex items-center gap-0.5">
                    <Sparkles className="w-3.5 h-3.5 fill-[var(--brand-green)]" />
                    Student has {studentEvalList.length} evaluation sheets. Avg: {calculatedAvgScore}%
                  </span>
                ) : (
                  "No evaluations recorded. Using realistic course metrics below."
                )}
              </p>
            </div>

            {/* Editable Subjects grid */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Subjects & Scores (0 - 100)
              </span>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                {customScores.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-xl p-2.5"
                  >
                    <input
                      type="text"
                      value={item.subject}
                      onChange={(e) => {
                        const updated = [...customScores];
                        updated[index].subject = e.target.value;
                        setCustomScores(updated);
                      }}
                      className="flex-1 bg-transparent border-none text-xs font-semibold focus:outline-none focus:ring-0 text-slate-850 px-1"
                      placeholder="Subject/Assessment"
                    />

                    <div className="flex items-center gap-1.5 w-20">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={item.score}
                        onChange={(e) => handleScoreChange(index, parseInt(e.target.value) || 0)}
                        className="w-14 h-7 text-xs font-bold text-center border-slate-200 bg-white rounded-md p-1"
                      />
                      <span className="text-xs text-slate-450 font-bold">%</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCustomSubject(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors text-xs font-bold px-1"
                      title="Remove row"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addCustomSubject}
                className="w-full py-1.5 px-3 border border-dashed border-slate-350 hover:border-[var(--brand-green)] hover:text-[var(--brand-green)] text-xs text-slate-500 font-bold rounded-xl transition-all cursor-pointer"
              >
                + Add Subject / Test Score
              </button>
            </div>

            {/* Calculations review */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Calculated Report Average
              </span>
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-800">
                  {customScores.length > 0
                    ? `${Math.round(customScores.reduce((sum, s) => sum + s.score, 0) / customScores.length)}%`
                    : "0%"}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Maps to overall Grade <span className="font-bold text-[var(--brand-green)]">{overallGrade}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
