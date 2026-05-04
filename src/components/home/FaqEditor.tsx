"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, GripVertical } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";

type Faq = { question: string; answer: string };

const initial: Faq[] = [
  { question: "What grades does Knowlix support?", answer: "We support students from KG to Grade 12 across all major boards including CBSE, ICSE, and State boards." },
  { question: "How many students are in each class?", answer: "We keep batches very small — maximum 4 students per class — to ensure every child gets direct attention." },
  { question: "Are the classes live or recorded?", answer: "All classes are conducted live. Additionally, every session is recorded and made available for revision anytime." },
  { question: "What subjects do you offer?", answer: "We offer Mathematics, Physics, Chemistry, Biology, English, Science, Coding, and Social Studies." },
  { question: "How do I track my child's progress?", answer: "Parents receive detailed daily progress reports via WhatsApp and can view full reports in the parent portal." },
  { question: "Is there a free trial available?", answer: "Yes! You can book a free demo class to experience our teaching methodology before enrolling." },
  { question: "What is the fee structure?", answer: "Fees vary by grade and subject. Contact us for a personalised quote tailored to your child's needs." },
  { question: "Are your mentors certified?", answer: "All mentors undergo a rigorous 5-stage selection: Subject Proficiency, Teaching Demo, Background Check, Communication Assessment, and Orientation." },
];

export default function FaqEditor() {
  const [items, setItems] = useState<Faq[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Faq, value: string) =>
    setItems((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));

  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const add = () => setItems((prev) => [...prev, { question: "", answer: "" }]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("FAQ saved!");
  };

  return (
    <SectionCard title="FAQ Items" description="Frequently asked questions shown on the home page">
      <div className="space-y-3">
        {items.map((faq, i) => (
          <div key={i} className="flex gap-3 p-4 rounded-lg border border-gray-100 bg-gray-50">
            <GripVertical className="w-4 h-4 mt-2 text-gray-300 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="space-y-1.5">
                <Label>Question</Label>
                <Input value={faq.question} onChange={(e) => update(i, "question", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Answer</Label>
                <Textarea value={faq.answer} onChange={(e) => update(i, "answer", e.target.value)} rows={2} />
              </div>
            </div>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors mt-1 flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>
      <FormActions onSave={save} saving={saving} />
    </SectionCard>
  );
}
