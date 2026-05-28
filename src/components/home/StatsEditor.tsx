"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import { IAboutPayload, IAboutResult } from "@/types/admin/about";
import { useCreateAbout } from "@/querys/admin/aboutQuery";
import { toast } from "react-hot-toast";

interface StatsEditorProps {
  form: IAboutPayload;
  setForm: React.Dispatch<React.SetStateAction<IAboutPayload>>;
}

export default function StatsEditor({ form, setForm }: StatsEditorProps) {
  const { mutateAsync: createAbout, isPending: saving } = useCreateAbout();

  const updateResult = (i: number, field: keyof IAboutResult, value: string) => {
    const newResults = [...form.results];
    if (!newResults[i]) {
      newResults[i] = { value: "", title: "", description: "" };
    }
    newResults[i] = { ...newResults[i], [field]: value };
    setForm((f) => (f ? { ...f, results: newResults } : f));
  };

  const save = async () => {
    try {
      await createAbout(form);
      toast.success("Results updated successfully!");
    } catch (error) {
      toast.error("Failed to update results");
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Learning Outcomes (Results)" description="Metrics highlighting the success rate and scope">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const result = form.results[i] || { value: "", title: "", description: "" };
            return (
              <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Result {i + 1}</p>
                <div className="space-y-1.5">
                  <Label>Value</Label>
                  <Input
                    value={result.value}
                    onChange={(e) => updateResult(i, "value", e.target.value)}
                    placeholder="e.g. 98%"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={result.title}
                    onChange={(e) => updateResult(i, "title", e.target.value)}
                    placeholder="e.g. Satisfaction Rate"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Input
                    value={result.description}
                    onChange={(e) => updateResult(i, "description", e.target.value)}
                    placeholder="Supporting text"
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
