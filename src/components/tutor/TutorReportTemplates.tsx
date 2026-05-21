"use client";

import { Calendar, FileCheck, ClipboardList, CheckCircle2, ArrowRight } from "lucide-react";

interface Template {
  id: "monthly" | "term-end" | "weekly";
  title: string;
  description: string;
  features: string[];
  recommendedFor: string;
  icon: React.ReactNode;
  bgGradient: string;
}

interface TutorReportTemplatesProps {
  onSelectTemplate: (templateId: "monthly" | "term-end" | "weekly") => void;
}

export default function TutorReportTemplates({ onSelectTemplate }: TutorReportTemplatesProps) {
  const templates: Template[] = [
    {
      id: "monthly",
      title: "Monthly Academic Check",
      description: "A comprehensive monthly breakdown focusing on regular academic scores, behavioral parameters, and specific tutor comments.",
      features: [
        "Dynamic Monthly Attendance calculation",
        "Soft-skill ratings (Attentiveness, Participation)",
        "Month-over-month performance remarks",
        "Subject-specific averages grid"
      ],
      recommendedFor: "Regular monthly check-ins & feedback loops.",
      icon: <Calendar className="w-6 h-6 text-[var(--brand-green)]" />,
      bgGradient: "from-emerald-500/10 to-teal-500/5",
    },
    {
      id: "term-end",
      title: "Term-End Summary",
      description: "Premium academic certificate/marksheet layout with final letter grade selection, cumulative attendance rates, and long-term feedback.",
      features: [
        "Official certificate style border",
        "Comprehensive final evaluation summary",
        "Attendance rates across the entire term",
        "Future learning recommendations & path planning"
      ],
      recommendedFor: "End of semester or course completion reviews.",
      icon: <AwardIcon className="w-6 h-6 text-indigo-600" />,
      bgGradient: "from-indigo-500/10 to-blue-500/5",
    },
    {
      id: "weekly",
      title: "Weekly Performance Slip",
      description: "Quick performance summary for sharing weekly updates with students and parents. Focuses on recent assignments and quizzes.",
      features: [
        "Assignment completion checkbox logs",
        "Most recent exam and quiz scores",
        "Attentiveness and homework punctuality review",
        "Compact format for rapid review"
      ],
      recommendedFor: "Frequent, short, action-oriented updates.",
      icon: <ClipboardList className="w-6 h-6 text-rose-600" />,
      bgGradient: "from-rose-500/10 to-orange-500/5",
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-heading text-slate-800">Select Progress Report Template</h2>
        <p className="text-sm text-slate-550 mt-1">Choose a layout template to generate and compile academic marks, attendance, and feedback for your students.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className={`bg-white rounded-2xl border border-slate-150 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden`}
          >
            {/* Background pattern */}
            <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${tpl.bgGradient} blur-2xl opacity-80`} />
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {tpl.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-base font-heading">{tpl.title}</h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed min-h-[60px]">{tpl.description}</p>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features included:</p>
                <ul className="space-y-1.5">
                  {tpl.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-655">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                <p className="text-xs font-medium text-slate-500">
                  <span className="font-bold text-slate-700">Recommended for:</span> {tpl.recommendedFor}
                </p>
              </div>

              <button
                onClick={() => onSelectTemplate(tpl.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 text-white hover:bg-[var(--brand-green)] rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm active:scale-98"
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

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}
