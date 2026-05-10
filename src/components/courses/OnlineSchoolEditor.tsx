"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Save } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import MediaUpload from "@/components/shared/MediaUpload";

const initial = {
  name: "Online School",
  tagline: "Full-curriculum schooling from KG to Grade 12",
  description:
    "A complete online schooling experience with live daily classes, recorded sessions, exams, report cards, and certification — all from the comfort of home.",
  grades: "KG – 12",
  batchSize: "1-on-1 or max 4 per class",
  schedule: "Monday – Saturday",
  duration: "45–60 min sessions",
  students: "280+",
  rating: "4.9",
  features: [
    "Full CBSE & International curriculum",
    "Live daily classes with attendance tracking",
    "Recorded class replay anytime",
    "Weekly tests and monthly assessments",
    "Detailed report cards",
    "Completion certification",
    "Dedicated parent-teacher communication",
    "Study material and worksheets included",
  ],
};

export default function OnlineSchoolEditor() {
  const [form, setForm] = useState(initial);
  const [sectionMedia, setSectionMedia] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const updateFeature = (i: number, val: string) =>
    setForm((f) => ({ ...f, features: f.features.map((ft, idx) => (idx === i ? val : ft)) }));

  const removeFeature = (i: number) =>
    setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const addFeature = () => setForm((f) => ({ ...f, features: [...f.features, ""] }));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Online School saved!");
  };

  return (
    <div className="space-y-5">
      {/* ── Program Overview ── */}
      <SectionCard title="Program Overview">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Program Name</Label>
              <Input value={form.name} onChange={set("name")} />
            </div>
            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input value={form.tagline} onChange={set("tagline")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={set("description")} rows={3} />
          </div>
          
        </div>
      </SectionCard>

      {/* ── Program Details ── */}
      <SectionCard title="Program Details">
        <div className="grid grid-cols-3 gap-4">
          {(
            [
              ["grades", "Grades Covered"],
              ["batchSize", "Batch Size"],
              ["schedule", "Schedule"],
              ["duration", "Session Duration"],
              ["students", "Students Enrolled"],
              ["rating", "Rating"],
            ] as [keyof typeof initial, string][]
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input value={form[key] as string} onChange={set(key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Program Features ── */}
      <SectionCard title="Program Features" description="Bullet points listed on the course card">
        <div className="space-y-2">
          {form.features.map((ft, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={ft}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder={`Feature ${i + 1}`}
              />
              <button
                onClick={() => removeFeature(i)}
                className="text-red-400 hover:text-red-600 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addFeature}
            className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors mt-1"
          >
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>
      </SectionCard>

      {/* ── Single primary Save ── */}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60"
          style={{ background: saving ? "#15803d" : "var(--brand-green)" }}
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Online School"}
        </button>
      </div>
    </div>
  );
}
