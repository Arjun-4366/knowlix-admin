"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Megaphone, Calendar, User, Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: "General" | "Exam" | "Holiday" | "Event" | "Urgent";
  targetGrade: string;
  date: string;
  authorName: string;
  authorRole: "Admin" | "Tutor";
}

const CATEGORY_OPTIONS = ["General", "Exam", "Holiday", "Event", "Urgent"];
const GRADE_OPTIONS = ["All Grades", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

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

export default function AdminNoticeManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<Notice["category"]>("General");
  const [newTargetGrade, setNewTargetGrade] = useState("All Grades");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

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

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please fill in both the title and content.");
      return;
    }

    const newNotice: Notice = {
      id: `NTC-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      targetGrade: newTargetGrade,
      date: new Date().toISOString().split("T")[0],
      authorName: "Administrator",
      authorRole: "Admin",
    };

    const updated = [newNotice, ...notices];
    setNotices(updated);
    localStorage.setItem("knowlix_notices", JSON.stringify(updated));
    toast.success("Notice created and published successfully!");

    // Reset fields
    setNewTitle("");
    setNewContent("");
    setNewCategory("General");
    setNewTargetGrade("All Grades");
    setShowAddForm(false);
  };

  const handleDeleteNotice = (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      const updated = notices.filter((n) => n.id !== id);
      setNotices(updated);
      localStorage.setItem("knowlix_notices", JSON.stringify(updated));
      toast.success("Notice deleted successfully.");
    }
  };

  // Filter logic
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || n.category === selectedCategory;
    const matchesGrade = selectedGrade === "all" || n.targetGrade === selectedGrade;
    return matchesSearch && matchesCategory && matchesGrade;
  });

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Notices & Announcements"
        description="Create, manage, and publish announcements on the notice board for students and tutors."
      />

      {/* Control Panel */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-white border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
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

          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="h-10 w-[140px] bg-white border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <SelectValue placeholder="Grade" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-semibold text-xs text-slate-700">All Grades</SelectItem>
              {GRADE_OPTIONS.map((g) => (
                <SelectItem key={g} value={g} className="font-semibold text-xs text-slate-700">
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Notice Button */}
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
            showAddForm
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white shadow-sm"
          }`}
        >
          {showAddForm ? (
            <>
              <X className="w-3.5 h-3.5" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Create Announcement
            </>
          )}
        </Button>
      </div>

      {/* Add Notice Form */}
      {showAddForm && (
        <Card className="bg-white border-slate-150 shadow-sm overflow-hidden animate-slide-down">
          <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Create New Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="md:col-span-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Notice Title
                  </label>
                  <Input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Schedule Update / Event Details"
                    className="h-10 bg-white border border-slate-200 rounded-xl text-sm"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Category
                  </label>
                  <Select value={newCategory} onValueChange={(val: any) => setNewCategory(val)}>
                    <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <SelectItem key={cat} value={cat} className="font-medium text-xs">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Grade */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Target Grade
                  </label>
                  <Select value={newTargetGrade} onValueChange={setNewTargetGrade}>
                    <SelectTrigger className="h-10 bg-white border-slate-200 rounded-xl text-sm font-medium">
                      <SelectValue placeholder="Select Target Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_OPTIONS.map((g) => (
                        <SelectItem key={g} value={g} className="font-medium text-xs">
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Notice Content / Description
                </label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Type the full notice announcement content here..."
                  className="min-h-24 bg-white border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" /> Publish Announcement
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                className="bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardContent className="p-6 space-y-4 flex-1">
                  {/* Category & Action */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${catColor}`}>
                        {notice.category}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-50 border-slate-200 text-slate-600">
                        {notice.targetGrade}
                      </Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteNotice(notice.id)}
                      className="text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Title & Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-6">
                      {notice.content}
                    </p>
                  </div>
                </CardContent>

                {/* Footer with Metadata */}
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-[10px] font-semibold text-slate-450">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[120px]">
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
            No notices found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
