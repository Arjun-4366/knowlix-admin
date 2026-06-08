"use client";

import { useState, useEffect } from "react";
import { X, User, Shield, Star, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Employee } from "../employees/types";
import { ICreateHRPerformancePayload, IHRPerformanceEvaluation } from "@/types/admin/hr";

interface UpdateEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<ICreateHRPerformancePayload>) => void;
  evaluation: IHRPerformanceEvaluation | null;
  tutors: Employee[];
  saving: boolean;
}

export default function UpdateEvaluationModal({
  isOpen,
  onClose,
  onSubmit,
  evaluation,
  tutors,
  saving,
}: UpdateEvaluationModalProps) {
  const [tutorId, setTutorId] = useState("");
  const [period, setPeriod] = useState("2026-06");
  const [scoreG, setScoreG] = useState(5);
  const [scoreR, setScoreR] = useState(8);
  const [scoreO, setScoreO] = useState(9);
  const [scoreW, setScoreW] = useState(10);
  const [scoreT, setScoreT] = useState(8);
  const [scoreH, setScoreH] = useState(10);
  const [feedback, setFeedback] = useState("");
  const [goals, setGoals] = useState("");

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setTutorId(tutors[0]?.id || "");
      setPeriod("2026-06");
      setScoreG(5);
      setScoreR(8);
      setScoreO(9);
      setScoreW(10);
      setScoreT(8);
      setScoreH(10);
      setFeedback("");
      setGoals("");
    }
  }, [isOpen, tutors]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tutorId) {
      toast.error("Please select a tutor.");
      return;
    }

    if (scoreG > 5) {
      toast.error("Growth rating cannot exceed 5.");
      return;
    }

    if (!period.trim()) {
      toast.error("Please specify a review period.");
      return;
    }

    if (!evaluation?.id) return;

    onSubmit(evaluation.id, {
      tutorId,
      period: period.trim(),
      scores: {
        G: scoreG,
        R: scoreR,
        O: scoreO,
        W: scoreW,
        T: scoreT,
        H: scoreH,
      },
      feedback: feedback.trim() || undefined,
      goals: goals.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-150 rounded-2xl max-w-xl w-full shadow-xl overflow-hidden my-8 animate-scale-in">
        <header className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-[var(--brand-green)]" /> Edit Performance Review
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Assignment Context */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Period
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Review Period */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Review Period *
                </label>
                <Input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="YYYY-MM (e.g. 2026-06)"
                  className="h-10 bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Core Value Ratings */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Star className="w-4 h-4" /> 2. Core Value Ratings (1 - 10)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Growth */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  Growth (G)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={scoreG}
                  onChange={(e) => setScoreG(Number(e.target.value))}
                  className="h-9 bg-white"
                  required
                />
              </div>

              {/* Reliability */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  Reliability (R)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={scoreR}
                  onChange={(e) => setScoreR(Number(e.target.value))}
                  className="h-9 bg-white"
                  required
                />
              </div>

              {/* Ownership */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  Ownership (O)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={scoreO}
                  onChange={(e) => setScoreO(Number(e.target.value))}
                  className="h-9 bg-white"
                  required
                />
              </div>

              {/* Work Ethics */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  Work Ethics (W)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={scoreW}
                  onChange={(e) => setScoreW(Number(e.target.value))}
                  className="h-9 bg-white"
                  required
                />
              </div>

              {/* Trustworthiness */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  Trustworthiness (T)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={scoreT}
                  onChange={(e) => setScoreT(Number(e.target.value))}
                  className="h-9 bg-white"
                  required
                />
              </div>

              {/* Helpfulness */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">
                  Helpfulness (H)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={scoreH}
                  onChange={(e) => setScoreH(Number(e.target.value))}
                  className="h-9 bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Feedback & Goals */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--brand-green)] border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> 3. Feedback & Goals
            </h4>

            <div className="space-y-3">
              {/* Feedback */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Feedback Summary
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Summarize the tutor's achievements, strengths, and areas for coaching..."
                  className="min-h-16 bg-white"
                />
              </div>

              {/* Goals */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Key Goals & Objectives
                </label>
                <Textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="List 2-3 specific objectives for the next period..."
                  className="min-h-16 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-550 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              {saving ? "Submitting…" : "Update Evaluation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
