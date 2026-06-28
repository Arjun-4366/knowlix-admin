import type { jsPDF as Doc } from "jspdf";

// ─── palette ──────────────────────────────────────────────────────────────────
const GREEN: [number, number, number] = [22, 163, 74];
const DARK: [number, number, number] = [15, 23, 42];
const DARK_MID: [number, number, number] = [30, 41, 59];
const SLATE700: [number, number, number] = [51, 65, 85];
const SLATE500: [number, number, number] = [100, 116, 139];
const SLATE300: [number, number, number] = [203, 213, 225];
const SLATE100: [number, number, number] = [241, 245, 249];
const SLATE50: [number, number, number] = [248, 250, 252];
const WHITE: [number, number, number] = [255, 255, 255];
const RED: [number, number, number] = [220, 38, 38];

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 40;
const CW = PAGE_W - MARGIN * 2;

const COMPANY = {
  name: "Knowlix Learning",
  address: "Kozhikode, Kerala - 673003, India",
  email: "hello@knowlixlearning.com",
  phone: "+91 7025235519",
};

export interface InvoiceStudentData {
  name: string;
  admissionNumber: string;
  class: string;
  programName?: string;
  courseName?: string;
  parentName?: string;
  email?: string;
  phone?: string;
  place?: string;
  mentorName?: string;
}

export interface InvoiceData {
  student: InvoiceStudentData;
  fees: {
    totalFee: number;
    paidAmount: number;
    dueAmount: number;
  };
}

// ─── helpers ──────────────────────────────────────────────────────────────────
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

function fmt(n: number) {
  return "Rs. " + n.toLocaleString("en-IN");
}

function invoiceNumber(admissionNumber: string) {
  const ts = Date.now().toString().slice(-6);
  const prefix = (admissionNumber || "STU").replace(/[^A-Z0-9]/gi, "").slice(0, 6).toUpperCase();
  return `INV-${prefix}-${ts}`;
}

function todayStr() {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

function hline(doc: Doc, y: number, color: [number, number, number] = SLATE300, width = 0.5) {
  doc.setDrawColor(...color);
  doc.setLineWidth(width);
  doc.line(MARGIN, y, MARGIN + CW, y);
}

function infoLabel(doc: Doc, text: string, x: number, y: number) {
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE500);
  doc.text(text.toUpperCase(), x, y);
}

function infoValue(doc: Doc, text: string, x: number, y: number, color: [number, number, number] = SLATE700, size = 9) {
  doc.setFontSize(size);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...color);
  doc.text(text, x, y);
}

function infoBold(doc: Doc, text: string, x: number, y: number, color: [number, number, number] = DARK, size = 10) {
  doc.setFontSize(size);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...color);
  doc.text(text, x, y);
}

// ─── main ─────────────────────────────────────────────────────────────────────
export async function generateInvoicePDF(data: InvoiceData): Promise<void> {
  const jspdfMod = await import("jspdf");
  const doc = new jspdfMod.jsPDF({ orientation: "portrait", unit: "pt", format: "a4" }) as Doc;

  const { student, fees } = data;
  const invNo = invoiceNumber(student.admissionNumber);
  const issueDate = todayStr();
  const isFullyPaid = fees.dueAmount === 0;
  const logoBase64 = await loadBase64("/images/logo.png");

  // ── 1. HEADER – white background ────────────────────────────────────────────
  // Logo (left)
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", MARGIN, 22, 66, 22);
  }

  // "FEE INVOICE" (right) in dark text
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("FEE INVOICE", PAGE_W - MARGIN, 24, { align: "right" });

  // Invoice # and date (right, below title)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE500);
  doc.text(invNo, PAGE_W - MARGIN, 50, { align: "right" });
  doc.text(`Issued: ${issueDate}`, PAGE_W - MARGIN, 62, { align: "right" });

  // Thin green separator line under header
  const HEADER_END = 78;
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(1.5);
  doc.line(MARGIN, HEADER_END, MARGIN + CW, HEADER_END);

  // ── 2. BILLING INFO – TWO COLUMNS ───────────────────────────────────────────
  let y = HEADER_END + 20;
  const COL1 = MARGIN;
  const COL2 = MARGIN + CW / 2 + 10;
  const lineH = 14;

  // Left: BILLED TO
  infoLabel(doc, "Billed To", COL1, y);
  y += 13;

  infoBold(doc, student.name, COL1, y, DARK, 11);
  y += lineH;

  infoValue(doc, `Admission ID: ${student.admissionNumber}`, COL1, y);
  y += lineH;
  infoValue(doc, `Class / Grade: ${student.class}`, COL1, y);
  y += lineH;

  if (student.programName || student.courseName) {
    infoValue(doc, `Program: ${student.programName || student.courseName}`, COL1, y);
    y += lineH;
  }
  if (student.parentName) {
    infoValue(doc, `Parent: ${student.parentName}`, COL1, y);
    y += lineH;
  }
  if (student.phone) {
    infoValue(doc, `Phone: ${student.phone}`, COL1, y);
    y += lineH;
  }
  if (student.email) {
    infoValue(doc, `Email: ${student.email}`, COL1, y);
    y += lineH;
  }
  if (student.place) {
    infoValue(doc, `Location: ${student.place}`, COL1, y);
    y += lineH;
  }

  // Right: FROM (company) – starts at same top as left column
  const fromTopY = HEADER_END + 20;
  let ry = fromTopY;
  infoLabel(doc, "From", COL2, ry);
  ry += 13;

  infoBold(doc, COMPANY.name, COL2, ry, DARK, 10);
  ry += lineH;
  infoValue(doc, COMPANY.address, COL2, ry);
  ry += lineH;
  infoValue(doc, `Email: ${COMPANY.email}`, COL2, ry);
  ry += lineH;
  infoValue(doc, `Phone: ${COMPANY.phone}`, COL2, ry);
  ry += lineH;


  // ── 3. SECTION DIVIDER ──────────────────────────────────────────────────────
  y += 18;
  hline(doc, y, SLATE300, 0.5);
  y += 18;

  // ── 4. FEE SUMMARY TABLE ────────────────────────────────────────────────────
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE500);
  doc.text("FEE SUMMARY", MARGIN, y);
  y += 12;

  // Table header row
  const HEAD_H = 28;
  doc.setFillColor(...DARK_MID);
  doc.rect(MARGIN, y, CW, HEAD_H, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("DESCRIPTION", MARGIN + 12, y + HEAD_H / 2 + 3);
  doc.text("AMOUNT", MARGIN + CW - 12, y + HEAD_H / 2 + 3, { align: "right" });
  y += HEAD_H;

  const ROW_H = 32;

  // Row 1: Course Enrollment Fee
  doc.setFillColor(...WHITE);
  doc.rect(MARGIN, y, CW, ROW_H, "F");
  doc.setDrawColor(...SLATE100);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y + ROW_H, MARGIN + CW, y + ROW_H);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE700);
  doc.text("Course Enrollment Fee", MARGIN + 12, y + ROW_H / 2 + 3.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text(fmt(fees.totalFee), MARGIN + CW - 12, y + ROW_H / 2 + 3.5, { align: "right" });
  y += ROW_H;

  // Row 2: Amount Received
  doc.setFillColor(...SLATE50);
  doc.rect(MARGIN, y, CW, ROW_H, "F");
  doc.setDrawColor(...SLATE100);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y + ROW_H, MARGIN + CW, y + ROW_H);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE700);
  doc.text("Amount Received", MARGIN + 12, y + ROW_H / 2 + 3.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GREEN);
  doc.text("- " + fmt(fees.paidAmount), MARGIN + CW - 12, y + ROW_H / 2 + 3.5, { align: "right" });
  y += ROW_H;

  // Row 3: Balance Outstanding
  doc.setFillColor(...WHITE);
  doc.rect(MARGIN, y, CW, ROW_H, "F");
  doc.setDrawColor(...SLATE300);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, y, MARGIN + CW, y);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE700);
  doc.text("Balance Outstanding", MARGIN + 12, y + ROW_H / 2 + 3.5);

  const balColor: [number, number, number] = fees.dueAmount > 0 ? RED : GREEN;
  doc.setTextColor(...balColor);
  doc.text(fmt(fees.dueAmount), MARGIN + CW - 12, y + ROW_H / 2 + 3.5, { align: "right" });
  y += ROW_H;

  // ── 5. AMOUNT DUE BOX – clean, no background ────────────────────────────────
  y += 16;
  const BOX_H = 52;

  // White box with subtle border
  doc.setFillColor(...WHITE);
  doc.setDrawColor(...SLATE300);
  doc.setLineWidth(0.6);
  doc.roundedRect(MARGIN, y, CW, BOX_H, 4, 4, "FD");

  // Left: label
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE500);
  doc.text(isFullyPaid ? "TOTAL PAID" : "TOTAL AMOUNT DUE", MARGIN + 16, y + BOX_H / 2 - 4);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE500);
  doc.text(
    isFullyPaid ? "Your fee account is fully up to date." : "Please clear your balance at the earliest.",
    MARGIN + 16,
    y + BOX_H / 2 + 9
  );

  // Right: amount
  const amtColor: [number, number, number] = isFullyPaid ? GREEN : RED;
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...amtColor);
  const displayAmt = isFullyPaid ? fmt(fees.paidAmount) : fmt(fees.dueAmount);
  doc.text(displayAmt, MARGIN + CW - 16, y + BOX_H / 2 + 6, { align: "right" });

  y += BOX_H + 24;

  // ── 6. NOTES ────────────────────────────────────────────────────────────────
  hline(doc, y, SLATE300, 0.4);
  y += 14;

  const notes = [
    `For billing queries contact: ${COMPANY.email} or call ${COMPANY.phone}.`,
    "This is a system-generated invoice and does not require a physical signature.",
  ];

  notes.forEach((n) => {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE500);
    doc.text(`- ${n}`, MARGIN + 4, y, { maxWidth: CW - 8 });
    y += 13;
  });

  // ── 7. FOOTER ───────────────────────────────────────────────────────────────
  const footerY = PAGE_H - 36;
  hline(doc, footerY, SLATE300, 0.4);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...SLATE500);
  doc.text(
    `${COMPANY.name}  |  ${COMPANY.address}`,
    MARGIN,
    footerY + 14
  );
  doc.text("Page 1 of 1", PAGE_W - MARGIN, footerY + 14, { align: "right" });

  const fileName = `Knowlix_Invoice_${student.admissionNumber}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}
