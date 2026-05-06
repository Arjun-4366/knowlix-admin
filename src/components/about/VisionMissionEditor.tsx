"use client";

import SectionCard from "@/components/shared/SectionCard";

export default function VisionMissionEditor() {
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
          </div>
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
          </div>
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
      </SectionCard>
    </div>
  );
}
