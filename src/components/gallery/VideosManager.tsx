"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, PlayCircle } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

type Video = { title: string; thumbnailUrl: string; videoUrl: string; type: string };

const initial: Video[] = [
  { title: "Free Demo Class — Grade 8 Mathematics", thumbnailUrl: "/videos/thumb1.jpg", videoUrl: "https://youtube.com/watch?v=xxx", type: "Demo Class" },
  { title: "Parent Review — Priya Sharma, Mumbai", thumbnailUrl: "/videos/thumb2.jpg", videoUrl: "https://youtube.com/watch?v=xxx", type: "Parent Review" },
  { title: "Student Success Story — Grade 10 Toppers", thumbnailUrl: "/videos/thumb3.jpg", videoUrl: "https://youtube.com/watch?v=xxx", type: "Student Success" },
  { title: "Inside a Live Knowlix Class", thumbnailUrl: "/videos/thumb4.jpg", videoUrl: "https://youtube.com/watch?v=xxx", type: "Demo Class" },
];

const videoTypes = ["Demo Class", "Parent Review", "Student Success", "Event Highlight"];

export default function VideosManager() {
  const [videos, setVideos] = useState<Video[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Video, value: string) =>
    setVideos((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));

  const remove = (i: number) => setVideos((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setVideos((prev) => [...prev, { title: "", thumbnailUrl: "", videoUrl: "", type: "Demo Class" }]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Videos saved!");
  };

  return (
    <SectionCard title="Videos" description={`${videos.length} videos`}>
      <div className="space-y-3">
        {videos.map((v, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-gray-400" />
                <p className="text-sm font-medium text-gray-700 truncate max-w-[300px]">{v.title || `Video ${i + 1}`}</p>
              </div>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={v.title} onChange={(e) => update(i, "title", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={v.type} onValueChange={(val) => update(i, "type", val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {videoTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Thumbnail Image</Label>
                  <MediaUpload
                    value={v.thumbnailUrl}
                    onChange={(url) => update(i, "thumbnailUrl", url)}
                    ratio="video"
                    accept="image/*"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Video File</Label>
                  <MediaUpload
                    value={v.videoUrl}
                    onChange={(url) => update(i, "videoUrl", url)}
                    ratio="video"
                    accept="video/*"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Video
        </button>
      </div>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
