"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";

type Stat = { value: string; label: string; subtext: string };

const initial: Stat[] = [
  { value: "445+", label: "Students Enrolled", subtext: "and growing every month" },
  { value: "33+", label: "Expert Mentors", subtext: "across all subjects" },
  { value: "4.9", label: "Average Rating", subtext: "from verified parents" },
  { value: "98%", label: "Satisfaction Rate", subtext: "in post-session surveys" },
];

export default function StatsEditor() {
  const [stats, setStats] = useState<Stat[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Stat, value: string) =>
    setStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Stats saved!");
  };

  return (
    <SectionCard title="Trust Bar Stats" description="4 metrics shown in the trust bar below the hero section">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Metric {i + 1}</p>
            <div className="space-y-1.5">
              <Label>Value</Label>
              <Input value={stat.value} onChange={(e) => update(i, "value", e.target.value)} placeholder="e.g. 445+" />
            </div>
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input value={stat.label} onChange={(e) => update(i, "label", e.target.value)} placeholder="e.g. Students Enrolled" />
            </div>
            <div className="space-y-1.5">
              <Label>
                Subtext{" "}
                <span className="text-gray-400 font-normal">
                  ({stat.subtext.length}/40)
                </span>
              </Label>
              <Input
                value={stat.subtext}
                onChange={(e) => update(i, "subtext", e.target.value.slice(0, 40))}
                placeholder="Short supporting text (max 40 chars)"
                maxLength={40}
              />
            </div>
          </div>
        ))}
      </div>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
