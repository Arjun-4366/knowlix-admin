"use client";

import { useState, useEffect } from "react";
import { Megaphone, Calendar, User, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Notice } from "@/components/admin/notices/AdminNoticeManager";

const CATEGORY_OPTIONS = ["General", "Exam", "Holiday", "Event", "Urgent"];

const initialNotices: Notice[] = [
  {
    id: "NTC-1",
    title: "Summer Vacation Schedule 2026",
    content: "The academy will remain closed for summer holidays from June 10th to June 25th, 2026. Regular online and hybrid classes will resume from June 26th. Please ensure your homework assignments are submitted before the closing date.",
    category: "Holiday",
    targetGrade: "All Grades",
    date: "2026-05-20",
    authorName: "Administrator",
    authorRole: "Admin"
  },
  {
    id: "NTC-2",
    title: "Maths Midterm Practice Session",
    content: "Dr. Ramesh Prasad will conduct a special limits & continuity doubt-solving session this Saturday from 4 PM to 6 PM. Attendance is highly recommended for Grade 10 students.",
    category: "General",
    targetGrade: "Grade 10",
    date: "2026-05-22",
    authorName: "Dr. Ramesh Prasad",
    authorRole: "Tutor"
  },
  {
    id: "NTC-3",
    title: "Final Assessment Timetable Release",
    content: "The final exam timetable for Term 1 has been uploaded under your exams section. Please check dates, duration, and exam instructions. Reach out to your coordinators for any conflicts.",
    category: "Exam",
    targetGrade: "Grade 12",
    date: "2026-05-18",
    authorName: "Administrator",
    authorRole: "Admin"
  }
];

export default function StudentNoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const studentGrade = "Grade 10"; // Rahul Sharma's grade

  useEffect(() => {
    const stored = localStorage.getItem("knowlix_notices");
    if (stored) {
      try {
        setNotices(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored notices:", e);
      }
    } else {
      localStorage.setItem("knowlix_notices", JSON.stringify(initialNotices));
      setNotices(initialNotices);
    }
  }, []);

  // Filter notices to only those matching student's grade or "All Grades"
  const studentNotices = notices.filter(
    (n) => n.targetGrade === "All Grades" || n.targetGrade === studentGrade
  );

  // Apply search and category filter
  const filteredNotices = studentNotices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Notice Board"
        description="Stay updated with the latest notices, announcements, and timetables published by academy admins and your tutors."
      />

      {/* Control Panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 w-[150px] bg-white border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-semibold text-xs text-slate-700">All Categories</SelectItem>
              {CATEGORY_OPTIONS.map((cat) => (
                <SelectItem key={cat} value={cat} className="font-semibold text-xs text-slate-700">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Info Badge */}
        <Badge className="bg-[var(--brand-light-green)] text-[var(--brand-mid)] border-[var(--brand-light)]/20 px-3 py-1 rounded-full text-xs font-bold shadow-none">
          Displaying updates for {studentGrade}
        </Badge>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => {
            let catColor = "bg-slate-100 text-slate-650 border-slate-200";
            if (notice.category === "Urgent") catColor = "bg-red-50 text-red-700 border-red-150";
            else if (notice.category === "Exam") catColor = "bg-amber-50 text-amber-700 border-amber-150";
            else if (notice.category === "Holiday") catColor = "bg-blue-50 text-blue-700 border-blue-150";
            else if (notice.category === "Event") catColor = "bg-purple-50 text-purple-700 border-purple-150";

            return (
              <Card
                key={notice.id}
                className="bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <CardContent className="p-6 space-y-4 flex-1">
                  {/* Category */}
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${catColor}`}>
                      {notice.category}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-50 border-slate-200 text-slate-600">
                      {notice.targetGrade}
                    </Badge>
                  </div>

                  {/* Title & Content */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-800 leading-tight">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>
                  </div>
                </CardContent>

                {/* Footer with Metadata */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-[10px] font-semibold text-slate-450">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[150px]">
                      {notice.authorName} ({notice.authorRole})
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(notice.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-16 bg-white border border-slate-150 rounded-2xl shadow-sm text-center text-slate-450 text-sm font-medium">
            No notices published for your grade at this time.
          </div>
        )}
      </div>
    </div>
  );
}
