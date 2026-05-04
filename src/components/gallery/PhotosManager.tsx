"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, ImageIcon } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

type Photo = { url: string; caption: string; alt: string; category: string };

const initial: Photo[] = [
  { url: "/gallery/class1.jpg", caption: "Live math class in session", alt: "Students in online math class", category: "Classes" },
  { url: "/gallery/class2.jpg", caption: "Science experiment demo", alt: "Science demonstration class", category: "Classes" },
  { url: "/gallery/activity1.jpg", caption: "Annual quiz competition", alt: "Students in quiz competition", category: "Activities" },
  { url: "/gallery/activity2.jpg", caption: "Art and creativity session", alt: "Art session for students", category: "Activities" },
  { url: "/gallery/event1.jpg", caption: "Knowlix Annual Day 2024", alt: "Annual day celebration", category: "Events" },
  { url: "/gallery/event2.jpg", caption: "Parent-Teacher Meet", alt: "Parent teacher interaction", category: "Events" },
  { url: "/gallery/class3.jpg", caption: "Coding bootcamp for beginners", alt: "Coding class for students", category: "Classes" },
  { url: "/gallery/event3.jpg", caption: "Student achievement awards", alt: "Award ceremony for students", category: "Events" },
];

const categories = ["Classes", "Activities", "Events"];

export default function PhotosManager() {
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Photo, value: string) =>
    setPhotos((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));

  const remove = (i: number) => setPhotos((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setPhotos((prev) => [...prev, { url: "", caption: "", alt: "", category: "Classes" }]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Photos saved!");
  };

  return (
    <SectionCard title="Photo Gallery" description={`${photos.length} photos`}>
      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-xs font-medium text-gray-500 truncate max-w-[120px]">{photo.url || "No image"}</span>
              </div>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <Label>Image Upload</Label>
              <MediaUpload
                value={photo.url}
                onChange={(url) => update(i, "url", url)}
                ratio="video"
                accept="image/*"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label>Caption</Label>
                <Input value={photo.caption} onChange={(e) => update(i, "caption", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={photo.category} onValueChange={(v) => update(i, "category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Alt Text</Label>
              <Input value={photo.alt} onChange={(e) => update(i, "alt", e.target.value)} placeholder="Describe the image" />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-3 mt-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Photo
      </button>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
