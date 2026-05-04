"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import MediaUpload from "@/components/shared/MediaUpload";

const categories = ["Parenting Tips", "Study Techniques", "Online Learning", "Exam Strategies"];

interface Props {
  onBack: () => void;
}

const empty = {
  title: "",
  category: "Parenting Tips",
  excerpt: "",
  content: "",
  date: new Date().toISOString().split("T")[0],
  readTime: "",
  imageUrl: "",
  featured: false,
  published: false,
};

export default function BlogForm({ onBack }: Props) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Post saved!");
    onBack();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Posts
        </button>
      </div>

      <SectionCard title="Post Details">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={set("title")} placeholder="Post title…" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Publish Date</Label>
              <Input type="date" value={form.date} onChange={set("date")} />
            </div>
            <div className="space-y-1.5">
              <Label>Read Time</Label>
              <Input value={form.readTime} onChange={set("readTime")} placeholder="e.g. 5 min" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Cover Image Upload</Label>
            <MediaUpload
              value={form.imageUrl}
              onChange={(url) => setForm(f => ({ ...f, imageUrl: url }))}
              ratio="video"
              accept="image/*"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={set("excerpt")} rows={2} placeholder="Short summary shown in the blog listing…" />
          </div>
          <div className="space-y-1.5">
            <Label>Content</Label>
            <Textarea value={form.content} onChange={set("content")} rows={12} placeholder="Full article content…" />
          </div>
          <div className="flex items-center gap-8 pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm((f) => ({ ...f, featured: v }))} />
              <Label>Featured post</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))} />
              <Label>Publish immediately</Label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
            style={{ background: "var(--brand-green)" }}
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : "Save Post"}
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
