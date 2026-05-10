"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import { IAboutPayload, IWhyChooseKnowlix } from "@/types/about";
import { useCreateAbout } from "@/querys/aboutQuery";
import { toast } from "react-hot-toast";
import * as LucideIcons from "lucide-react";

interface WhyParentsEditorProps {
  initialData?: IAboutPayload;
}

const AVAILABLE_ICONS = [
  "GraduationCap", "Users", "User", "Award", "Clock", "Target", "ShieldCheck", "MessageCircle",
  "BookOpen", "Heart", "Star", "Zap", "ChartNoAxesColumn", "CheckCircle2", "Globe",
  "Smile", "Cpu", "Briefcase", "Search", "PenTool", "Laptop",
  "Trophy", "Rocket", "Lightbulb", "Brain", "MessageSquare", "Phone",
  "Calendar", "Clock3", "MapPin", "Flag", "Flame", "Gem",
  "Layers", "Layout", "MousePointer2", "PieChart", "Shield", "ZapOff"
];

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WhyParentsEditorProps {
  form: IAboutPayload;
  setForm: React.Dispatch<React.SetStateAction<IAboutPayload | null>>;
}

export default function WhyParentsEditor({ form, setForm }: WhyParentsEditorProps) {
  const { mutateAsync: createAbout, isPending: saving } = useCreateAbout();

  const updateFeature = (i: number, field: keyof IWhyChooseKnowlix, value: string) => {
    const newFeatures = [...form.whyChooseKnowlix];
    newFeatures[i] = { ...newFeatures[i], [field]: value };
    setForm((f) => (f ? { ...f, whyChooseKnowlix: newFeatures } : f));
  };

  const save = async () => {
    try {
      await createAbout(form);
      toast.success("Features updated successfully!");
    } catch (error) {
      toast.error("Failed to update features");
    }
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Feature Cards" description="6 explanation cards for why parents trust Knowlix">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {form.whyChooseKnowlix.map((feature, i) => {
            const IconComponent = (LucideIcons as any)[feature.icon] || LucideIcons.HelpCircle;
            
            return (
              <div key={i} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4 hover:border-green-200 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Feature Slot {i + 1}</p>
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <IconComponent className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input 
                      value={feature.title} 
                      onChange={(e) => updateFeature(i, "title", e.target.value)} 
                      placeholder="e.g. Expert Mentors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Select Icon</Label>
                    <Select value={feature.icon} onValueChange={(val) => updateFeature(i, "icon", val)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {AVAILABLE_ICONS.map((iconName) => {
                          const IconItem = (LucideIcons as any)[iconName];
                          return (
                            <SelectItem key={iconName} value={iconName}>
                              <div className="flex items-center gap-2">
                                <IconItem className="w-4 h-4" />
                                <span>{iconName}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea 
                      value={feature.subtitle} 
                      onChange={(e) => updateFeature(i, "subtitle", e.target.value)} 
                      rows={2} 
                      placeholder="Short explanation for parents..."
                    />
                  </div>
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
