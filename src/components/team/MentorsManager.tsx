"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, X } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

type Mentor = { name: string; subject: string; grades: string; experience: string; bio: string; avatar: string };

const initial: Mentor[] = [
  { name: "Kavitha Nair", subject: "Mathematics", grades: "8–12", experience: "8 years", bio: "Specialises in board exam preparation with a focus on conceptual clarity and problem-solving shortcuts.", avatar: "" },
  { name: "Rohit Sharma", subject: "Physics", grades: "9–12", experience: "6 years", bio: "IIT graduate passionate about making physics intuitive through real-world analogies and experiments.", avatar: "" },
  { name: "Deepa Iyer", subject: "Chemistry", grades: "8–12", experience: "10 years", bio: "Expert in organic chemistry with a track record of helping students crack JEE and NEET.", avatar: "" },
  { name: "Amit Singh", subject: "English", grades: "KG–10", experience: "7 years", bio: "Specialises in building reading comprehension and creative writing skills from an early age.", avatar: "" },
  { name: "Preethi Raj", subject: "Biology", grades: "9–12", experience: "9 years", bio: "NEET specialist with deep expertise in human anatomy, genetics, and ecology.", avatar: "" },
  { name: "Vikram Nair", subject: "Coding", grades: "4–12", experience: "5 years", bio: "Full-stack developer turned educator. Makes coding fun with project-based learning and real apps.", avatar: "" },
  { name: "Sunita Gupta", subject: "Social Studies", grades: "6–10", experience: "11 years", bio: "Makes history and geography come alive through storytelling and visual learning techniques.", avatar: "" },
  { name: "Arun Kumar", subject: "Science", grades: "6–8", experience: "7 years", bio: "Integrated science teacher focused on hands-on experiments and curiosity-driven learning.", avatar: "" },
];

export default function MentorsManager() {
  const [mentors, setMentors] = useState<Mentor[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Mentor, value: string) =>
    setMentors((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));

  const remove = (i: number) => {
    setMentors((prev) => prev.filter((_, idx) => idx !== i));
    if (editing === i) setEditing(null);
  };

  const add = () => {
    setMentors((prev) => [...prev, { name: "", subject: "", grades: "", experience: "", bio: "", avatar: "" }]);
    setEditing(mentors.length);
  };

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Mentors saved!");
  };

  return (
    <SectionCard title="Mentors" description={`${mentors.length} mentors`}>
      <div className="space-y-2 mb-4">
        {mentors.map((m, i) => (
          <div key={i}>
            <div
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-200 cursor-pointer transition-colors"
              style={editing === i ? { borderColor: "var(--brand-green)", background: "#f0fdf4" } : {}}
              onClick={() => setEditing(editing === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-cover bg-center overflow-hidden"
                  style={{
                    background: m.avatar ? `url(${m.avatar}) center/cover` : "var(--brand-green)"
                  }}
                >
                  {!m.avatar && (m.name ? m.name[0] : "?")}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{m.name || "Unnamed Mentor"}</p>
                  <p className="text-xs text-gray-400">{m.subject} · {m.grades} · {m.experience}</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {editing === i && (
              <div className="mt-2 p-4 rounded-lg border border-green-200 bg-green-50 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input value={m.name} onChange={(e) => update(i, "name", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subject</Label>
                    <Input value={m.subject} onChange={(e) => update(i, "subject", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Grades</Label>
                    <Input value={m.grades} onChange={(e) => update(i, "grades", e.target.value)} placeholder="e.g. 8–12" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Experience</Label>
                    <Input value={m.experience} onChange={(e) => update(i, "experience", e.target.value)} placeholder="e.g. 6 years" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Avatar Image</Label>
                  <MediaUpload
                    value={m.avatar}
                    onChange={(url) => update(i, "avatar", url)}
                    ratio="square"
                    className="w-32"
                    accept="image/*"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea value={m.bio} onChange={(e) => update(i, "bio", e.target.value)} rows={2} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Mentor
      </button>

      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
