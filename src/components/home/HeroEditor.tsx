"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

const initial = {
  headline: "Personalized Online Learning for Every Child",
  subheadline: "Expert-led live classes for KG–12, designed around your child's pace, potential, and personality.",
  cta1Text: "Book a Free Demo",
  cta1Link: "/contact",
  cta2Text: "Explore Courses",
  cta2Link: "/courses",
  stat1Value: "445+",
  stat1Label: "Students Enrolled",
  stat2Value: "33+",
  stat2Label: "Expert Mentors",
  stat3Value: "4.9",
  stat3Label: "Average Rating",
  stat4Value: "98%",
  stat4Label: "Satisfaction Rate",
  bannerMedia: "",
};

export default function HeroEditor() {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Hero section saved!");
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Hero Text" description="Main headline and subheadline shown in the hero banner">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Headline</Label>
            <Input value={form.headline} onChange={set("headline")} placeholder="Main headline" />
          </div>
          <div className="space-y-1.5">
            <Label>Subheadline</Label>
            <Textarea value={form.subheadline} onChange={set("subheadline")} rows={3} placeholder="Supporting text" />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label>Banner Media (Image or Video)</Label>
          <MediaUpload
            value={form.bannerMedia}
            onChange={(url) => setForm((f) => ({ ...f, bannerMedia: url }))}
            ratio="video"
          />
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>

      <SectionCard title="CTA Buttons" description="Call-to-action buttons in the hero">
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Primary Button</p>
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input value={form.cta1Text} onChange={set("cta1Text")} />
            </div>
            <div className="space-y-1.5">
              <Label>Link</Label>
              <Input value={form.cta1Link} onChange={set("cta1Link")} />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Secondary Button</p>
            <div className="space-y-1.5">
              <Label>Label</Label>
              <Input value={form.cta2Text} onChange={set("cta2Text")} />
            </div>
            <div className="space-y-1.5">
              <Label>Link</Label>
              <Input value={form.cta2Link} onChange={set("cta2Link")} />
            </div>
          </div>
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>

      <SectionCard title="Hero Stats" description="4 key metrics displayed below the headline">
        <div className="grid grid-cols-2 gap-5">
          {([
            ["stat1Value", "stat1Label"],
            ["stat2Value", "stat2Label"],
            ["stat3Value", "stat3Label"],
            ["stat4Value", "stat4Label"],
          ] as [keyof typeof initial, keyof typeof initial][]).map(([valKey, labelKey], i) => (
            <div key={i} className="space-y-2 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Stat {i + 1}</p>
              <div className="space-y-1.5">
                <Label>Value</Label>
                <Input value={form[valKey]} onChange={set(valKey)} placeholder="e.g. 445+" />
              </div>
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input value={form[labelKey]} onChange={set(labelKey)} placeholder="e.g. Students Enrolled" />
              </div>
            </div>
          ))}
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>
    </div>
  );
}
