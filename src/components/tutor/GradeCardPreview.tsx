"use client";

import { GradeCardReport, calcGrade } from "./TutorReportStats";

interface GradeCardPreviewProps {
  report: GradeCardReport;
}

export default function GradeCardPreview({ report }: GradeCardPreviewProps) {
  const isYearly = report.reportType === "annual";

  const totals = report.subjects.reduce(
    (acc, s) => ({
      faMax: acc.faMax + (s.faMax || 0),
      faScored: acc.faScored + (s.faScored || 0),
      saMax: acc.saMax + (s.saMax || 0),
      saScored: acc.saScored + (s.saScored || 0),
    }),
    { faMax: 0, faScored: 0, saMax: 0, saScored: 0 }
  );

  const totalMax = isYearly ? totals.faMax + totals.saMax : totals.faMax;
  const totalScored = isYearly ? totals.faScored + totals.saScored : totals.faScored;
  const overallGrade = totalMax > 0 ? calcGrade(totalScored, totalMax) : "—";

  const tb = "1px solid #d0d0d0";
  const ob = "1.5px solid #c0c0c0";

  const td = (extra?: React.CSSProperties): React.CSSProperties => ({
    border: tb,
    padding: "7px 12px",
    fontSize: "11px",
    lineHeight: "1.5",
    color: "#111",
    ...extra,
  });

  const th = (extra?: React.CSSProperties): React.CSSProperties => ({
    border: tb,
    padding: "6px 10px",
    fontSize: "10px",
    fontWeight: "700",
    background: "#f2f2f2",
    color: "#333",
    textAlign: "center" as const,
    ...extra,
  });

  const issueFormatted = report.issueDate
    ? new Date(report.issueDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div
      id="grade-card-preview"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        width: "100%",
        background: "#fff",
        color: "#111",
        border: ob,
        boxSizing: "border-box",
      }}
    >
      {/* ─── HEADER ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "16px 20px 14px",
          borderBottom: ob,
        }}
      >
        <div>
          <div style={{ fontSize: "26px", fontWeight: "900", letterSpacing: "4px", color: "#111", lineHeight: 1 }}>
            GRADE CARD
          </div>
          <div style={{ fontSize: "8.5px", fontWeight: "600", color: "#888", letterSpacing: "2px", marginTop: "4px", textTransform: "uppercase" }}>
            Academic Progress Report
          </div>
          <div style={{ fontSize: "10.5px", fontWeight: "700", color: "#333", marginTop: "6px" }}>
            Academic Year: {report.academicYear || report.period}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="Knowlix"
            style={{ height: "36px", objectFit: "contain", display: "block", marginLeft: "auto", marginBottom: "6px" }}
          />
          <div style={{ fontSize: "8px", color: "#777", lineHeight: "1.6" }}>
            www.knowlixlearning.com<br />
            Phone: 70 25235 59<br />
            knowlixlearning@gmail.com
          </div>
        </div>
      </div>

      {/* ─── STUDENT INFO ─── */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ ...td(), borderTop: "none", borderLeft: "none", width: "40%", verticalAlign: "top" }}>
              <div style={{ fontSize: "7.5px", color: "#999", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>
                Student Name
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700" }}>{report.studentName || "—"}</div>
            </td>
            <td style={{ ...td(), borderTop: "none", borderLeft: "none", width: "30%", verticalAlign: "top" }}>
              <div style={{ fontSize: "7.5px", color: "#999", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>
                Program
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700" }}>{report.programName || "—"}</div>
            </td>
            <td style={{ ...td(), borderTop: "none", borderLeft: "none", borderRight: "none", verticalAlign: "top" }}>
              <div style={{ fontSize: "7.5px", color: "#999", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "3px" }}>
                Admission No
              </div>
              <div style={{ fontSize: "13px", fontWeight: "700" }}>{report.admissionNo || "—"}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ─── EXAM TITLE ─── */}
      <div
        style={{
          background: "#f5f5f5",
          borderTop: tb,
          borderBottom: tb,
          padding: "9px 20px",
          textAlign: "center",
          fontSize: "13px",
          fontWeight: "700",
          color: "#111",
        }}
      >
        {report.examTitle || `${report.period}`}
      </div>

      {/* ─── MARKS TABLE ─── */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th rowSpan={2} style={{ ...th(), textAlign: "left", verticalAlign: "middle", width: isYearly ? "20%" : "25%", borderLeft: "none" }}>
              Subjects
            </th>
            <th colSpan={2} style={{ ...th(), borderLeft: "none" }}>
              Formative Assessment (FA)
            </th>
            {isYearly && (
              <th colSpan={2} style={{ ...th(), borderLeft: "none" }}>
                Summative Assessment (SA)
              </th>
            )}
            <th colSpan={3} style={{ ...th(), borderLeft: "none", borderRight: "none" }}>
              Total
            </th>
          </tr>
          <tr>
            <th style={{ ...th(), borderLeft: "none" }}>Max Marks</th>
            <th style={{ ...th(), borderLeft: "none" }}>Scored Marks</th>
            {isYearly && (
              <>
                <th style={{ ...th(), borderLeft: "none" }}>Max Marks</th>
                <th style={{ ...th(), borderLeft: "none" }}>Scored Marks</th>
              </>
            )}
            <th style={{ ...th(), borderLeft: "none" }}>Max Marks</th>
            <th style={{ ...th(), borderLeft: "none" }}>Scored Marks</th>
            <th style={{ ...th(), borderLeft: "none", borderRight: "none" }}>Grade</th>
          </tr>
        </thead>
        <tbody>
          {report.subjects.map((s, i) => {
            const subMax = isYearly ? s.faMax + s.saMax : s.faMax;
            const subScored = isYearly ? s.faScored + s.saScored : s.faScored;
            const grade = subMax > 0 ? calcGrade(subScored, subMax) : "—";
            return (
              <tr key={i}>
                <td style={{ ...td(), borderLeft: "none" }}>{s.subject || "—"}</td>
                <td style={{ ...td(), borderLeft: "none", textAlign: "center" }}>{s.faMax ?? 0}</td>
                <td style={{ ...td(), borderLeft: "none", textAlign: "center" }}>{s.faScored ?? 0}</td>
                {isYearly && (
                  <>
                    <td style={{ ...td(), borderLeft: "none", textAlign: "center" }}>{s.saMax ?? 0}</td>
                    <td style={{ ...td(), borderLeft: "none", textAlign: "center" }}>{s.saScored ?? 0}</td>
                  </>
                )}
                <td style={{ ...td(), borderLeft: "none", textAlign: "center" }}>{subMax ?? 0}</td>
                <td style={{ ...td(), borderLeft: "none", textAlign: "center" }}>{subScored ?? 0}</td>
                <td style={{ ...td(), borderLeft: "none", borderRight: "none", textAlign: "center", fontWeight: "700" }}>{grade}</td>
              </tr>
            );
          })}
          <tr style={{ background: "#f2f2f2" }}>
            <td style={{ ...td(), borderLeft: "none", fontWeight: "700", background: "#f2f2f2" }}><strong>Total</strong></td>
            <td style={{ ...td(), borderLeft: "none", textAlign: "center", fontWeight: "700", background: "#f2f2f2" }}><strong>{totals.faMax}</strong></td>
            <td style={{ ...td(), borderLeft: "none", textAlign: "center", fontWeight: "700", background: "#f2f2f2" }}><strong>{totals.faScored}</strong></td>
            {isYearly && (
              <>
                <td style={{ ...td(), borderLeft: "none", textAlign: "center", fontWeight: "700", background: "#f2f2f2" }}><strong>{totals.saMax}</strong></td>
                <td style={{ ...td(), borderLeft: "none", textAlign: "center", fontWeight: "700", background: "#f2f2f2" }}><strong>{totals.saScored}</strong></td>
              </>
            )}
            <td style={{ ...td(), borderLeft: "none", textAlign: "center", fontWeight: "700", background: "#f2f2f2" }}><strong>{totalMax}</strong></td>
            <td style={{ ...td(), borderLeft: "none", textAlign: "center", fontWeight: "700", background: "#f2f2f2" }}><strong>{totalScored}</strong></td>
            <td style={{ ...td(), borderLeft: "none", borderRight: "none", textAlign: "center", fontWeight: "700", background: "#f2f2f2" }}><strong>{overallGrade}</strong></td>
          </tr>
        </tbody>
      </table>

      {/* ─── SIGNATURES ─── */}
      <table style={{ width: "100%", borderCollapse: "collapse", borderTop: tb }}>
        <tbody>
          <tr>
            {(["Class Teacher", "Section Head", "Principal", "Parent"] as const).map((label, i) => (
              <td
                key={label}
                style={{
                  width: "25%",
                  padding: "20px 16px 14px",
                  textAlign: "center",
                  verticalAlign: "bottom",
                  borderRight: i < 3 ? tb : "none",
                  borderLeft: "none",
                  borderTop: "none",
                  borderBottom: "none",
                }}
              >
                {label === "Principal" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src="/images/principal-sign.png"
                    alt="Principal Signature"
                    style={{ height: "36px", objectFit: "contain", display: "block", margin: "0 auto 6px" }}
                  />
                ) : (
                  <div style={{ height: "36px", marginBottom: "6px" }} />
                )}
                <div style={{ borderTop: "1px solid #555", paddingTop: "5px", fontSize: "9.5px", fontWeight: "600", color: "#444" }}>
                  {label}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* ─── FOOTER ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          borderTop: ob,
        }}
      >
        <div>
          <div style={{ fontSize: "7.5px", color: "#999", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Date of Issue
          </div>
          <div style={{ fontSize: "12px", fontWeight: "700", marginTop: "2px" }}>{issueFormatted}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/knowlix-seal.png" alt="Seal" style={{ height: "90px", objectFit: "contain" }} />
      </div>
    </div>
  );
}
