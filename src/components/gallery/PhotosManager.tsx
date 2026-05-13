"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Tag, Image as ImageIcon2 } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";
import { IGalleryItem } from "@/types/gallery";
import { useAddGalleryItem, useDeleteGalleryItem } from "@/querys/galleryQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

interface PhotosManagerProps {
  initialData: IGalleryItem[];
}

export default function PhotosManager({ initialData }: PhotosManagerProps) {
  const { mutateAsync: addItem, isPending: adding } = useAddGalleryItem();
  const { mutateAsync: deleteItem } = useDeleteGalleryItem();
  const { confirm } = useConfirmation();

  const [items, setItems] = useState<IGalleryItem[]>(initialData);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const update = (i: number, field: keyof IGalleryItem, value: any) =>
    setItems((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      { mediaUrl: "", mediaType: "image", tag: "", description: "" },
    ]);
  };

  const handleDelete = (id: string | undefined, index: number) => {
    if (!id) {
      setItems((prev) => prev.filter((_, idx) => idx !== index));
      return;
    }

    confirm({
      title: "Remove Photo",
      message: "Are you sure you want to delete this image? It will be removed from the public website.",
      confirmText: "Remove",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteItem(id);
          toast.success("Photo removed successfully");
        } catch (error) {
          console.error(error);
          toast.error("Failed to remove photo");
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const newItems = items.filter(item => !item.id && (item.mediaUrl instanceof File || item.tag));
      if (newItems.length === 0) {
        toast.error("No new photos to save");
        return;
      }

      for (const item of newItems) {
        await addItem(item);
      }
      toast.success("Photos updated successfully!");
    } catch (error) {
      toast.error("Failed to save photos");
    }
  };

  return (
    <SectionCard title="Photo Collection" description={`${items.length} items currently published`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {items.map((item, i) => (
          <div key={i} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="aspect-video relative bg-gray-50 border-b border-gray-100">
              <MediaUpload
                value={item.mediaUrl}
                onChange={(file) => update(i, "mediaUrl", file)}
                ratio="video"
                accept="image/*"
                className="w-full h-full"
              />
              <button 
                onClick={() => handleDelete(item.id, i)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-3 flex-1 flex flex-col">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  <Tag className="w-3 h-3 text-green-500" /> Event / Category
                </div>
                <Input 
                  value={item.tag} 
                  onChange={(e) => update(i, "tag", e.target.value)} 
                  placeholder="e.g. Science Fair 2024" 
                  className="h-9 text-xs rounded-lg border-gray-100"
                />
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  <ImageIcon2 className="w-3 h-3 text-green-500" /> Description
                </div>
                <Textarea 
                  value={item.description} 
                  onChange={(e) => update(i, "description", e.target.value)} 
                  placeholder="Short description of the moment..." 
                  rows={2}
                  className="text-xs rounded-lg border-gray-100 resize-none flex-1"
                />
              </div>
            </div>

            {!item.id && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-lg shadow-sm">
                New
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 font-medium italic">No photos in the gallery yet.</p>
          </div>
        )}
      </div>

      <button
        onClick={handleAdd}
        className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-green-200 hover:text-green-600 hover:bg-green-50/30 transition-all mb-4"
      >
        <Plus className="w-5 h-5" /> Add New Photo
      </button>

      <FormActions onSave={handleSave} saving={adding} label="Publish Photos" />
    </SectionCard>
  );
}
