"use client";

import { useState } from "react";
import { Megaphone, Calendar, Search, Loader2, Bell, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { useGetTutorNotices } from "@/querys/tutor/noticeQuery";
import { ITutorAnnouncement, ITutorNotice } from "@/services/tutor/notices";

const PRIORITY_STYLES: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

function AnnouncementCard({ item }: { item: ITutorAnnouncement }) {
  const priorityStyle = PRIORITY_STYLES[item.priority] || "bg-slate-100 text-slate-600 border-slate-200";

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

export default function TutorNoticeManager() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetTutorNotices();

  const announcements = (data?.announcements || []).filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
  );

  const notices = (data?.notices || []).filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Notice Board & Announcements"
        description="Stay updated with academy announcements and notices."
      />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
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
          <TabsList className="bg-slate-100 rounded-xl p-1 h-auto">
            <TabsTrigger value="announcements" className="rounded-lg text-xs font-bold flex items-center gap-1.5 px-4 py-2">
              <Megaphone className="w-3.5 h-3.5" />
              Announcements
              {!isLoading && (
                <span className="ml-1 bg-[var(--brand-light-green)] text-[var(--brand-mid)] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {data?.announcements?.length ?? 0}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="notices" className="rounded-lg text-xs font-bold flex items-center gap-1.5 px-4 py-2">
              <Bell className="w-3.5 h-3.5" />
              Notices
              {!isLoading && (
                <span className="ml-1 bg-[var(--brand-light-green)] text-[var(--brand-mid)] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {data?.notices?.length ?? 0}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="mt-5">
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
          </TabsContent>

          <TabsContent value="notices" className="mt-5">
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
