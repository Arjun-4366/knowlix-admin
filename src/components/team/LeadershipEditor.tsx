import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";
import { ITeamMember, TeamCategory } from "@/types/team";
import { useCreateTeamMember, useDeleteTeamMember } from "@/querys/teamQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

interface Props {
  initialMembers: ITeamMember[];
  category: TeamCategory;
}

export default function LeadershipEditor({ initialMembers, category }: Props) {
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
      { name: "", role: "", description: "", image: "", category, tags: [] },
    ]);
  };

  const remove = (id: string | undefined, index: number) => {
    if (!id) {
      setMembers((prev) => prev.filter((_, idx) => idx !== index));
      return;
    }

    confirm({
      title: "Delete Member",
      message: "Are you sure you want to remove this member? This action cannot be undone.",
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
      toast.success(`${category} updated successfully!`);
    } catch (error) {
      toast.error(`Failed to save ${category}`);
    }
  };

  return (
    <div className="space-y-6">
      {members.map((m, i) => (
        <SectionCard 
          key={i} 
          title={m.name || `${category} Member ${i + 1}`}
          description={m.role}
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
                    placeholder="e.g. Arjun Mehta"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Role / Designation</Label>
                  <Input 
                    value={m.role} 
                    onChange={(e) => update(i, "role", e.target.value)} 
                    placeholder="e.g. Founder & CEO"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Biography / Summary</Label>
                  <Textarea 
                    value={m.description} 
                    onChange={(e) => update(i, "description", e.target.value)} 
                    rows={4} 
                    placeholder="Briefly describe their background and vision..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Profile Picture</Label>
                  <MediaUpload
                    value={m.image}
                    onChange={(file) => update(i, "image", file)}
                    ratio="portrait"
                    accept="image/*"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tags / Credentials (Comma separated)</Label>
                  <Input 
                    value={m.tags.join(", ")} 
                    onChange={(e) => update(i, "tags", e.target.value.split(",").map(s => s.trim()))} 
                    placeholder="e.g. B.Tech IIT, 12+ Years Experience"
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      ))}

      <button
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-green-200 hover:text-green-600 hover:bg-green-50/30 transition-all"
      >
        <Plus className="w-5 h-5" /> Add New {category} Member
      </button>

      <FormActions onSave={saveAll} saving={saving} label={`Save All ${category}`} />
    </div>
  );
}
