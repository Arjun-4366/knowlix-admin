"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

type Feature = { title: string; description: string };

const initial: Feature[] = [
  { title: "Personalized Learning", description: "Curriculum tailored to each child's pace, learning style, and academic goals." },
  { title: "Small Batches", description: "Max 4 students per class ensuring every child gets direct mentor attention." },
  { title: "Daily Progress Reports", description: "Parents receive daily updates on their child's learning progress and areas of focus." },
  { title: "Direct Communication", description: "Parents can directly communicate with mentors anytime via WhatsApp or the portal." },
  { title: "Live + Recorded Classes", description: "Attend live sessions and access recorded classes anytime for revision." },
  { title: "Certified Mentors", description: "All mentors go through a rigorous 5-stage selection and training process." },
];

export default function WhyParentsEditor() {
  const [sectionMedia, setSectionMedia] = useState("");
  const [features, setFeatures] = useState<Feature[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Feature, value: string) =>
    setFeatures((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Why Parents section saved!");
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Section Media" description="Image or video displayed alongside the feature cards">
        <MediaUpload
          value={sectionMedia}
          onChange={setSectionMedia}
          ratio="square"
        />
        <FormActions onSave={save} saving={saving} />
      </SectionCard>

      <SectionCard title="Feature Cards" description="6 feature cards explaining why parents trust Knowlix">
        <div className="space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Card {i + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={feature.title} onChange={(e) => update(i, "title", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={feature.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>
    </div>
  );
}
