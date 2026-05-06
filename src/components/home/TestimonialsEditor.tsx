"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Star } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";

type Review = {
  name: string;
  location: string;
  grade: string;
  text: string;
  rating: number;
  avatar: string;
};

const initial: Review[] = [
  { name: "Priya Sharma", location: "Mumbai", grade: "Grade 8", text: "My daughter's confidence in Math has improved remarkably. The personalized attention she gets is unmatched.", rating: 5, avatar: "" },
  { name: "Rajesh Kumar", location: "Hyderabad", grade: "Grade 10", text: "My son scored distinction in board exams after just 6 months with Knowlix. Highly recommended!", rating: 5, avatar: "" },
  { name: "Anita Reddy", location: "Bangalore", grade: "Grade 5", text: "The live classes keep my child engaged unlike any other online platform we've tried before.", rating: 5, avatar: "" },
  { name: "Suresh Patel", location: "Ahmedabad", grade: "Grade 12", text: "Knowlix mentors helped my daughter achieve 95% in board exams. The daily reports kept us informed.", rating: 5, avatar: "" },
];

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof Review, value: string | number) =>
    setReviews((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));

  const remove = (i: number) => setReviews((prev) => prev.filter((_, idx) => idx !== i));

  const add = () =>
    setReviews((prev) => [...prev, { name: "", location: "", grade: "", text: "", rating: 5, avatar: "" }]);

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    alert("Reviews saved!");
  };

  return (
    <SectionCard
      title="Review Management"
      description="Parent and student reviews displayed on the home page"
    >
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
            {/* Card header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Review {i + 1}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 cursor-pointer transition-colors ${s < r.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                      onClick={() => update(i, "rating", s + 1)}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => remove(i)}
                className="text-red-400 hover:text-red-600 transition-colors"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Reviewer info */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={r.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Parent / Student name" />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={r.location} onChange={(e) => update(i, "location", e.target.value)} placeholder="City" />
              </div>
              <div className="space-y-1.5">
                <Label>Child's Grade</Label>
                <Input value={r.grade} onChange={(e) => update(i, "grade", e.target.value)} placeholder="e.g. Grade 8" />
              </div>
            </div>

            {/* Review text + avatar */}
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-3 space-y-1.5">
                <Label>Review Text</Label>
                <Textarea
                  value={r.text}
                  onChange={(e) => update(i, "text", e.target.value)}
                  rows={3}
                  placeholder="What did this parent / student say?"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Avatar</Label>
                <MediaUpload
                  value={r.avatar}
                  onChange={(url) => update(i, "avatar", url)}
                  ratio="square"
                  className="w-full"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Review */}
        <button
          onClick={add}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-green-300 hover:text-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>
      </div>

      <FormActions onSave={save} saving={saving} label="Save All Reviews" />
    </SectionCard>
  );
}
