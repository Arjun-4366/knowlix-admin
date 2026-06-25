import type { jsPDF as Doc } from "jspdf";
import {
  ITutorPerformanceReportItem,
  IStudentPerformanceReportItem,
  IAttendanceReportResponse,
} from "@/types/admin/reports";

// ─── palette ──────────────────────────────────────────────────────────────────
const GREEN: [number, number, number] = [22, 163, 74];
const DARK: [number, number, number] = [15, 23, 42];
const SLATE700: [number, number, number] = [51, 65, 85];
const SLATE500: [number, number, number] = [100, 116, 139];
const SLATE300: [number, number, number] = [203, 213, 225];
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
  type: "tutor" | "student_performance" | "attendance";
  dateRange: { startDate: string; endDate: string; preset: string };
  tutorData?: ITutorPerformanceReportItem[];
  studentData?: IStudentPerformanceReportItem[];
  attendanceData?: IAttendanceReportResponse;
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

function kpiBox(
  doc: Doc,
  x: number,
  y: number,
  w: number,
  h: number,
  value: string,
  label: string,
  accent: [number, number, number] = GREEN
) {
  // card background + border
  doc.setFillColor(...SLATE50);
  doc.roundedRect(x, y, w, h, 5, 5, "F");
  doc.setDrawColor(...SLATE300);
  doc.setLineWidth(0.5);
  doc.roundedRect(x, y, w, h, 5, 5, "S");
  // coloured top bar
  doc.setFillColor(...accent);
  doc.roundedRect(x, y, w, 3.5, 1.5, 1.5, "F");
  // value
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(value, x + w / 2, y + h / 2 + 4, { align: "center" });
  // label
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE500);
  doc.text(label, x + w / 2, y + h - 9, { align: "center" });
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
  doc.setFillColor(...DARK);
  doc.rect(MARGIN, y, CW, rowH, "F");
  let cx = MARGIN;
  cols.forEach((c) => {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...WHITE);
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
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE500);
  doc.text(text, MARGIN, y);
}

// ─── summary card rows ────────────────────────────────────────────────────────
function drawTutorSummary(doc: Doc, data: ITutorPerformanceReportItem[], y: number): number {
  const n = data.length;
  const avgGrowth = n ? (data.reduce((s, t) => s + t.growthPoints, 0) / n).toFixed(1) : "0";
  const totalCond = data.reduce((s, t) => s + t.conductedSessions, 0);
  const avgPerf = n ? (data.reduce((s, t) => s + t.performanceScore, 0) / n).toFixed(1) : "0";
  const avgAtt = n ? Math.round(data.reduce((s, t) => s + t.attendanceRate, 0) / n) : 0;
  const H = 62;
  const gap = 8;
  const bw = (CW - gap * 3) / 4;
  kpiBox(doc, MARGIN, y, bw, H, `${avgGrowth} pts`, "Avg Growth Points", GREEN);
  kpiBox(doc, MARGIN + (bw + gap) * 1, y, bw, H, `${totalCond}`, "Total Conducted", BLUE);
  kpiBox(doc, MARGIN + (bw + gap) * 2, y, bw, H, `${avgPerf} / 100`, "Avg Perf. Score", PURPLE);
  kpiBox(doc, MARGIN + (bw + gap) * 3, y, bw, H, `${avgAtt}%`, "Avg Attendance", AMBER);
  return y + H;
}

function drawStudentSummary(doc: Doc, data: IStudentPerformanceReportItem[], y: number): number {
  const total = data.length;
  const completed = data.filter((d) => d.admissionStatus === "course_completed").length;
  const admitted = data.filter((d) => d.admissionStatus === "admission_taken").length;
  const pending = data.filter((d) => d.admissionStatus === "pending").length;
  const H = 62;
  const gap = 8;
  const bw = (CW - gap * 3) / 4;
  kpiBox(doc, MARGIN, y, bw, H, `${total}`, "Total Students", BLUE);
  kpiBox(doc, MARGIN + (bw + gap) * 1, y, bw, H, `${completed}`, "Completed", GREEN);
  kpiBox(doc, MARGIN + (bw + gap) * 2, y, bw, H, `${admitted}`, "Active", PURPLE);
  kpiBox(doc, MARGIN + (bw + gap) * 3, y, bw, H, `${pending}`, "Pending", AMBER);
  return y + H;
}

function drawAttendanceSummary(doc: Doc, data: IAttendanceReportResponse, y: number): number {
  const H = 62;
  const gap = 6;
  const bw = (CW - gap * 4) / 5;
  kpiBox(doc, MARGIN, y, bw, H, `${data.attendanceRate}%`, "Attendance Rate", PURPLE);
  kpiBox(doc, MARGIN + (bw + gap) * 1, y, bw, H, `${data.total}`, "Total Sessions", SLATE500);
  kpiBox(doc, MARGIN + (bw + gap) * 2, y, bw, H, `${data.conducted}`, "Conducted", GREEN);
  kpiBox(doc, MARGIN + (bw + gap) * 3, y, bw, H, `${data.notConducted}`, "Not Conducted", RED);
  kpiBox(doc, MARGIN + (bw + gap) * 4, y, bw, H, `${data.postponed}`, "Postponed", AMBER);
  return y + H;
}

// ─── detail tables ────────────────────────────────────────────────────────────
// CW = 515.28 — column widths must sum exactly to this

function drawTutorTable(doc: Doc, data: ITutorPerformanceReportItem[], startY: number): number {
  const ROW_H = 26;
  const HEAD_H = 28;
  // 125 + 90 + 67 + 110 + 65 + 58 = 515
  const cols = [
    { label: "Tutor Name", width: 125, align: "left" as Align },
    { label: "Role", width: 90, align: "left" as Align },
    { label: "Growth Pts", width: 67, align: "center" as Align },
    { label: "G-H-O-R-T-W", width: 110, align: "center" as Align },
    { label: "Cond / Total", width: 65, align: "center" as Align },
    { label: "Attendance", width: 58, align: "center" as Align },
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
    const role = t.role
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
    const bd = t.growthBreakdown;
    const breakdown = `G:${bd.G ?? 0} H:${bd.H ?? 0} O:${bd.O ?? 0} R:${bd.R ?? 0} T:${bd.T ?? 0} W:${bd.W ?? 0}`;
    drawTableRow(
      doc,
      [
        { text: t.name, width: cols[0].width },
        { text: role, width: cols[1].width, color: SLATE500 },
        { text: `${t.growthPoints} pts`, width: cols[2].width, align: "center", color: GREEN },
        { text: breakdown, width: cols[3].width, align: "center", color: SLATE500 },
        { text: `${t.conductedSessions} / ${t.totalSessions}`, width: cols[4].width, align: "center" },
        {
          text: `${t.attendanceRate}%`,
          width: cols[5].width,
          align: "center",
          color: t.attendanceRate >= 80 ? GREEN : RED,
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
  const ROW_H = 26;
  const HEAD_H = 28;
  // 115 + 100 + 42 + 75 + 45 + 69 + 69 = 515
  const cols = [
    { label: "Student", width: 115, align: "left" as Align },
    { label: "Parent", width: 100, align: "left" as Align },
    { label: "Class", width: 42, align: "center" as Align },
    { label: "Status", width: 75, align: "center" as Align },
    { label: "Total", width: 45, align: "center" as Align },
    { label: "Conducted", width: 69, align: "center" as Align },
    { label: "Not Cond.", width: 69, align: "center" as Align },
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

  data.forEach((s, i) => {
    y = ensureSpace(doc, y, ROW_H);
    drawTableRow(
      doc,
      [
        { text: s.studentName, width: cols[0].width },
        { text: s.parentName, width: cols[1].width, color: SLATE500 },
        { text: `Cls ${s.class}`, width: cols[2].width, align: "center" },
        {
          text: statusLabel[s.admissionStatus] ?? s.admissionStatus,
          width: cols[3].width,
          align: "center",
          color: statusColor[s.admissionStatus] ?? SLATE700,
        },
        { text: `${s.totalSessions}`, width: cols[4].width, align: "center" },
        { text: `${s.conducted}`, width: cols[5].width, align: "center", color: BLUE },
        { text: `${s.notConducted}`, width: cols[6].width, align: "center", color: RED },
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
      : "Attendance Summary Report";

  const logoBase64 = await loadBase64("/images/logo.png");

  let y = 36;

  // ── Header row ─────────────────────────────────────────────────────────────
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", MARGIN, y - 6, 108, 34);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...SLATE500);
  doc.text("ADMIN REPORT", PAGE_W - MARGIN, y + 2, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Knowlix Education Platform", PAGE_W - MARGIN, y + 14, { align: "right" });

  y += 44;

  // green bar
  doc.setFillColor(...GREEN);
  doc.rect(MARGIN, y, CW, 3, "F");
  y += 14;

  // ── Title ──────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...DARK);
  doc.text(reportLabel, MARGIN, y);
  y += 20;

  // ── Meta row ───────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...SLATE500);
  doc.text(
    `Period: ${options.dateRange.startDate}  to  ${options.dateRange.endDate}`,
    MARGIN,
    y
  );
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`,
    PAGE_W - MARGIN,
    y,
    { align: "right" }
  );
  y += 8;

  // thin rule
  doc.setDrawColor(...SLATE300);
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
  }

  y += 22;

  // ── Detail table ───────────────────────────────────────────────────────────
  sectionLabel(doc, "DETAILED DATA", y);
  y += 10;

  if (options.type === "tutor" && options.tutorData) {
    drawTutorTable(doc, options.tutorData, y);
  } else if (options.type === "student_performance" && options.studentData) {
    drawStudentTable(doc, options.studentData, y);
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...SLATE500);
    doc.text(
      "Detailed row-level data is not available for the attendance report.",
      MARGIN,
      y + 16
    );
  }

  // ── Footer on every page ───────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...SLATE300);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, PAGE_H - 36, PAGE_W - MARGIN, PAGE_H - 36);
    doc.setFillColor(...GREEN);
    doc.rect(MARGIN, PAGE_H - 33, 20, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE500);
    doc.text(
      "Confidential  |  Knowlix Education Platform  |  Admin Dashboard",
      MARGIN + 26,
      PAGE_H - 26
    );
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 26, { align: "right" });
  }

  const fileName = `${reportLabel.toLowerCase().replace(/\s+/g, "_")}_${new Date()
    .toISOString()
    .slice(0, 10)}.pdf`;
  doc.save(fileName);
}
