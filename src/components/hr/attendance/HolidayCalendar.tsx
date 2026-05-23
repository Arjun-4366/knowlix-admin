import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { CalendarDays, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HolidayItem, HolidayType } from "./types";

interface HolidayCalendarProps {
  holidays: HolidayItem[];
  referenceDate: string;
}

const typeClassMap: Record<HolidayType, string> = {
  National: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Company: "bg-sky-50 text-sky-700 border-sky-200",
  Optional: "bg-violet-50 text-violet-700 border-violet-200",
};

export default function HolidayCalendar({
  holidays,
  referenceDate,
}: HolidayCalendarProps) {
  const sortedHolidays = [...holidays].sort((left, right) =>
    left.date.localeCompare(right.date)
  );
  const nextHoliday = sortedHolidays[0];
  const groupedHolidays = sortedHolidays.reduce<Record<string, HolidayItem[]>>(
    (group, holiday) => {
      const key = format(parseISO(holiday.date), "MMMM yyyy");
      if (!group[key]) {
        group[key] = [];
      }
      group[key].push(holiday);
      return group;
    },
    {}
  );

  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-850">Holiday Calendar</h2>
        <p className="text-xs text-slate-500 mt-1">
          Publish closure windows early so payroll, leave, and staffing plans stay aligned.
        </p>
      </div>

      <div className="p-5 space-y-5">
        {nextHoliday && (
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

        {sortedHolidays.length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedHolidays).map(([monthLabel, monthHolidays]) => (
              <div key={monthLabel} className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-450">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  {monthLabel}
                </div>
                <div className="space-y-2">
                  {monthHolidays.map((holiday) => (
                    <div
                      key={holiday.id}
                      className="rounded-xl border border-slate-150 bg-slate-50/40 px-4 py-3 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800">{holiday.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {format(parseISO(holiday.date), "EEE, dd MMM")} • {holiday.appliesTo}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full border text-[10px] font-bold px-2.5 py-1",
                          typeClassMap[holiday.type]
                        )}
                      >
                        {holiday.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-slate-500">
            No upcoming holidays fall inside the current 90-day planning window.
          </div>
        )}
      </div>
    </Card>
  );
}
