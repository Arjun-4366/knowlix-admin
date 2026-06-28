"use client";

import { useState, useEffect, useRef } from "react";
import { Megaphone, FileText, Calendar, Search, Filter, ChevronLeft, ChevronRight, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useGetStudentNotices } from "@/querys/student/studentQuery";

type CategoryFilter = "all" | "announcement" | "notice";

const LIMIT = 12;

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};

export default function StudentNoticeBoard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
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

  const handleCategoryChange = (val: CategoryFilter) => {
    setCategory(val);
    setPage(1);
  };

  const queryParams = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(category !== "all" ? { category } : {}),
    page,
    limit: LIMIT,
  };

  const { data, isLoading } = useGetStudentNotices(queryParams);

  const items = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || 0;

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader
        title="Notice Board"
        description="Stay updated with the latest notices and announcements from the academy."
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <Input
              type="text"
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            {(["all", "announcement", "notice"] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  category === cat
                    ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)] shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {cat === "all" ? "All" : cat === "announcement" ? "Announcements" : "Notices"}
              </button>
            ))}
          </div>
        </div>

        {total > 0 && (
          <span className="text-xs font-semibold text-slate-600 flex-shrink-0">
            {total} result{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] bg-white border border-slate-150 rounded-2xl shadow-sm">
          <Bell className="w-10 h-10 text-slate-600 mb-3" />
          <p className="text-sm font-semibold text-slate-600">No notices found</p>
          {debouncedSearch && (
            <p className="text-xs text-slate-600 mt-1">Try a different search term</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <Card
              key={item.id}
              className="bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              <CardContent className="p-5 space-y-3 flex-1">
                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      item.category === "announcement"
                        ? "bg-blue-50 text-blue-700 border-blue-100"
                        : "bg-purple-50 text-purple-700 border-purple-100"
                    }`}
                  >
                    {item.category === "announcement"
                      ? <Megaphone className="w-2.5 h-2.5" />
                      : <FileText className="w-2.5 h-2.5" />
                    }
                    {item.category === "announcement" ? "Announcement" : "Notice"}
                  </Badge>

                  <Badge
                    variant="outline"
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.low}`}
                  >
                    {item.priority}
                  </Badge>

                  {item.department && (
                    <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border-slate-200">
                      {item.department}
                    </Badge>
                  )}
                </div>

                {/* Title & Content */}
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-800 leading-tight">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.content}</p>
                </div>
              </CardContent>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                <span className="capitalize bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                  {item.audience}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </Card>
          ))}
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
