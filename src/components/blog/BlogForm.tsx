"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import MediaUpload from "@/components/shared/MediaUpload";
import { IBlog, BlogCategory } from "@/types/blog";
import { useCreateBlog, useUpdateBlog } from "@/querys/blogQuery";
import { ButtonLoader } from "@/components/shared/Loader";
import { toast } from "react-hot-toast";

const categories: BlogCategory[] = ["Collaborations", "Talks", "Trainings", "Workshops", "Partnerships"];

interface Props {
  onBack: () => void;
  initialData?: IBlog | null;
}

const empty: IBlog = {
  title: "",
  category: "Collaborations",
  description: "",
  date: new Date().toISOString().split("T")[0],
  readTime: "",
  image: "",
  isFeatured: false,
};

export default function BlogForm({ onBack, initialData }: Props) {
  const [form, setForm] = useState<IBlog>(initialData || empty);
  const { mutateAsync: createPost, isPending: creating } = useCreateBlog();
  const { mutateAsync: updatePost, isPending: updating } = useUpdateBlog();

  const saving = creating || updating;

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const update = (key: keyof IBlog, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    try {
      if (!form.title.trim()) return toast.error("Title is required");
      
      if (form.id) {
        await updatePost(form);
      } else {
        await createPost(form);
      }
      
      toast.success(form.id ? "Blog post updated" : "Blog post created");
      onBack();
    } catch (error) {
      toast.error("Failed to save blog post");
    }
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

      <SectionCard title={form.id ? "Edit Post" : "New Blog Post"}>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Enter post title…" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Publish Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Read Time</Label>
                  <Input value={form.readTime} onChange={(e) => update("readTime", e.target.value)} placeholder="e.g. 5 min read" />
                </div>
                <div className="flex items-center gap-4 pt-8">
                  <Switch checked={form.isFeatured} onCheckedChange={(v) => update("isFeatured", v)} />
                  <Label className="cursor-pointer">Featured post</Label>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Cover Image Upload</Label>
              <MediaUpload
                value={form.image}
                onChange={(file) => update("image", file)}
                ratio="video"
                accept="image/*"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Content / Description</Label>
            <Textarea 
              value={form.description} 
              onChange={(e) => update("description", e.target.value)} 
              rows={12} 
              placeholder="Write the full article content here…" 
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 active:scale-95 shadow-sm hover:shadow-md"
            style={{ background: "var(--brand-green)" }}
          >
            {saving ? <ButtonLoader /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Publish Post"}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
          >
            Cancel
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
