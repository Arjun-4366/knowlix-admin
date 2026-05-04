"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

type Leader = { name: string; role: string; experience: string; bio: string; credentials: string; avatar: string };

const initial: Leader[] = [
  {
    name: "Arjun Mehta",
    role: "Founder & CEO",
    experience: "12+ years in education",
    bio: "Arjun founded Knowlix to make personalised education accessible to every child. His vision drives our mission to serve students across India.",
    credentials: "B.Tech IIT Mumbai | M.Ed Educational Leadership",
    avatar: "",
  },
  {
    name: "Dr. Meera Krishnan",
    role: "Academic Head",
    experience: "15+ years in educational psychology",
    bio: "Dr. Meera oversees curriculum design and mentor training, ensuring every student receives evidence-based, developmentally appropriate instruction.",
    credentials: "PhD Educational Psychology, University of Delhi | Former NCERT Consultant",
    avatar: "",
  },
];

export default function LeadershipEditor() {
  const [leaders, setLeaders] = useState<Leader[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Leader, value: string) =>
    setLeaders((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Leadership saved!");
  };

  return (
    <div className="space-y-5">
      {leaders.map((l, i) => (
        <SectionCard key={i} title={`${l.role || `Leader ${i + 1}`}`}>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={l.name} onChange={(e) => update(i, "name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Role / Title</Label>
                <Input value={l.role} onChange={(e) => update(i, "role", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Experience</Label>
                <Input value={l.experience} onChange={(e) => update(i, "experience", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea value={l.bio} onChange={(e) => update(i, "bio", e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Credentials</Label>
                <Input value={l.credentials} onChange={(e) => update(i, "credentials", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Avatar / Photo</Label>
                <MediaUpload
                  value={l.avatar}
                  onChange={(url) => update(i, "avatar", url)}
                  ratio="portrait"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
          <FormActions onSave={save} saving={saving} />
        </SectionCard>
      ))}
    </div>
  );
}
