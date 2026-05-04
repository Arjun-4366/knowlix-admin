"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

const initial = {
  visionTitle: "Our Vision",
  visionText: "To make world-class, personalised education accessible to every child in India and beyond, regardless of location or background.",
  missionTitle: "Our Mission",
  missionText: "To provide structured, mentor-led online education that genuinely improves academic outcomes through small batches, daily accountability, and a nurturing learning environment.",
  visionMedia: "",
  missionMedia: "",
};

export default function VisionMissionEditor() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Vision & Mission saved!");
  };

  return (
    <div className="grid grid-cols-2 gap-5">
      <SectionCard title="Vision">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.visionTitle} onChange={set("visionTitle")} />
          </div>
          <div className="space-y-1.5">
            <Label>Text</Label>
            <Textarea value={form.visionText} onChange={set("visionText")} rows={5} />
          <div className="space-y-1.5">
            <Label>Vision Media</Label>
            <MediaUpload
              value={form.visionMedia}
              onChange={(url) => setForm((f) => ({ ...f, visionMedia: url }))}
              ratio="video"
              accept="image/*,video/*"
            />
          </div>
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>

      <SectionCard title="Mission">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.missionTitle} onChange={set("missionTitle")} />
          </div>
          <div className="space-y-1.5">
            <Label>Text</Label>
            <Textarea value={form.missionText} onChange={set("missionText")} rows={5} />
          <div className="space-y-1.5">
            <Label>Mission Media</Label>
            <MediaUpload
              value={form.missionMedia}
              onChange={(url) => setForm((f) => ({ ...f, missionMedia: url }))}
              ratio="video"
              accept="image/*,video/*"
            />
          </div>
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>
    </div>
  );
}
