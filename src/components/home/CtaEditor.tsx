"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

const initial = {
  heading: "Ready to Transform Your Child's Learning Journey?",
  subheading: "Join 445+ students who are already experiencing the Knowlix difference.",
  btnText: "Book a Free Demo Class",
  btnLink: "/contact",
  trust1: "No credit card required",
  trust2: "Cancel anytime",
  trust3: "Free first session",
  bgImage: "",
};

export default function CtaEditor() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("CTA section saved!");
  };

  return (
    <div className="space-y-5">
      {/* ── Main CTA copy ── */}
      <SectionCard
        title="CTA Content"
        description="Bottom-of-page banner that drives visitors to book a demo"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Heading</Label>
            <Input value={form.heading} onChange={set("heading")} placeholder="Main CTA headline" />
          </div>
          <div className="space-y-1.5">
            <Label>Subheading</Label>
            <Textarea value={form.subheading} onChange={set("subheading")} rows={2} placeholder="Supporting sentence below the heading" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Button Label</Label>
              <Input value={form.btnText} onChange={set("btnText")} placeholder="e.g. Book a Free Demo" />
            </div>
            <div className="space-y-1.5">
              <Label>Button Link</Label>
              <Input value={form.btnLink} onChange={set("btnLink")} placeholder="/contact" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Background Image</Label>
            <MediaUpload
              value={form.bgImage}
              onChange={(url) => setForm((f) => ({ ...f, bgImage: url }))}
              ratio="video"
              accept="image/*"
            />
          </div>
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>

      {/* ── Trust badges ── */}
      <SectionCard
        title="Trust Badges"
        description="Three short reassurances shown below the CTA button (e.g. 'No credit card required')"
      >
        <div className="grid grid-cols-3 gap-4">
          {(["trust1", "trust2", "trust3"] as (keyof typeof initial)[]).map((key, i) => (
            <div key={i} className="space-y-1.5">
              <Label>Badge {i + 1}</Label>
              <Input value={form[key]} onChange={set(key)} placeholder="Short trust line" />
            </div>
          ))}
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>
    </div>
  );
}
