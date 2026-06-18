"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Tag, Image as ImageIcon2 } from "lucide-react";
import SectionCard from "@/components/shared/SectionCard";
import FormActions from "@/components/shared/FormActions";
import MediaUpload from "@/components/shared/MediaUpload";
import { IGalleryItem } from "@/types/admin/gallery";
import { useAddGalleryItem, useDeleteGalleryItem } from "@/querys/admin/galleryQuery";
import { useConfirmation } from "@/context/ConfirmationContext";
import { toast } from "react-hot-toast";

interface PhotosManagerProps {
  initialData: IGalleryItem[];
}

export default function PhotosManager({ initialData }: PhotosManagerProps) {
  const { mutateAsync: addItem, isPending: adding } = useAddGalleryItem();
  const { mutateAsync: deleteItem } = useDeleteGalleryItem();
  const { confirm } = useConfirmation();

  const [localItems, setLocalItems] = useState<IGalleryItem[]>(initialData);
  const [pendingItems, setPendingItems] = useState<IGalleryItem[]>([]);

  // Sync server data into localItems but preserve any File the user has already selected
  useEffect(() => {
    setLocalItems(prev => initialData.map(serverItem => {
      const local = prev.find(p => p.id === serverItem.id);
      return local && local.mediaUrl instanceof File ? local : serverItem;
    }));
  }, [initialData]);

  const updateLocal = (id: string, field: keyof IGalleryItem, value: any) =>
    setLocalItems(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

  const updatePending = (index: number, field: keyof IGalleryItem, value: any) =>
    setPendingItems(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));

  const handleAdd = () => {
    setPendingItems(prev => [...prev, { mediaUrl: "", mediaType: "image", tag: "", description: "" }]);
  };

  const handleDeleteExisting = (id: string) => {
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
      // Existing items where the user selected a new image File
      const toReplace = localItems.filter(item => item.id && item.mediaUrl instanceof File);
      // Brand-new items with a file selected
      const toAdd = pendingItems.filter(item => item.mediaUrl);

      if (toReplace.length === 0 && toAdd.length === 0) {
        toast.error("No new photos to save");
        return;
      }

      // Replace: delete old record, then create new one with the new image
      for (const item of toReplace) {
        await deleteItem(item.id!);
        const { id, ...itemData } = item;
        await addItem(itemData as IGalleryItem);
      }

      // Add brand-new items
      for (const item of toAdd) {
        await addItem(item);
      }

      setPendingItems([]);
      toast.success("Photos updated successfully!");
    } catch (error) {
      toast.error("Failed to save photos");
    }
  };

  return (
    <SectionCard title="Photo Collection" description={`${localItems.length} items currently published`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {localItems.map((item) => (
          <div key={item.id} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="aspect-video relative bg-gray-50 border-b border-gray-100">
              <MediaUpload
                value={item.mediaUrl}
                onChange={(file) => updateLocal(item.id!, "mediaUrl", file)}
                ratio="video"
                accept="image/*"
                className="w-full h-full"
              />
              {item.mediaUrl instanceof File && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-[9px] font-black uppercase rounded-lg shadow-sm">
                  Changed
                </div>
              )}
              <button
                onClick={() => handleDeleteExisting(item.id!)}
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
                  onChange={(e) => updateLocal(item.id!, "tag", e.target.value)}
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
                  onChange={(e) => updateLocal(item.id!, "description", e.target.value)}
                  placeholder="Short description of the moment..."
                  rows={2}
                  className="text-xs rounded-lg border-gray-100 resize-none flex-1"
                />
              </div>
            </div>
          </div>
        ))}

        {pendingItems.map((item, i) => (
          <div key={`pending-${i}`} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="aspect-video relative bg-gray-50 border-b border-gray-100">
              <MediaUpload
                value={item.mediaUrl}
                onChange={(file) => updatePending(i, "mediaUrl", file)}
                ratio="video"
                accept="image/*"
                className="w-full h-full"
              />
              <button
                onClick={() => setPendingItems(prev => prev.filter((_, idx) => idx !== i))}
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
                  onChange={(e) => updatePending(i, "tag", e.target.value)}
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
                  onChange={(e) => updatePending(i, "description", e.target.value)}
                  placeholder="Short description of the moment..."
                  rows={2}
                  className="text-xs rounded-lg border-gray-100 resize-none flex-1"
                />
              </div>
            </div>
            <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded-lg shadow-sm">
              New
            </div>
          </div>
        ))}

        {localItems.length === 0 && pendingItems.length === 0 && (
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
