"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Megaphone,
  Bell,
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  X,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  useGetHRNotices,
  useCreateHRNotice,
  useUpdateHRNotice,
  useDeleteHRNotice,
} from "@/querys/admin/hrQuery";
import {
  IHRNotice,
  HRNoticeCategory,
  HRNoticePriority,
  ICreateHRNoticePayload,
} from "@/types/admin/hr";
import { useConfirmation } from "@/context/ConfirmationContext";

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  HRNoticeCategory,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  announcement: {
    label: "Announcement",
    icon: Megaphone,
    color: "text-sky-700",
    bg: "bg-sky-50 border-sky-200",
  },
  notice: {
    label: "Notice",
    icon: Bell,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
};

const PRIORITY_COLOR: Record<HRNoticePriority, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const PRIORITIES: HRNoticePriority[] = ["high", "medium", "low"];
const CATEGORIES: HRNoticeCategory[] = ["announcement", "notice"];
const AUDIENCES = ["tutors", "students"];
const DEPARTMENTS = ["HR", "Academic", "Sales", "Operations", "Finance", "All"];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm p-5 flex items-start gap-4">
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          color,
        )}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-850">{value}</p>
        <p className="text-xs font-semibold text-slate-700 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

function NoticeFormModal({
  initial,
  onClose,
  onSubmit,
  saving,
}: {
  initial?: IHRNotice | null;
  onClose: () => void;
  onSubmit: (data: ICreateHRNoticePayload) => void;
  saving: boolean;
}) {
  const isEdit = !!initial;
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState<HRNoticeCategory>(
    initial?.category ?? "notice",
  );
  const [priority, setPriority] = useState<HRNoticePriority>(
    initial?.priority ?? "medium",
  );
  const [department, setDepartment] = useState(initial?.department ?? "");
  const [audience, setAudience] = useState(initial?.audience ?? "all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    onSubmit({
      title,
      content,
      category,
      priority,
      department: department || undefined,
      audience,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-light-green)] flex items-center justify-center">
              <Bell className="w-4 h-4 text-[var(--brand-green)]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {isEdit ? "Edit Notice" : "Create Notice"}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {isEdit
                  ? "Update the notice details below"
                  : "Fill in the details to publish a notice"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500">
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as HRNoticeCategory)}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CATEGORY_META[c].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as HRNoticePriority)}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audience + Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500">
                Audience
              </Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>  
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-slate-500">
                Department
              </Label>
              <Select
                value={department || "all"}
                onValueChange={(v) => setDepartment(v === "all" ? "" : v)}>
                <SelectTrigger className="h-9 text-sm font-semibold bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-500">
              Title *
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notice title…"
              className="h-9 text-sm bg-slate-50 border-slate-200"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase font-bold text-slate-500">
              Content *
            </Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the notice content here…"
              className="text-sm bg-slate-50 border-slate-200 resize-none"
              rows={4}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="font-semibold text-sm">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !title.trim() || !content.trim()}
              className="bg-[var(--brand-green)] hover:bg-[var(--brand-mid)] text-white font-bold text-sm flex items-center gap-1.5">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Saving…" : isEdit ? "Update Notice" : "Publish Notice"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NoticeCard({
  notice,
  onEdit,
  onDelete,
}: {
  notice: IHRNotice;
  onEdit: (n: IHRNotice) => void;
  onDelete: (id: string) => void;
}) {
  const meta = CATEGORY_META[notice.category] ?? CATEGORY_META["announcement"];
  const Icon = meta.icon;

  return (
    <div className="rounded-2xl border border-slate-150 bg-white shadow-sm hover:shadow-md transition-shadow p-5 space-y-3">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0",
            meta.bg,
          )}>
          <Icon className={cn("w-4 h-4", meta.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">
            {notice.title}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {format(parseISO(notice.createdAt), "dd MMM yyyy, hh:mm a")}
            {notice.department ? ` · ${notice.department}` : ""}
            {notice.audience && notice.audience !== "all"
              ? ` · For ${notice.audience}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onEdit(notice)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(notice.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
        {notice.content}
      </p>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="outline"
          className={cn(
            "rounded-full text-[10px] font-bold px-2.5 py-0.5 border",
            meta.bg,
            meta.color,
          )}>
          {meta.label}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "rounded-full text-[10px] font-bold px-2.5 py-0.5 border",
            PRIORITY_COLOR[notice.priority],
          )}>
          {notice.priority.toUpperCase()} Priority
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "rounded-full text-[10px] font-bold px-2.5 py-0.5 border",
            notice.isPublished
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-500 border-slate-200",
          )}>
          {notice.isPublished ? "Published" : "Draft"}
        </Badge>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function HRNoticesManager() {
  const { confirm } = useConfirmation();
  const [categoryFilter, setCategoryFilter] = useState<HRNoticeCategory | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<HRNoticePriority | "all">("all");
  const [audienceFilter, setAudienceFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<IHRNotice | null>(null);

  const { data: noticesRes, isLoading } = useGetHRNotices({
    ...(categoryFilter !== "all" ? { category: categoryFilter as HRNoticeCategory } : {}),
    ...(priorityFilter !== "all" ? { priority: priorityFilter as HRNoticePriority } : {}),
    ...(audienceFilter !== "all" ? { audience: audienceFilter } : {}),
  });
  const createNoticeMutation = useCreateHRNotice();
  const updateNoticeMutation = useUpdateHRNotice();
  const deleteNoticeMutation = useDeleteHRNotice();

  const notices = noticesRes?.data ? (noticesRes.data as IHRNotice[]) : [];

  const handleCreate = (data: ICreateHRNoticePayload) => {
    createNoticeMutation.mutate(data, {
      onSuccess: () => setShowModal(false),
    });
  };

  const handleUpdate = (data: ICreateHRNoticePayload) => {
    if (!editTarget) return;
    updateNoticeMutation.mutate(
      { id: editTarget.id, data },
      {
        onSuccess: () => {
          setShowModal(false);
          setEditTarget(null);
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Notice",
      message:
        "Are you sure you want to delete this notice? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
      onConfirm: async () => {
        deleteNoticeMutation.mutate(id);
      },
    });
  };

  const openCreate = () => {
    setEditTarget(null);
    setShowModal(true);
  };

  const openEdit = (notice: IHRNotice) => {
    setEditTarget(notice);
    setShowModal(true);
  };

  const totalAnnouncements = notices.filter(
    (n) => n.category === "announcement",
  ).length;
  const totalNotices = notices.filter((n) => n.category === "notice").length;
  const totalHigh = notices.filter((n) => n.priority === "high").length;

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Notices & Announcements"
        description="Publish and manage HR communications — company announcements, department notices."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Published"
          value={notices.length}
          icon={Bell}
          color="bg-slate-100 text-slate-600"
        />
        <StatCard
          label="Announcements"
          value={totalAnnouncements}
          icon={Megaphone}
          color="bg-sky-100 text-sky-600"
        />
        <StatCard
          label="Notices"
          value={totalNotices}
          icon={Bell}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          label="High Priority"
          value={totalHigh}
          sub="Requires immediate attention"
          icon={Bell}
          color="bg-red-100 text-red-600"
        />
      </div>

      {/* Filters + CTA */}
      <Card className="bg-white border border-slate-150 rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as HRNoticeCategory | "all")}>
            <SelectTrigger className="w-[140px] h-8 text-xs font-semibold bg-white border-slate-200">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{CATEGORY_META[c].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Priority */}
          <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as HRNoticePriority | "all")}>
            <SelectTrigger className="w-[130px] h-8 text-xs font-semibold bg-white border-slate-200">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Audience */}
          <Select value={audienceFilter} onValueChange={setAudienceFilter}>
            <SelectTrigger className="w-[130px] h-8 text-xs font-semibold bg-white border-slate-200">
              <SelectValue placeholder="Audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {AUDIENCES.map((a) => (
                <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Publish button */}
          <Button
            onClick={openCreate}
            className="ml-auto bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Plus className="w-4 h-4" />
            Publish Notice
          </Button>
        </div>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : notices.length === 0 ? (
        <Card className="rounded-2xl border-slate-150 p-10 text-center bg-white shadow-sm">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">No notices found</p>
          <p className="text-xs text-slate-400 mt-1">Publish your first notice using the button above.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <NoticeFormModal
          initial={editTarget}
          onClose={() => {
            setShowModal(false);
            setEditTarget(null);
          }}
          onSubmit={editTarget ? handleUpdate : handleCreate}
          saving={
            createNoticeMutation.isPending || updateNoticeMutation.isPending
          }
        />
      )}
    </div>
  );
}
