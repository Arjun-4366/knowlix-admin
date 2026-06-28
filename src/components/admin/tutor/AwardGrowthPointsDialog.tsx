"use client";

import { useState } from "react";
import { X, Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAwardGrowthPoints } from "@/querys/admin/tutorQuery";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const GROWTH_KEYS = ["G", "R", "O", "W", "T", "H"] as const;
const GROWTH_LABELS: Record<string, string> = {
  G: "Growth",
  R: "Responsibility",
  O: "Ownership",
  W: "Work Ethics",
  T: "Teamwork",
  H: "Honesty",
};

interface AwardGrowthPointsDialogProps {
  tutorId: string;
  open: boolean;
  onClose: () => void;
}

export function AwardGrowthPointsDialog({ tutorId, open, onClose }: AwardGrowthPointsDialogProps) {
  const currentDate = new Date();
  const [month, setMonth] = useState(MONTHS[currentDate.getMonth()]);
  const [year, setYear] = useState(currentDate.getFullYear().toString());
  const [description, setDescription] = useState("");
  const [scores, setScores] = useState<Record<string, string>>({
    G: "", R: "", O: "", W: "", T: "", H: "",
  });

  const { mutateAsync: awardGrowthPoints, isPending } = useAwardGrowthPoints();

  const total = Object.values(scores).reduce((sum, v) => sum + (parseInt(v) || 0), 0);
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const handleScoreChange = (key: string, raw: string) => {
    if (raw === "") {
      setScores((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    const val = Math.min(5, Math.max(0, parseInt(raw) || 0));
    setScores((prev) => ({ ...prev, [key]: String(val) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      await awardGrowthPoints({
        tutorId,
        month,
        year: parseInt(year),
        evaluationArea: "performance_consistency",
        G: parseInt(scores.G) || 0,
        R: parseInt(scores.R) || 0,
        O: parseInt(scores.O) || 0,
        W: parseInt(scores.W) || 0,
        T: parseInt(scores.T) || 0,
        H: parseInt(scores.H) || 0,
        description: description.trim(),
      });
      onClose();
      setDescription("");
      setScores({ G: "", R: "", O: "", W: "", T: "", H: "" });
    } catch {
      // toast handled in query
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-light-green)] flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[var(--brand-green)]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Award Growth Points</h3>
              <p className="text-[10px] text-slate-600 font-semibold mt-0.5">Each score is 0–5 per category</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Month</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-600">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase font-bold text-slate-600">G-R-O-W-T-H Scores</Label>
              <span className="text-[10px] font-bold text-[var(--brand-green)] bg-[var(--brand-light-green)] px-2 py-0.5 rounded-md border border-[var(--brand-green)]/20">
                Total: {total} / 30 pts
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {GROWTH_KEYS.map((key) => (
                <div key={key} className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-600 uppercase">
                    {key} — {GROWTH_LABELS[key]}
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={5}
                    value={scores[key]}
                    onChange={(e) => handleScoreChange(key, e.target.value)}
                    className="h-9 text-sm font-bold bg-slate-50 border-slate-200 text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-600">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Monthly overall performance review..."
              className="text-sm bg-slate-50 border-slate-200 resize-none"
              rows={3}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose} className="font-semibold text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !description.trim()}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm flex items-center gap-1.5"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Award Points
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
