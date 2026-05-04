"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/components/shared/PageHeader";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";

const initialContact = {
  phone: "+91 98765 43210",
  email: "hello@knowlix.in",
  whatsapp: "+91 98765 43210",
  address: "Online — Nationwide, India",
  responseTime: "2 hours",
};

const initialSocial = {
  facebook: "https://facebook.com/knowlixlearning",
  instagram: "https://instagram.com/knowlixlearning",
  youtube: "https://youtube.com/@knowlix",
  linkedin: "",
  twitter: "",
};

const initialSeo = {
  siteTitle: "Knowlix — Personalised Online Learning for Every Child",
  description: "Expert-led live classes for KG–12. Small batches, certified mentors, and daily progress reports. Book a free demo today.",
  keywords: "online tuition, online school, cbse tuition, personalised learning, live classes",
  ogImage: "/og-image.jpg",
};

export default function SettingsPage() {
  const [contact, setContact] = useState(initialContact);
  const [social, setSocial] = useState(initialSocial);
  const [seo, setSeo] = useState(initialSeo);
  const [saving, setSaving] = useState<string | null>(null);

  const setC = (k: keyof typeof initialContact) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setContact((f) => ({ ...f, [k]: e.target.value }));

  const setS = (k: keyof typeof initialSocial) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSocial((f) => ({ ...f, [k]: e.target.value }));

  const setSeo_ = (k: keyof typeof initialSeo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSeo((f) => ({ ...f, [k]: e.target.value }));

  const save = async (section: string) => {
    setSaving(section);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(null);
    alert(`${section} saved!`);
  };

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader title="Settings" description="Site-wide configuration for Knowlix" />

      <SectionCard title="Contact Information" description="Used across the website and contact page">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={contact.phone} onChange={setC("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp Number</Label>
              <Input value={contact.whatsapp} onChange={setC("whatsapp")} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={contact.email} onChange={setC("email")} type="email" />
            </div>
            <div className="space-y-1.5">
              <Label>Response Time</Label>
              <Input value={contact.responseTime} onChange={setC("responseTime")} placeholder="e.g. 2 hours" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Address / Location</Label>
            <Input value={contact.address} onChange={setC("address")} />
          </div>
        </div>
        <FormActions onSave={() => save("Contact Information")} saving={saving === "Contact Information"} />
      </SectionCard>

      <SectionCard title="Social Links" description="Links to Knowlix social media profiles">
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(initialSocial) as (keyof typeof initialSocial)[]).map((key) => (
            <div key={key} className="space-y-1.5">
              <Label className="capitalize">{key}</Label>
              <Input value={social[key]} onChange={setS(key)} placeholder={`https://${key}.com/knowlix`} />
            </div>
          ))}
        </div>
        <FormActions onSave={() => save("Social Links")} saving={saving === "Social Links"} />
      </SectionCard>

      <SectionCard title="SEO Settings" description="Meta tags for search engines and social sharing">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Site Title</Label>
            <Input value={seo.siteTitle} onChange={setSeo_("siteTitle")} />
          </div>
          <div className="space-y-1.5">
            <Label>Meta Description</Label>
            <Textarea value={seo.description} onChange={setSeo_("description")} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Keywords</Label>
            <Input value={seo.keywords} onChange={setSeo_("keywords")} placeholder="Comma-separated keywords" />
          </div>
          <div className="space-y-1.5">
            <Label>OG Image URL</Label>
            <Input value={seo.ogImage} onChange={setSeo_("ogImage")} placeholder="/og-image.jpg" />
          </div>
        </div>
        <FormActions onSave={() => save("SEO Settings")} saving={saving === "SEO Settings"} />
      </SectionCard>
    </div>
  );
}
