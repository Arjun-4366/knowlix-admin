"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportFiltersState, ReportType } from "./types";
import { Calendar, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetTutors } from "@/querys/admin/tutorQuery";

interface ReportsFiltersProps {
  filters: ReportFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<ReportFiltersState>>;
  onGenerate: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

export default function ReportsFilters({
  filters,
  setFilters,
  onGenerate,
  onReset,
  isGenerating,
}: ReportsFiltersProps) {
  const { data: tutorsResponse } = useGetTutors();
  const tutors = tutorsResponse?.data ?? [];

  const handleTypeChange = (type: ReportType) => {
    setFilters((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleDatePresetChange = (preset: string) => {
    let startDate = "";
    let endDate = new Date().toISOString().split("T")[0];
    const today = new Date();

    if (preset === "today") {
      startDate = endDate;
    } else if (preset === "7days") {
      const past = new Date(today);
      past.setDate(today.getDate() - 7);
      startDate = past.toISOString().split("T")[0];
    } else if (preset === "thismonth") {
      startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    } else if (preset === "30days") {
      const past = new Date(today);
      past.setDate(today.getDate() - 30);
      startDate = past.toISOString().split("T")[0];
    } else {
      // custom
      startDate = prevDateRange().startDate;
    }

    setFilters((prev) => ({
      ...prev,
      dateRange: {
        preset,
        startDate,
        endDate,
      },
    }));
  };

  const prevDateRange = () => {
    return filters.dateRange;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
      {/* Report Types Tabs */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Select Report Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {([
            { id: "tutor", label: "Tutor Performance" },
          ] as const).map((tab) => {
            const isActive = filters.type === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTypeChange(tab.id)}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  isActive
                    ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)] shadow-md shadow-green-600/10"
                    : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid for parameters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Date Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Time Period
          </label>
          <Select
            value={filters.dateRange.preset}
            onValueChange={handleDatePresetChange}
          >
            <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 rounded-xl text-xs font-semibold">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today" className="text-xs">Today</SelectItem>
              <SelectItem value="7days" className="text-xs">Last 7 Days</SelectItem>
              <SelectItem value="thismonth" className="text-xs">This Month</SelectItem>
              <SelectItem value="30days" className="text-xs">Last 30 Days</SelectItem>
              <SelectItem value="custom" className="text-xs">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Start & End Dates */}
        {filters.dateRange.preset === "custom" && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="date"
                  value={filters.dateRange.startDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, startDate: e.target.value },
                    }))
                  }
                  className="pl-10 h-10 bg-slate-50/50 border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="date"
                  value={filters.dateRange.endDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, endDate: e.target.value },
                    }))
                  }
                  className="pl-10 h-10 bg-slate-50/50 border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </>
        )}

        {/* Contextual Filters */}
        {filters.type === "tutor" && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Performance Tier
              </label>
              <Select
                value={filters.tutorTier}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, tutorTier: val }))
                }
              >
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 rounded-xl text-xs font-semibold">
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Tiers</SelectItem>
                  <SelectItem value="Outstanding" className="text-xs">Outstanding</SelectItem>
                  <SelectItem value="Excellent" className="text-xs">Excellent</SelectItem>
                  <SelectItem value="Very Good" className="text-xs">Very Good</SelectItem>
                  <SelectItem value="Needs Attention" className="text-xs">Needs Attention</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Filter by Tutor
              </label>
              <Select
                value={filters.tutorId || "all"}
                onValueChange={(val) =>
                  setFilters((prev) => ({ ...prev, tutorId: val === "all" ? undefined : val }))
                }
              >
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 rounded-xl text-xs font-semibold">
                  <SelectValue placeholder="All Tutors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All Tutors</SelectItem>
                  {tutors.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs">
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}



        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:col-start-4">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isGenerating}
            className="flex-1 h-10 text-slate-600 hover:text-slate-900 border-slate-200 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
          <Button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex-[2] h-10 bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white border-transparent rounded-xl font-bold text-xs shadow-md shadow-green-600/10 hover:shadow-lg transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
