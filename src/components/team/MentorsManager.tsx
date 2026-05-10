import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";
import { ITeamMember } from "@/types/team";
import { useCreateTeamMember, useDeleteTeamMember } from "@/querys/teamQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

interface Props {
  initialMembers: ITeamMember[];
}

export default function MentorsManager({ initialMembers }: Props) {
  const [members, setMembers] = useState<ITeamMember[]>(initialMembers);
  const { mutateAsync: saveMember, isPending: saving } = useCreateTeamMember();
  const { mutateAsync: deleteMember } = useDeleteTeamMember();
  const { confirm } = useConfirmation();

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const update = (i: number, field: keyof ITeamMember, value: any) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));

  const add = () => {
    setMembers((prev) => [
      ...prev,
      { name: "", role: "Mentor", description: "", image: "", category: "Mentor", tags: [] },
    ]);
  };

  const remove = (id: string | undefined, index: number) => {
    if (!id) {
      setMembers((prev) => prev.filter((_, idx) => idx !== index));
      return;
    }

    confirm({
      title: "Delete Mentor",
      message: "Are you sure you want to remove this mentor? This action cannot be undone.",
      confirmText: "Remove",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteMember(id);
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const saveAll = async () => {
    try {
      const validMembers = members.filter(m => m.name.trim());
      for (const m of validMembers) {
        await saveMember(m);
      }
      toast.success("Mentors updated successfully!");
    } catch (error) {
      toast.error("Failed to save mentors");
    }
  };

  return (
    <div className="space-y-6">
      {members.map((m, i) => (
        <SectionCard 
          key={i} 
          title={m.name || `Mentor Profile ${i + 1}`}
          description={m.tags[0] || "Subject not specified"}
        >
          <div className="space-y-4">
            <div className="flex justify-end -mt-10 mb-2">
              <button 
                onClick={() => remove(m.id, i)}
                className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input 
                    value={m.name} 
                    onChange={(e) => update(i, "name", e.target.value)} 
                    placeholder="e.g. Kavitha Nair"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subject / Specialty</Label>
                  <Input 
                    value={m.tags[0] || ""} 
                    onChange={(e) => {
                      const newTags = [...m.tags];
                      newTags[0] = e.target.value;
                      update(i, "tags", newTags);
                    }} 
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Short Bio</Label>
                  <Textarea 
                    value={m.description} 
                    onChange={(e) => update(i, "description", e.target.value)} 
                    rows={4} 
                    placeholder="Describe their teaching style and expertise..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Profile Picture</Label>
                  <MediaUpload
                    value={m.image}
                    onChange={(file) => update(i, "image", file)}
                    ratio="square"
                    accept="image/*"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Other Details (Grades, Experience, etc.)</Label>
                  <Input 
                    value={m.tags.slice(1).join(", ")} 
                    onChange={(e) => {
                      const otherTags = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                      update(i, "tags", [m.tags[0] || "", ...otherTags]);
                    }} 
                    placeholder="e.g. Grade 8–12, 8+ Years Exp"
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      ))}

      {members.length === 0 && (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl">
          <p className="text-sm text-gray-400 italic">No mentors added yet.</p>
        </div>
      )}

      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-green-200 hover:text-green-600 hover:bg-green-50/30 transition-all"
      >
        <Plus className="w-5 h-5" /> Add New Mentor
      </button>

      <FormActions onSave={saveAll} saving={saving} label="Save All Mentors" />
    </div>
  );
}
