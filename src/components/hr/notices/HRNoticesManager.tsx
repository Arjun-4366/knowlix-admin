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
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  general: {
    label: "General",
    icon: MessageSquare,
    color: "text-slate-700",
    bg: "bg-slate-50 border-slate-200",
  },
};

const PRIORITY_COLOR: Record<HRNoticePriority, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const PRIORITIES: HRNoticePriority[] = ["high", "medium", "low"];
const CATEGORIES: HRNoticeCategory[] = ["announcement", "notice", "general"];
const AUDIENCES = ["all", "tutors", "students", "admins", "operations"];
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
          color
        )}
      >
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
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState<HRNoticeCategory>(initial?.category ?? "general");
  const [priority, setPriority] = useState<HRNoticePriority>(initial?.priority ?? "medium");
  const [department, setDepartment] = useState(initial?.department ?? "");
  const [audience, setAudience] = useState(initial?.audience ?? "all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    onSubmit({ title, content, category, priority, department, audience });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <Card className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* Header */}
        <div
          className="flex items-center justify-between p-5 border-b border-slate-100"
          style={{ background: "var(--brand-dark)" }}
        >
          <h2 className="text-sm font-bold text-white">
            {initial ? "Edit Notice" : "Create Notice"}
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HRNoticeCategory)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none pr-8"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_META[c].label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as HRNoticePriority)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none pr-8"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Audience + Department row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Audience
              </label>
              <div className="relative">
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none pr-8"
                >
                  {AUDIENCES.map((a) => (
                    <option key={a} value={a}>
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Department
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none pr-8"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notice title…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the notice content here…"
              rows={4}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: "var(--brand-green)" }}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {saving ? "Saving…" : initial ? "Update Notice" : "Publish Notice"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
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
  const meta = CATEGORY_META[notice.category] ?? CATEGORY_META.general;
  const Icon = meta.icon;

  return (
    <div className="rounded-2xl border border-slate-150 bg-white shadow-sm hover:shadow-md transition-shadow p-5 space-y-3">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0",
            meta.bg
          )}
        >
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
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(notice.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{notice.content}</p>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant="outline"
          className={cn(
            "rounded-full text-[10px] font-bold px-2.5 py-0.5 border",
            meta.bg,
            meta.color
          )}
        >
          {meta.label}
        </Badge>
        <Badge
          variant="outline"
          className={cn(
            "rounded-full text-[10px] font-bold px-2.5 py-0.5 border",
            PRIORITY_COLOR[notice.priority]
          )}
        >
          {notice.priority.toUpperCase()} Priority
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
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<IHRNotice | null>(null);

  const queryParams = categoryFilter !== "all" ? { category: categoryFilter as HRNoticeCategory } : undefined;
  const { data: noticesRes, isLoading } = useGetHRNotices(queryParams);
  const createNoticeMutation = useCreateHRNotice();
  const updateNoticeMutation = useUpdateHRNotice();
  const deleteNoticeMutation = useDeleteHRNotice();

  const notices = noticesRes?.data ? (noticesRes.data as IHRNotice[]) : [];

  const handleCreate = (data: ICreateHRNoticePayload) => {
    createNoticeMutation.mutate(data, {
      onSuccess: () => setShowModal(false)
    });
  };

  const handleUpdate = (data: ICreateHRNoticePayload) => {
    if (!editTarget) return;
    updateNoticeMutation.mutate({ id: editTarget.id, data }, {
      onSuccess: () => {
        setShowModal(false);
        setEditTarget(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Notice",
      message: "Are you sure you want to delete this notice? This action cannot be undone.",
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

  const filteredNotices = notices.filter((n) => {
    if (categoryFilter !== "all" && n.category !== categoryFilter) return false;
    if (priorityFilter !== "all" && n.priority !== priorityFilter) return false;
    return true;
  });

  const totalAnnouncements = notices.filter((n) => n.category === "announcement").length;
  const totalNotices = notices.filter((n) => n.category === "notice").length;
  const totalHigh = notices.filter((n) => n.priority === "high").length;

  return (
    <div className="space-y-6 w-full pb-10">
      <DashboardHeader
        title="Notices & Announcements"
        description="Publish and manage HR communications — company announcements, department notices, and general updates."
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
          {/* Category filter pills */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Category:
            </span>
            {(["all", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-lg font-medium transition-all",
                  categoryFilter === c
                    ? "text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
                style={categoryFilter === c ? { background: "var(--brand-green)" } : undefined}
              >
                {c === "all" ? "All" : CATEGORY_META[c].label}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Priority:
            </span>
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as HRNoticePriority | "all")}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-200 appearance-none pr-7 bg-white"
              >
                <option value="all">All</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Publish button */}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--brand-green)" }}
          >
            <Plus className="w-4 h-4" />
            Publish Notice
          </button>
        </div>
      </Card>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : filteredNotices.length === 0 ? (
        <Card className="rounded-2xl border-slate-150 p-10 text-center bg-white shadow-sm">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">No notices found</p>
          <p className="text-xs text-slate-400 mt-1">
            {categoryFilter !== "all" || priorityFilter !== "all"
              ? "Try clearing the filters."
              : "Publish your first notice using the button above."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filteredNotices.map((notice) => (
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
          saving={createNoticeMutation.isPending || updateNoticeMutation.isPending}
        />
      )}
    </div>
  );
}
