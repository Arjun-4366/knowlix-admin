"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";
import { IAboutPayload, IAboutStat } from "@/types/admin/about";
import { useCreateAbout } from "@/querys/admin/aboutQuery";
import { toast } from "react-hot-toast";

interface HeroEditorProps {
  form: IAboutPayload;
  setForm: React.Dispatch<React.SetStateAction<IAboutPayload>>;
}

export default function HeroEditor({ form, setForm }: HeroEditorProps) {
  const { mutateAsync: createAbout, isPending: saving } = useCreateAbout();

  const handleChange = (key: keyof IAboutPayload, value: string | File) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const updateStat = (i: number, field: keyof IAboutStat, value: string) => {
    const newStats = [...form.stats];
    if (!newStats[i]) {
      newStats[i] = { value: "", title: "", description: "" };
    }
    newStats[i] = { ...newStats[i], [field]: value };
    setForm((f) => (f ? { ...f, stats: newStats } : f));
  };

  const save = async () => {
    try {
      if (form.mainPageFeatureImage instanceof File) {
        const formData = new FormData();
        formData.append("mainPageFeatureImage", form.mainPageFeatureImage);
        formData.append("mainPageTag", form.mainPageTag);
        formData.append("mainPageTitle", form.mainPageTitle);
        formData.append("mainPageSubtitle", form.mainPageSubtitle);
        formData.append("stats", JSON.stringify(form.stats));
        formData.append("results", JSON.stringify(form.results));
        formData.append("whyChooseKnowlix", JSON.stringify(form.whyChooseKnowlix));
        formData.append("yearBaseJourney", JSON.stringify(form.yearBaseJourney));
        const response = await createAbout(formData as any);
        toast.success("Hero section and image updated successfully!");

        // After save, the backend should return the updated object with the new image URL
        if (response?.data?.mainPageFeatureImage) {
          handleChange("mainPageFeatureImage", response.data.mainPageFeatureImage);
        }
      } else {
        await createAbout(form);
        toast.success("Hero section updated successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update hero section");
    }
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Hero Content" description="Main tag, title, and subtitle shown in the hero banner">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Tagline (Badge)</Label>
            <Input
              value={form.mainPageTag}
              onChange={(e) => handleChange("mainPageTag", e.target.value)}
              placeholder="e.g. Learn Fast"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Headline</Label>
            <Input
              value={form.mainPageTitle}
              onChange={(e) => handleChange("mainPageTitle", e.target.value)}
              placeholder="Main headline"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Subtitle</Label>
            <Textarea
              value={form.mainPageSubtitle}
              onChange={(e) => handleChange("mainPageSubtitle", e.target.value)}
              rows={3}
              placeholder="Supporting text"
            />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <Label>Banner Image</Label>
          <MediaUpload
            value={form.mainPageFeatureImage}
            onChange={(url) => handleChange("mainPageFeatureImage", url)}
            ratio="video"
            accept="image/*"
          />
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>

      <SectionCard title="Hero Stats" description="3 key metrics displayed below the headline">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[0, 1, 2, 3].map((i) => {
            const stat = form.stats[i] || { value: "", title: "", description: "" };
            return (
              <div key={i} className="space-y-2 p-4 rounded-lg border border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Stat {i + 1}</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Value</Label>
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="e.g. 445+"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={stat.title}
                    onChange={(e) => updateStat(i, "title", e.target.value)}
                    placeholder="e.g. Students"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Input
                    value={stat.description}
                    onChange={(e) => updateStat(i, "description", e.target.value)}
                    placeholder="e.g. Across India"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>
    </div>
  );
}
