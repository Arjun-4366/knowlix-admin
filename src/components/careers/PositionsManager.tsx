"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";

type Position = { title: string; department: string; type: string; description: string; active: boolean };

const initial: Position[] = [
  { title: "Mathematics Mentor", department: "Academics", type: "Part-time / Freelance", description: "Teach Math for grades 6–12. Must have strong subject knowledge and min 2 years teaching experience.", active: true },
  { title: "Science Mentor", department: "Academics", type: "Part-time / Freelance", description: "Integrated science for grades 6–8. Ability to make concepts engaging through experiments.", active: true },
  { title: "Physics Mentor", department: "Academics", type: "Part-time / Freelance", description: "Board and JEE-focused physics for grades 9–12. IIT/NIT graduate preferred.", active: true },
  { title: "Chemistry Mentor", department: "Academics", type: "Part-time / Freelance", description: "Organic, Inorganic, and Physical Chemistry for grades 9–12 and NEET preparation.", active: true },
  { title: "English Mentor", department: "Academics", type: "Part-time / Freelance", description: "English language and literature for grades KG–10. Strong grammar and communication skills required.", active: false },
  { title: "Coding Mentor", department: "Academics", type: "Part-time / Freelance", description: "Python, Scratch, HTML/CSS for grades 4–12. Background in software development preferred.", active: true },
  { title: "Academic Coordinator", department: "Operations", type: "Full-time", description: "Coordinate between parents, students, and mentors. Handle scheduling, feedback, and academic quality.", active: true },
];

export default function PositionsManager() {
  const [positions, setPositions] = useState<Position[]>(initial);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Position, value: string | boolean) =>
    setPositions((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));

  const remove = (i: number) => {
    setPositions((prev) => prev.filter((_, idx) => idx !== i));
    if (editing === i) setEditing(null);
  };

  const add = () => {
    setPositions((prev) => [...prev, { title: "", department: "", type: "Part-time / Freelance", description: "", active: true }]);
    setEditing(positions.length);
  };

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Positions saved!");
  };

  return (
    <SectionCard title="Open Positions" description={`${positions.filter((p) => p.active).length} active · ${positions.length} total`}>
      <div className="space-y-2 mb-4">
        {positions.map((p, i) => (
          <div key={i}>
            <div
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-200 cursor-pointer transition-colors"
              style={editing === i ? { borderColor: "var(--brand-green)", background: "#f0fdf4" } : {}}
              onClick={() => setEditing(editing === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-800">{p.title || "Unnamed Position"}</p>
                  <p className="text-xs text-gray-400">{p.department} · {p.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={p.active ? { background: "#dcfce7", color: "var(--brand-green)" } : { background: "#f3f4f6", color: "#9ca3af" }}
                >
                  {p.active ? "Active" : "Closed"}
                </span>
                <button onClick={(e) => { e.stopPropagation(); remove(i); }} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editing === i && (
              <div className="mt-2 p-4 rounded-lg border border-green-200 bg-green-50 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Job Title</Label>
                    <Input value={p.title} onChange={(e) => update(i, "title", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Department</Label>
                    <Input value={p.department} onChange={(e) => update(i, "department", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Input value={p.type} onChange={(e) => update(i, "type", e.target.value)} placeholder="Full-time / Part-time" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={p.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={p.active} onCheckedChange={(v) => update(i, "active", v)} />
                  <Label>Position is actively accepting applications</Label>
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
        <Plus className="w-4 h-4" /> Add Position
      </button>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
