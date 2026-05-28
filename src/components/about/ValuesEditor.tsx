"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import { IAboutPayload, IAboutHighlight } from "@/types/admin/about";
import { useCreateAbout } from "@/querys/admin/aboutQuery";
import { toast } from "react-hot-toast";
import * as LucideIcons from "lucide-react";

const AVAILABLE_ICONS = [
  "GraduationCap", "Users", "User", "Award", "Clock", "Target", "ShieldCheck", "MessageCircle",
  "BookOpen", "Heart", "Star", "Zap", "ChartNoAxesColumn", "CheckCircle2", "Globe",
  "Smile", "Cpu", "Briefcase", "Search", "PenTool", "Laptop",
  "Trophy", "Rocket", "Lightbulb", "Brain", "MessageSquare", "Phone",
  "Calendar", "Clock3", "MapPin", "Flag", "Flame", "Gem",
  "Layers", "Layout", "MousePointer2", "PieChart", "Shield", "ZapOff"
];

const EMPTY_HIGHLIGHT: IAboutHighlight = { icon: "Star", title: "", subtitle: "" };

interface Props {
  form: IAboutPayload;
  setForm: React.Dispatch<React.SetStateAction<IAboutPayload>>;
}

export default function ValuesEditor({ form, setForm }: Props) {
  const { mutateAsync: saveAbout, isPending } = useCreateAbout();

  const highlights: IAboutHighlight[] = Array.isArray(form.aboutHighlights)
    ? form.aboutHighlights
    : [];

  const update = (i: number, field: keyof IAboutHighlight, value: string) => {
    const updated = highlights.map((h, idx) =>
      idx === i ? { ...h, [field]: value } : h
    );
    setForm((prev) => ({ ...prev, aboutHighlights: updated }));
  };

  const remove = (i: number) => {
    setForm((prev) => ({
      ...prev,
      aboutHighlights: highlights.filter((_, idx) => idx !== i),
    }));
  };

  const add = () => {
    setForm((prev) => ({
      ...prev,
      aboutHighlights: [...highlights, { ...EMPTY_HIGHLIGHT }],
    }));
  };

  const save = async () => {
    try {
      await saveAbout({ ...form, aboutHighlights: highlights });
      toast.success("Highlights saved successfully");
    } catch {
      toast.error("Failed to save highlights");
    }
  };

  return (
    <SectionCard title="About Highlights" description="Key highlights displayed on the About page">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-4">
        {highlights.map((h, i) => {
          const IconComponent = (LucideIcons as any)[h.icon] || LucideIcons.HelpCircle;
          return (
            <div key={i} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4 hover:border-green-200 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Highlight {i + 1}
                </p>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                    <IconComponent className="w-5 h-5 text-green-600" />
                  </div>
                  <button
                    onClick={() => remove(i)}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={h.title}
                    onChange={(e) => update(i, "title", e.target.value)}
                    placeholder="e.g. Expert Mentors"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Select Icon</Label>
                  <Select value={h.icon} onValueChange={(val) => update(i, "icon", val)}>
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
                  <Label>Subtitle</Label>
                  <Input
                    value={h.subtitle}
                    onChange={(e) => update(i, "subtitle", e.target.value)}
                    placeholder="e.g. Guiding students since 2015"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {highlights.length === 0 && (
        <p className="text-center text-gray-400 italic text-sm py-6 border-2 border-dashed border-gray-100 rounded-xl mb-4">
          No highlights yet — click "Add Highlight" to create one.
        </p>
      )}

      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors mb-4"
      >
        <Plus className="w-4 h-4" /> Add Highlight
      </button>

      <FormActions onSave={save} saving={isPending} />
    </SectionCard>
  );
}
