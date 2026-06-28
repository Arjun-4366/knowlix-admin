"use client";

import { Calendar, BarChart2, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";


interface Template {
  id: "monthly" | "five-month" | "annual";
  title: string;
  description: string;
  features: string[];
  recommendedFor: string;
  icon: React.ReactNode;
  bgGradient: string;
}

interface TutorReportTemplatesProps {
  onSelectTemplate: (templateId: "monthly" | "five-month" | "annual") => void;
}

export default function TutorReportTemplates({ onSelectTemplate }: TutorReportTemplatesProps) {
  const templates: Template[] = [
    {
      id: "monthly",
      title: "Monthly Progress Report",
      description:
        "A month-by-month grade card showing Formative Assessment (FA) marks and attendance for the selected month.",
      features: [
        "Specify the month (e.g. June 2026)",
        "FA Max & Scored marks per subject",
        "Auto-calculated grades per subject",
        "Working days & attendance summary",
      ],
      recommendedFor: "Regular monthly check-ins with parents.",
      icon: <Calendar className="w-6 h-6 text-[var(--brand-green)]" />,
      bgGradient: "from-emerald-500/10 to-teal-500/5",
    },
    {
      id: "five-month",
      title: "5-Month Progress Report",
      description:
        "A cumulative FA-only grade card covering a 5-month academic period. Ideal for mid-year reviews.",
      features: [
        "Covers any 5-month span (e.g. Apr–Aug 2026)",
        "FA Max & Scored marks per subject",
        "Auto-calculated grades per subject",
        "Cumulative attendance for the period",
      ],
      recommendedFor: "Mid-year or semester-level FA reviews.",
      icon: <BarChart2 className="w-6 h-6 text-indigo-600" />,
      bgGradient: "from-indigo-500/10 to-blue-500/5",
    },
    {
      id: "annual",
      title: "Annual / Yearly Report",
      description:
        "Full-year grade card with both Formative (FA) and Summative (SA) assessments, totals, and final grades.",
      features: [
        "Academic year format (e.g. 2025–2026)",
        "FA and SA Max & Scored marks per subject",
        "Combined total and grade per subject",
        "Full-year attendance summary",
      ],
      recommendedFor: "End-of-year final evaluations.",
      icon: <BookOpen className="w-6 h-6 text-rose-600" />,
      bgGradient: "from-rose-500/10 to-orange-500/5",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-heading text-slate-800">
          Select Progress Report Template
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Choose a report type to generate an official grade card for your student.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-150 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
          >
            <div
              className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${tpl.bgGradient} blur-2xl opacity-80`}
            />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {tpl.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-base font-heading">{tpl.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed min-h-[60px]">
                {tpl.description}
              </p>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Features included:
                </p>
                <ul className="space-y-1.5">
                  {tpl.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-600">
                  <span className="font-bold text-slate-700">Recommended for:</span>{" "}
                  {tpl.recommendedFor}
                </p>
              </div>
              <button
                onClick={() => onSelectTemplate(tpl.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 text-white hover:bg-[var(--brand-green)] rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm"
              >
                <span>Use Template</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
