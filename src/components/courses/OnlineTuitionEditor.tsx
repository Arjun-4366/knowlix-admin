"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

type Subject = { name: string; description: string; grades: string; students: string; rating: string; image: string };

const initial: Subject[] = [
  { name: "Mathematics", description: "From basic arithmetic to advanced calculus — building strong foundations.", grades: "KG–12", students: "120+", rating: "4.9", image: "" },
  { name: "Physics", description: "Conceptual clarity and problem-solving skills for board and competitive exams.", grades: "8–12", students: "65+", rating: "4.8", image: "" },
  { name: "Chemistry", description: "Organic, inorganic, and physical chemistry taught with real-world examples.", grades: "8–12", students: "58+", rating: "4.9", image: "" },
  { name: "Biology", description: "In-depth study of life sciences with diagram-focused learning.", grades: "8–12", students: "45+", rating: "4.8", image: "" },
  { name: "English", description: "Grammar, comprehension, writing, and literature for confident communication.", grades: "KG–12", students: "90+", rating: "4.9", image: "" },
  { name: "Science", description: "Integrated science covering Physics, Chemistry, and Biology for middle school.", grades: "6–8", students: "70+", rating: "4.8", image: "" },
  { name: "Coding", description: "Python, Scratch, and web development — building future-ready skills.", grades: "4–12", students: "55+", rating: "4.9", image: "" },
  { name: "Social Studies", description: "History, Geography, Civics, and Economics made engaging and easy to retain.", grades: "6–10", students: "40+", rating: "4.7", image: "" },
];

export default function OnlineTuitionEditor() {
  const [subjects, setSubjects] = useState<Subject[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Subject, value: string) =>
    setSubjects((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const remove = (i: number) => setSubjects((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setSubjects((prev) => [...prev, { name: "", description: "", grades: "", students: "", rating: "", image: "" }]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Online Tuition saved!");
  };

  return (
    <SectionCard title="Subjects" description="Each subject offered under Online Tuition">
      <div className="space-y-4">
        {subjects.map((s, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{s.name || `Subject ${i + 1}`}</p>
              <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label>Subject Name</Label>
                <Input value={s.name} onChange={(e) => update(i, "name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Grades</Label>
                <Input value={s.grades} onChange={(e) => update(i, "grades", e.target.value)} placeholder="e.g. 8–12" />
              </div>
              <div className="space-y-1.5">
                <Label>Students</Label>
                <Input value={s.students} onChange={(e) => update(i, "students", e.target.value)} placeholder="e.g. 65+" />
              </div>
              <div className="space-y-1.5">
                <Label>Rating</Label>
                <Input value={s.rating} onChange={(e) => update(i, "rating", e.target.value)} placeholder="e.g. 4.9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea value={s.description} onChange={(e) => update(i, "description", e.target.value)} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>Subject Image</Label>
                <MediaUpload
                  value={s.image}
                  onChange={(url) => update(i, "image", url)}
                  ratio="video"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
