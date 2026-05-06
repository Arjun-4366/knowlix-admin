"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";
import { Input } from "../ui/input";

type Milestone = { year: string; title: string; description: string };

const initial: Milestone[] = [
  { year: "2021", title: "Founded with a Vision", description: "Knowlix was founded with a simple belief — every child deserves personalised, high-quality education regardless of location." },
  { year: "2022", title: "First 100 Students", description: "Within a year, we crossed 100 enrolled students and expanded our mentor team to 10 subject experts." },
  { year: "2023", title: "Curriculum Expansion", description: "Launched our comprehensive Online School program covering KG–12 with full CBSE curriculum and live daily classes." },
  { year: "2024", title: "445+ Students Strong", description: "Today, Knowlix serves 445+ students across India with 33+ certified mentors and a 4.9 average rating." },
];

export default function StoryEditor() {
  const [sectionMedia, setSectionMedia] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Milestone, value: string) =>
    setMilestones((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));

  const remove = (i: number) => setMilestones((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setMilestones((prev) => [...prev, { year: "", title: "", description: "" }]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Our Story saved!");
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Section Media">
        <div className="space-y-1.5">
          <Label>Image or Video</Label>
          <MediaUpload
            value={sectionMedia}
            onChange={setSectionMedia}
            ratio="video"
          />
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>

      <SectionCard title="Timeline Milestones">
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Milestone {i + 1}</p>
                <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label>Year</Label>
                  <Input value={m.year} onChange={(e) => update(i, "year", e.target.value)} placeholder="2021" />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <Label>Title</Label>
                  <Input value={m.title} onChange={(e) => update(i, "title", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={m.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} />
              </div>
            </div>
          ))}
          <button
            onClick={add}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Milestone
          </button>
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>
    </div>
  );
}
