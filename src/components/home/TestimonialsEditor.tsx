"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

type Testimonial = { name: string; location: string; grade: string; text: string; rating: number; verified: boolean; avatar: string };

const initial: Testimonial[] = [
  { name: "Priya Sharma", location: "Mumbai", grade: "Grade 8", text: "My daughter's confidence in Math has improved remarkably. The personalized attention she gets is unmatched.", rating: 5, verified: true, avatar: "" },
  { name: "Rajesh Kumar", location: "Hyderabad", grade: "Grade 10", text: "My son scored distinction in board exams after just 6 months with Knowlix. Highly recommended!", rating: 5, verified: true, avatar: "" },
  { name: "Anita Reddy", location: "Bangalore", grade: "Grade 5", text: "The live classes keep my child engaged unlike any other online platform we've tried before.", rating: 5, verified: true, avatar: "" },
  { name: "Suresh Patel", location: "Ahmedabad", grade: "Grade 12", text: "Knowlix mentors helped my daughter achieve 95% in board exams. The daily reports kept us informed.", rating: 5, verified: true, avatar: "" },
];

export default function TestimonialsEditor() {
  const [items, setItems] = useState<Testimonial[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Testimonial, value: string | number | boolean) =>
    setItems((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)));

  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const add = () =>
    setItems((prev) => [...prev, { name: "", location: "", grade: "", text: "", rating: 5, verified: false, avatar: "" }]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Testimonials saved!");
  };

  return (
    <SectionCard
      title="Testimonials"
      description="Parent and student reviews shown on the home page"
    >
      <div className="space-y-4">
        {items.map((t, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Review {i + 1}</p>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={t.name} onChange={(e) => update(i, "name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={t.location} onChange={(e) => update(i, "location", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Child's Grade</Label>
                <Input value={t.grade} onChange={(e) => update(i, "grade", e.target.value)} placeholder="e.g. Grade 8" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Avatar Image</Label>
              <MediaUpload
                value={t.avatar}
                onChange={(url) => update(i, "avatar", url)}
                ratio="square"
                className="w-24 h-24"
                accept="image/*"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Review Text</Label>
              <Textarea value={t.text} onChange={(e) => update(i, "text", e.target.value)} rows={2} />
            </div>
            <div className="flex items-center gap-6">
              <div className="space-y-1.5">
                <Label>Rating (1–5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={t.rating}
                  onChange={(e) => update(i, "rating", Number(e.target.value))}
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <Switch
                  checked={t.verified}
                  onCheckedChange={(v) => update(i, "verified", v)}
                />
                <Label>Verified badge</Label>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
