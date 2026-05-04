"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";

type Value = { icon: string; title: string; description: string };

const initial: Value[] = [
  { icon: "🌱", title: "Growth", description: "We believe every child can grow academically and personally with the right guidance." },
  { icon: "❤️", title: "Empathy", description: "We approach every student with understanding, patience, and genuine care." },
  { icon: "⭐", title: "Excellence", description: "We hold ourselves to the highest standards in teaching quality and student outcomes." },
  { icon: "🤝", title: "Community", description: "We build a supportive community of students, mentors, and parents working together." },
  { icon: "💡", title: "Innovation", description: "We continuously improve our methods using technology and the latest educational research." },
  { icon: "🛡️", title: "Integrity", description: "We are transparent, honest, and accountable to every family that trusts us." },
];

export default function ValuesEditor() {
  const [values, setValues] = useState<Value[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Value, value: string) =>
    setValues((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));

  const remove = (i: number) => setValues((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setValues((prev) => [...prev, { icon: "", title: "", description: "" }]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Core Values saved!");
  };

  return (
    <SectionCard title="Core Values" description="Values displayed on the About page">
      <div className="grid grid-cols-2 gap-4">
        {values.map((v, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Value {i + 1}</p>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <Input value={v.icon} onChange={(e) => update(i, "icon", e.target.value)} />
              </div>
              <div className="col-span-4 space-y-1.5">
                <Label>Title</Label>
                <Input value={v.title} onChange={(e) => update(i, "title", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={v.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-3 mt-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Value
      </button>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
