"use client";

import { useState } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { CalendarDays, Plus, Sparkles, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HolidayItem, HolidayType } from "./types";
import { useConfirmation } from "@/context/ConfirmationContext";

interface HolidayCalendarProps {
  holidays: HolidayItem[];
  referenceDate: string;
  loading?: boolean;
  onCreateHoliday?: (data: {
    name: string;
    date: string;
    description?: string;
    isOptional?: boolean;
  }) => Promise<void>;
  onDeleteHoliday?: (id: string) => Promise<void>;
}

const typeClassMap: Record<HolidayType, string> = {
  National: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Company: "bg-sky-50 text-sky-700 border-sky-200",
  Optional: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function HolidayCalendar({
  holidays,
  referenceDate,
  loading = false,
  onCreateHoliday,
  onDeleteHoliday,
}: HolidayCalendarProps) {
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formOptional, setFormOptional] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { confirm } = useConfirmation();

  const sortedHolidays = [...holidays].sort((left, right) =>
    left.date.localeCompare(right.date)
  );
  const nextHoliday = sortedHolidays[0];
  const groupedHolidays = sortedHolidays.reduce<Record<string, HolidayItem[]>>(
    (group, holiday) => {
      const key = format(parseISO(holiday.date), "MMMM yyyy");
      if (!group[key]) group[key] = [];
      group[key].push(holiday);
      return group;
    },
    {}
  );

  const handleAdd = async () => {
    if (!formName || !formDate || !onCreateHoliday) return;
    setSaving(true);
    try {
      await onCreateHoliday({
        name: formName,
        date: formDate,
        description: formDesc || undefined,
        isOptional: formOptional,
      });
      setFormName("");
      setFormDate("");
      setFormDesc("");
      setFormOptional(false);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (!onDeleteHoliday) return;
    
    confirm({
      title: "Delete Holiday",
      message: `Are you sure you want to delete the holiday "${name}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        setDeletingId(id);
        try {
          await onDeleteHoliday(id);
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-850">Holiday Calendar</h2>
          <p className="text-xs text-slate-600 mt-1">
            Publish closure windows early so payroll, leave, and staffing plans stay aligned.
          </p>
        </div>
        {onCreateHoliday && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
            style={{ background: "var(--brand-green)" }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        )}
      </div>

      {/* Add Holiday Form */}
      {showForm && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 space-y-3">
          <input
            type="text"
            placeholder="Holiday name *"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <DatePicker
            value={formDate}
            onChange={setFormDate}
            placeholder="Holiday date *"
            className="w-full"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={formOptional}
              onChange={(e) => setFormOptional(e.target.checked)}
              className="rounded"
            />
            Mark as optional holiday
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!formName || !formDate || saving}
              className="flex-1 text-xs font-semibold py-2 rounded-lg text-white disabled:opacity-50 transition-colors"
              style={{ background: "var(--brand-green)" }}
            >
              {saving ? "Saving…" : "Add Holiday"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 text-xs font-medium py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="p-5 space-y-5">
        {loading && (
          <div className="py-8 text-center text-xs text-slate-600 animate-pulse">
            Loading holidays…
          </div>
        )}

        {!loading && nextHoliday && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Next Holiday
              </p>
              <p className="text-sm font-bold text-slate-800">{nextHoliday.name}</p>
              <p className="text-xs text-slate-600">
                {format(parseISO(nextHoliday.date), "EEE, dd MMM yyyy")} •{" "}
                {differenceInCalendarDays(
                  parseISO(nextHoliday.date),
                  parseISO(referenceDate)
                )}{" "}
                days away
              </p>
            </div>
          </div>
        )}

        {!loading && sortedHolidays.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedHolidays).map(([monthLabel, monthHolidays]) => (
              <div key={monthLabel} className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-600" />
                  {monthLabel}
                </div>
                <div className="space-y-2">
                  {monthHolidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="rounded-xl border border-slate-150 bg-slate-50/40 px-4 py-3 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-bold text-slate-800">{holiday.name}</p>
                        <p className="text-[11px] text-slate-600">
                          {format(parseISO(holiday.date), "EEE, dd MMM")} •{" "}
                          {holiday.appliesTo}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full border text-[10px] font-bold px-2.5 py-1",
                            typeClassMap[holiday.type]
                          )}
                        >
                          {holiday.type}
                        </Badge>
                        {onDeleteHoliday && (
                          <button
                            onClick={() => handleDelete(holiday.id, holiday.name)}
                            disabled={deletingId === holiday.id}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !loading ? (
          <div className="py-12 text-center text-sm text-slate-600">
            No upcoming holidays fall inside the current 90-day planning window.
          </div>
        ) : null}
      </div>
    </Card>
  );
}
