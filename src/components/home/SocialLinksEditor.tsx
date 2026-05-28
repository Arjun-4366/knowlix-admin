"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IAboutPayload, ISocialMediaLinks } from "@/types/admin/about";
import SectionCard from "../shared/SectionCard";
import FormActions from "../shared/FormActions";
import { useCreateAbout } from "@/querys/admin/aboutQuery";
import { Globe } from "lucide-react";

interface SocialLinksEditorProps {
  form: IAboutPayload;
  setForm: (form: IAboutPayload) => void;
}

const Icons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  ),
  Linkedin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  ),
  Youtube: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
    </svg>
  ),
};

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: Icons.Instagram, color: "text-pink-500", placeholder: "https://instagram.com/knowlix" },
  { key: "facebook", label: "Facebook", icon: Icons.Facebook, color: "text-blue-600", placeholder: "https://facebook.com/knowlix" },
  { key: "twitter", label: "Twitter / X", icon: Icons.Twitter, color: "text-gray-900", placeholder: "https://twitter.com/knowlix" },
  { key: "linkedin", label: "LinkedIn", icon: Icons.Linkedin, color: "text-blue-700", placeholder: "https://linkedin.com/company/knowlix" },
  { key: "youtube", label: "YouTube", icon: Icons.Youtube, color: "text-red-600", placeholder: "https://youtube.com/@knowlix" },
] as const;

export default function SocialLinksEditor({ form, setForm }: SocialLinksEditorProps) {
  const { mutate: createAbout, isPending } = useCreateAbout();

  const updateLink = (key: keyof ISocialMediaLinks, value: string) => {
    setForm({
      ...form,
      socialMediaLinks: {
        ...form?.socialMediaLinks,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    createAbout(form);
  };

  return (
    <SectionCard
      title="Social Presence"
      description="Connect your social media profiles to the Knowlix platform"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        {SOCIAL_PLATFORMS.map((platform) => (
          <div key={platform.key} className="group space-y-3 p-4 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-white shadow-sm ${platform.color} group-hover:scale-110 transition-transform`}>
                  <platform.icon />
                </div>
                <Label className="text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-600 transition-colors">
                  {platform.label}
                </Label>
              </div>
              <div className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                Official URL
              </div>
            </div>

            <div className="relative group/input">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-gray-400 transition-colors">
                <Globe className="w-4 h-4" />
              </div>
              <Input
                value={form.socialMediaLinks?.[platform.key] || ""}
                onChange={(e) => updateLink(platform.key, e.target.value)}
                placeholder={platform.placeholder}
                className="pl-10 h-12 bg-white border-gray-100 rounded-xl text-sm focus:ring-green-500 focus:border-green-500 transition-all shadow-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <FormActions onSave={handleSave} saving={isPending} label="Update Social Links" />
      </div>
    </SectionCard>
  );
}
