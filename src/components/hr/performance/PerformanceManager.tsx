"use client";

import { useState } from "react";
import {
  Loader2, Plus, Trophy, History, X, Medal, Crown,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetHRGrowthLeaderboard,
  useGetHRPerformanceHistory,
  useCreateHRPerformance,
  useGetTutorsHR,
} from "@/querys/admin/hrQuery";
import { IHRPerformancePayload } from "@/types/admin/hr";

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

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

function rankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-4 h-4 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
  if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
  return <span className="text-xs font-bold text-slate-400">#{rank}</span>;
}

// ── Award / Edit Dialog ───────────────────────────────────────────────────────

interface AwardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: IHRPerformancePayload) => Promise<void>;
  saving: boolean;
  tutors: { id: string; name: string }[];
}

function AwardDialog({ open, onClose, onSubmit, saving, tutors }: AwardDialogProps) {
  const [tutorId, setTutorId] = useState("");
  const [month, setMonth] = useState(MONTHS[currentDate.getMonth()]);
  const [year, setYear] = useState(currentYear.toString());
  const [description, setDescription] = useState("");
  const [scores, setScores] = useState<Record<string, string>>({
    G: "", R: "", O: "", W: "", T: "", H: "",
  });

  if (!open) return null;

  const total = Object.values(scores).reduce((sum, v) => sum + (parseInt(v) || 0), 0);

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
    if (!tutorId || !description.trim()) return;
    await onSubmit({
      tutorId,
      month,
      year: parseInt(year),
      G: parseInt(scores.G) || 0,
      R: parseInt(scores.R) || 0,
      O: parseInt(scores.O) || 0,
      W: parseInt(scores.W) || 0,
      T: parseInt(scores.T) || 0,
      H: parseInt(scores.H) || 0,
      description: description.trim(),
    });
    setTutorId("");
    setDescription("");
    setScores({ G: "", R: "", O: "", W: "", T: "", H: "" });
  };

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
              <h3 className="font-bold text-slate-800 text-base">
                Award Performance Points
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                Each score is 0–5 per category
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-500">Tutor</Label>
            <Select value={tutorId} onValueChange={setTutorId} required>
              <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                <SelectValue placeholder="Select tutor…" />
              </SelectTrigger>
              <SelectContent>
                {tutors.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500">Month</Label>
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
              <Label className="text-[10px] uppercase font-bold text-slate-500">Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] uppercase font-bold text-slate-500">
                G-R-O-W-T-H Scores
              </Label>
              <span className="text-[10px] font-bold text-[var(--brand-green)] bg-[var(--brand-light-green)] px-2 py-0.5 rounded-md border border-[var(--brand-green)]/20">
                Total: {total} / 30 pts
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {GROWTH_KEYS.map((key) => (
                <div key={key} className="space-y-1">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase">
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
            <Label className="text-[10px] uppercase font-bold text-slate-500">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Monthly overall performance review…"
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
              disabled={saving || !tutorId || !description.trim()}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm flex items-center gap-1.5"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Award Points
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PerformanceManager() {
  const [showAwardDialog, setShowAwardDialog] = useState(false);

  const [historyTutorId, setHistoryTutorId] = useState("");
  const [historyMonth, setHistoryMonth] = useState("");
  const [historyYear, setHistoryYear] = useState("");

  const { data: leaderboardRes, isLoading: leaderboardLoading } = useGetHRGrowthLeaderboard();
  const { data: historyRes, isLoading: historyLoading } = useGetHRPerformanceHistory({
    ...(historyTutorId ? { tutorId: historyTutorId } : {}),
    ...(historyMonth ? { month: historyMonth } : {}),
    ...(historyYear ? { year: parseInt(historyYear) } : {}),
  });
  const { data: tutorsRes } = useGetTutorsHR({ limit: 1000 });

  const createMutation = useCreateHRPerformance();

  const leaderboard = leaderboardRes?.data ?? [];
  const history = historyRes?.data ?? [];
  const tutors = (tutorsRes?.data as any[] ?? []).map((t: any) => ({
    id: t.id || t._id || "",
    name: t.name || "Unnamed",
  }));

  const topTutor = leaderboard[0];
  const totalPoints = leaderboard.reduce((s, t) => s + t.totalPoints, 0);

  const handleCreate = async (data: IHRPerformancePayload) => {
    await createMutation.mutateAsync(data);
    setShowAwardDialog(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader
        title="Performance Management"
        description="G-R-O-W-T-H point awards, leaderboard rankings, and history."
        actions={
          <Button
            onClick={() => setShowAwardDialog(true)}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer ml-auto"
          >
            <Plus className="w-4 h-4" /> Award Points
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-light-green)] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[var(--brand-green)]" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Tutors</p>
              <p className="text-2xl font-bold text-slate-800">{leaderboard.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Top Performer</p>
              <p className="text-sm font-bold text-slate-800 truncate max-w-[160px]">
                {topTutor?.tutorName ?? "—"}
              </p>
              {topTutor && (
                <p className="text-[10px] text-[var(--brand-green)] font-semibold">
                  {topTutor.totalPoints} pts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-150 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Points Awarded</p>
              <p className="text-2xl font-bold text-slate-800">{totalPoints}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leaderboard">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="leaderboard" className="rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" /> Leaderboard
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg text-xs font-bold flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" /> History
          </TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="mt-4">
          <Card className="bg-white border-slate-150 shadow-sm">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[var(--brand-green)]" />
                Tutor Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {leaderboardLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-green)]" />
                </div>
              ) : leaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="border-slate-100 hover:bg-slate-50">
                        <TableHead className="text-xs font-bold text-slate-500 w-16 px-6 py-3">Rank</TableHead>
                        <TableHead className="text-xs font-bold text-slate-500 py-3">Tutor</TableHead>
                        {GROWTH_KEYS.map((k) => (
                          <TableHead key={k} className="text-xs font-bold text-slate-500 text-center py-3 whitespace-nowrap">
                            {k} — {GROWTH_LABELS[k]}
                          </TableHead>
                        ))}
                        <TableHead className="text-xs font-bold text-slate-500 text-center px-6 py-3">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((item) => (
                        <TableRow key={item.tutorId} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center justify-center">{rankIcon(item.rank)}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm font-semibold text-slate-700">{item.tutorName}</span>
                          </TableCell>
                          {GROWTH_KEYS.map((k) => (
                            <TableCell key={k} className="text-center text-sm font-semibold text-slate-700 py-4">
                              {item.categoryBreakdown?.[k] ?? 0}
                            </TableCell>
                          ))}
                          <TableCell className="text-center px-6 py-4">
                            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold rounded-md bg-[var(--brand-light-green)] text-[var(--brand-mid)] border border-[var(--brand-green)]/20">
                              {item.totalPoints}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500">
                  <Trophy className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-medium">No leaderboard data yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <Card className="bg-white border-slate-150 shadow-sm">
            <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-[var(--brand-green)]" />
                  Performance History
                </CardTitle>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={historyTutorId || "all"} onValueChange={(v) => setHistoryTutorId(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-[160px] h-8 text-xs font-semibold bg-white border-slate-200">
                      <SelectValue placeholder="All Tutors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tutors</SelectItem>
                      {tutors.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={historyMonth || "all"} onValueChange={(v) => setHistoryMonth(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-[140px] h-8 text-xs font-semibold bg-white border-slate-200">
                      <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {MONTHS.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={historyYear || "all"} onValueChange={(v) => setHistoryYear(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-[120px] h-8 text-xs font-semibold bg-white border-slate-200">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {historyLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-green)]" />
                </div>
              ) : history.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="border-slate-100 hover:bg-slate-50">
                        <TableHead className="text-xs font-bold text-slate-500 px-6 py-3 whitespace-nowrap">Period</TableHead>
                        <TableHead className="text-xs font-bold text-slate-500 py-3 whitespace-nowrap">Awarded At</TableHead>
                        {GROWTH_KEYS.map((k) => (
                          <TableHead key={k} className="text-xs font-bold text-slate-500 text-center py-3">{k}</TableHead>
                        ))}
                        <TableHead className="text-xs font-bold text-slate-500 text-center py-3">Total</TableHead>
                        <TableHead className="text-xs font-bold text-slate-500 px-6 py-3">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((item) => (
                        <TableRow key={item.id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-700">
                              {item.month} {item.year}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-[11px] text-slate-400 whitespace-nowrap">
                            {item.awardedAt ? format(new Date(item.awardedAt), "MMM d, yyyy") : "—"}
                          </TableCell>
                          {GROWTH_KEYS.map((k) => (
                            <TableCell key={k} className="text-center text-sm font-semibold text-slate-700 py-4">
                              {item[k]}
                            </TableCell>
                          ))}
                          <TableCell className="text-center py-4">
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-md bg-[var(--brand-light-green)] text-[var(--brand-mid)] border border-[var(--brand-green)]/20">
                              {item.totalPoints}
                            </span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-sm text-slate-600 max-w-[200px] truncate" title={item.description}>
                            {item.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500">
                  <History className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-medium">No performance history found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Award Dialog */}
      <AwardDialog
        open={showAwardDialog}
        onClose={() => setShowAwardDialog(false)}
        onSubmit={handleCreate}
        saving={createMutation.isPending}
        tutors={tutors}
      />

      {/* removed edit dialog */}
    </div>
  );
}
