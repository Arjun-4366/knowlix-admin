"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, X } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import { Input } from "../ui/input";
import { IAboutPayload, IYearBaseJourney } from "@/types/about";
import { useCreateAbout } from "@/querys/aboutQuery";
import { toast } from "react-hot-toast";

interface StoryEditorProps {
  form: IAboutPayload;
  setForm: React.Dispatch<React.SetStateAction<IAboutPayload>>;
}

export default function StoryEditor({ form, setForm }: StoryEditorProps) {
  const { mutateAsync: createAbout, isPending: saving } = useCreateAbout();

  const updateMilestone = (i: number, field: keyof IYearBaseJourney, value: string) => {
    const newJourney = [...form.yearBaseJourney];
    newJourney[i] = { ...newJourney[i], [field]: value };
    setForm((f) => ({ ...f, yearBaseJourney: newJourney }));
  };

  const updatePoint = (mIdx: number, pIdx: number, value: string) => {
    const newJourney = [...form.yearBaseJourney];
    const newDesc = [...newJourney[mIdx].description];
    newDesc[pIdx] = value;
    newJourney[mIdx] = { ...newJourney[mIdx], description: newDesc };
    setForm((f) => ({ ...f, yearBaseJourney: newJourney }));
  };

  const addPoint = (mIdx: number) => {
    const newJourney = [...form.yearBaseJourney];
    newJourney[mIdx] = { 
      ...newJourney[mIdx], 
      description: [...newJourney[mIdx].description, ""] 
    };
    setForm((f) => ({ ...f, yearBaseJourney: newJourney }));
  };

  const removePoint = (mIdx: number, pIdx: number) => {
    const newJourney = [...form.yearBaseJourney];
    newJourney[mIdx] = { 
      ...newJourney[mIdx], 
      description: newJourney[mIdx].description.filter((_, idx) => idx !== pIdx) 
    };
    setForm((f) => ({ ...f, yearBaseJourney: newJourney }));
  };

  const removeMilestone = (i: number) => {
    const newJourney = form.yearBaseJourney.filter((_, idx) => idx !== i);
    setForm((f) => ({ ...f, yearBaseJourney: newJourney }));
  };

  const addMilestone = () => {
    setForm((f) => ({
      ...f,
      yearBaseJourney: [...f.yearBaseJourney, { year: "", title: "", description: [""] }],
    }));
  };

  const save = async () => {
    try {
      await createAbout(form);
      toast.success("Journey updated successfully!");
    } catch (error) {
      toast.error("Failed to update journey");
    }
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Timeline Milestones" description="Key milestones in the Knowlix journey">
        <div className="space-y-6">
          {form.yearBaseJourney.map((m, i) => (
            <div key={i} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4 hover:border-green-100 transition-colors">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Milestone {i + 1}</p>
                <button 
                  onClick={() => removeMilestone(i)} 
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove Milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label>Year</Label>
                  <Input 
                    value={m.year} 
                    onChange={(e) => updateMilestone(i, "year", e.target.value)} 
                    placeholder="e.g. 2021"
                    className="bg-white"
                  />
                </div>
                <div className="md:col-span-3 space-y-1.5">
                  <Label>Title</Label>
                  <Input 
                    value={m.title} 
                    onChange={(e) => updateMilestone(i, "title", e.target.value)}
                    placeholder="e.g. Company Founded"
                    className="bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-500 uppercase tracking-wide">Key Highlights (Points)</Label>
                  <button
                    onClick={() => addPoint(i)}
                    className="flex items-center gap-1 text-[10px] font-bold text-green-600 hover:text-green-700 bg-green-50 px-2 py-1 rounded-md transition-colors"
                  >
                    <Plus className="w-3 h-3" /> ADD POINT
                  </button>
                </div>
                
                <div className="space-y-2">
                  {m.description.map((point, pIdx) => (
                    <div key={pIdx} className="flex gap-2 group">
                      <div className="flex-1">
                        <Input
                          value={point}
                          onChange={(e) => updatePoint(i, pIdx, e.target.value)}
                          placeholder="Add a highlight..."
                          className="bg-white h-9 text-sm"
                        />
                      </div>
                      <button
                        onClick={() => removePoint(i, pIdx)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {m.description.length === 0 && (
                    <p className="text-[11px] text-gray-400 italic text-center py-2 border border-dashed border-gray-200 rounded-lg">
                      No points added. Click "Add Point" to start.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addMilestone}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-400 hover:border-green-200 hover:text-green-600 hover:bg-green-50/30 transition-all"
          >
            <Plus className="w-5 h-5" /> Add New Milestone
          </button>
        </div>
        <FormActions onSave={save} saving={saving} />
      </SectionCard>
    </div>
  );
}
