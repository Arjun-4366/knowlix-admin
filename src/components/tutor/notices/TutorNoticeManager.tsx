"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Megaphone, Calendar, Search, Bell, FileText,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useGetTutorNotices } from "@/querys/tutor/noticeQuery";
import { ITutorAnnouncement, ITutorNotice } from "@/services/tutor/notices";

const LIMIT = 10;

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

function AnnouncementCard({ item }: { item: ITutorAnnouncement }) {
  const priorityStyle = PRIORITY_STYLES[item.priority] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col">
      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${priorityStyle}`}>
              {item.priority} priority
            </Badge>
            {item.department && (
              <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-50 border-slate-200 text-slate-600 capitalize">
                {item.department}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold flex-shrink-0">
            <Calendar className="w-3 h-3" />
            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-800 leading-tight">{item.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-5">{item.content}</p>
        </div>
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
          <Megaphone className="w-3 h-3" />
          Audience: <span className="capitalize">{item.audience}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function NoticeCard({ item }: { item: ITutorNotice }) {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col">
      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-green)]/20">
            Notice
          </Badge>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold flex-shrink-0">
            <Calendar className="w-3 h-3" />
            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-slate-800 leading-tight">{item.title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-5">{item.content}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CardSkeleton() {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-3/4 rounded" />
      </CardContent>
    </Card>
  );
}

function Pagination({
  page,
  onPrev,
  onNext,
  hasMore,
  isLoading,
}: {
  page: number;
  onPrev: () => void;
  onNext: () => void;
  hasMore: boolean;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
      <span className="text-xs font-semibold text-slate-400">Page {page}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={page <= 1 || isLoading}
          className="h-8 px-3 rounded-xl text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasMore || isLoading}
          className="h-8 px-3 rounded-xl text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default function TutorNoticeManager() {
  const [search, setSearch] = useState("");
  const [announcePage, setAnnouncePage] = useState(1);
  const [noticePage, setNoticePage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching, isError } = useGetTutorNotices({
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    page: announcePage,
    limit: LIMIT,
  });

  const announcements = data?.announcements || [];
  const notices = data?.notices || [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setAnnouncePage(1);
    setNoticePage(1);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Notice Board"
        description="Stay updated with academy announcements and notices."
      />

      {/* ── Filter Bar ── */}
      <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-150">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
          <Input
            placeholder="Search notices and announcements..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-10 bg-white border border-slate-200 rounded-xl text-sm"
          />
        </div>
      </div>

      {isError && (
        <div className="py-12 text-center text-slate-500 text-sm font-medium bg-white border border-slate-150 rounded-2xl">
          Failed to load notices. Please try again.
        </div>
      )}

      {!isError && (
        <Tabs defaultValue="announcements">
          <TabsList className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
            <TabsTrigger
              value="announcements"
              className="rounded-lg text-xs font-bold flex items-center gap-1.5 px-4 py-2 data-[state=active]:shadow-none data-[state=active]:text-white"
            >
              <Megaphone className="w-3.5 h-3.5" />
              Announcements
              {!isLoading && (
                <span className="ml-1 bg-[var(--brand-light-green)] text-[var(--brand-mid)] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {data?.totalAnnouncements ?? announcements.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="notices"
              className="rounded-lg text-xs font-bold flex items-center gap-1.5 px-4 py-2 data-[state=active]:shadow-none data-[state=active]:text-white"
            >
              <Bell className="w-3.5 h-3.5" />
              Notices
              {!isLoading && (
                <span className="ml-1 bg-[var(--brand-light-green)] text-[var(--brand-mid)] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {data?.totalNotices ?? notices.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Announcements ── */}
          <TabsContent value="announcements" className="mt-5">
            <div className="relative">
              {isFetching && !isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 rounded-2xl" />
              )}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
                </div>
              ) : announcements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {announcements.map((a) => <AnnouncementCard key={a.id} item={a} />)}
                </div>
              ) : (
                <div className="py-16 bg-white border border-slate-150 rounded-2xl text-center">
                  <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-500">No announcements found.</p>
                </div>
              )}
            </div>
            {!isLoading && announcements.length > 0 && (
              <Pagination
                page={announcePage}
                onPrev={() => setAnnouncePage((p) => Math.max(1, p - 1))}
                onNext={() => setAnnouncePage((p) => p + 1)}
                hasMore={announcements.length === LIMIT}
                isLoading={isFetching}
              />
            )}
          </TabsContent>

          {/* ── Notices ── */}
          <TabsContent value="notices" className="mt-5">
            <div className="relative">
              {isFetching && !isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 rounded-2xl" />
              )}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2].map((i) => <CardSkeleton key={i} />)}
                </div>
              ) : notices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {notices.map((n) => <NoticeCard key={n.id} item={n} />)}
                </div>
              ) : (
                <div className="py-16 bg-white border border-slate-150 rounded-2xl text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-500">No notices at the moment.</p>
                </div>
              )}
            </div>
            {!isLoading && notices.length > 0 && (
              <Pagination
                page={noticePage}
                onPrev={() => setNoticePage((p) => Math.max(1, p - 1))}
                onNext={() => setNoticePage((p) => p + 1)}
                hasMore={notices.length === LIMIT}
                isLoading={isFetching}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
