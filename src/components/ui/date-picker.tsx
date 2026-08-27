"use client";

import { useState } from "react";
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;           // YYYY-MM-DD
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const today = new Date();
  const selected = value ? new Date(value + "T00:00:00") : null;
  const [view, setView] = useState<Date>(selected ?? today);
  const [open, setOpen] = useState(false);

  const year  = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = getDaysInMonth(view);
  const firstDow    = getDay(startOfMonth(view));   // 0 = Sunday

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const select = (day: number) => {
    const d = new Date(year, month, day);
    onChange(format(d, "yyyy-MM-dd"));
    setOpen(false);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const isSelected = (day: number) =>
    selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700",
            "hover:bg-white hover:border-slate-300 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/30",
            !value && "text-slate-400",
            className,
          )}
        >
          <CalendarIcon className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="flex-1 text-left">
            {selected ? format(selected, "MMM d, yyyy") : placeholder}
          </span>
          {value && (
            <span onClick={clear} className="ml-1 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-3 w-[260px]">
        {/* Month / year nav */}
        <div className="flex items-center justify-between mb-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setView(subMonths(view, 1))}
            className="h-7 w-7 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs font-bold text-slate-800">
            {MONTHS[month]} {year}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setView(addMonths(view, 1))}
            className="h-7 w-7 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d) => (
            <span key={d} className="text-center text-[10px] font-bold text-slate-400 py-0.5">
              {d}
            </span>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, i) => {
            if (!day) return <span key={i} />;
            const sel = isSelected(day);
            const tod = isToday(day);
            return (
              <button
                key={i}
                type="button"
                onClick={() => select(day)}
                className={cn(
                  "flex items-center justify-center h-7 w-7 mx-auto rounded-lg text-xs font-semibold transition-colors",
                  sel
                    ? "bg-[var(--brand-green)] text-white font-bold"
                    : tod
                    ? "bg-[var(--brand-light-green)]/40 text-[var(--brand-mid)] font-bold"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Today shortcut */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex justify-center">
          <button
            type="button"
            onClick={() => { onChange(format(today, "yyyy-MM-dd")); setOpen(false); }}
            className="text-[10px] font-bold text-[var(--brand-mid)] hover:underline"
          >
            Today
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
