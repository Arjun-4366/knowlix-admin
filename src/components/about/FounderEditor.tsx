"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

const initial = {
  name: "Arjun Mehta",
  role: "Founder & CEO",
  experience: "12+ years in education",
  quote: "Every child is capable of excellence. Our job is to create the environment where that excellence can naturally emerge.",
  bio: "Arjun founded Knowlix after witnessing firsthand how the lack of personalised attention was holding brilliant students back. With a background in education technology and a passion for child development, he built Knowlix to bridge this gap.",
  credentials: "B.Tech IIT Mumbai | M.Ed Educational Leadership | Former Head of Curriculum, EduFirst India",
  founderImage: "",
};

export default function FounderEditor() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Founder Message saved!");
  };

  return (
    <SectionCard title="Founder Message" description="Displayed on the About page">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={set("name")} />
          </div>
          <div className="space-y-1.5">
            <Label>Role / Title</Label>
            <Input value={form.role} onChange={set("role")} />
          </div>
          <div className="space-y-1.5">
            <Label>Experience</Label>
            <Input value={form.experience} onChange={set("experience")} placeholder="e.g. 12+ years in education" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Quote</Label>
          <Textarea value={form.quote} onChange={set("quote")} rows={3} placeholder="Founder's featured quote" />
        </div>
        <div className="space-y-1.5">
          <Label>Bio</Label>
          <Textarea value={form.bio} onChange={set("bio")} rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Credentials</Label>
            <Input value={form.credentials} onChange={set("credentials")} placeholder="Degrees, past roles, etc." />
          </div>
          <div className="space-y-1.5">
            <Label>Founder Image</Label>
            <MediaUpload
              value={form.founderImage}
              onChange={(url) => setForm(f => ({ ...f, founderImage: url }))}
              ratio="portrait"
              accept="image/*"
            />
          </div>
        </div>
      </div>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
