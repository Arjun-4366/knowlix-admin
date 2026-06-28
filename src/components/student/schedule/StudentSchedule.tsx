"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, Video, BookOpen, Search, Filter, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useGetStudentSchedule } from "@/querys/student/studentQuery";

type FilterType = "all" | "today" | "upcoming" | "past";

const LIMIT = 4;

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const isSessionActive = (scheduledAt: string, durationMinutes: number) => {
  const start = new Date(scheduledAt).getTime();
  const end = start + durationMinutes * 60000;
  const now = Date.now();
  return now >= start && now <= end;
};

export default function StudentSchedule() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("today");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  const handleFilterChange = (val: FilterType) => {
    setFilter(val);
    setPage(1);
  };

  const queryParams = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(filter !== "all" ? { filter } : {}),
    page,
    limit: LIMIT,
  };

  const { data, isLoading } = useGetStudentSchedule(queryParams);

  const sessions = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const total = data?.pagination?.total || 0;

  const FILTER_LABELS: Record<FilterType, string> = {
    all: "All",
    today: "Today",
    upcoming: "Upcoming",
    past: "Past",
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="My Schedule"
        description="View your upcoming and past tutoring sessions."
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <Input
              type="text"
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
            />
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            {(["all", "today", "upcoming", "past"] as FilterType[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFilterChange(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  filter === f
                    ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {total > 0 && (
          <span className="text-xs font-semibold text-slate-600 flex-shrink-0">
            {total} session{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh] w-full">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] bg-white border border-slate-150 rounded-2xl shadow-sm">
          <CalendarDays className="w-10 h-10 text-slate-600 mb-3" />
          <p className="text-sm font-semibold text-slate-600">No sessions found</p>
          {debouncedSearch && (
            <p className="text-xs text-slate-600 mt-1">Try a different search term</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => {
            const scheduledDate = new Date(session.scheduledAt);
            const endDate = new Date(scheduledDate.getTime() + (session.durationMinutes || 60) * 60000);
            const active = isSessionActive(session.scheduledAt, session.durationMinutes || 60);
            const isCompleted = session.status === "completed";
            const isCancelled = session.status === "cancelled";

            let statusLabel = active ? "Live Now" : "Scheduled";
            if (isCompleted) statusLabel = "Completed";
            if (isCancelled) statusLabel = "Cancelled";

            let statusCls = "bg-amber-50 text-amber-700 border-amber-100";
            if (active) statusCls = "bg-emerald-50 text-emerald-700 border-emerald-100 border-2 animate-pulse";
            if (isCompleted) statusCls = "bg-slate-100 text-slate-600 border-slate-200";
            if (isCancelled) statusCls = "bg-rose-50 text-rose-700 border-rose-100";

            return (
              <Card
                key={session.id}
                className={`bg-white border rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  active ? "border-[var(--brand-green)] ring-1 ring-[var(--brand-green)]/15" : "border-slate-150"
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusCls}`}>
                      {statusLabel}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border-slate-200 capitalize">
                      {session.type}
                    </Badge>
                  </div>

                  <div>
                    {session.subject && (
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">
                        {session.subject}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-slate-800 leading-tight mt-0.5">
                      {session.title}
                    </h3>
                    {session.notes && (
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {session.notes}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <span className="truncate">{formatDate(session.scheduledAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                      <span className="truncate">
                        {formatTime(scheduledDate)} - {formatTime(endDate)}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-600 bg-slate-300">
                    <BookOpen className="w-3 h-3 flex-shrink-0" />
                    <span>{session.durationMinutes || 60} min</span>
                  </div>

                  {isCompleted || isCancelled ? (
                    <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-none border ${
                      isCompleted ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-rose-50 text-rose-400 border-rose-100"
                    }`}>
                      {isCompleted ? "Session Ended" : "Cancelled"}
                    </Badge>
                  ) : (
                    <a
                      href={session.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`h-9 text-[11px] px-4 font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm ${
                        active
                          ? "bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white shadow-md ring-2 ring-[var(--brand-green)]/25"
                          : "bg-[var(--brand-dark)] hover:bg-[var(--brand-mid)] text-white"
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Join Room
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="h-9 px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <span className="text-xs font-bold text-slate-600 px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="h-9 px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
