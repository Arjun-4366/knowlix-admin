"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";

type Stat = { value: string; label: string; icon: string };

const initial: Stat[] = [
  { value: "445+", label: "Students Enrolled", icon: "👨‍🎓" },
  { value: "33+", label: "Expert Mentors", icon: "👩‍🏫" },
  { value: "4.9", label: "Average Rating", icon: "⭐" },
  { value: "98%", label: "Satisfaction Rate", icon: "🏆" },
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
              <Label>Icon (emoji)</Label>
              <Input value={stat.icon} onChange={(e) => update(i, "icon", e.target.value)} className="w-24" />
            </div>
            <div className="space-y-1.5">
              <Label>Value</Label>
              <Input value={stat.value} onChange={(e) => update(i, "value", e.target.value)} placeholder="e.g. 445+" />
            </div>
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input value={stat.label} onChange={(e) => update(i, "label", e.target.value)} placeholder="e.g. Students Enrolled" />
            </div>
          </div>
        ))}
      </div>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
