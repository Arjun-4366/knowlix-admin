import type { jsPDF as Doc } from "jspdf";
import {
  ITutorPerformanceReportItem,
  IStudentPerformanceReportItem,
  IAttendanceReportResponse,
  IAttendanceReportItem,
  ISessionReportResponse,
  ISessionReportItem,
} from "@/types/admin/reports";

// ─── palette ──────────────────────────────────────────────────────────────────
const GREEN: [number, number, number] = [22, 163, 74];
const DARK: [number, number, number] = [15, 23, 42];
const SLATE700: [number, number, number] = [51, 65, 85];
const SLATE500: [number, number, number] = [100, 116, 139];
const SLATE100: [number, number, number] = [241, 245, 249];
const SLATE50: [number, number, number] = [248, 250, 252];
const WHITE: [number, number, number] = [255, 255, 255];
const BLUE: [number, number, number] = [59, 130, 246];
const RED: [number, number, number] = [239, 68, 68];
const AMBER: [number, number, number] = [245, 158, 11];
const PURPLE: [number, number, number] = [139, 92, 246];

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;
// Exact usable content width
const CW = PAGE_W - MARGIN * 2; // 515.28pt
const USABLE_H = PAGE_H - 65;

export interface ReportPDFOptions {
  type: "tutor" | "student_performance" | "attendance" | "session";
  dateRange: { startDate: string; endDate: string; preset: string };
  tutorData?: ITutorPerformanceReportItem[];
  studentData?: IStudentPerformanceReportItem[];
  attendanceData?: IAttendanceReportResponse;
  sessionData?: ISessionReportResponse;
}

// ─── utilities ────────────────────────────────────────────────────────────────
async function loadBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const SLATE200: [number, number, number] = [226, 232, 240];

function kpiBox(
  doc: Doc,
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
  _accent?: [number, number, number]
) {
  // white card with subtle border
  doc.setFillColor(...WHITE);
  doc.roundedRect(x, y, w, h, 4, 4, "F");
  doc.setDrawColor(...SLATE200);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 4, 4, "S");
  // value
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(value, x + w / 2, y + h / 2 + 3, { align: "center" });
  // label
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE500);
  doc.text(label, x + w / 2, y + h - 10, { align: "center" });
}

function ensureSpace(doc: Doc, y: number, needed: number): number {
  if (y + needed > USABLE_H) {
    doc.addPage();
    return 50;
  }
  return y;
}

type Align = "left" | "center" | "right";

function drawTableHeader(
  doc: Doc,
  cols: { label: string; width: number; align?: Align }[],
  y: number,
  rowH: number
) {
  doc.setFillColor(...SLATE100);
  doc.rect(MARGIN, y, CW, rowH, "F");
  doc.setDrawColor(...SLATE200);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y + rowH, MARGIN + CW, y + rowH);
  let cx = MARGIN;
  cols.forEach((c) => {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...SLATE700);
    const a = c.align ?? "left";
    const tx = a === "right" ? cx + c.width - 7 : a === "center" ? cx + c.width / 2 : cx + 7;
    doc.text(c.label.toUpperCase(), tx, y + rowH / 2 + 3, { align: a });
    cx += c.width;
  });
}

function drawTableRow(
  doc: Doc,
  cells: { text: string; width: number; align?: Align; color?: [number, number, number] }[],
  y: number,
  rowH: number,
  even: boolean
) {
  doc.setFillColor(...(even ? SLATE50 : WHITE));
  doc.rect(MARGIN, y, CW, rowH, "F");
  doc.setDrawColor(...SLATE100);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y + rowH, MARGIN + CW, y + rowH);
  let cx = MARGIN;
  cells.forEach((c) => {
    const a = c.align ?? "left";
    const tx = a === "right" ? cx + c.width - 7 : a === "center" ? cx + c.width / 2 : cx + 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...(c.color ?? SLATE700));
    doc.text(c.text, tx, y + rowH / 2 + 3, { align: a, maxWidth: c.width - 10 });
    cx += c.width;
  });
}

function sectionLabel(doc: Doc, text: string, y: number) {
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE500);
  doc.text(text, MARGIN, y);
  doc.setDrawColor(...SLATE200);
  doc.setLineWidth(0.4);
  doc.line(MARGIN + doc.getTextWidth(text) + 5, y - 1.5, MARGIN + CW, y - 1.5);
}

// ─── summary card rows ────────────────────────────────────────────────────────
function drawTutorSummary(doc: Doc, data: ITutorPerformanceReportItem[], y: number): number {
  const n = data.length;
  const avgGrowth = n ? (data.reduce((s, t) => s + t.growthPoints, 0) / n).toFixed(1) : "0";
  const totalCond = data.reduce((s, t) => s + t.conductedSessions, 0);
  const totalHours = data.reduce((s, t) => s + t.totalWorkHours, 0);
  const totalStudents = data.reduce((s, t) => s + t.assignedStudentCount, 0);
  const avgAtt = n ? Math.round(data.reduce((s, t) => s + t.attendanceRate, 0) / n) : 0;
  const H = 62;
  const gap = 8;
  // Row 1: 3 core metrics
  const bw3 = (CW - gap * 2) / 3;
  kpiBox(doc, MARGIN, y, bw3, H, `${n}`, "Total Tutors", BLUE);
  kpiBox(doc, MARGIN + (bw3 + gap) * 1, y, bw3, H, `${avgGrowth} pts`, "Avg Growth Points", GREEN);
  kpiBox(doc, MARGIN + (bw3 + gap) * 2, y, bw3, H, `${totalCond}`, "Sessions Conducted", PURPLE);
  // Row 2: 3 operational metrics
  const y2 = y + H + 10;
  kpiBox(doc, MARGIN, y2, bw3, H, `${totalHours}h`, "Total Work Hours", AMBER);
  kpiBox(doc, MARGIN + (bw3 + gap) * 1, y2, bw3, H, `${totalStudents}`, "Students Assigned", BLUE);
  kpiBox(doc, MARGIN + (bw3 + gap) * 2, y2, bw3, H, `${avgAtt}%`, "Avg Attendance", GREEN);
  return y2 + H;
}

function drawStudentSummary(doc: Doc, data: IStudentPerformanceReportItem[], y: number): number {
  const total = data.length;
  const completed = data.filter((d) => d.admissionStatus === "course_completed").length;
  const admitted = data.filter((d) => d.admissionStatus === "admission_taken").length;
  const pending = data.filter((d) => d.admissionStatus === "pending").length;
  const collected = data.reduce((s, d) => s + d.paidAmount, 0);
  const balance = data.reduce((s, d) => s + d.balanceFee, 0);
  const fmtFee = (n: number) =>
    n >= 100000 ? `Rs.${(n / 100000).toFixed(1)}L` : n >= 1000 ? `Rs.${(n / 1000).toFixed(1)}K` : `Rs.${n}`;
  const H = 62;
  const gap = 8;
  // Row 1: 4 admission cards
  const bw4 = (CW - gap * 3) / 4;
  kpiBox(doc, MARGIN, y, bw4, H, `${total}`, "Total Students", BLUE);
  kpiBox(doc, MARGIN + (bw4 + gap) * 1, y, bw4, H, `${completed}`, "Completed", GREEN);
  kpiBox(doc, MARGIN + (bw4 + gap) * 2, y, bw4, H, `${admitted}`, "Admitted", PURPLE);
  kpiBox(doc, MARGIN + (bw4 + gap) * 3, y, bw4, H, `${pending}`, "Pending", AMBER);
  // Row 2: 2 fee cards
  const y2 = y + H + 10;
  const bw2 = (CW - gap) / 2;
  kpiBox(doc, MARGIN, y2, bw2, H, fmtFee(collected), "Total Fee Collected", GREEN);
  kpiBox(doc, MARGIN + bw2 + gap, y2, bw2, H, fmtFee(balance), "Balance Outstanding", RED);
  return y2 + H;
}

function drawAttendanceSummary(doc: Doc, data: IAttendanceReportResponse, y: number): number {
  const H = 62;
  const gap = 8;
  const avgHrs = data.totalTutors > 0 ? (data.totalWorkHours / data.totalTutors).toFixed(1) : "0";
  const bw = (CW - gap * 3) / 4;
  kpiBox(doc, MARGIN, y, bw, H, `${data.totalTutors}`, "Total Tutors", BLUE);
  kpiBox(doc, MARGIN + (bw + gap) * 1, y, bw, H, `${data.totalSessions}`, "Total Sessions", PURPLE);
  kpiBox(doc, MARGIN + (bw + gap) * 2, y, bw, H, `${data.totalWorkHours}h`, "Total Work Hours", GREEN);
  kpiBox(doc, MARGIN + (bw + gap) * 3, y, bw, H, `${avgHrs}h`, "Avg Hrs / Tutor", AMBER);
  return y + H;
}

function drawAttendanceTable(doc: Doc, data: IAttendanceReportItem[], startY: number): number {
  const ROW_H = 26;
  const HEAD_H = 28;
  // 170 + 140 + 65 + 65 + 75 = 515
  const cols = [
    { label: "Tutor Name", width: 170, align: "left" as Align },
    { label: "Email", width: 140, align: "left" as Align },
    { label: "Days", width: 65, align: "center" as Align },
    { label: "Work Hrs", width: 65, align: "center" as Align },
    { label: "Sessions", width: 75, align: "center" as Align },
  ];

  let y = ensureSpace(doc, startY, HEAD_H + ROW_H);
  drawTableHeader(doc, cols, y, HEAD_H);
  y += HEAD_H;

  if (data.length === 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE500);
    doc.text("No records found.", MARGIN + CW / 2, y + 20, { align: "center" });
    return y + 40;
  }

  data.forEach((row, i) => {
    y = ensureSpace(doc, y, ROW_H);
    drawTableRow(
      doc,
      [
        { text: row.tutorName || "Unknown", width: cols[0].width },
        { text: row.tutorEmail || "-", width: cols[1].width, color: SLATE500 },
        { text: `${row.totalDays}`, width: cols[2].width, align: "center" },
        { text: `${row.totalWorkHours}h`, width: cols[3].width, align: "center", color: PURPLE },
        { text: `${row.totalSessions}`, width: cols[4].width, align: "center", color: BLUE },
      ],
      y,
      ROW_H,
      i % 2 === 0
    );
    y += ROW_H;
  });
  return y;
}

// ─── detail tables ────────────────────────────────────────────────────────────
// CW = 515.28 — column widths must sum exactly to this

function drawTutorTable(doc: Doc, data: ITutorPerformanceReportItem[], startY: number): number {
  const ROW_H = 28;
  const HEAD_H = 28;
  // 130 + 110 + 50 + 65 + 80 + 45 + 35 = 515
  const cols = [
    { label: "Tutor", width: 130, align: "left" as Align },
    { label: "Subjects", width: 110, align: "left" as Align },
    { label: "Students", width: 50, align: "center" as Align },
    { label: "Growth Pts", width: 65, align: "center" as Align },
    { label: "Sessions (C/T)", width: 80, align: "center" as Align },
    { label: "Work Hrs", width: 45, align: "center" as Align },
    { label: "Attend.", width: 35, align: "center" as Align },
  ];

  let y = ensureSpace(doc, startY, HEAD_H + ROW_H);
  drawTableHeader(doc, cols, y, HEAD_H);
  y += HEAD_H;

  if (data.length === 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE500);
    doc.text("No records found.", MARGIN + CW / 2, y + 20, { align: "center" });
    return y + 40;
  }

  data.forEach((t, i) => {
    y = ensureSpace(doc, y, ROW_H);
    const subjects = t.subjects.slice(0, 3).join(", ") + (t.subjects.length > 3 ? ` +${t.subjects.length - 3}` : "");
    drawTableRow(
      doc,
      [
        { text: t.name, width: cols[0].width },
        { text: subjects || "-", width: cols[1].width, color: SLATE500 },
        { text: `${t.assignedStudentCount}`, width: cols[2].width, align: "center" },
        { text: `${t.growthPoints} pts`, width: cols[3].width, align: "center", color: GREEN },
        { text: `${t.conductedSessions} / ${t.totalSessions}`, width: cols[4].width, align: "center", color: BLUE },
        { text: `${t.totalWorkHours}h`, width: cols[5].width, align: "center", color: PURPLE },
        {
          text: `${t.attendanceRate.toFixed(0)}%`,
          width: cols[6].width,
          align: "center",
          color: t.attendanceRate >= 75 ? GREEN : RED,
        },
      ],
      y,
      ROW_H,
      i % 2 === 0
    );
    y += ROW_H;
  });
  return y;
}

function drawStudentTable(doc: Doc, data: IStudentPerformanceReportItem[], startY: number): number {
  const ROW_H = 30;
  const HEAD_H = 28;
  // 115 + 120 + 70 + 60 + 55 + 50 + 45 = 515
  const cols = [
    { label: "Student", width: 115, align: "left" as Align },
    { label: "Course", width: 120, align: "left" as Align },
    { label: "Mentor", width: 70, align: "left" as Align },
    { label: "Status", width: 60, align: "center" as Align },
    { label: "Sessions", width: 55, align: "center" as Align },
    { label: "Attend.", width: 50, align: "center" as Align },
    { label: "Fee", width: 45, align: "right" as Align },
  ];

  let y = ensureSpace(doc, startY, HEAD_H + ROW_H);
  drawTableHeader(doc, cols, y, HEAD_H);
  y += HEAD_H;

  if (data.length === 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE500);
    doc.text("No records found.", MARGIN + CW / 2, y + 20, { align: "center" });
    return y + 40;
  }

  const statusLabel: Record<string, string> = {
    course_completed: "Completed",
    admission_taken: "Admitted",
    pending: "Pending",
  };
  const statusColor: Record<string, [number, number, number]> = {
    course_completed: GREEN,
    admission_taken: BLUE,
    pending: AMBER,
  };
  const fmtFee = (n: number) =>
    n >= 100000 ? `Rs.${(n / 100000).toFixed(1)}L` : n >= 1000 ? `Rs.${(n / 1000).toFixed(1)}K` : `Rs.${n}`;

  data.forEach((s, i) => {
    y = ensureSpace(doc, y, ROW_H);
    const course = s.courseName || s.programName || "-";
    drawTableRow(
      doc,
      [
        { text: s.studentName, width: cols[0].width },
        { text: course, width: cols[1].width, color: SLATE500 },
        { text: s.mentorName || "-", width: cols[2].width, color: SLATE500 },
        {
          text: statusLabel[s.admissionStatus] ?? s.admissionStatus,
          width: cols[3].width,
          align: "center",
          color: statusColor[s.admissionStatus] ?? SLATE700,
        },
        { text: `${s.conducted}/${s.totalSessions}`, width: cols[4].width, align: "center", color: BLUE },
        {
          text: `${s.attendanceRate.toFixed(0)}%`,
          width: cols[5].width,
          align: "center",
          color: s.attendanceRate >= 75 ? GREEN : RED,
        },
        { text: fmtFee(s.paidAmount), width: cols[6].width, align: "right", color: GREEN },
      ],
      y,
      ROW_H,
      i % 2 === 0
    );
    y += ROW_H;
  });
  return y;
}

function drawSessionSummary(doc: Doc, data: ISessionReportResponse, y: number): number {
  const H = 62;
  const gap = 8;
  const completed = data.data?.filter((s) => s.status === "completed").length ?? 0;
  const bw = (CW - gap * 4) / 5;
  kpiBox(doc, MARGIN, y, bw, H, `${data.total}`, "Total Sessions", BLUE);
  kpiBox(doc, MARGIN + (bw + gap) * 1, y, bw, H, `${data.conducted}`, "Conducted", GREEN);
  kpiBox(doc, MARGIN + (bw + gap) * 2, y, bw, H, `${completed}`, "Completed", PURPLE);
  kpiBox(doc, MARGIN + (bw + gap) * 3, y, bw, H, `${data.notConducted}`, "Not Conducted", RED);
  kpiBox(doc, MARGIN + (bw + gap) * 4, y, bw, H, `${data.scheduled}`, "Scheduled", AMBER);
  return y + H;
}

function drawSessionTable(doc: Doc, data: ISessionReportItem[], startY: number): number {
  const ROW_H = 28;
  const HEAD_H = 28;
  // 145 + 90 + 50 + 70 + 90 + 40 + 30 = 515
  const cols = [
    { label: "Session", width: 145, align: "left" as Align },
    { label: "Tutor", width: 90, align: "left" as Align },
    { label: "Type", width: 50, align: "center" as Align },
    { label: "Students", width: 70, align: "left" as Align },
    { label: "Scheduled At", width: 90, align: "left" as Align },
    { label: "Duration", width: 40, align: "center" as Align },
    { label: "Status", width: 30, align: "center" as Align },
  ];

  let y = ensureSpace(doc, startY, HEAD_H + ROW_H);
  drawTableHeader(doc, cols, y, HEAD_H);
  y += HEAD_H;

  if (data.length === 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE500);
    doc.text("No records found.", MARGIN + CW / 2, y + 20, { align: "center" });
    return y + 40;
  }

  const statusLabel: Record<string, string> = {
    conducted: "Done",
    completed: "Compl.",
    not_conducted: "Missed",
    scheduled: "Sched.",
  };
  const statusColor: Record<string, [number, number, number]> = {
    conducted: BLUE,
    completed: GREEN,
    not_conducted: RED,
    scheduled: AMBER,
  };

  data.forEach((row, i) => {
    y = ensureSpace(doc, y, ROW_H);
    const fmtDate = (iso: string) => {
      try {
        return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      } catch {
        return iso;
      }
    };
    const studentText =
      row.students.length === 0
        ? "None"
        : row.students
            .slice(0, 2)
            .map((s) => s.studentName)
            .join(", ") + (row.students.length > 2 ? ` +${row.students.length - 2}` : "");

    drawTableRow(
      doc,
      [
        { text: row.title || "-", width: cols[0].width },
        { text: row.tutorName || "-", width: cols[1].width, color: SLATE500 },
        { text: row.type, width: cols[2].width, align: "center", color: row.type === "group" ? PURPLE : SLATE700 },
        { text: studentText, width: cols[3].width, color: SLATE500 },
        { text: fmtDate(row.scheduledAt), width: cols[4].width, color: SLATE500 },
        { text: `${row.durationMinutes}m`, width: cols[5].width, align: "center", color: PURPLE },
        {
          text: statusLabel[row.status] ?? row.status,
          width: cols[6].width,
          align: "center",
          color: statusColor[row.status] ?? SLATE700,
        },
      ],
      y,
      ROW_H,
      i % 2 === 0
    );
    y += ROW_H;
  });
  return y;
}

// ─── main ─────────────────────────────────────────────────────────────────────
export async function generateReportPDF(options: ReportPDFOptions): Promise<void> {
  const jspdfMod = await import("jspdf");
  const doc = new jspdfMod.jsPDF({ orientation: "portrait", unit: "pt", format: "a4" }) as Doc;

  const reportLabel =
    options.type === "tutor"
      ? "Tutor Performance Report"
      : options.type === "student_performance"
      ? "Student Performance Report"
      : options.type === "attendance"
      ? "Attendance Summary Report"
      : "Session Report";

  const logoBase64 = await loadBase64("/images/logo.png");

  const HEADER_H = 44;
  let y = 0;

  // ── Header band ────────────────────────────────────────────────────────────
  // Left: logo | Center: report title | Right: period + generated
  const headerMidY = HEADER_H / 2;

  // Logo (left)
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", MARGIN, headerMidY - 10, 58, 18);
  }

  // Report title (center)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...DARK);
  doc.text(reportLabel, PAGE_W / 2, headerMidY + 2, { align: "center" });

  // Period + Generated (right, two lines)
  const genDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...SLATE500);
  doc.text(
    `${options.dateRange.startDate}  to  ${options.dateRange.endDate}`,
    PAGE_W - MARGIN,
    headerMidY - 3,
    { align: "right" }
  );
  doc.text(`Generated: ${genDate}`, PAGE_W - MARGIN, headerMidY + 8, { align: "right" });

  y = HEADER_H;

  // thin rule under header
  doc.setDrawColor(...SLATE200);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 20;

  // ── Summary ────────────────────────────────────────────────────────────────
  sectionLabel(doc, "SUMMARY", y);
  y += 10;

  if (options.type === "tutor" && options.tutorData) {
    y = drawTutorSummary(doc, options.tutorData, y);
  } else if (options.type === "student_performance" && options.studentData) {
    y = drawStudentSummary(doc, options.studentData, y);
  } else if (options.type === "attendance" && options.attendanceData) {
    y = drawAttendanceSummary(doc, options.attendanceData, y);
  } else if (options.type === "session" && options.sessionData) {
    y = drawSessionSummary(doc, options.sessionData, y);
  }

  y += 22;

  // ── Detail table ───────────────────────────────────────────────────────────
  sectionLabel(doc, "DETAILED DATA", y);
  y += 10;

  if (options.type === "tutor" && options.tutorData) {
    drawTutorTable(doc, options.tutorData, y);
  } else if (options.type === "student_performance" && options.studentData) {
    drawStudentTable(doc, options.studentData, y);
  } else if (options.type === "attendance" && options.attendanceData) {
    drawAttendanceTable(doc, options.attendanceData.data ?? [], y);
  } else if (options.type === "session" && options.sessionData) {
    drawSessionTable(doc, options.sessionData.data ?? [], y);
  }

  // ── Footer on every page ───────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...SLATE200);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, PAGE_H - 32, PAGE_W - MARGIN, PAGE_H - 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...SLATE500);
    doc.text(
      "Confidential  |  Knowlix Education Platform  |  Admin Dashboard",
      MARGIN,
      PAGE_H - 22
    );
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 22, { align: "right" });
  }

  const fileName = `${reportLabel.toLowerCase().replace(/\s+/g, "_")}_${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;
  doc.save(fileName);
}
